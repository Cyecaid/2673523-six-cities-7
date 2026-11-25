import {DocumentType} from '@typegoose/typegoose';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {City, Component} from '../../types/index.js';
import {CITIES} from '../../constants/index.js';
import {fillDto} from '../../helpers/index.js';
import {Logger} from '../../libs/logger/index.js';
import {
  AuthenticateMiddleware,
  BaseController,
  DocumentExistsMiddleware,
  getCurrentUser,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import {UserEntity} from '../user/user.entity.js';
import {OfferService} from './offer-service.interface.js';
import {OfferEntity} from './offer.entity.js';
import {OfferRdo} from './rdo/offer.rdo.js';
import {OfferPreviewRdo} from './rdo/offer-preview.rdo.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {CreateOfferRequest, OfferIdRequest, UpdateOfferRequest} from './offer-request.type.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    const authenticate = new AuthenticateMiddleware();
    const validateOfferId = new ValidateObjectIdMiddleware('offerId');
    const offerExists = new DocumentExistsMiddleware(this.offerService, 'Предложение', 'offerId');
    const privateOfferMiddlewares = [authenticate, validateOfferId, offerExists];

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [authenticate, new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getPremium});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.show, middlewares: [validateOfferId]});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [...privateOfferMiddlewares, new ValidateDtoMiddleware(UpdateOfferDto)],
    });
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, middlewares: privateOfferMiddlewares});
  }

  private parseLimit(value: unknown): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    const limit = Number(value);
    if (!Number.isInteger(limit) || limit < 1) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'limit должен быть целым числом > 0', 'OfferController');
    }
    return limit;
  }

  private async ensureAuthor(offerId: string, userId: string): Promise<void> {
    if (!await this.offerService.isAuthor(offerId, userId)) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Изменить или удалить предложение может только его автор', 'OfferController');
    }
  }

  private toPreviews(offers: DocumentType<OfferEntity>[], user?: DocumentType<UserEntity>): OfferPreviewRdo[] {
    const favoriteIds = new Set(user?.favorites.map(String));

    return offers.map((offer) => {
      const preview = fillDto(OfferPreviewRdo, offer);
      preview.isFavorite = favoriteIds.has(offer.id);
      return preview;
    });
  }

  private toOffer(offer: DocumentType<OfferEntity> | null, user?: DocumentType<UserEntity>): OfferRdo {
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Предложение не найдено', 'OfferController');
    }

    const result = fillDto(OfferRdo, offer);
    result.isFavorite = user?.favorites.some((favorite) => String(favorite) === offer.id) ?? false;
    return result;
  }

  public async index(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(this.parseLimit(req.query.limit));
    this.ok(res, this.toPreviews(offers, res.locals.user));
  }

  public async create({body}: CreateOfferRequest, res: Response): Promise<void> {
    const user = getCurrentUser(res);
    const {id} = await this.offerService.create({...body, authorId: user.id});
    const offer = await this.offerService.findById(id);
    this.created(res, this.toOffer(offer, user));
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const city = CITIES.find((item) => item === req.query.city);
    if (!city) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `city должен быть одним из: ${CITIES.join(', ')}`, 'OfferController');
    }

    const offers = await this.offerService.findPremiumByCity(city as City);
    this.ok(res, this.toPreviews(offers, res.locals.user));
  }

  public async show({params}: OfferIdRequest, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, this.toOffer(offer, res.locals.user));
  }

  public async update({params, body}: UpdateOfferRequest, res: Response): Promise<void> {
    const user = getCurrentUser(res);
    await this.ensureAuthor(params.offerId, user.id);
    const offer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, this.toOffer(offer, user));
  }

  public async delete({params}: OfferIdRequest, res: Response): Promise<void> {
    await this.ensureAuthor(params.offerId, getCurrentUser(res).id);
    await this.offerService.deleteById(params.offerId);
    this.noContent(res);
  }
}

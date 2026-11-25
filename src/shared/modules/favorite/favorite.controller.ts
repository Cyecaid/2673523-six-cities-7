import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {fillDto} from '../../helpers/index.js';
import {Logger} from '../../libs/logger/index.js';
import {AuthenticateMiddleware, BaseController, DocumentExistsMiddleware, getCurrentUser, HttpError, HttpMethod, ValidateObjectIdMiddleware} from '../../libs/rest/index.js';
import {OfferIdRequest} from '../offer/offer-request.type.js';
import {OfferService} from '../offer/offer-service.interface.js';
import {OfferPreviewRdo} from '../offer/rdo/offer-preview.rdo.js';
import {UserService} from '../user/user-service.interface.js';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    const authenticate = new AuthenticateMiddleware();
    const middlewares = [authenticate, new ValidateObjectIdMiddleware('offerId')];
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index, middlewares: [authenticate]});
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.create, middlewares});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [...middlewares, new DocumentExistsMiddleware(this.offerService, 'Предложение', 'offerId')],
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.userService.findFavorites(getCurrentUser(res).id);
    const previews = offers.map((offer) => Object.assign(fillDto(OfferPreviewRdo, offer), {isFavorite: true}));
    this.ok(res, previews);
  }

  public async create({params}: OfferIdRequest, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Предложение не найдено', 'FavoriteController');
    }

    const user = await this.userService.addToFavorites(getCurrentUser(res).id, params.offerId);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Пользователь не найден', 'FavoriteController');
    }

    const preview = fillDto(OfferPreviewRdo, offer);
    preview.isFavorite = true;
    this.ok(res, preview);
  }

  public async delete({params}: OfferIdRequest, res: Response): Promise<void> {
    const user = await this.userService.removeFromFavorites(getCurrentUser(res).id, params.offerId);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Пользователь не найден', 'FavoriteController');
    }

    this.noContent(res);
  }
}

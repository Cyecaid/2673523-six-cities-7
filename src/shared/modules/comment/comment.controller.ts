import {Response} from 'express';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/index.js';
import {fillDto} from '../../helpers/index.js';
import {Logger} from '../../libs/logger/index.js';
import {
  AuthenticateMiddleware,
  BaseController,
  DocumentExistsMiddleware,
  getCurrentUser,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import {OfferService} from '../offer/offer-service.interface.js';
import {CommentService} from './comment-service.interface.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {CommentRdo} from './rdo/comment.rdo.js';
import {CommentsByOfferRequest, CreateCommentRequest} from './comment-request.type.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) offerService: OfferService,
  ) {
    super(logger);

    const validateOfferId = new ValidateObjectIdMiddleware('offerId');
    const offerExists = new DocumentExistsMiddleware(offerService, 'Предложение', 'offerId');

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [validateOfferId, offerExists],
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new AuthenticateMiddleware(),
        validateOfferId,
        new ValidateDtoMiddleware(CreateCommentDto),
        offerExists,
      ],
    });
  }

  public async index({params}: CommentsByOfferRequest, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDto(CommentRdo, comments));
  }

  public async create({params, body}: CreateCommentRequest, res: Response): Promise<void> {
    const comment = await this.commentService.create({
      ...body,
      offerId: params.offerId,
      authorId: getCurrentUser(res).id,
    });
    this.created(res, fillDto(CommentRdo, comment));
  }
}

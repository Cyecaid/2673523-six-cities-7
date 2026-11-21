import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {EntityService} from '../../entity-service/index.js';
import {HttpError} from '../errors/http-error.js';
import {Middleware} from './middleware.interface.js';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: EntityService<unknown>,
    private readonly entityName: string,
    private readonly param: string,
  ) {}

  public async execute({params}: Request, _res: Response, next: NextFunction): Promise<void> {
    const id = params[this.param];
    if (!(await this.service.exists(id))) {
      throw new HttpError(StatusCodes.NOT_FOUND, `${this.entityName} ${id} не найдено`, 'DocumentExistsMiddleware');
    }
    next();
  }
}

import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {isValidObjectId} from 'mongoose';
import {HttpError} from '../errors/http-error.js';
import {Middleware} from './middleware.interface.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private readonly param: string) {}

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const value = params[this.param];
    if (!isValidObjectId(value)) {
      throw new HttpError(StatusCodes.BAD_REQUEST, `${value} не является корректным ObjectId`, 'ValidateObjectIdMiddleware');
    }
    next();
  }
}

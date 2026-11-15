import {NextFunction, Request, Response} from 'express';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import {StatusCodes} from 'http-status-codes';
import {reduceValidationErrors} from '../../../helpers/index.js';
import {HttpError} from '../errors/http-error.js';
import {Middleware} from './middleware.interface.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private readonly dto: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance, {whitelist: true});

    if (errors.length > 0) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Данные не прошли валидацию',
        'ValidateDtoMiddleware',
        reduceValidationErrors(errors),
      );
    }

    req.body = dtoInstance;
    next();
  }
}

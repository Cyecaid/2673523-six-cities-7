import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../errors/http-error.js';
import {Middleware} from './middleware.interface.js';

export function getCurrentUser(res: Response) {
  const {user} = res.locals;
  if (!user) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Требуется действительный токен авторизации');
  }

  return user;
}

export class AuthenticateMiddleware implements Middleware {
  public execute(_req: Request, res: Response, next: NextFunction): void {
    getCurrentUser(res);
    next();
  }
}

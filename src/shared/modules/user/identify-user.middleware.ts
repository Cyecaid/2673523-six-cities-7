import {NextFunction, Request, Response} from 'express';
import {errors, jwtVerify} from 'jose';
import {isObjectIdOrHexString} from 'mongoose';
import {Middleware} from '../../libs/rest/index.js';
import {UserService} from './user-service.interface.js';
import {JWT_ALGORITHM} from './user.constant.js';

export class IdentifyUserMiddleware implements Middleware {
  private readonly secret: Uint8Array;

  constructor(secret: string, private readonly userService: UserService) {
    this.secret = Buffer.from(secret, 'utf8');
  }

  private async getUserId(token: string): Promise<string | undefined> {
    try {
      const {payload} = await jwtVerify(token, this.secret, {
        algorithms: [JWT_ALGORITHM],
        requiredClaims: ['sub', 'exp'],
      });

      if (typeof payload.sub === 'string' && isObjectIdOrHexString(payload.sub)) {
        return payload.sub;
      }
    } catch (error) {
      if (!(error instanceof errors.JOSEError)) {
        throw error;
      }
    }

    return undefined;
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.vary('Authorization');
    const token = req.get('Authorization')?.match(/^Bearer +(\S+)$/i)?.[1];
    const userId = token && await this.getUserId(token);

    if (userId) {
      res.locals.user = (await this.userService.findById(userId)) ?? undefined;
    }

    next();
  }
}

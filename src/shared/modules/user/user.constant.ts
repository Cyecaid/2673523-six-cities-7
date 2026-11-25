import {UserType} from '../../types/index.js';

export const USER_TYPES: UserType[] = ['regular', 'pro'];

export const JWT_ALGORITHM = 'HS256';
export const JWT_EXPIRATION = '1h';

export const UserLimit = {
  Name: {min: 1, max: 15},
  Password: {min: 6, max: 12},
} as const;

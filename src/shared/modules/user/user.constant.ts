import {UserType} from '../../types/index.js';

export const USER_TYPES: UserType[] = ['regular', 'pro'];

export const UserLimit = {
  Name: {min: 1, max: 15},
  Password: {min: 6, max: 12},
} as const;

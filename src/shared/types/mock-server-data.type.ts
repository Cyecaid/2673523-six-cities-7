import {User} from './user.type.js';

export type MockUser = Omit<User, 'password'>;

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  previewImages: string[];
  photos: string[];
  users: MockUser[];
};

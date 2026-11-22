import {DocumentType} from '@typegoose/typegoose';
import {Request} from 'express';
import {RequestBody, RequestParams} from '../../libs/rest/index.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import {UserEntity} from './user.entity.js';

declare module 'express-serve-static-core' {
  interface Locals {
    user?: DocumentType<UserEntity>;
  }
}

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;

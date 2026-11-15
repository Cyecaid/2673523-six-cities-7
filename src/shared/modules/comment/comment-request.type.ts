import {Request} from 'express';
import {ParamOfferId, RequestBody} from '../../libs/rest/index.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';

export type CreateCommentRequest = Request<ParamOfferId, RequestBody, CreateCommentDto>;
export type CommentsByOfferRequest = Request<ParamOfferId>;

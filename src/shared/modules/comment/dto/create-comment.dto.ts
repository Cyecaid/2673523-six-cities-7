import {IsInt, IsString, Length, Max, Min} from 'class-validator';
import {CommentLimit} from '../comment.constant.js';

export class CreateCommentDto {
  @IsString()
  @Length(CommentLimit.Text.min, CommentLimit.Text.max)
  public text!: string;

  @IsInt()
  @Min(CommentLimit.Rating.min)
  @Max(CommentLimit.Rating.max)
  public rating!: number;
}

export type CreateCommentData = CreateCommentDto & {
  offerId: string;
  authorId: string;
};

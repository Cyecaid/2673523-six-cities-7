import {IsEmail, IsIn, IsOptional, IsString, Length, Matches} from 'class-validator';
import {UserType} from '../../../types/index.js';
import {USER_TYPES, UserLimit} from '../user.constant.js';

export class CreateUserDto {
  @IsString()
  @Length(UserLimit.Name.min, UserLimit.Name.max)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsOptional()
  @Matches(/\.(jpe?g|png)$/i, {message: 'avatarUrl должен указывать на изображение .jpg или .png'})
  public avatarUrl?: string;

  @IsString()
  @Length(UserLimit.Password.min, UserLimit.Password.max)
  public password!: string;

  @IsIn(USER_TYPES)
  public type!: UserType;
}

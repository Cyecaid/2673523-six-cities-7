import {Type} from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {Amenity, City, HousingType} from '../../../types/index.js';
import {AMENITIES, CITIES, HOUSING_TYPES, OFFER_PHOTOS_COUNT, OfferLimit} from '../../../constants/index.js';
import {LocationDto} from './location.dto.js';

export class CreateOfferDto {
  @IsString()
  @Length(OfferLimit.Title.min, OfferLimit.Title.max)
  public title!: string;

  @IsString()
  @Length(OfferLimit.Description.min, OfferLimit.Description.max)
  public description!: string;

  @IsIn(CITIES)
  public city!: City;

  @IsString()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(OFFER_PHOTOS_COUNT)
  @ArrayMaxSize(OFFER_PHOTOS_COUNT)
  @IsString({each: true})
  public photos!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsIn(HOUSING_TYPES)
  public type!: HousingType;

  @IsInt()
  @Min(OfferLimit.Rooms.min)
  @Max(OfferLimit.Rooms.max)
  public roomsCount!: number;

  @IsInt()
  @Min(OfferLimit.Guests.min)
  @Max(OfferLimit.Guests.max)
  public guestsCount!: number;

  @IsInt()
  @Min(OfferLimit.Price.min)
  @Max(OfferLimit.Price.max)
  public price!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(AMENITIES, {each: true})
  public amenities!: Amenity[];

  @ValidateNested()
  @Type(() => LocationDto)
  public location!: LocationDto;
}

export type CreateOfferData = CreateOfferDto & {
  authorId: string;
  postDate?: Date;
  rating?: number;
};

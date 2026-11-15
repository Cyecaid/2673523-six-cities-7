import {Type} from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {Amenity, City, HousingType} from '../../../types/index.js';
import {AMENITIES, CITIES, HOUSING_TYPES, OFFER_PHOTOS_COUNT, OfferLimit} from '../../../constants/index.js';
import {LocationDto} from './location.dto.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  @Length(OfferLimit.Title.min, OfferLimit.Title.max)
  public title?: string;

  @IsOptional()
  @IsString()
  @Length(OfferLimit.Description.min, OfferLimit.Description.max)
  public description?: string;

  @IsOptional()
  @IsIn(CITIES)
  public city?: City;

  @IsOptional()
  @IsString()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(OFFER_PHOTOS_COUNT)
  @ArrayMaxSize(OFFER_PHOTOS_COUNT)
  @IsString({each: true})
  public photos?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsIn(HOUSING_TYPES)
  public type?: HousingType;

  @IsOptional()
  @IsInt()
  @Min(OfferLimit.Rooms.min)
  @Max(OfferLimit.Rooms.max)
  public roomsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(OfferLimit.Guests.min)
  @Max(OfferLimit.Guests.max)
  public guestsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(OfferLimit.Price.min)
  @Max(OfferLimit.Price.max)
  public price?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsIn(AMENITIES, {each: true})
  public amenities?: Amenity[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  public location?: LocationDto;
}

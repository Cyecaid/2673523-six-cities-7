import {IsNumber, Max, Min} from 'class-validator';
import {CoordinateLimit} from '../../../constants/index.js';

export class LocationDto {
  @IsNumber()
  @Min(CoordinateLimit.Latitude.min)
  @Max(CoordinateLimit.Latitude.max)
  public latitude!: number;

  @IsNumber()
  @Min(CoordinateLimit.Longitude.min)
  @Max(CoordinateLimit.Longitude.max)
  public longitude!: number;
}

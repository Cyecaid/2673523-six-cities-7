import {MockServerData} from '../../types/index.js';
import {AMENITIES, CITIES, CITY_LOCATIONS, HOUSING_TYPES, OFFER_PHOTOS_COUNT, OfferLimit} from '../../constants/index.js';
import {getRandomBoolean, getRandomItem, getRandomItems, getRandomNumber} from '../../helpers/index.js';
import {OfferGenerator} from './offer-generator.interface.js';

const MAX_DAYS_AGO = 30;
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const RATING_DIGITS = 1;

export class TsvOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const city = getRandomItem(CITIES);
    const {latitude, longitude} = CITY_LOCATIONS[city];
    const postDate = new Date(Date.now() - getRandomNumber(0, MAX_DAYS_AGO) * MS_IN_DAY);

    return [
      getRandomItem(this.mockData.titles),
      getRandomItem(this.mockData.descriptions),
      postDate.toISOString(),
      city,
      getRandomItem(this.mockData.previewImages),
      getRandomItems(this.mockData.photos, OFFER_PHOTOS_COUNT).join(';'),
      getRandomBoolean(),
      getRandomBoolean(),
      getRandomNumber(OfferLimit.Rating.min, OfferLimit.Rating.max, RATING_DIGITS),
      getRandomItem(HOUSING_TYPES),
      getRandomNumber(OfferLimit.Rooms.min, OfferLimit.Rooms.max),
      getRandomNumber(OfferLimit.Guests.min, OfferLimit.Guests.max),
      getRandomNumber(OfferLimit.Price.min, OfferLimit.Price.max),
      getRandomItems(AMENITIES).join(';'),
      getRandomItem(this.mockData.users).email,
      latitude,
      longitude,
    ].join('\t');
  }
}

import {Amenity, City, HousingType, Offer} from '../../types/index.js';

const CITIES: City[] = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];
const HOUSING_TYPES: HousingType[] = ['apartment', 'house', 'room', 'hotel'];
const AMENITIES: Amenity[] = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'];
const FIELDS_COUNT = 17;
const PHOTOS_COUNT = 6;

function toNumber(value: string, field: string, min: number, max: number, isInteger = false): number {
  const result = Number(value);
  const isInvalid = value.trim() === '' || !Number.isFinite(result)
    || result < min || result > max || (isInteger && !Number.isInteger(result));

  if (isInvalid) {
    throw new Error(`${field} содержит некорректное значение: ${value}`);
  }
  return result;
}

function toBoolean(value: string, field: string): boolean {
  if (value !== 'true' && value !== 'false') {
    throw new Error(` ${field} должно быть true или false, получено: ${value}`);
  }
  return value === 'true';
}

function toCity(value: string): City {
  const city = CITIES.find((item) => item === value);
  if (!city) {
    throw new Error(`Неизвестный город: ${value}`);
  }
  return city;
}

function toHousingType(value: string): HousingType {
  const type = HOUSING_TYPES.find((item) => item === value);
  if (!type) {
    throw new Error(`Неизвестный тип жилья: ${value}`);
  }
  return type;
}

function toAmenities(value: string): Amenity[] {
  const result: Amenity[] = [];
  for (const name of value.split(';')) {
    const amenity = AMENITIES.find((item) => item === name);
    if (!amenity) {
      throw new Error(`Неизвестное удобство: ${name}`);
    }
    result.push(amenity);
  }
  return result;
}

function toPhotos(value: string): string[] {
  const photos = value.split(';');
  if (photos.length !== PHOTOS_COUNT || photos.some((photo) => !photo)) {
    throw new Error(`Ожидалось ${PHOTOS_COUNT} фотографий, получено ${photos.length}`);
  }
  return photos;
}

function toDate(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Некорректная дата: ${value}`);
  }
  return date;
}

function checkLength(value: string, field: string, min: number, max: number): string {
  if (value.length < min || value.length > max) {
    throw new Error(`Длина поля ${field} должна быть от ${min} до ${max} символов`);
  }
  return value;
}

function checkEmail(value: string): string {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`Некорректная почта автора: ${value}`);
  }
  return value;
}

function toRating(value: string): number {
  if (!/^\d(?:[.,]\d)?$/.test(value)) {
    throw new Error(`Некорректный рейтинг: ${value}`);
  }
  return toNumber(value.replace(',', '.'), 'rating', 1, 5);
}

export function parseOffer(line: string): Offer {
  const fields = line.split('\t');
  if (fields.length !== FIELDS_COUNT) {
    throw new Error(`Ожидалось ${FIELDS_COUNT} полей, получено ${fields.length}`);
  }

  const [
    title, description, postDate, city, previewImage, photos, isPremium, isFavorite,
    rating, type, roomsCount, guestsCount, price, amenities, authorEmail, latitude, longitude
  ] = fields;

  return {
    title: checkLength(title, 'title', 10, 100),
    description: checkLength(description, 'description', 20, 1024),
    postDate: toDate(postDate),
    city: toCity(city),
    previewImage,
    photos: toPhotos(photos),
    isPremium: toBoolean(isPremium, 'isPremium'),
    isFavorite: toBoolean(isFavorite, 'isFavorite'),
    rating: toRating(rating),
    type: toHousingType(type),
    roomsCount: toNumber(roomsCount, 'roomsCount', 1, 8, true),
    guestsCount: toNumber(guestsCount, 'guestsCount', 1, 10, true),
    price: toNumber(price, 'price', 100, 100000, true),
    amenities: toAmenities(amenities),
    authorEmail: checkEmail(authorEmail),
    commentsCount: 0,
    location: {
      latitude: toNumber(latitude, 'latitude', -90, 90),
      longitude: toNumber(longitude, 'longitude', -180, 180),
    },
  };
}

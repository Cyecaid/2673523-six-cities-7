import {ClassConstructor, plainToInstance} from 'class-transformer';
import {ValidationError} from 'class-validator';

export type ErrorField = {
  property: string;
  messages: string[];
};

export function fillDto<T, V>(dto: ClassConstructor<T>, plainObject: V): T {
  return plainToInstance(dto, plainObject, {excludeExtraneousValues: true});
}

export function createErrorObject(message: string, details?: ErrorField[]) {
  return details ? {message, details} : {message};
}

export function reduceValidationErrors(errors: ValidationError[], parent = ''): ErrorField[] {
  return errors.flatMap(({property, constraints, children}) => {
    const path = parent ? `${parent}.${property}` : property;
    const own = constraints ? [{property: path, messages: Object.values(constraints)}] : [];
    return [...own, ...reduceValidationErrors(children ?? [], path)];
  });
}

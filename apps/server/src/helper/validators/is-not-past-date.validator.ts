import { registerDecorator, ValidationOptions } from 'class-validator';

const PAST_DATE_TOLERANCE_MS = 24 * 60 * 60 * 1000;

export function IsNotPastDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotPastDate',
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} cannot be in the past`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown) {
          const time = new Date(value as string).getTime();
          return (
            !Number.isNaN(time) && time >= Date.now() - PAST_DATE_TOLERANCE_MS
          );
        },
      },
    });
  };
}

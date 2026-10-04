export type DecimalApiValue =
  | string
  | number
  | null
  | undefined
  | {
      $numberDecimal?: string;
    };

export const normalizeDecimal = (value: DecimalApiValue): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (value && typeof value === 'object' && '$numberDecimal' in value) {
    return value.$numberDecimal || '0';
  }

  return '0';
};

export const normalizeNullableDecimal = (
  value: DecimalApiValue
): string | null =>
  value === null || value === undefined ? null : normalizeDecimal(value);

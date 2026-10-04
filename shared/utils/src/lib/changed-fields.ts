const isEmpty = (value: unknown) =>
  value === null || value === undefined || value === '';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof Date);

export const isEqualValue = (previous: unknown, next: unknown): boolean => {
  if (isEmpty(previous) && isEmpty(next)) {
    return true;
  }

  if (typeof previous === 'string' && typeof next === 'string') {
    return previous.trim() === next.trim();
  }

  if (previous instanceof Date || next instanceof Date) {
    return (
      new Date(previous as Date).getTime() === new Date(next as Date).getTime()
    );
  }

  if (Array.isArray(previous) && Array.isArray(next)) {
    return (
      previous.length === next.length &&
      previous.every((item, index) => isEqualValue(item, next[index]))
    );
  }

  if (isPlainObject(previous) && isPlainObject(next)) {
    const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
    return [...keys].every((key) => isEqualValue(previous[key], next[key]));
  }

  return previous === next;
};

export const getChangedFields = <T extends object>(
  previous: T,
  next: T
): Partial<T> =>
  Object.fromEntries(
    Object.entries(next).filter(
      ([key, value]) => !isEqualValue(previous[key as keyof T], value)
    )
  ) as Partial<T>;

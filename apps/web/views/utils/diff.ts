type Normalizer<T> = Partial<{
  [K in keyof T]: (value: T[K]) => T[K];
}>;

interface GetChangedFieldsOptions<T> {
  normalizers?: Normalizer<T>;
}

export function getChangedFields<T>(
  previous: Partial<T>,
  next: Partial<T>,
  options: GetChangedFieldsOptions<T> = {}
): Partial<T> {
  const changedFields: Partial<T> = {};
  const keys = new Set<keyof T>([
    ...(Object.keys(previous) as Array<keyof T>),
    ...(Object.keys(next) as Array<keyof T>),
  ]);

  for (const key of keys) {
    const normalize = options.normalizers?.[key];
    const previousValue = normalize
      ? normalize(previous[key] as T[keyof T])
      : previous[key];
    const nextValue = normalize ? normalize(next[key] as T[keyof T]) : next[key];

    if (previousValue !== nextValue) {
      changedFields[key] = next[key] as T[keyof T];
    }
  }

  return changedFields;
}

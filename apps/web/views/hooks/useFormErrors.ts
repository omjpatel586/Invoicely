import { useCallback, useState } from 'react';

type ErrorMap<T> = { [K in keyof T]?: string };

export function useFormErrors<T extends ErrorMap<T>>(
  errors: T,
  showAllErrors: boolean
) {
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const markTouched = useCallback((field: keyof T & string) => {
    setTouched((previous) =>
      previous.has(field) ? previous : new Set(previous).add(field)
    );
  }, []);

  const resetTouched = useCallback(() => setTouched(new Set()), []);

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(
      ([field, message]) => message && (showAllErrors || touched.has(field))
    )
  ) as Partial<T>;

  const hasErrors = Object.values(errors).some(Boolean);

  return { visibleErrors, hasErrors, markTouched, resetTouched };
}

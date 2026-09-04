/**
 * The backend rejects empty strings on optional fields (e.g. "Invalid phone
 * number format.", "Profile image must be a valid URL.") instead of treating
 * them as absent — so optional fields must be omitted entirely, not sent as "".
 */
export function withOptionalFields<T extends Record<string, unknown>>(
  base: T,
  optional: Record<string, string | null | undefined>,
): T {
  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(optional)) {
    if (value) {
      result[key] = value;
    }
  }

  return result as T;
}

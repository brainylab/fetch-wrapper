export function objectToUrlParams(
  obj: Record<string, string | number>,
): string {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      params.append(key, String(obj[key]));
    }
  }

  return params.toString();
}

export function createPath(path: string | string[]) {
  return Array.isArray(path) ? path.join('/') : path;
}

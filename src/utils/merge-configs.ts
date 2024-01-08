export function mergeConfigs(
  defaultConfig: Record<string, any>,
  newConfig: Record<string, any>,
) {
  for (const prop in newConfig) {
    if (Object.prototype.hasOwnProperty.call(newConfig, prop)) {
      if (newConfig[prop] && newConfig[prop].constructor === Object) {
        defaultConfig[prop] = mergeConfigs(
          defaultConfig[prop] || {},
          newConfig[prop],
        );
      } else {
        defaultConfig[prop] = newConfig[prop];
      }
    }
  }

  return defaultConfig;
}

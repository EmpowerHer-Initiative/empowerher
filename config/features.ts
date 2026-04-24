import config from "./config.json";

type Config = typeof config;

export type FeatureKey = keyof Config;

export function isFeatureEnabled(key: FeatureKey): boolean {
  return config[key] === true;
}

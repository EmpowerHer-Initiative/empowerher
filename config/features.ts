import config from "./config.json";

type Config = typeof config;

// Top-level boolean keys (e.g. "blog", "contact")
type TopLevelKey = {
  [K in keyof Config]: Config[K] extends boolean ? K : never;
}[keyof Config];

// For nested objects: "parent" + "parent.child" for each boolean child (excluding "enabled")
type NestedKeys = {
  [K in keyof Config]: Config[K] extends Record<string, unknown>
    ?
        | (K & string)
        | `${K & string}.${Exclude<
            {
              [C in keyof Config[K]]: Config[K][C] extends boolean ? C : never;
            }[keyof Config[K]],
            "enabled"
          > &
            string}`
    : never;
}[keyof Config];

export type FeatureKey = TopLevelKey | NestedKeys;

export function isFeatureEnabled(key: FeatureKey): boolean {
  if (key in config) {
    const value = config[key as keyof Config];
    if (typeof value === "boolean") return value;
    return (value as Record<string, unknown>).enabled === true;
  }

  const [parent, child] = (key as string).split(".");
  const group = config[parent as keyof Config] as Record<string, unknown>;
  return group.enabled === true && group[child] === true;
}

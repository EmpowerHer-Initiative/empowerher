import { isFeatureEnabled, type FeatureKey } from "./features";

export function FeatureGate({
  feature,
  children,
  fallback = null,
}: {
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (!isFeatureEnabled(feature)) return fallback;
  return children;
}

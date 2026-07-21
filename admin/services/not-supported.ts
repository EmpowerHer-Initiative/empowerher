export function notSupported(fn: string): never {
  throw new Error(`${fn} is not supported by the current provider`);
}

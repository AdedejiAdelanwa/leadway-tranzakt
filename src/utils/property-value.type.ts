export type PropertyValueType<
  T extends Record<keyof T, object>,
  K extends keyof T,
> = T[K];

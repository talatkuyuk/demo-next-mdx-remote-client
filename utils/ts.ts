export type PartiallyOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

// eslint-disable-next-line @typescript-eslint/ban-types
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

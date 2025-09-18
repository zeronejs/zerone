export * from "./apiTypes/Pet";
export * from "./apiTypes/Category";
export * from "./apiTypes/Tag";

export type Primitive = undefined | null | boolean | string | number | symbol;
export type DeepRequired<T> = T extends Primitive ? T : keyof T extends never ? T : { [K in keyof T]-?: DeepRequired<T[K]> };

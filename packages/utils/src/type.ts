/**
 * From T, pick 出所有方法的key
 * @example type keys = PickMethodsKey<{ a: () => void; b: () => void }>;
 */
export type PickMethodsKey<T> = {
    [K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];

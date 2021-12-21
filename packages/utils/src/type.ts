/**
 * From T, pick 出所有方法的key
 * @example type keys = PickMethodsKey<{ a: () => void; b: () => void }>;
 */
export type PickMethodsKey<T> = {
    [K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];

/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/8-medium-readonly-2/README.zh-CN.md
 */
export type PickReadonly<T, K extends keyof T = keyof T> = {
    readonly [key in K]: T[key];
} & Omit<T, K>;
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/62-medium-type-lookup/README.zh-CN.md
 */
export type LookUp<U, T> = U extends { type: T } ? U : never;

type Space = ' ' | '\n' | '\t';
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/106-medium-trimleft/README.zh-CN.md
 */
export type TrimLeft<S extends string> = S extends `${Space}${infer Other}` ? TrimLeft<Other> : S;
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/108-medium-trim/README.md
 */
export type Trim<S extends string> = S extends `${Space}${infer T}` | `${infer T}${Space}` ? Trim<T> : S;
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/599-medium-merge/README.md
 */
export type Merge<F, S> = {
    [Key in keyof F | keyof S]: Key extends keyof S ? S[Key] : Key extends keyof F ? F[Key] : never;
};

export type MergeType<T> = {
    [K in keyof T]: T[K];
};

/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/2757-medium-partialbykeys/README.md
 */
export type PartialByKeys<T, K = keyof T, P extends keyof T = Extract<keyof T, K>> = MergeType<
    Partial<Pick<T, P>> & Omit<T, P>
>;

/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/2759-medium-requiredbykeys/README.md
 */
export type RequiredByKeys<T, K = keyof T, P extends keyof T = Extract<keyof T, K>> = MergeType<
    Required<Pick<T, P>> & Omit<T, P>
>;

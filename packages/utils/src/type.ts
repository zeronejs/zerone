export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
/**
 * From T, pick 出所有方法的key
 * @example type keys = PickMethodsKey<{ a: () => void; b: () => void }>;
 */
export type PickMethodsKey<T> = {
    [K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];
/**
 * https://github.com/type-challenges/type-challenges/blob/main/questions/00008-medium-readonly-2/README.zh-CN.md
 */
export type PickReadonly<T, K extends keyof T = keyof T> = {
    readonly [key in K]: T[key];
} & Omit<T, K>;
/**
 * https://github.com/type-challenges/type-challenges/blob/main/questions/00062-medium-type-lookup/README.zh-CN.md
 */
export type LookUp<U, T> = U extends { type: T } ? U : never;

type Space = ' ' | '\n' | '\t';
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/00106-medium-trimleft/README.zh-CN.md
 */
export type TrimLeft<S extends string> = S extends `${Space}${infer Other}` ? TrimLeft<Other> : S;
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/00108-medium-trim/README.md
 */
export type Trim<S extends string> = S extends `${Space}${infer T}` | `${infer T}${Space}` ? Trim<T> : S;
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/04803-medium-trim-right/README.md
 */
export type TrimRight<S extends string> = S extends `${infer L}${Space}` ? TrimRight<L> : S;
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/00599-medium-merge/README.md
 * type F = {a:string} S= {b:number} ====>  {a:string,b:number}
 */
export type Merge<F, S> = {
    [Key in keyof F | keyof S]: Key extends keyof S ? S[Key] : Key extends keyof F ? F[Key] : never;
};
/**
 * 把一堆类型 如：Partial<Pick<User, "name">> & Omit<User, "name">   合并成简单的 {name?:string;age:number}
 */
export type MergeType<T> = {
    [K in keyof T]: T[K];
};

/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/02757-medium-partialbykeys/README.md
 */
export type PartialByKeys<T, K = keyof T, P extends keyof T = Extract<keyof T, K>> = MergeType<
    Partial<Pick<T, P>> & Omit<T, P>
>;

/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/02759-medium-requiredbykeys/README.md
 */
export type RequiredByKeys<T, K = keyof T, P extends keyof T = Extract<keyof T, K>> = MergeType<
    Required<Pick<T, P>> & Omit<T, P>
>;
/**
 * @example Tuple2Union<[1,2]>  // 1 | 2
 * type[number]
 */
export type Tuple2Union<T extends any[]> = T extends Array<infer K> ? K : never;
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/00055-hard-union-to-intersection/README.zh-CN.md
 */
export type UnionToIntersection<U> = (U extends any ? (arg: U) => any : never) extends (arg: infer I) => void
    ? I
    : never;
/**
 * https://github.com/type-challenges/type-challenges/blob/master/questions/00399-hard-tuple-filter/README.md
 */
export type TupleFilterOut<T extends any[], F> = T extends [infer First, ...infer R]
    ? [First] extends [F]
        ? TupleFilterOut<R, F>
        : [First, ...TupleFilterOut<R, F>]
    : [];

type IsUnion<T, O = T> = T extends O ? ([O] extends [T] ? false : true) : never;
/**
 * LastInUnion<1 | 2> = 2.
 */
type LastInUnion<U> = UnionToIntersection<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0
    ? L
    : never;

/**
 * UnionToTuple<1 | 2> = [1, 2].
 */
type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
    ? []
    : [...UnionToTuple<Exclude<U, Last>>, Last];

export type NonReadonly<T> = {
    -readonly [P in keyof T]: T[P];
};
/**
 * type Arr = ['1', '2', '3']
 * type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
 */
export type TupleToUnion<T extends any[]> = T extends Array<infer K> ? K : never;
/**
 * class
 */
interface Type<T> extends Function {
    new (...args: any[]): T;
}

export type Primitive = undefined | null | boolean | string | number | symbol;
// 深度 Required
export type DeepRequired<T> = T extends Primitive
    ? T
    : keyof T extends never
    ? T
    : { [K in keyof T]-?: DeepRequired<T[K]> };

const toString = Object.prototype.toString;
export function getTag(value: any): string {
    if (value === null) {
        return '[object Null]';
    } else if (value === undefined) {
        return '[object Undefined]';
    }
    return toString.call(value);
}
export function isObjectLike(value: any): boolean {
    return typeof value === 'object' && value !== null;
}
export function isBoolean(value: any): value is boolean {
    return value === true || value === false || (isObjectLike(value) && getTag(value) === '[object Boolean]');
}

export function isString(value: any): value is string {
    return typeof value === 'string' || (isObjectLike(value) && getTag(value) === '[object String]');
}

export function isNumber(value: any): value is number {
    return typeof value === 'number' || (isObjectLike(value) && getTag(value) === '[object Number]');
}
export function isSymbol(value: any): value is symbol {
    return typeof value === 'symbol' || (isObjectLike(value) && getTag(value) === '[object Symbol]');
}
export function isDate(value: any): value is Date {
    return isObjectLike(value) && getTag(value) === '[object Date]';
}
// 整数
export function isInteger(val: any): val is number {
    return isNumber(val) && val % 1 === 0;
}
// 小数
export function isDecimal(val: any): val is number {
    return isNumber(val) && val % 1 !== 0;
}
// 负数
export function isNegative(val: any): val is number {
    return isNumber(val) && val < 0;
}
// 正数
export function isPositive(val: any): val is number {
    return isNumber(val) && val > 0;
}
// 奇数
export function isOdd(val: any): val is number {
    return isNumber(val) && val % 2 !== 0;
}
// 偶数
export function isEven(val: any): val is number {
    return isNumber(val) && val % 2 === 0;
}

export function isUndefined(val: any): val is undefined {
    return val === undefined;
}
export function isNull(val: any): val is null {
    return val === null;
}
export function isNil(val: any): val is null | undefined {
    return isUndefined(val) || isNull(val);
}
/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 */
export function isError(value: any): value is Error {
    if (!isObjectLike(value)) {
        return false;
    }
    const tag = getTag(value);
    return (
        tag === '[object Error]' ||
        tag === '[object DOMException]' ||
        (typeof value.message === 'string' && typeof value.name === 'string' && !isPlainObject(value))
    );
}
export function isPlainObject(value: any): value is object {
    if (!isObjectLike(value) || getTag(value) !== '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }
    let proto = value;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
}

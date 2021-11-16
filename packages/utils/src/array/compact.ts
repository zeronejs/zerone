/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
export function compact<T>(array: Array<T | null | undefined | false | '' | 0> | null | undefined): T[] {
	let resIndex = 0;
	const result: T[] = [];

	if (!array) {
		return result;
	}

	for (const value of array) {
		if (value) {
			result[resIndex++] = value;
		}
	}
	return result;
}

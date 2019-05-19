// /* This Source Code Form is subject to the terms of the Mozilla Public
//  * License, v. 2.0. If a copy of the MPL was not distributed with this file,
//  * You can obtain one at http://mozilla.org/MPL/2.0/. */

// /**
//  * Returns the index of the given target in the given array or -1 if the
//  * target is not found.
//  *
//  * See search() for a description of this function's parameters.
//  *
//  * @return The index of `target` in `array` or -1 if `target` is not found.
//  */
// export function indexOf<T=any>(comparator: Comparator<T>, array: T[], target: T) {
//   let [found, idx] = search(comparator, array, target);
//   return found ? idx : -1;
// }

// /**
//  * Returns the index within the given array where the given target may be
//  * inserted to keep the array ordered.
//  *
//  * See search() for a description of this function's parameters.
//  *
//  * @return The index in `array` where `target` may be inserted to keep `array`
//  *         ordered.
//  */
// export function insertionIndexOf<T=any>(comparator: Comparator<T>, array: T[], target: T): number {
//   return search(comparator, array, target)[1] as number
// }

// /**
//  * Searches for the given target in the given array.
//  *
//  * @param  comparator
//  *         A function that takes two arguments and compares them, returning a
//  *         negative number if the first should be ordered before the second,
//  *         zero if the first and second have the same ordering, or a positive
//  *         number if the second should be ordered before the first.  The first
//  *         argument is always `target`, and the second argument is a value
//  *         from the array.
//  * @param  array
//  *         An array whose elements are ordered by `comparator`.
//  * @param  target
//  *         The value to search for.
//  * @return An array with two elements.  If `target` is found, the first
//  *         element is true, and the second element is its index in the array.
//  *         If `target` is not found, the first element is false, and the
//  *         second element is the index where it may be inserted to keep the
//  *         array ordered.
//  */
// export function search<T=any>(comparator: Comparator<T>, array: T[], target: T) {
//   let low = 0;
//   let high = array.length - 1;
//   while (low <= high) {
//     // Thanks to http://jsperf.com/code-review-1480 for this tip.
//     let mid = (low + high) >> 1;
//     let cmp = comparator(target, array[mid]);
//     if (cmp == 0)
//       return [true, mid];
//     if (cmp < 0)
//       high = mid - 1;
//     else
//       low = mid + 1;
//   }
//   return [false, low];
// }

// type Comparator<T=any> = (arg0: T, arg1: T) => number

/* Javascript doesn't do integer math. Everything is
 * floating point with percision Number.EPSILON.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
 */


export const cmp = {
  epsilon: Number.EPSILON === undefined ? Number.EPSILON : Math.pow(2, -52),
  
  EPSILON_SQ: cmp.epsilon * cmp.epsilon,
  
  /* FLP comparator */
  cmp: (a, b) => {
    // check if they're both 0
    if (-cmp.epsilon < a && a < cmp.epsilon) {
      if (-cmp.epsilon < b && b < cmp.epsilon) {
        return 0
      }
    }

    // check if one is positive and the other negative
    if (a < 0 && 0 < b) return -1
    if (b < 0 && 0 < a) return 1

    // check if they're flp equal
    const ab = a - b
    if (ab * ab < cmp.EPSILON_SQ * a * b) {
      return 0
    }

    // normal comparison
    return a < b ? -1 : 1
  }
}
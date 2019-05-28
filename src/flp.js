/* Javascript doesn't do integer math. Everything is
 * floating point with percision Number.EPSILON.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
 */


export const cmp = {
  get epsilon () {
    return Number.EPSILON === undefined ? Number.EPSILON : Math.pow(2, -52)
  },

  get EPSILON_SQ () {
    return this.epsilon * this.epsilon
  }, 
  
  /* FLP comparator */
  cmp (a, b) {
    // check if they're both 0
    if (-this.epsilon < a && a < this.epsilon) {
      if (-this.epsilon < b && b < this.epsilon) {
        return 0
      }
    }

    // check if one is positive and the other negative
    if (a < 0 && 0 < b) return -1
    if (b < 0 && 0 < a) return 1

    // check if they're flp equal
    const ab = a - b
    if (ab * ab < this.EPSILON_SQ * a * b) {
      return 0
    }

    // normal comparison
    return a < b ? -1 : 1
  }
}
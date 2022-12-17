import * as bn from 'bn.js'
/*   *大数运算
  *其他方法类型，https://www.npmjs.com/package/bn.js
  @param { String } a
  @param { String } b
  @param { String } type  add(加) | sub(减) | mul(乘) | div(除)
 */
export function calcuBN(type, a, b) {
  return new bn.BN(a)[type](new bn.BN(b))
}



export default {
  calcuBN
}

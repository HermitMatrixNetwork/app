import * as bn from 'bn.js'

/* 
  *其他方法类型，https://www.npmjs.com/package/bn.js
 */
export function calcuBN(type, a, b) {
  return new bn(a)[type](new BN(b))
}
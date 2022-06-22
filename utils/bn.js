import * as bn from 'bn.js'

/*   *计算大数    *type：String BN计算方法，add(加) sub(减) mul(乘) div(除)
  *其他方法类型，https://www.npmjs.com/package/bn.js  *注意： 大数据传入参数要是字符串
 */
export function calcuBN(type, a, b) {
  return new bn(a)[type](new BN(b))
}
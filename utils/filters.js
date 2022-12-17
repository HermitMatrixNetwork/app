/**
 *地址显示修改 
 * @param {String} address
 * @param {Number} start
 * @param {Number} end
 */
export const sliceAddress =(address,start=16,end = -6)=>{
  if (address) {
    let subStr1 = address.substr(0, start)
    let subStr2 = address.substr(end)
    let subStr = subStr1 + '...' + subStr2
    return subStr
  } else {
    return ''
  }
}

/**
 * 除e6
 */
export const exceptE6=(num)=>{
  return Number(num)/1e6
}
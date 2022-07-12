/**
 *地址显示修改 
 * @param {String} address
 */
export const sliceAddress =(address)=>{
  if (address) {
    let subStr1 = address.substr(0, 16)
    let subStr2 = address.substr(address.length - 14, 14)
    let subStr = subStr1 + '...' + subStr2
    return subStr
  } else {
    return ''
  }
	
}
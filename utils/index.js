/*
* @Author: Huanghaicong
* @Date: 2022-06-22 16:26:27
* @LastEditors: Huanghaicong
* @FilePath: /utils/index.js
* @Description: In User Settings Edit
*/
import secretjs from './secretjs/index'
import * as bn from './bn.js'
import isTor from './isTor'

export const checkAddress = (address) => {
	return /^ghm1[a-z0-9]{38}$/.test(address)
}

export {
  secretjs,
  bn,
  isTor,
}

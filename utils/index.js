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

export const getRamNumber = () => {
  var result = ''
  for (var i = 0; i < 32; i++) {

    result += Math.floor(Math.random() * 16).toString(16) //获取0-15并通过toString转16进制
  }

  return result
}

export {
  secretjs,
  bn,
  isTor,
}

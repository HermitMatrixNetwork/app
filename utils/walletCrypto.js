/**
 * @Author: 黄海聪
 * @Date: 2022-06-22 16:11:38
 * @LastEditors: 黄海聪
 * @FilePath: /utils/walletCrypto.js
 * @Description: In User Settings Edit
 */
import {
  bech32
} from 'bech32'
import {
  ripemd160
} from '@noble/hashes/ripemd160'
import {
  sha256
} from '@noble/hashes/sha256'
import CryptoJS from "crypto-js"

const WalletCrypto = {}

/**
 *   @param { string } key 需要加密的数据
 *   @param { string } msg 加密签名
 *   @return { string } ciphertext 密文
 */

WalletCrypto.encode = (key, msg = 'hhaic') => {
  return CryptoJS.AES.encrypt(key, msg).toString()
}

/**
 *   @param { string } ciphertext 需要解密的密文
 *   @param { string } msg 解密签名
 *   @return { string } originalText 明文
 */
WalletCrypto.decode = (ciphertext, msg = 'hhaic') => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, msg)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  return originalText
}

/**
 *   Uint8Array(32)私钥转换为string类型
 *   @param { Uint8Array } source 数据源
 *   @return { String } 64位字符串
 */
WalletCrypto.UintToString = (source) => {
  let result = Array.prototype.map.call(source, item => ('00' + item.toString(16)).slice(-2))
  return result.join('')
}

/**
 *  string类型的私钥转换为Uint8Array
 *  @param { String } source 数据源
 *  @return { Uint8Array } 32位ArrayBuffer
 */
WalletCrypto.StringToUint = (source) => {
  let result = []
  let str = ''
  source.split('').forEach((item, index) => {
    if (index % 2 !== 0) {
      str += item
      result.push(str)
      str = ''
    } else {
      str = item
    }
  })
  return new Uint8Array(result.map(item => parseInt(item, 16)))
}


/**
  跟据公钥推导钱包地址
  @param  { pubkey } Uint8Array 公钥
  @param { prefix } String 地址前缀
  @returns { string } 钱包地址
 */
WalletCrypto.pubkeyToAddress = (pubkey, prefix = 'ghm') => {
  const result = bech32.encode(prefix, bech32.toWords(ripemd160(sha256(pubkey))))
  return result
}

export default WalletCrypto

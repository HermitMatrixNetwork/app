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

const WalletCrypto = {}

/**
  Uint8Array(32)私钥转换为string类型
  @param { key } Uint8Array 私钥
  @param { msg } string 签名
  @returns { string } 私钥
 */
WalletCrypto.encode = (key, msg = 'gongshi') => {
  const words = bech32.toWords(key, 'utf8')
  const result = bech32.encode(msg, words)
  return result
}

/**
 string类型的私钥转换为Uint8Array(32)
 @param { key } string 私钥
 @returns { Uint8Array(32) } 私钥
 */
WalletCrypto.decode = (key) => {
  const cover = bech32.decode(key)
  const result = bech32.fromWords(cover.words)
  return result
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

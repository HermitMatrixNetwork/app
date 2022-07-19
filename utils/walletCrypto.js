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
import CryptoJS from 'crypto-js'
import * as cosmjs from '@cosmjs/crypto'
import AES, {
  Counter
} from 'aes-js'
import {
  Hash
} from '@keplr-wallet/crypto'
import pbkdf2 from 'pbkdf2'

import {
  Buffer
} from 'buffer/'
import randomBytes from 'randombytes'

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
  let result = Array.prototype.map.call(source, (item) =>
    ('00' + item.toString(16)).slice(-2)
  )
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
  return new Uint8Array(result.map((item) => parseInt(item, 16)))
}

/**
  跟据公钥推导钱包地址
  @param  { pubkey } Uint8Array 公钥
  @param { prefix } String 地址前缀
  @returns { string } 钱包地址
 */
WalletCrypto.pubkeyToAddress = (pubkey, prefix = 'ghm') => {
  const result = bech32.encode(
    prefix,
    bech32.toWords(ripemd160(sha256(pubkey)))
  )
  return result
}

/**
 *   根据私钥推到公钥
 *   @param { Uint8Array } privatekey 私钥
 *   @return { Promise } Uint8Array publickey 公钥
 */
WalletCrypto.getPublickey = async (privatekey) => {
  const makeKeypair = await cosmjs.Secp256k1.makeKeypair(privatekey)
  const publickey = await cosmjs.Secp256k1.compressPubkey(makeKeypair.pubkey)
  return publickey
}

WalletCrypto.generateKeystore = {
  crypto: {
    getRandomBytesAsync: (array) => {
      const random = randomBytes(array.byteLength)
      const bytes = new Uint8Array(array.buffer, array.byteOffset, array.byteLength)
      for (let i = 0; i < random.length; i++) {
        bytes[i] = random[i]
      }
      return array
    }
  },
  async encrypt(text, password, crypto = WalletCrypto.generateKeystore.crypto, kdf = 'pbkdf2') {
    let random = new Uint8Array(32)
    const salt = Buffer.from(crypto.getRandomBytesAsync(random)).toString('hex')
    const scryptParams = {
      salt,
      dklen: 32,
      n: 131072,
      r: 8,
      p: 1,
    }

    const derivedKey = await (async () => {
      return new Promise((resolve, reject) => {
        pbkdf2.pbkdf2(
          password, // password
          salt,
          4000,
          32,
          'sha256',
          (err, derivedKey) => {
            if (err) {
              reject(err)
            } else {
              resolve(new Uint8Array(derivedKey))
            }
          }
        )
      })
    })()

    const buf = Buffer.from(text) // params text @test 'test' maybe is a privateKey

    random = new Uint8Array(16)
    const iv = Buffer.from(await crypto.getRandomBytesAsync(random))

    const counter = new Counter(0)
    counter.setBytes(iv)

    const aesCtr = new AES.ModeOfOperation.ctr(derivedKey, counter)
    const ciphertext = Buffer.from(aesCtr.encrypt(buf))

    const mac = Hash.sha256(
      Buffer.concat([
        Buffer.from(derivedKey.slice(derivedKey.length / 2)),
        ciphertext,
      ])
    )
    return {
      version: '1.2',
      coinTypeForChain: {},
      crypto: {
        cipher: 'aes-128-ctr',
        cipherparams: {
          iv: iv.toString('hex'),
        },
        ciphertext: ciphertext.toString('hex'),
        kdf,
        kdfparams: scryptParams,
        mac: Buffer.from(mac).toString('hex'),
      },
    }
  },
  async decrypt(keyStore, password, crypto = WalletCrypto.generateKeystore.crypto) {
    const derivedKey = await (async () => {
      return new Promise((resolve, reject) => {
        pbkdf2.pbkdf2(
          password,
          keyStore.crypto.kdfparams.salt,
          4000,
          32,
          'sha256',
          (err, derivedKey) => {
            if (err) {
              reject(err)
            } else {
              resolve(new Uint8Array(derivedKey))
            }
          }
        )
      })
    })()

    const counter = new Counter(0)
    counter.setBytes(Buffer.from(keyStore.crypto.cipherparams.iv, 'hex'))
    const aesCtr = new AES.ModeOfOperation.ctr(derivedKey, counter)

    const mac = Hash.sha256(
      Buffer.concat([
        Buffer.from(derivedKey.slice(derivedKey.length / 2)),
        Buffer.from(keyStore.crypto.ciphertext, 'hex'),
      ])
    )
    if (!Buffer.from(mac).equals(Buffer.from(keyStore.crypto.mac, 'hex'))) {
      // throw new KeplrError('keyring', 222, 'Unmatched mac')
    }

    const result = Buffer.from(
      aesCtr.decrypt(Buffer.from(keyStore.crypto.ciphertext, 'hex'))
    )
    const privateKey = Buffer.from(result).toString()
    return privateKey
  }
}

export default WalletCrypto

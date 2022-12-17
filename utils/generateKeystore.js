import {
  sha256
} from '@noble/hashes/sha256'
import CryptoJS from 'crypto-js'
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
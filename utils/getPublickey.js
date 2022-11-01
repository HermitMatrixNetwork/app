import * as cosmjs from '@cosmjs/crypto'

/**
 *   根据私钥推到公钥
 *   @param { Uint8Array } privatekey 私钥
 *   @return { Promise } Uint8Array publickey 公钥
 */

export default async (privatekey) => {
  const makeKeypair = await cosmjs.Secp256k1.makeKeypair(privatekey)
  const publickey = await cosmjs.Secp256k1.compressPubkey(makeKeypair.pubkey)
  return publickey
}
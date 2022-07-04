/**
 * @Author: 黄海聪
 * @Date: 2022-07-04 13:59:38
 * @Description: In User Settings Edit
 */
import WalletCrypto from '@/utils/walletCrypto.js'
import secretjs from '@/utils/secretjs/index.js'
import renderUtils from '@/utils/render.base.js'

/**
 *   根据助记词创建钱包（没有则新建钱包）, 生成privateKey密钥
 *   @param { string } fn 目标函数名字
 *   @param { object } vm vue实例(调用者)
 *   @param { string } mnemonic 助记词
 *   @param { string } cb 回调函数名字
 */
export function createWallet(fn, vm, mnemonic = '', cb) {
  const wallet = new secretjs.Wallet(mnemonic, {
    bech32Prefix: 'ghm'
  })

  // 生成私钥
  const privateKey = WalletCrypto.encode(wallet.privateKey)

  renderUtils.runMethod(vm._$id, fn, {
    wallet,
    privateKey
  }, vm)
  cb && renderUtils.runMethod(vm._$id, cb, '', vm)
}
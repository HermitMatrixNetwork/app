/**
 * @Author: 黄海聪
 * @Date: 2022-07-04 13:59:38
 * @Description: In User Settings Edit
 */
import {
  validate,
  validateAll
} from '@/utils/validator.js'
import WalletCrypto from '@/utils/walletCrypto'
export default {
  methods: {
    /** 
     * 查找钱包
     * @param { string } target 字段名
     * @param { string } value 字段值  
     * @return { undefined | wallet }
     */
    findWallet(target, value) {
      const walletList = this.$cache.get('_walletList')
      if (!walletList) return
      return walletList.find(item => item[target] === value)
    },
    /** 设置 _currentWallet , 更新 _walletList
     */
    initWallet({
      wallet,
      privateKey64
    }) {
      if (!this.password || !this.name) return console.error('初始化钱包数据失败，请检查组件是否已经注册password、name字段作为钱包密码和钱包名字')
      wallet.name = this.name
      // 删除隐私信息
      // delete wallet.privateKey
      // delete wallet.publicKey
      
      // 加密隐私信息 (mnemonic、password、privateKey64)
      wallet.mnemonic = WalletCrypto.encode(wallet.mnemonic)
      wallet.password = WalletCrypto.encode(this.password)
      wallet.privateKey64 = WalletCrypto.encode(privateKey64)
      
      
      console.log('创建钱包数据:', {
        wallet
      })
      this.$cache.set('_currentWallet', wallet, 0)
      this.updateWalletList(wallet)
    },
    /** 更新本地 walletList 数据
     *  @param { object } wallet 钱包数据
     *  @return { boolean } 更新是否成功
     */
    updateWalletList(wallet) {
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1)
      }
      walletList.push(wallet)
      this.$cache.set('_walletList', walletList, 0)
      return true
    },
    // 校验密码
    verifyPassword(target, value) {
      const {
        result
      } = validate.call(this, 'password')
      const wallet = this.findWallet(target, value)
      if (!wallet) return true
      return result && WalletCrypto.decode(wallet.password) == this.password
    }
  }
}

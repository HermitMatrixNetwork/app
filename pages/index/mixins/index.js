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
import renderUtils from '@/utils/render.base.js'
export default {
  methods: {
    /** 
     * 查找钱包
     * @param { Object } wallet 钱包
     * @return { undefined | wallet }
     */
    findWallet(wallet) {
      const walletList = this.$cache.get('_walletList')
      if (!walletList) return undefined
      return walletList.find(item => item.address === wallet.address)
    },
    checkExist(wallet) {
      const result = Boolean(this.findWallet(wallet))
      return result
    },
    synchronizingLocalData(wallet) {
      this.$cache.set('_currentWallet', wallet, 0)
      this.updateWalletList(wallet)                
    },
    /** 设置 _currentWallet , 更新 _walletList
     */
    async initWallet({
      wallet,
      cb
    }) {
      if (!this.password || !this.name) return console.error('初始化钱包数据失败，请检查组件是否已经注册password、name字段作为钱包密码和钱包名字')

      const currentRoutes = getCurrentPages() // 获取当前打开过的页面路由数组
      const {
        route,
        options
      } = currentRoutes[currentRoutes.length - 1] //获取当前页面路由
      const action = route.split('/').slice(-1)[0]
      const from = options.from || 'index'
      const validateMnemonicPages = ['createWallet']

      // 删除隐私信息
      this.deletePrivateInfo(wallet, action)
      
      // keystore解密私钥(if it need)
      this.getPrivateKeyFromKeystore && await this.getPrivateKeyFromKeystore(wallet)

      // 推导钱包地址
      const address = await this.getWalletAddress(wallet, action)

      // 推导不出地址 直接跳出
      if (!address) return

      // 加密隐私信息 (mnemonic、password、privateKey64)
      this.encryptPrivateInfo(wallet, action)

      wallet.name = this.name
      wallet.address = address

      // @test
      // window.WallectCrypto = WalletCrypto
      // window.wallet = wallet
      // console.log('创建钱包数据:', {
      //   wallet
      // })
      // end test

      if (from == 'walletManager' && this.checkExist(wallet)) {
        // 校验是否已经存在该钱包
        return this.$refs.notify.show('error', this.language.text86) // '钱包已存在，请勿导入相同的钱包'
      }
      
      // 助记词校验成功后再同步到本地数据，否则不会同步到本地
      if (validateMnemonicPages.includes(action)) {
        this.$cache.delete('_temporaryWallet', wallet)
        this.$cache.set('_temporaryWallet', wallet, 0)
      } else {
        this.synchronizingLocalData(wallet)
      }
      
      // cb && renderUtils.runMethod(this._$id, cb, { wallet }, this)
      cb && this[cb]({wallet})
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
        walletList.splice(walletIndex, 1, wallet)
      } else {
        walletList.unshift(wallet)
      }
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
    },
    deletePrivateInfo(wallet, action) {
      const deleteMnemonicPages = ['importFromPrivatekey', 'importFromKeystore']


      if (deleteMnemonicPages.includes(action)) {
        delete wallet.mnemonic
        delete wallet.address
      }

      // 删除隐私信息
      delete wallet.privateKey
      delete wallet.publicKey
    },
    encryptPrivateInfo(wallet, action) {
      const useCurrentPrivateKeyPages = ['importFromPrivatekey', 'importFromKeystore']
      wallet.mnemonic = wallet.mnemonic && WalletCrypto.encode(wallet.mnemonic)
      wallet.password = WalletCrypto.encode(this.password)
      wallet.privateKey64 = useCurrentPrivateKeyPages.includes(action) ? WalletCrypto.encode(this.privateKey64) :
        WalletCrypto.encode(wallet.privateKey64)
    },
    async getWalletAddress(wallet, action) {
      try {
        const inferAddressPages = ['importFromPrivatekey', 'importFromKeystore']
        let address = wallet.address
        if (inferAddressPages.includes(action)) {
          if (this.privateKey64.split('').find(item => item.charCodeAt(0) === 65533) !== undefined) {
            throw Error('私钥错误')
          }
          // if (action == 'importFromKeystore') {
          //   console.log('fire')
          //   await this.getPrivateKeyFromKeystore()
          // }
          const pubkey = await WalletCrypto.getPublickey(WalletCrypto.StringToUint(this.privateKey64))
          address = WalletCrypto.pubkeyToAddress(pubkey)
        }

        return address
      } catch (e) {
        console.log(e)
        this.$refs.notify.show('error', this.language.text60)
        return false
      }
    }
  }
}

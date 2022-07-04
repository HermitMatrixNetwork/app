/**
 * @Author: 黄海聪
 * @Date: 2022-07-04 13:59:38
 * @Description: In User Settings Edit
 */
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
    /**
     * 应用上方弹出提示
     * @param { string } type 类型 
     * @param { string } message 提示信息
     */
    showNotify(type, message) {
      if (!this.$refs.uNotify) return console.warn('没有注册uNotify组件')
      return this.$refs.uNotify.show({
        top: .1, // 0在H5下无效
        type: type || 'error',
        color: '#FFFFFF',
        bgColor: '#EC6665',
        message: message || '信息',
        duration: 1000 * 3,
        fontSize: '28rpx', // 单位rpx
        safeAreaInsetTop: false
      })
    },
    /** 设置 _currentWallet , 更新 _walletList
     */
    initWallet({
      wallet,
      privateKey
    }) {
      const walletList = this.$cache.get('_walletList')

      // 加密密码
      // const password = WalletCrypto.encode(this.password, 'hhaic')

      // console.log(password)

      wallet.password = this.password
      wallet.privateKey64 = privateKey

      console.log('111创建钱包数据:', {
        wallet
      })
      this.$cache.set('_currentWallet', wallet, 0)

      if (walletList) { // @todo 校验是否已经存在于walletList
        walletList.push(wallet)
        this.$cache.set('_walletList', walletList, 0)
      } else {
        this.$cache.set('_walletList', [wallet], 0)
      }
      // 解密密码
      // const dePassword = WalletCrypto.decode(password)
      // console.log(dePassword.join(''))
    }
  }
}

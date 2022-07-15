<template>
  <view>
    <custom-header class="header" title="助记词导入"></custom-header>
    <view class="container">
      <view class="item">
        <view class="item-label">助记词</view>
        <view class="item-input">
          <u--textarea v-model="mnemonic" height="180rpx" @input="mnemonicChange" placeholder="输入助记词单词，使用空格隔开"
            maxlength="120">
          </u--textarea>
        </view>
      </view>
      <view class="item">
        <view class="item-label">资金密码</view>
        <view class="item-input item-input-password">
          <u-input :password="!passwordEye" v-model="password" placeholder="输入资金密码">
          </u-input>
          <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'" @click="passwordEye = !passwordEye">
          </u-icon>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          钱包名称
        </view>
        <view class="item-input item-input-name">
          <u-input v-model="name" placeholder="设置钱包名称"></u-input>
        </view>
      </view>
    </view>
    <u-button class="btn" @click="importWallet">导入</u-button>

    <view :callRenderMnemonic="callRenderMnemonic" :change:callRenderMnemonic="render.getMnemonic"></view>
    <!-- 错误提示 -->
    <Notify ref="notify"></Notify>

  </view>
</template>

<script>
import * as cosmosjs from '@cosmjs/crypto'
import * as bip39 from 'bip39'
import Notify from './components/notify.vue'
import { validate } from '@/utils/validator.js' 
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  components: {
    Notify
  },
  data() {
    return {
      mnemonic: '', // 助记词
      password: '', // 资金密码
      name: '', // 钱包名称
      passwordEye: false, // 是否明文显示资金密码
      callRenderMnemonic: '', // 调用render.getMnemonic获取助记词
      rules: {
        'password': {
          rule: 'required',
          errMessage: '资金密码不能空'
        }
      }
    }
  },
  methods: {
    importWallet() {
      // this.$cache.delete('_walletList') // @test
      const isValidate = this.verifyForm()
      // const isValidate = true // @test
      if (!isValidate) return // 没有通过校验
      this.callRenderMnemonic = this.mnemonic.trim()
    },
    initWallet({
      wallet,
      privateKey64
    }) {
      if (!this.password || !this.name) return console.error('初始化钱包数据失败，请检查组件是否已经注册password、name字段作为钱包密码和钱包名字')
      wallet.name = this.name
      
      // 删除隐私信息
      delete wallet.privateKey
      delete wallet.publicKey
      
      // 加密隐私信息 (mnemonic、password、privateKey64)
      wallet.mnemonic = WalletCrypto.encode(wallet.mnemonic)
      wallet.password = WalletCrypto.encode(this.password)
      wallet.privateKey64 = WalletCrypto.encode(privateKey64)

      // console.log('创建钱包数据:', {
      //   wallet
      // })
      this.$cache.set('_currentWallet', wallet, 0)
      this.updateWalletList(wallet)
      this.toAccount()
    },
    toAccount() {
      uni.reLaunch({
        url: '/pages/account/index'
      })
    },
    mnemonicChange() {
      const mnemonic = this.mnemonic.trim().split(' ')
      const totalMnemonicList = cosmosjs.EnglishMnemonic.wordlist
      this.verifySingleMnemonic(mnemonic, totalMnemonicList)
    },
    // 校验单个助记词
    verifySingleMnemonic(target, source) {
      let errorMnemonic
      // #ifdef H5
      errorMnemonic = target.findLast(mnemonic => !source.find(item => target.slice(-1)[0] == mnemonic ? item
        .startsWith(mnemonic) : item == mnemonic
      ))
      // #endif
      // #ifdef APP
      for (let i = target.length; i >= 0; i--) {
        let mnemonic = target[i]
        // 就是不写注释 气死你
        source.find(item => target.slice(-1)[0] == mnemonic ? item.startsWith(mnemonic) : item == mnemonic) ?
          '' : errorMnemonic = mnemonic
        if (errorMnemonic) break
      }
      // #endif

      if (errorMnemonic) {
        this.$refs.notify.show('error', `${errorMnemonic} 为无效助记词，请检查。`, {
          bgColor: '#EC6665'
        })
      } else {
        this.$refs.notify.close() // 关闭错误警告
      }
    },
    // 校验一个完整的助记词
    verifyTotalMnemonic() {
      const mnemonic = this.mnemonic.trim()
      return bip39.validateMnemonic(mnemonic)
    },
    // 校验密码
    verifyPassword() {
      const {
        result
      } = validate.call(this, 'password')
      const currentWallet = this.$cache.get('_currentWallet')
      return result && WalletCrypto.decode(currentWallet.password) == this.password
    },
    verifyForm() {
      const isEffectiveMnemonic = this.verifyTotalMnemonic()
      const isEffectivePassword = this.verifyPassword()
      // const isEffectiveMnemonic = false // @test
      // const isEffectivePassword = true // @test
      if (!isEffectiveMnemonic) {
        this.$refs.notify.show('error', '助记词校验位不正确', {
          bgColor: '#EC6665'
        })
      } else if (!isEffectivePassword) {
        this.$refs.notify.show('error', '资金密码错误！', {
          bgColor: '#EC6665'
        })
      } else if (!this.name) {
        this.$refs.notify.show('error', '钱包名称不能为空', {
          bgColor: '#EC6665'
        })
      } else {
        // 通过校验
        return true
      }
    },
    findWallet(target, value) {
      const walletList = this.$cache.get('_walletList')
      if (!walletList) return
      return walletList.find(item => item[target] === value)
    },
    updateWalletList(wallet) {
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1)
      }
      walletList.unshift(wallet)
      this.$cache.set('_walletList', walletList, 0)
      return true
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import WalletCrypto from '@/utils/walletCrypto.js'
  import secretjs from '@/utils/secretjs/index.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    data() {
      return {
        mnemonic: ''
      }
    },
    methods: {
      createWallet(newVal, oldVal, newVm) {
        const wallet = new secretjs.Wallet(this.mnemonic, {
          bech32Prefix: 'ghm'
        })

        // 生成私钥
        const privateKey64 = WalletCrypto.UintToString(wallet.privateKey)

        renderUtils.runMethod(this._$id, 'initWallet', {
          wallet,
          privateKey64
        }, this)
      },
      getMnemonic(newVal) {
        if (newVal == '') return
        this.mnemonic = newVal
        this.createWallet()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    border-bottom: 2rpx solid #F2F4F8;
  }

  .container {
    padding: 0 32rpx;
    margin-top: 48rpx;

    .item {
      margin-bottom: 48rpx;

      &-label {
        margin-bottom: 24rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #2C365A;
        line-height: 28rpx;
      }

      &-input {

        .u-textarea {
          background-color: #F2F4F8;
          border-radius: 16rpx !important;
          padding-left: 0 !important;

          /deep/ textarea {
            color: #2C365A !important;
            font-size: 28rpx !important;
            padding-left: 32rpx;
            line-height: 48rpx !important;

          }
        }

        .u-input {
          height: 96rpx;
          background-color: #F2F4F8;
          border-radius: 16rpx 0 0 16rpx;
          padding-left: 0 !important;

          /deep/ input {
            color: #2C365A !important;
            font-size: 28rpx !important;
            padding-left: 32rpx;
            line-height: 48rpx !important;
          }
        }

        /deep/ .input-placeholder {
          height: 48rpx !important;
          font-weight: 400 !important;
          font-size: 28rpx !important;
          // color: #8397B1 !important;
          color: #8397B1 !important;
          line-height: 48rpx !important;
        }

        &-password {
          display: flex;

          .u-icon {
            height: 96rpx;
            padding-right: 36rpx;
            background-color: #F2F4F8;
            border-radius: 0 16rpx 16rpx 0 !important;
          }
        }
      }
    
      &-input-name {
        .u-input {
          border-radius: 16rpx;
        }
      }
    }
  }

  .btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
  }
</style>

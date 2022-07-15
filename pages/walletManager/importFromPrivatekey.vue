<template>
  <view>
    <custom-header class="header" title="私钥导入"></custom-header>
    <view class="container">
      <view class="item">
        <view class="item-label">私钥</view>
        <view class="item-input">
          <u--textarea v-model.trim="privateKey64" placeholder="输入明文私钥"></u--textarea>
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

    <view :callRenderCreate="callRenderCreate" :change:callRenderCreate="render.createWallet"></view>
    <!-- 错误提示 -->
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import Notify from './components/notify.vue'
import {
  validateAll
} from '@/utils/validator.js'
import WalletCrypto from '@/utils/walletCrypto'
export default {
  components: {
    Notify
  },
  data() {
    return {
      privateKey64: '', // 私钥
      password: '', // 资金密码
      name: '', // 钱包名称
      passwordEye: false, // 是否明文显示资金密码
      callRenderCreate: 0,
      rules: {
        privateKey64: [{
          rule: 'required',
          errMessage: '私钥明文不能为空'
        }, {
          validator(value) {
            // 校验私钥合法性
            const reg = /^[A-Fa-f0-9]{64}$/
            return reg.test(value)
          },
          errMessage: '请输入有效的私钥格式'
        }],
        password: [{
          rule: 'required',
          errMessage: '资金密码错误！'
        }, {
          validator(value) {
            const currentWallet = this.$cache.get('_currentWallet')
            return WalletCrypto.decode(currentWallet.password) == this.password
          },
          errMessage: '资金密码错误！'
        }]
      }
    }
  },
  methods: {
    importWallet() {
      const result = this.verifyForm()
      if (!result) return
      this.callRenderCreate++ // 还原钱包，调用render.createWallet
    },
    verifyForm() {
      const result = validateAll.call(this, this.rules)
      const invalidateField = result.find(item => !item.result)
      if (invalidateField) {
        this.$refs.notify.show('error', invalidateField.errMessage, {
          bgColor: '#EC6665'
        })
        return false
      } else if (!this.name) {
        this.$refs.notify.show('error', '钱包名称不能为空', {
          bgColor: '#EC6665'
        })
        return false
      } else {
        // 通过校验
        return true
      }
    },
    async initWallet({
      wallet
    }) {

      // 删除隐私信息
      delete wallet.privateKey
      delete wallet.publicKey
      delete wallet.mnemonic
      delete wallet.address

      // 推导address
      const pubkey = await WalletCrypto.getPublickey(WalletCrypto.StringToUint(this.privateKey64))
      const address = WalletCrypto.pubkeyToAddress(pubkey)

      // 加密隐私信息
      wallet.password = WalletCrypto.encode(this.password)
      wallet.privateKey64 = WalletCrypto.encode(this.privateKey64)
      wallet.name = this.name
      wallet.address = address

      // console.log('创建钱包数据:', {
      //   wallet
      // })
      this.$cache.set('_currentWallet', wallet, 0)
      this.updateWalletList(wallet)
      this.toAccount()
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
    },
    toAccount() {
      uni.reLaunch({
        url: '/pages/account/index'
      })
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import secretjs from '@/utils/secretjs/index.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      createWallet(newVal, oldVal, oldVm, newVm) {
        if (newVal == 0) return; // 第一次进入页面会默认调用一次
        const wallet = new secretjs.Wallet(this.mnemonic, {
          bech32Prefix: 'ghm'
        })

        renderUtils.runMethod(this._$id, 'initWallet', {
          wallet
        }, this)
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
          height: 180rpx;
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

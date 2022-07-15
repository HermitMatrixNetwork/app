<template>
  <view class="create-wallet">

    <custom-header :title="language.createWallet"></custom-header>
    <view class="border"></view>
    <view class="wallet-name">
      <view class="wallet-name-label">
        {{ language.walletName }}
      </view>
      <u-input class="wallet-name-input" :class="{error: invalidFields.fieldName == 'name'}" v-model="name"
        placeholder="设置钱包名称"></u-input>
    </view>

    <view class="wallet-password">
      <view class="wallet-password-label">
        {{ language.verifyWalletPassword }}
      </view>
      <view class="wallet-password-item">
        <u-input :password="!passwordEye" class="wallet-password-input"
          :class="{error: invalidFields.fieldName == 'password'}" v-model="password" placeholder="设置钱包密码（不少于8位）">
        </u-input>
        <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'"
          :class="{error: invalidFields.fieldName == 'password'}" @click="passwordEye = !passwordEye">
        </u-icon>
      </view>
    </view>

    <view :callRenderCreate="callRenderCreate" :change:callRenderCreate="render.createWallet"></view>

    <u-button type="primary" class="create-btn" @click="confrim">确认</u-button>

    <!-- 错误提示 -->
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import {
  validateAll
} from '@/utils/validator.js'
import language from './language'
import Notify from './components/notify.vue'
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  components: {
    Notify
  },
  data() {
    return {
      name: '',
      password: '', // 不能大于48位
      passwordEye: false, // 是否明文显示密码
      isValidate: false, // 表单校验状态 @test: true
      invalidFields: {}, // 校验失败的字段
      callRenderCreate: 0,
      language: language[this.$cache.get('_language')],
      rules: {
        name: {
          rule: 'required',
          errMessage: '钱包名称不能为空'
        },
        password: [{
          rule: 'required',
          errMessage: '钱包密码不能为空'
        }, {
          validator(value) {
            const currentWallet = this.$cache.get('_currentWallet')
            if (value !== WalletCrypto.decode(currentWallet.password)) return false
            return true
          },
          errMessage: '资金密码错误！'
        }]
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    confrim() {
      this.invalidFields = validateAll.call(this, this.rules).find(item => !item.result) || {}
      this.isValidate = this.invalidFields.fieldName == undefined
      // this.isValidate = true // @test
      if (this.isValidate) {
        this.callRenderCreate++ // 调用render.createWallet创建钱包
      } else {
        // 表单校验失败
        this.$refs.notify.show('error', this.invalidFields.errMessage, { bgColor: '#EC6665' })
      }
    },
    initWallet({wallet, privateKey64}) {
      wallet.name = this.name
      
      // 删除隐私信息
      delete wallet.privateKey
      delete wallet.publicKey
      
      // 加密隐私信息 (mnemonic、password、privateKey64)
      wallet.mnemonic = WalletCrypto.encode(wallet.mnemonic)
      wallet.password = WalletCrypto.encode(this.password)
      wallet.privateKey64 = WalletCrypto.encode(privateKey64)
      
      
      console.log('创建钱包数据:', {
        wallet
      })
      this.$cache.set('_currentWallet', wallet, 0)
      this.updateWalletList(wallet)
      this.toBackupReminder()
    },
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
    toBackupReminder() {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('close')
      uni.navigateTo({
        url: '/pages/index/backupReminder'
      })
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import WalletCrypto from '@/utils/walletCrypto.js'
  import secretjs from '@/utils/secretjs/index.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      createWallet(newVal, oldVal, oldVm, newVm) {
        if (newVal == 0) return; // 第一次进入页面会默认调用一次
        const wallet = new secretjs.Wallet('', {
          bech32Prefix: 'ghm'
        })

        // 生成私钥
        const privateKey64 = WalletCrypto.UintToString(wallet.privateKey)

        renderUtils.runMethod(this._$id, 'initWallet', {
          wallet,
          privateKey64
        }, this)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .create-wallet {
    // padding: 0 32rpx;
  }

  .border {
    border-top: 1rpx solid #8397B1;
    opacity: .16;
    margin-bottom: 48rpx;
  }

  .wallet-name,
  .wallet-password {
    margin-left: 32rpx;
    margin-right: 32rpx;

    &-label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-weight: 500;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      line-height: 28rpx;
    }

    .u-input {
      height: 96rpx;
      background-color: #F2F4F8;
      border-radius: 16rpx !important;
      padding-left: 32rpx !important;

      /deep/ input {
        color: #2C365A !important;
        font-size: 28rpx !important;
      }

      /deep/ .input-placeholder {
        height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        color: #8397B1 !important;
        line-height: 48rpx !important;
      }
    }
  }

  .wallet-name {
    &-input {
      margin-bottom: 48rpx;
    }
  }

  .wallet-password {
    &-item {
      display: flex;
      height: 96rpx;
      margin-bottom: 32rpx;
      background-color: #F2F4F8;
      border-radius: 16rpx;

      .u-icon {
        height: 96rpx;
        padding-right: 36rpx;
        background-color: #F2F4F8;
        border-radius: 0 16rpx 16rpx 0 !important;
      }
    }

    .u-input {
      border-radius: 16rpx 0 0 16rpx !important;
    }
  }

  .create-btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translate(-50%, 0);
    width: 622rpx;
    height: 96rpx;
    background-color: #002FA7;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #FCFCFD;
  }

  .error {
    background-color: rgba(230, 55, 51, 0.12) !important;

    /deep/ .uni-input-input {
      color: #E63733 !important;
    }

    /deep/ .uni-input-wrapper .input-placeholder {
      color: #E63733 !important;
    }
  }
</style>

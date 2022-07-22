<template>
  <view class="container">
    <custom-header :title="language.resetPassword" :customStyle="{ 'background-color': '#fff' }"></custom-header>

    <view class="wallet-password">
      <view class="wallet-password-label">
        {{ language[label[flag]] }}
      </view>
      <view class="wallet-password-item" :class="{ errorBorder: confirmPasswordError }">
        <u-input :password="!passwordEye" class="wallet-password-input" :class="{error: confirmPasswordError}"
          v-model="originVal" :placeholder="language[placeholder[flag]]">
        </u-input>
        <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'" :class="{error: confirmPasswordError}"
          @click="passwordEye = !passwordEye">
        </u-icon>
      </view>
      <view class="error-tip" :style="{ opacity: confirmPasswordError ? 1 : 0 }">
        {{ language[errorTip[flag]] }}
      </view>
    </view>

    <u-button class="btn" :class="{disable: disable}" @click="toNextStep">下一步</u-button>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import language from './language/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
import mixin from './mixins/mixin.js'
export default {
  mixins: [mixin],
  data() {
    return {
      language: language[this.$cache.get('_language')],
      errorTip: ['confirmPasswordErrorTip', 'passwordDuplication', 'verifyPasswordFail'],
      label: ['VerifyOriginalPassword', 'setNewPassowrd', 'confirmNewPassword'],
      placeholder: ['resetFundPasswordPlaceholder', 'setNewPassowrd', 'verifyPasswordCheckPlaceholder'],
      passwordEye: false,
      disable: true,
      flag: 0,
      originVal: '',
      newPassword: '',
      confirmPasswordError: false,
    }
  },
  methods: {
    toNextStep() {
      if (this.originVal.trim() === '') return
      let result = true
      switch (this.flag) {
      case 0:
        result = this.verifyPassword()
        if (!result) {
          this.confirmPasswordError = true
        } else {
          this.flag++
          this.passwordEye = false
          this.confirmPasswordError = false
        }
        break
      case 1:
        result = this.verifyNewPassword()
        if (!result) {
          this.confirmPasswordError = true
        } else {
          this.flag++
          this.passwordEye = false
          this.confirmPasswordError = false
        }
        break
      case 2:
        result = this.verifyPasswordCheck()
        if (!result) {
          this.confirmPasswordError = true
        } else {
          this.confirmPasswordError = false
          const wallet = this.$cache.get('_currentWallet')
          wallet.password = WalletCrypto.encode(this.newPassword)
          this.$cache.set('_currentWallet', wallet, 0)
          this.updateWalletList(wallet)
          this.$refs.uToast.show({
            type: 'success',
            title: '修改密码成功',
            message: '修改密码成功',
            complete: () => {
              uni.navigateTo({
                url: '/pages/walletManager/index'
              })
            }
          })
        }
        break
      }
    },
    verifyPassword() {
      const wallet = this.$cache.get('_currentWallet')
      const originPassword = WalletCrypto.decode(wallet.password)
      return originPassword === this.originVal
    },
    verifyNewPassword() {
      const wallet = this.$cache.get('_currentWallet')
      const originPassword = WalletCrypto.decode(wallet.password)
      if (this.originVal.trim() === '' || originPassword === this.originVal) return false
      return true
    },
    verifyPasswordCheck() {
      return this.newPassword === this.originVal
    }
  },
  watch: {
    flag: {
      immedate: true,
      handler(newVal) {
        switch (newVal) {
        case 2:
          this.newPassword = this.originVal
          this.originVal = ''
          break
        default:
          this.originVal = ''
        }
      }
    },
    'originVal': {
      immedate: true,
      handler(newVal) {
        if (newVal.trim() === '') {
          this.disable = true
        } else {
          this.disable = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    background-color: #F4F6F9;
  }

  .wallet-password {
    background-color: #fff;
    padding: 32rpx;
    margin-top: 2rpx;

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

  .wallet-password {
    &-item {
      display: flex;
      height: 96rpx;
      background-color: #F2F4F8;
      border-radius: 16rpx;

      .u-icon {
        height: 96rpx;
        padding-right: 36rpx;
        background-color: #F2F4F8;
        border-radius: 0 16rpx 16rpx 0 !important;
      }
    }

    /deep/ .u-input {
      border-radius: 16rpx 0 0 16rpx !important;
    }
  }

  .errorBorder {
    border: 2rpx solid #E63733;
  }

  .error-tip {
    height: 24rpx;
    margin-top: 16rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #EC2828;
    line-height: 24rpx;
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
  
  .disable {
    opacity: 0.2;
  }
</style>

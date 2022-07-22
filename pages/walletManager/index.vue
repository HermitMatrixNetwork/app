<template>
  <view class="container">
    <custom-header class="header" title="钱包管理"></custom-header>

    <view class="wallet-detail">
      <view class="wallet-detail-address item">
        <view class="label-address label">{{ language.walletAddress }}</view>
        <view class="item-address">{{ wallet.address }}</view>
      </view>
      <view class="border"></view>
      <view class="wallet-detail-name item" @click="clickItem('editName')">
        <text class="label-name label left">{{ language.walletName }}</text>
        <view class="right">
          <text class="item-name">{{ wallet.name }}</text>
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
      <view class="wallet-detail-name item" @click="toResetPassword">
        <text class="label-name label left">{{ language.resetFundPassword }}</text>
        <view class="right">
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
    </view>

    <view class="export-detail">
      <view v-show="wallet.mnemonic" class="export-detail-mnemonic item" @click="clickItem('Mnemonic')">
        <view class="label">
          {{ language.exportMnemonic }}
        </view>
        <view class="right">
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
      <view class="border"></view>
      <view class="export-detail-privatekey item" @click="clickItem('Privatekey')">
        <view class="label">
          {{ language.exportPrivateKey }}
        </view>
        <view class="right">
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
      <view class="border"></view>
      <view class="export-detail-keystore item" @click="clickItem('Keystore')">
        <view class="label">
          {{ language.exportKeyStore }}
        </view>
        <view class="right">
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
    </view>

    <uni-button class="remove-wallet-btn" @click="clickItem('removeWallet')">{{ language.removeWallet }}</uni-button>

    <!-- 修改钱包名字模态框 -->
    <u-modal class="edit-name-modal" :show="showEditWalletNameModal" :closeOnClickOverlay="false"
      :showConfirmButton="false">
      <template slot="default">
        <view>
          <view class="title">
            <text>{{ language.editName }}</text>
          </view>
          <u--input :placeholder="language.editNamePlaceholder" border="surround" v-model="name" class="edit-name-input"
            :class="{ 'error-edit-name': editNameError }" clearable>
          </u--input>
          <view class="error-tip" :style="{ opacity: editNameError ? 1 : 0 }">
            {{ language.editNameErrorTip }}
          </view>
        </view>
      </template>
      <template slot="confirmButton">
        <view class="confirm-button">
          <uni-button class="cancel" @click="cancel('name')">{{ language.cancel }}</uni-button>
          <uni-button class="confirm" @click="confirm('name')">{{ language.confirm }}</uni-button>
        </view>
      </template>
    </u-modal>

    <!-- 密码确认模态框 -->
    <u-modal class="confirm-password-modal" :show="showConfirmPasswordModal" :closeOnClickOverlay="false"
      :showConfirmButton="false">
      <template slot="default">
        <view>
          <view class="title">
            <text>{{ language.confirmPassword }}</text>
            <image src="@/static/img/ic-close.png" @click="cancel('password')"></image>
          </view>
          <u-input :type="showPassword ? 'text' : 'password'" :placeholder="language.confirmPasswordPlaceholder"
            border="surround" v-model="password" class="edit-name-input" :class="{ 'error-edit-name': editNameError }">
            <template slot="suffix">
              <u-icon :name="showPassword ? 'eye-fill' : 'eye-off'" color="#8F9BB3" size="24"
                @click="showPassword = !showPassword"></u-icon>
            </template>
          </u-input>
          <view class="error-tip" :style="{ opacity: confirmPasswordError ? 1 : 0 }">
            {{ language.confirmPasswordErrorTip }}
          </view>
        </view>
      </template>
      <template slot="confirmButton">
        <view class="confirm-button">
          <uni-button class="confirm" @click="confirm('password')">{{ language.confirm }}</uni-button>
        </view>
      </template>
    </u-modal>
  </view>
</template>

<script>
import language from './language'
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  data() {
    return {
      wallet: this.$cache.get('_currentWallet') || {},
      language: language[this.$cache.get('_language')],
      name: '', // 钱包名称
      showEditWalletNameModal: false,
      editNameError: false, // 校验编辑钱包名称是否失败
      showConfirmPasswordModal: false,
      confirmPasswordError: false, // 校验资金密码是否失败
      password: '', // 资金密码
      showPassword: false, // 是否明文显示密码
    }
  },
  methods: {
    toResetPassword() {
      uni.navigateTo({
        url: './resetPassword'
      })
    },
    clickItem(target) {
      this.target = target
      if (target === 'editName') {
        this.showEditWalletNameModal = true
      } else {
        this.showConfirmPasswordModal = true
      }
    },
    cancel(target) {
      if (target === 'name') {
        this.name = ''
        this.editNameError = false
        this.showEditWalletNameModal = false
      } else if (target === 'password') {
        this.password = ''
        this.confirmPasswordError = false
        this.showConfirmPasswordModal = false
      }
    },
    verifyPawword() {
      const walletPassword = WalletCrypto.decode(this.wallet.password)
      const password = this.password.trim()
      if (password !== walletPassword) {
        this.confirmPasswordError = true 
        return false
      }
      this.confirmPasswordError = false
      this.showConfirmPasswordModal = false
      this.password = ''
      return true
    },
    removeWallet() {
      const walletList = this.$cache.get('_walletList')
      
      if (walletList.length > 1) {
        walletList.shift()
        this.$cache.set('_currentWallet', walletList[0], 0)
        this.$cache.set('_walletList', walletList, 0)
        uni.reLaunch({
          url: '/pages/account/index'
        })
      } else {
        this.$cache.delete('_walletList')
        this.$cache.delete('_currentWallet')
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }
    },
    confirm() {
      if (this.target === 'editName') {
        const name = this.name.trim()
        if (name.length > 10) {
          this.editNameError = true
          return
        }
        this.wallet.name = name
        this.$cache.set('_currentWallet', this.wallet, 0)
        this.editNameError = false
        this.showEditWalletNameModal = false
        this.name = ''
      } else if (this.target === 'removeWallet') {
        const result = this.verifyPawword()
        if (!result) return
        // 删除当前钱包
        this.removeWallet()
      } else {
        const result = this.verifyPawword()
        if (!result) return
        uni.navigateTo({
          url: `/pages/walletManager/export${this.target}Reminder`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    background-color: #F4F6F9;
    width: 100vw;
    height: 100vh;
  }

  .header {
    background-color: #fff;
  }

  .wallet-detail {
    margin-top: 2rpx;
    background-color: #fff;

    &-address {
      .item-address {
        height: 28rpx;
        margin-top: 14rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #8397B1;
        line-height: 28rpx;
      }
    }

    &-name {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .right {
        display: flex;
        align-items: center;

        .item-name {
          height: 28rpx;
          font-weight: 400;
          font-size: 28rpx;
          color: #2C365A;
          line-height: 28rpx;
        }
      }

    }
  }

  .export-detail {
    background-color: #fff;
    margin-top: 24rpx;

    >view {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .remove-wallet-btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #EC2828;
    text-align: center;
    line-height: 96rpx;
    background-color: #fff;
    border-radius: 16rpx;

    &:after {
      border: 0 !important;
    }
  }


  .edit-name-modal,
  .confirm-password-modal {
    /deep/ .u-modal {
      width: 686rpx !important;
    }

    /deep/ .u-modal__content {
      display: block !important;
      padding: 0 32rpx 0;
    }

    .title {
      height: 32rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #2C365A;
      line-height: 32rpx;
      margin-bottom: 64rpx;
    }

    /deep/ .edit-name-input {
      background-color: #F2F4F8;
      height: 96rpx;

      .uni-input-input {
        height: 48rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #2C365A;
        line-height: 48rpx;
      }

      .input-placeholder {
        height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        color: #8397B1 !important;
        line-height: 48rpx !important;
      }
    }

    .error-tip {
      height: 24rpx;
      margin-top: 16rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #EC2828;
      line-height: 24rpx;
    }

    /deep/ .u-modal__button-group--confirm-button {
      padding: 0;
    }

    .confirm-button {
      display: flex;
      margin-top: 40rpx;
      margin-bottom: 48rpx;
      padding: 0 32rpx;
      justify-content: space-between;

      uni-button {
        width: 292rpx;
        height: 96rpx;
        font-weight: 400;
        font-size: 32rpx;
        line-height: 96rpx;
        color: #FCFCFD;
        border-radius: 16rpx;
      }

      .confirm {
        background-color: #002FA7;
      }

      /deep/ .cancel {
        color: #8397B1;
        background-color: rgba(0, 47, 167, 0.00);
        border: 1px solid rgba(131, 151, 177, 0.30);
        &:after {
          border: 0 !important
        }
      }
    }
  }

  .confirm-password-modal {
    .title {
      display: flex;
      justify-content: space-between;

      image {
        width: 32rpx;
        height: 32rpx;
      }
    }

    .confirm-button {
      uni-button {
        width: 100%;
      }
    }
  }

  /deep/ .error-edit-name {
    border: 2rpx solid #EC2828;
    background-color: rgba(236, 40, 40, 0.06);

    .uni-input-input {
      color: #EC2828;
    }
  }



  .label {
    height: 32rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #2C365A;
    line-height: 32rpx;
  }

  .item {
    padding: 32rpx 0 32rpx 32rpx;
  }

  .arrow-right {
    width: 32rpx;
    height: 32rpx;
    margin-right: 20rpx;
    margin-left: 24rpx;
  }

  .border {
    height: 2rpx;
    background-color: #F4F6F9;
    margin-left: 32rpx;
  }
</style>

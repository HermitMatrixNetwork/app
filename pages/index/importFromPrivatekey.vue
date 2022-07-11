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
        <view class="item-input">
          <u-input v-model="name" placeholder="设置钱包名称"></u-input>
        </view>
      </view>
    </view>
    <u-button class="btn" @click="importWallet">导入</u-button>
    <!-- 错误提示 -->
    <u-notify class="notify" ref="uNotify"></u-notify>
  </view>
</template>

<script>
import mixin from './mixins/index.js'
export default {
  mixins: [mixin],
  data() {
    return {
      privateKey64: '', // 私钥
      password: '', // 资金密码
      name: '', // 钱包名称
      passwordEye: false, // 是否明文显示资金密码
    }
  },
  methods: {
    importWallet() {
      this.verifyForm()
    },
    verifyPrivateKey64() {
        
    },
    verifyForm() {
      const isValidatePrivateKey64 = this.verifyPrivateKey64()
      const isValidatePassword = this.verfiyPassowr('privateKey64', this.privateKey64)
      if (this.privateKey64 === '') {
        this.showNotify('error', '私钥不能为空')
      } else if (isValidatePassword) {
        this.showNotify('error', '资金密码错误')
      }
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
        background-color: #F2F4F8;
        border-radius: 4rpx !important;

        .u-textarea {
          background-color: #F2F4F8;
          height: 180rpx;
          border-radius: 4rpx !important;
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
          border-radius: 4rpx 0 0 4rpx;
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
            border-radius: 0 4rpx 4rpx 0 !important;
          }
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

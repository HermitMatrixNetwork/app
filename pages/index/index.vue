<template>
  <view class="index">
    <!-- 状态栏 -->
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>
    <!-- 标题 -->
    <h1 class="title">Hermit Wallet</h1>

    <!--  -->
    <view class="logo">
      <image class="logo-image" src="/static/img/index/logo.png"></image>
      <view class="logo-describe">
        {{ language.text66 }}</view>
      <view class="logo-describe">
        {{ language.text67 }}
      </view>
    </view>
    <view class="content">

      <view class="wallet">
        <view class="wallet-create" @click="toCreateWallet">
          <view>{{ language.text01 }}</view>
          <view class="wallet-create-describe">{{ language.text02 }}</view>
        </view>
        <view class="wallet-import" @click="toImportWallet">
          <view>{{ language.text03 }}</view>
          <view class="wallet-import-describe">{{ language.text04 }}</view>
        </view>
      </view>
    </view>
    <!-- bgColor="#F7F8FA" -->
    <u-popup class="protocol" bgColor="#F7F8FA" :show="showProtocol" :round="16" mode="bottom" closeOnClickOverlay
      duration="400" @close="closeProtocol">
      <view class="protocol-header">
        <view class="protocol-header-placeholder"></view>
        <view class="protocol-header-title">
          {{ language.text68 }}
        </view>
        <view class="protocol-header-close" @click="closeProtocol">
          <u-icon name="close" color="#2C365A" size="32rpx"></u-icon>
        </view>
      </view>
      <view class="protocol-content">
        <text v-text='`          由于越来越多的诈骗者想方设法欺骗毫无戒心的受害者的数字资产，请您在每次访问我们的域名站时验证SSL证书。本《服务协议》（定义如下）仅适用于由Encryption Everywhere DV TLS CA发布的具备有效SSL证书的域名站：https://xxxx.xx。在从您正在访问的网站下载、点击或以其他方式与之交互之前，请确保SSL证书的真实性。为免疑义，我们无法控制任何第三方网站或服务的内容、隐私政策或行为，也不对其承担任何责任。对于因使用或依赖任何此类网站或服务上或通过此类网站或服务提供的任何此类内容、商品或服务而造成或声称造成的任何损害或损失，我们概不负责或承担任何直接或间接责任。
          
          本《服务协议》（“协议”或“服务协议”）包含管理您访问和使用我们提供的网站和服务（定义如下）的条款和条件，并且是我们与您或您所代表的实体之间的协议。在使用本网站或服务之前，请仔细阅读本《服务协议》。通过使用本网站，或单击按钮或复选框以接受或同意本《服务协议》的服务条款（如有该选项），或者填写服务订单，或者，如果更早，使用或以其他方式访问服务（“生效日期”），您(1)接受并同意本《服务协议》以及我们不时发布的任何附加条款、规则和参与条件，以及(2)同意如我们的《隐私政策》中所述的收集、使用、披露和其他处理信息的活动。如果您不同意本《服务协议》，则您不得访问或使用服务。
          
          我们在此特别提醒您在使用我们的imToken移动应用（以下简称“imToken”或“本软件”，imToken可在各移动应用平台上下载，包括但不限于Google Play Store和Apple App Store）之前，请认真阅读本《服务协议》及本《服务协议》中提及的其他文件，尤其是本《服务协议》中“免责及责任限制”条款，确保您充分理解本《服务协议》中各条款，并自主考虑使用imToken的风险。`'>

        </text>
      </view>
      <view class="protocol-footer">
        <view class="protocol-footer-check">
          <label>
            <checkbox class="protocol-footer-check-checkbox" :checked="agree_protocol"
              @click="agree_protocol = !agree_protocol" />
          </label>
          <text>{{ language.text05 }}</text>
        </view>
        <view class="protocol-footer-confirm" :class="{ complete: agree_protocol }">
          <u-button @click="confirmProtocol">{{ language.text22 }}</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import language from './language/index.js'
export default {
  data() {
    return {
      agree_protocol: this.$cache.get('_agree_protocol') || false,
      showProtocol: false,
      action: '',
      language: language[this.$cache.get('_language')]
    }
  },
  onLoad() {
    if (this.$cache.get('_currentWallet') == null) {
      this.agree_protocol = this.$cache.get('_agree_protocol') || false
    }
  },
  methods: {
    toCreateWallet() {
      this.action = 'toCreateWallet'
      if (!this.checkIsAgree()) return
      uni.navigateTo({
        url: './createWallet'
      })
    },
    toImportWallet() {
      this.action = 'toImportWallet'
      if (!this.checkIsAgree()) return
      uni.navigateTo({
        url: './importWallet'
      })
    },
    checkIsAgree() {
      const isAgree = this.agree_protocol === true
      this.showProtocol = !isAgree
      return isAgree
    },
    confirmProtocol() {
      if (this.agree_protocol) {
        this.$cache.set('_agree_protocol', true, 0)
        this.showProtocol = false
        this.action === 'toCreateWallet' ? this.toCreateWallet() : this.toImportWallet()
      } else {
        // 提示用户勾选同意用户协议按钮
      }

    },
    closeProtocol() {
      this.showProtocol = false
      this.agree_protocol = false
    }
  },
  watch: {
    agree_protocol(newVal, oldVal) {
      this.$cache.set('_agree_protocol', newVal, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .title {
    height: 60rpx;
    padding-left: 64rpx;
    padding-top: 30rpx;
    font-weight: Bold;
    font-size: 44rpx;
    color: #2C365A;
  }

  .logo {
    &-image {
      display: block;
      margin: auto;
      width: 370rpx;
      height: 370rpx;
      margin-bottom: 32rpx;
      margin-top: 144rpx;
      // background-color: skyblue;
    }

    &-describe {
      width: 370rpx;
      margin: auto;
      font-weight: 700;
      font-size: 36rpx;
      color: #2C365A;
      letter-spacing: 0;
      text-align: center;
      line-height: 52rpx;
    }
  }

  .content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 314rpx;

    .wallet {
      >view {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 622rpx;
        padding: 24rpx 0;
        align-items: center;
        border-radius: 16rpx;
      }

      &-create {
        height: 120rpx;
        font-size: 32rpx;
        color: #FFFFFF;
        background-color: #002FA7;

        &-describe {
          margin-top: 5rpx;
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.60);
        }
      }

      &-import {
        height: 120rpx;
        margin-top: 40rpx;
        font-size: 32rpx;
        color: #2C365A;
        background-color: #F2F2F4;

        &-describe {
          margin-top: 5rpx;
          color: #748BAA;
          font-size: 24rpx;
        }
      }

    }
  }

  .protocol {
    &-header {
      display: flex;
      height: 96rpx;
      justify-content: space-between;
      align-items: center;
      padding: 0 32rpx;

      &-title {
        color: #2C365A;
        font-size: 32rpx;
        font-weight: 600;
      }
    }

    &-content {
      height: 1092rpx;
      margin: 0 16rpx;
      padding: 48rpx 48rpx 24rpx;
      word-break: break-all;
      background-color: #fff;
      overflow: hidden;

      text {
        display: block;
        height: 100%;
        overflow-y: scroll;
        font-size: 28rpx;
        // background-color: pink;
      }
    }

    &-footer {
      &-check {
        display: flex;
        margin: 38rpx 0 38rpx 64rpx;
        font-size: 28rpx;
        line-height: 28rpx;
        color: #2C3457;

        &-checkbox {
          display: flex;
          align-items: center;
          justify-content: center;

          /deep/ .uni-checkbox-input {
            margin-right: 12rpx;
            width: 28rpx;
            height: 28rpx;
          }

          /deep/ .uni-checkbox-input-checked {
            background-color: #002FA7;
            color: #fff !important;
          }
        }
      }

      &-confirm {
        opacity: .2;

        .u-button {
          width: 622rpx;
          height: 96rpx;
          margin-bottom: 70rpx;
          background: #002FA7;
          border-radius: 16rpx;
          font-size: 32rpx;
          color: #FCFCFD;
        }
      }
    }
  }

  .complete {
    opacity: 1 !important;
  }
</style>

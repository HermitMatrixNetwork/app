<template>
  <view class="index">
    <view class="mask" v-show="updating"></view>
    <custom-updateApp ref="custom_update" :updating.sync="updating" checkImmediate />
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
    <view class="wallet-content">

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
          <image src="/static/img/ic-close.png" style="width: 32rpx;height: 32rpx;"></image>
        </view>
      </view>
      <view class="protocol-content">
        <text v-html='language.text87'>

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
      language: language[this.$cache.get('_language')],
      updating: false
    }
  },
  onShow() {
    this.$refs.custom_update && this.$refs.custom_update.checkUpdate()
  },
  onLoad() {
    if (this.$cache.get('_currentWallet') == null) {
      this.agree_protocol = this.$cache.get('_agree_protocol') || false
      plus.navigator.closeSplashscreen()
    } else {
      uni.reLaunch({
        url: '/pages/account/index',
        success: () => {
          plus.navigator.closeSplashscreen()
        }
      })
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
  .index {
    height: 100vh;
  }
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

  .wallet-content {
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
        margin-bottom: 40rpx;
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
      height: 60vh;
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
  
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5) !important;
    z-index: 9999;
  }
</style>

<template>
  <view>
    <custom-header :title="language.text120"></custom-header>

    
    <view class="border"></view>
    <view class="container">
      <view class="label">
        <text>{{ language.text140 }}</text>
        <text class="label-tip">({{ language.text176 }})</text>
      </view>
      <view class="item" @click="copy">
        {{ rawPassword }}
      </view>
    </view>
    
    <Tooltip></Tooltip>
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import Tooltip from './components/tooltip.vue'
import Notify from './components/notify.vue'
import language from '@/pages/account/language/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  components: {
    Tooltip,
    Notify
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      rawPassword: WalletCrypto.decode(this.$cache.get('_currentWallet').privateKey64)
    }
  },
  methods: {
    copy() {
      uni.setClipboardData({
        data: this.rawPassword,
        showToast: false,
        success: () => {
          this.$refs.notify.show('success', this.language.text75)
        },
        fail: () => {
          // this.$refs.notify.show('error', this.language.copyfailure)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .border {
    border-top: 1rpx solid #8397B1;
    opacity: .16;
  }

  .container {
    padding: 48rpx 32rpx 0;

    .label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-weight: 600;
      font-size: 28rpx;
      color: #2C365A;
      line-height: 28rpx;

      &-tip {
        color: #8397B1;
        margin-left: 12rpx;
      }
    }

    .item {
      width: 686rpx;
      height: 180rpx;
      border-radius: 16rpx;
      background-color: #F2F4F8;
      padding: 24rpx 24rpx 0;
      word-break: break-all;
      font-weight: 400;
      font-size: 28rpx;
      color: #2C365A;
      line-height: 48rpx;
    }
  }
</style>

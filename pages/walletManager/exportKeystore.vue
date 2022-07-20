<template>
  <view>
    <custom-header :title="language.exportKeyStore"></custom-header>

    
    <view class="border"></view>
    <view class="container">
      <view class="label">
        <text>{{ language.keystore }}</text>
        <text class="label-tip">({{ language.clickToCopy }})</text>
      </view>
      <view class="item" @click="copy">
        <view class="content">{{ keystore }}</view>
      </view>
    </view>
    
    <Tooltip></Tooltip>
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import Tooltip from './components/tooltip.vue'
import Notify from './components/notify.vue'
import language from './language'
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  components: {
    Tooltip,
    Notify
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      wallet: this.$cache.get('_currentWallet'),
      keystore: ''
    }
  },
  created() {
    this.generateKeystore()
  },
  methods: {
    async generateKeystore() {
      const password = WalletCrypto.decode(this.wallet.password)
      const privateKey64 = WalletCrypto.decode(this.wallet.privateKey64)
      this.keystore = JSON.stringify(await WalletCrypto.generateKeystore.encrypt(privateKey64, password))
    },
    copy() {
      uni.setClipboardData({
        data: this.keystore,
        showToast: false,
        success: () => {
          this.$refs.notify.show('error', this.language.copySuccess)
        },
        fail: () => {
          this.$refs.notify.show('error', this.language.copyfailure)
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
      font-weight: 500;
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
      height: 300rpx;
      border-radius: 16rpx;
      background-color: #F2F4F8;
      padding: 24rpx;
      word-break: break-all;
      font-weight: 400;
      font-size: 28rpx;
      color: #2C365A;
      .content {
        height: 252rpx;
        overflow: scroll;
        line-height: 40rpx;
      }
    }
  }
</style>

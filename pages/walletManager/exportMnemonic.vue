<template>
  <view class="page-wrapper">
    <Notify ref="notify" style="z-index: 99"></Notify>
    <custom-header :title="language.text119" :customStyle="{ 'z-index': 98 }"></custom-header>


    <view class="border"></view>
    <view class="container">
      <view class="label">
        <text>{{ language.text213 }}</text>
        <text class="label-tip">({{ language.text176 }})</text>
      </view>
      <view class="mnemonic-content" @click="copy">
        <view v-for="(item, index) in mnemonicList" :key="index" class="mnemonic-content-item">
          <view>
            <text class="item">{{ item }}</text>
            <text class="index">{{ index + 1 }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <uni-button class="validate-mnemonic-btn" @click="toVerify">{{ language.text218 }}</uni-button>

    <uni-button class="copy-mnemonic-btn" @click="copy">{{ language.text230 }}</uni-button>
    <Tooltip></Tooltip>
    
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
      wallet: this.$cache.get('_currentWallet'),
      mnemonicList: WalletCrypto.decode(this.$cache.get('_currentWallet').mnemonic).split(' ')
    }
  },
  methods: {
    copy() {
      uni.setClipboardData({
        data: WalletCrypto.decode(this.wallet.mnemonic),
        showToast: false,
        success: () => {
          this.$refs.notify.show('error', this.language.text56)
        },
        fail: () => {
          // this.$refs.notify.show('error', this.language.copyfailure)
        }
      })
    },
    toVerify() {
      uni.navigateTo({
        url: './verifyMnemonic'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
  }
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

    .mnemonic-content {
      display: flex;
      flex-wrap: wrap;
      background-color: #FAFCFE;

      &-item {
        flex-basis: 33%;
        padding: 50rpx 0 50rpx 20rpx;
        position: relative;
        border-bottom: 1px solid rgba(176, 193, 208, 0.40);
        border-left: 1px solid rgba(176, 193, 208, 0.40);

        &:nth-of-type(3n) {
          border-right: 1px solid rgba(176, 193, 208, 0.40);
        }

        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          border-top: 1px solid rgba(176, 193, 208, 0.40);
        }

        &:nth-child(1) {
          border-top-left-radius: 16rpx;
        }

        &:nth-child(3) {
          border-top-right-radius: 16rpx;
        }

        &:nth-child(10) {
          border-bottom-left-radius: 16rpx;
        }

        &:nth-child(12) {
          border-bottom-right-radius: 16rpx;
        }

        .item {
          font-weight: 600;
          font-size: 32rpx;
          color: #2C365A;
        }

        .index {
          position: absolute;
          right: 20rpx;
          top: 10rpx;
          font-weight: 400;
          font-size: 20rpx;
          color: #8397B1;
        }
      }
    }
  }

  .validate-mnemonic-btn {
    margin: 96rpx 32rpx 32rpx;
    width: auto;
    height: 96rpx;
    background: #002FA7;
    border-radius: 16rpx;
    font-weight: 400;
    font-size: 32rpx;
    line-height: 96rpx;
    color: #FCFCFD;
  }
  
  .copy-mnemonic-btn {
    margin: 32rpx 32rpx 32rpx;
    width: auto;
    height: 96rpx;
    background: #17C499;
    border-radius: 16rpx;
    font-weight: 400;
    font-size: 32rpx;
    line-height: 96rpx;
    color: #FCFCFD;
  }
</style>

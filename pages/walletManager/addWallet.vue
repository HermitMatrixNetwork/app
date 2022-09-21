<template>
  <u-popup class="add-wallet-popup" :show="showAddWallet" overlayStyle="z-index:10075">
    <view class="header">
      <text>{{ language.hermitWalle }}</text>
      <image src="@/static/img/ic-close.png" @click="close"></image>
    </view>
    <view class="wallet">
      <view class="wallet-create" @click="toCreateWallet">
        <view>{{ language.text12 }}</view>
        <view class="wallet-create-describe">{{ language.text02 }}</view>
      </view>
      <view class="wallet-import" @click="toImportWallet">
        <view>{{ language.text13 }}</view>
        <view class="wallet-import-describe">{{ language.text04 }}</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import language from './language'
export default {
  props: {
    showAddWallet: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    toCreateWallet() {
      const touchId = this.$cache.get('_touchId')
      if (touchId == 0) {
        uni.navigateTo({
          url: '/pages/index/createWallet?from=walletManager',
        })
      } else {
        uni.navigateTo({
          url: '/pages/mine/anquan/touchIdCheck?redirectUrl=/pages/index/createWallet?from=walletManager&redirectType=redirect'
        })
      }
    },
    toImportWallet() {
      const touchId = this.$cache.get('_touchId')
      if (touchId == 0) {
        uni.navigateTo({
          url: '/pages/walletManager/importWallet',
        })
      } else {
        uni.navigateTo({
          url: '/pages/mine/anquan/touchIdCheck?redirectUrl=/pages/walletManager/importWallet?from=walletManager&redirectType=redirect'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-wallet-popup {
    /deep/ .u-popup__content {
      flex-shrink: 0 !important;
      flex-basis: 520rpx !important;
      border-radius: 16rpx 16rpx 0 0;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: 32rpx;
    border-radius: 16rpx 16rpx 0 0;

    text {
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      line-height: 32rpx;
    }

    image {
      width: 32rpx;
      height: 32rpx;
    }
  }

  .wallet {
    margin-top: 64rpx;

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
      margin: 0 auto 40rpx;
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
      margin: auto;
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
</style>

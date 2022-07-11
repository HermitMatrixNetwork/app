<template>
  <view class="container">
    <custom-header class="header" title="钱包管理"></custom-header>

    <view class="wallet-detail">
      <view class="wallet-detail-address item">
        <view class="label-address label">{{ language.text01 }}</view>
        <view class="item-address">{{ wallet.address }}</view>
      </view>
      <view class="border"></view>
      <view class="wallet-detail-name item" @click="editWalletName">
        <text class="label-name label left">{{ language.text02 }}</text>
        <view class="right">
          <text class="item-name">{{ wallet.name }}</text>
          <image src="@/static/icon/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
    </view>
    
    <view class="export-detail">
      <view class="export-detail-mnemonic item">
        <view class="label">
          {{ language.text03 }}
        </view>
        <view class="right">
          <image src="@/static/icon/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
      <view class="border"></view>
      <view class="export-detail-privatekey item">
        <view class="label">
          {{ language.text04 }}
        </view>
        <view class="right">
          <image src="@/static/icon/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
      <view class="border"></view>
      <view class="export-detail-privatekey item">
        <view class="label">
          {{ language.text05 }}
        </view>
        <view class="right">
          <image src="@/static/icon/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import language from './language'
export default {
  data() {
    return {
      wallet: {},
      language: language[uni.getStorageSync('_language').data]
    }
  },
  created() {
    this.wallet = uni.getStorageSync('_currentWallet').data
  },
  methods: {
    editWalletName() {}
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
    > view {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

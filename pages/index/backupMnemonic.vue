<template>
  <view>
    <custom-header></custom-header>

    <view class="mnemonic">
      <view class="mnemonic-title">备份助记词</view>
      <view class="mnemonic-hint">
        请按顺序抄写助记词，确保备份正确。
      </view>
      <view class="mnemonic-content">
        <view v-for="(item, index) in mnemonicList" :key="index" class="mnemonic-content-item">
          <view>
            <text class="item">{{ item }}</text>
            <text class="index">{{ index + 1 }}</text>
          </view>
        </view>
      </view>
      <view class="mnemonic-rules">
        <view class="mnemonic-rules-item">
          <view class="mnemonic-rules-item-icon"></view>
          <view class="mnemonic-rules-item-describe">
            妥善保管助记词至隔离网络的安全地方。
          </view>
        </view>
        <view class="mnemonic-rules-item">
          <view class="mnemonic-rules-item-icon"></view>
          <view class="mnemonic-rules-item-describe">
            请勿将助记词在联网环境下分享和存储，比如
            邮件、相册、社交应用等。
          </view>
        </view>
      </view>
      <u-button class="mnemonic-confirm" @click="toValidateMnemonic">已确认备份</u-button>
    </view>

    <!-- 提示窗口-->
    <u-modal :show="showHint" :closeOnClickOverlay="false" :showConfirmButton="false">
      <template slot="default">
        <view class="hint">
          <view class="hint-logo">
            <image class="hint-logo-image" src="../../static/img/jietu.png"></image>
          </view>
          <view class="hint-title">
            请勿截屏
          </view>
          <view class="hint-content">
            请勿截屏分享和存储，这将可能被第三方恶意软件收集，造成资产损失。
          </view>
          <u-button class="hint-btn" @click="confrimHint">我知道了</u-button>
        </view>
      </template>
    </u-modal>
  </view>
</template>

<script>
import WalletCryto from '@/utils/walletCrypto.js'
export default {
  data() {
    return {
      showHint: true, // 是否显示提示窗口 @test: false
      mnemonicList: [],
      wallet: {}
    }
  },
  created() {
    this.wallet = this.$cache.get('_temporaryWallet')
    this.mnemonicList = WalletCryto.decode(this.wallet.mnemonic).split(' ')
  },
  methods: {
    confrimHint() {
      this.showHint = false
    },
    toValidateMnemonic() {
      uni.navigateTo({
        url: './validateMnemonic'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mnemonic {
    margin-top: 64rpx;
    padding: 0 42rpx 0 40rpx;

    &-title {
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      line-height: 32rpx;
    }

    &-hint {
      font-weight: 400;
      font-size: 28rpx;
      color: #8397B1;
      line-height: 28rpx;
      margin-top: 16rpx;
      margin-bottom: 48rpx;
    }

    &-content {
      display: flex;
      flex-wrap: wrap;

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
          font-weight: 500;
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

    &-rules {
      margin-top: 48rpx;

      &-item {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;

        &-icon {
          width: 10rpx;
          height: 10rpx;
          margin-right: 26rpx;
          border-radius: 50%;
          background-color: #8397B1;
        }

        &-describe {
          font-size: 28rpx;
          line-height: 28rpx;
          line-height: 50rpx;
          color: #8397B1;
        }
      }
    }

    &-confirm {
      position: absolute;
      bottom: 64rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 622rpx;
      height: 96rpx;
      border-radius: 16rpx;
      background-color: #002FA7;
      font-weight: 400;
      font-size: 32rpx;
      color: #FCFCFD;
      line-height: 32rpx;
    }
  }
  
  /deep/ .u-modal {
    width: 686rpx;
    border-radius: 16rpx;
    
    .u-modal__content {
      display: block;
      padding: 0 32rpx 32rpx !important;
    }
    
    .hint {
      background-color: #fff;
    
      &-logo {
        width: 100rpx;
        height: 100rpx;
        margin: 48rpx auto 0;
    
        &-image {
          width: 100rpx;
          height: 100rpx;
        }
      }
    
      &-title {
        margin: 24rpx 0 30rpx;
        font-weight: 500;
        font-size: 32rpx;
        color: #2C365A;
        text-align: center;
      }
    
      &-content {
        width: 544rpx;
        margin: auto;
        margin-bottom: 48rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #8397B1;
      }
    
      &-btn {
        height: 96rpx;
        background-color: #002FA7;
        border-radius: 16rpx;
        font-weight: 400;
        font-size: 32rpx;
        color: #FCFCFD;
      }
    }
  }
</style>

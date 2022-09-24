<template>
  <view>
    <u-popup class="switch-wallet-popup" :show="showSwitchWallet" closeOnClickOverlay @close="close">
      <view class="header">
        <text>{{ language.text32 }}</text>
        <image src="@/static/img/ic-close.png" @click="close"></image>
      </view>
      <u-list class="content" height="1080rpx">
        <view class="item" v-for="(wallet, index) in walletList" :key="index"
          :class="{ selected: index == 0 }" @click="close($event, index)">
          <view class="item-left">
            <view class="item-left-name">{{ wallet.name }}</view>
            <view class="item-left-address">{{ wallet.address | formatAddress }}</view>
          </view>
          <view class="item-right" v-show="index == 0">
            <image src="@/static/img/walletManager/xuanzhong2.png"></image>
          </view>
        </view>
      </u-list>
    
      <uni-button class="add-wallet" @click="showAddWallet = true">
        <view class="add-wallet-content">
          <image src="@/static/img/walletManager/add2.png"></image>
          <text>{{ language.text11 }}</text>
        </view>
      </uni-button>
    </u-popup>
    <addWallet :showAddWallet="showAddWallet" @close="closeAddWalletPopup" />
  </view>
</template>

<script>
import addWallet from './addWallet'
import language from './language'
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  components: { addWallet },
  props: {
    showSwitchWallet: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      walletList: this.$cache.get('_walletList'),
      showAddWallet: false,
    }
  },
  filters: {
    formatAddress(val) {
      return val.substr(0, 10) + '...' + val.substr(-10)
    }
  },
  methods: {
    close(event, index) {
      if (index > 0) {
        const walletList = this.walletList
        const currentWallet = walletList[index]
        this.$cache.set('_currentWallet', currentWallet, 0)
        walletList.splice(index, 1)
        walletList.unshift(currentWallet)
        this.$cache.set('_walletList', walletList, 0)
        this.$emit('close', true)
      } else {
        this.$emit('close')
      }
    },
    closeAddWalletPopup() {
      this.showAddWallet = false
    }
  },
  watch: {
    showSwitchWallet(newVal) {
      if(newVal) {
        this.walletList = this.$cache.get('_walletList')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .switch-wallet-popup {
    /deep/ .u-popup__content {
      flex-shrink: 0 !important;
      flex-basis: 85vh !important;
      border-radius: 16rpx 16rpx 0 0;
    }    
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: 32rpx;
    background-color: #F7F8FA;
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

  .content {
    padding: 32rpx 32rpx 0;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 686rpx;
      height: 128rpx;
      padding: 0 32rpx;
      border-radius: 16rpx;
      background-color: #F1F2F6;
      margin-bottom: 24rpx;

      &-left {
        &-name {
          height: 28rpx;
          margin-bottom: 12rpx;
          font-weight: 600;
          font-size: 28rpx;
          line-height: 28rpx;
          color: #2C365A;
        }

        &-address {
          height: 24rpx;
          opacity: 0.9;
          font-weight: 400;
          font-size: 24rpx;
          color: #8397B1;
          line-height: 24rpx;
        }
      }

      &-right {
        width: 32rpx;
        height: 32rpx;

        image {
          width: 32rpx;
          height: 32rpx;
        }
      }

    }

    .selected {
      background-image: linear-gradient(-49deg, #1E74E2 0%, #002FA7 100%);

      .item {
        &-left {
          &-name {
            color: #FFFFFF;
          }
        }
      }
    }
  }

  .add-wallet {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    background: #002FA7;
    border-radius: 16rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
    line-height: 96rpx;

    &-content {
      display: flex;
      align-items: center;

      image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 10rpx;
      }
    }
  }
</style>

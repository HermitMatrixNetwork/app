<template>
  <view class="index">
    <view class="banner">

    </view>
    <view class="content">
      <view class="protocol">
        <label>
          <checkbox class="protocol-checkbox" :checked="agree_protocol" @click="agree_protocol = !agree_protocol" />
        </label>
        <text>我已阅读并同意</text>
        <text class="protocol-detail" @tap="toProtocolDetail">《用户协议》</text>
      </view>
      <view class="wallet">
        <view class="wallet-create" @click="toCreateWallet">
          <view class="left">
            <view>创建钱包</view>
            <view class="left-describe">没有钱包</view>
          </view>
          <view class="right">
            <u-icon name="arrow-right"></u-icon>
          </view>
        </view>
        <view class="wallet-import" @click="toImportWallet">
          <view class="left">
            <view>导入钱包</view>
            <view class="left-describe">已有钱包</view>
          </view>
          <view class="right">
            <u-icon name="arrow-right"></u-icon>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        agree_protocol: this.$cache.get('_agree_protocol') || false
      }
    },
    methods: {
      toProtocolDetail() {
        uni.navigateTo({
          url: '/pages/index/protocolDetail'
        })
      },
      toCreateWallet() {
        if (this.checkIsAgree()) {
          uni.navigateTo({
            url: '/pages/index/createWallet'
          })
        } else {
          uni.showToast({
            title: '请勾选同意用户协议',
            icon: 'none'
          })
        }
      },
      toImportWallet() {
        if (this.checkIsAgree()) {
          uni.navigateTo({
            url: '/pages/index/importWallet'
          })
        } else {
          uni.showToast({
            title: '请勾选同意用户协议',
            icon: 'none'
          })
        }
      },
      checkIsAgree() {
        return this.agree_protocol == true
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
  .content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    >view {
      width: 80vw;
    }

    .protocol {
      display: flex;
      align-items: center;

      &-detail {
        color: skyblue;
      }

      &-checkbox {
        display: flex;
        align-items: center;
        justify-content: center;

        /deep/ .uni-checkbox-input {
          margin-right: 15rpx;
          width: 30rpx;
          height: 30rpx;
        }
      }
    }

    .wallet {
      >view {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15rpx;
        padding: 17rpx 25rpx 10rpx;
        border: 1px solid #f7f7f7;
        border-radius: 15rpx;

        .left {
          color: #169bd5;

          &-describe {
            font-size: 12rpx;
            color: #aaaaaa;
          }
        }
      }
    }
  }
</style>

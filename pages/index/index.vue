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
      <image class="logo-image" src="/static/img/placeholder.jpeg"></image>
      <view class="logo-describe">
        创建您自己的钱包</view>
      <view class="logo-describe">
        保护您的资产
      </view>
    </view>
    <view class="content">

      <view class="wallet">
        <view class="wallet-create" @click="toCreateWallet">
          <view>创建钱包</view>
          <view class="wallet-create-describe">没有钱包</view>
        </view>
        <view class="wallet-import" @click="toImportWallet">
          <view>导入钱包</view>
          <view class="wallet-import-describe">已有钱包</view>
        </view>
      </view>
    </view>
    <!-- bgColor="#F7F8FA" -->
    <u-popup class="protocol" bgColor="#F7F8FA" :show="showProtocol" :round="16" mode="bottom" closeOnClickOverlay
      duration="400" @close="closeProtocol">
      <view class="protocol-header">
        <view class="protocol-header-placeholder"></view>
        <view class="protocol-header-title">
          用户协议
        </view>
        <view class="protocol-header-close" @click="closeProtocol">
          <u-icon name="close" color="#2C365A" size="32rpx"></u-icon>
        </view>
      </view>
      <view class="protocol-content">
        <text>
          testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
          testtesttesttesttesttesttesttesttesttesttesttest
        </text>
      </view>
      <view class="protocol-footer">
        <view class="protocol-footer-check">
          <label>
            <checkbox class="protocol-footer-check-checkbox" :checked="agree_protocol"
              @click="agree_protocol = !agree_protocol" />
          </label>
          <text>我已阅读并同意用户协议</text>
        </view>
        <view class="protocol-footer-confirm" :class="{ complete: agree_protocol }">
          <u-button @click="confirmProtocol">确认</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        agree_protocol: this.$cache.get('_agree_protocol') || false,
        showProtocol: false,
        action: ''
      }
    },
    onShow() {
      // str @test
      // this.$cache.delete('_agree_protocol')
      // this.agree_protocol = this.$cache.get('_agree_protocol') || false
      // end
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
        padding: 12rpx 0;
        align-items: center;
        border-radius: 16rpx;
      }

      &-create {
        font-size: 32rpx;
        color: #FFFFFF;
        background-color: #002FA7;

        &-describe {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.60);
        }
      }

      &-import {
        margin-top: 40rpx;
        font-size: 32rpx;
        color: #2C365A;
        background-color: #F2F2F4;

        &-describe {
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
        font-weight: 500;
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
        align-items: center;
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

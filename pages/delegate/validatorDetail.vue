<template>
  <view class="container">
    <custom-header tabUrl="/pages/delegate/index" :title="language.text85"></custom-header>

    <view class="name">
      <image src="/static/img/delegate/theme2.png"></image>
      <view class="name-info">
        <view class="title">
          {{ language.text84 }}
        </view>
        <view class="address" @click="copy">
          <text>{{ validatorInfo.validator_name }}</text>
          <image src="/static/img/account/copy.png" ></image>
        </view>
      </view>
    </view>

    <!-- 验证人详细信息 -->
    <view class="detail">
      <view class="item">
        <view class="label">
          <text>{{ language.text52 }}</text>
        </view>
        <view class="value">
          <text>{{ validatorInfo.tokens / mainCoin.decimals }}</text>
        </view>
      </view>
      <view class="item">
        <view class="label">
          <text>{{ language.text53 }}</text>
        </view>
        <view class="value">
          <text>{{ validatorInfo.self_delegate_tokens / mainCoin.decimals }}</text>
        </view>
      </view>
      <view class="item">
        <view class="label">
          <text>{{ language.text50 }}</text>
        </view>
        <view class="value">
          <text>{{ validatorInfo.rate }}</text>
        </view>
      </view>
      <view class="item">
        <view class="label">
          <text>{{ language.text49 }}</text>
        </view>
        <view class="value">
          <text>{{ validatorInfo.uptimes }}</text>
        </view>
      </view>
    </view>

    <!-- 说明 -->
    <view class="explain">
      <view class="item">
        <view class="label">
          <view class="dot"></view>
          <text>{{ language.text54 }}</text>
        </view>
        <view class="info">
          <text>{{ language.text55 }}</text>
        </view>
      </view>
      <view class="item">
        <view class="label">
          <view class="dot"></view>
          <text>{{ language.text56 }}</text>
        </view>
        <view class="info">
          <text>
            {{ language.text57 }}
          </text>
        </view>
      </view>
    </view>
    
    <u-button class="btn" @click="toDelegate">{{ language.text58 }}</u-button>
    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import language from './language/index.js'
import { getValidatorInfo } from '@/api/browers.js'
import mainCoin from '@/config/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      validatorInfo: {},
      mainCoin
    }
  },
  async onLoad(options) {
    this.validatorInfo = JSON.parse(options.validatorInfo)
    console.log('验证人信息', this.validatorInfo)
  },
  methods: {
    toDelegate() {
      uni.navigateTo({
        url: `./delegate?data=${JSON.stringify(this.validatorInfo)}`
      })
    },
    copy() {
      uni.setClipboardData({
        data: this.validatorInfo.operator_address,
        showToast: false,
        success: () => {
          this.$refs.notify.show('error', this.language.text103, { bgColor: '#275EF1' })
        },
        fail: () => {
          this.$refs.notify.show('error', '复制失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    background-color: #F4F6F9;
  }

  .name {
    position: relative;
    margin: 32rpx;
    height: 200rpx;

    >image {
      position: absolute;
      width: 100%;
      height: 200rpx;
    }

    .name-info {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      margin: auto;
      text-align: center;


      .title {
        font-weight: 600;
        font-size: 32rpx;
        color: #FFFFFF;
        line-height: 32rpx;
        margin-bottom: 32rpx;
      }

      .address {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        color: #FFFFFF;

        image {
          width: 32rpx;
          height: 32rpx;
        }

        text {
          font-size: 24rpx;
          margin-right: 6rpx;
        }
      }
    }
  }

  .detail {
    margin: 32rpx;
    background-color: #fff;
    padding: 14rpx 32rpx;
    border-radius: 16rpx;

    .item {
      display: flex;
      justify-content: space-between;
      padding: 24rpx 0;

      &:not(:last-child) {
        border-bottom: 2rpx solid rgba(131, 151, 177, 0.12)
      }

      .label {
        font-size: 28rpx;
        color: #8397B1;
        line-height: 48rpx;
      }

      .value {
        font-weight: 600;
        font-size: 28rpx;
        color: #212121;
        line-height: 48rpx;
      }
    }
  }

  .explain {
    margin: 0 32rpx;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 0 40rpx 20rpx 32rpx;

    .item {
      .label {
        display: flex;
        align-items: center;
        padding-top: 48rpx;
        margin-bottom: 24rpx;
        .dot {
          width: 16rpx;
          height: 16rpx;
          margin-right: 12rpx;
          background: #1E5EFF;
          border-radius: 50%;
        }
        text {
          font-weight: 600;
          font-size: 28rpx;
          color: #0F172A;
          line-height: 28rpx;
        }
      }
      .info {
        text {
          font-size: 24rpx;
          color: #8397B1;
          line-height: 24rpx;
        }
      }
    }
  }

  .btn {
    position: absolute;
    bottom: 10rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
  }
</style>

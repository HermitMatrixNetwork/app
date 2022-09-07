<template>
  <view>
    <custom-header></custom-header>

    <view class="logo">
      <image src="/static/img/index/tishi.png" style="width: 174rpx; height: 174rpx;"></image>
    </view>

    <view class="content">
      <view class="title">
        {{ language.text136 }}
      </view>
      <view class="hint">
        {{ language.text190 }}
      </view>
      <view class="line"></view>
      <view class="rules">
        <view class="rules-item">
          <view class="rules-item-icon"></view>
          <view class="rules-item-describe">
            {{ language.text137 }}
          </view>
        </view>
        <view class="rules-item">
          <view class="rules-item-icon"></view>
          <view class="rules-item-describe">
            {{ language.text138 }}
          </view>
        </view>
        <view class="rules-item">
          <view class="rules-item-icon"></view>
          <view class="rules-item-describe">
            {{ language.text139 }}
          </view>
        </view>
      </view>
      <u-button class="btn" @click="toNextStep">{{ language.text152 }}</u-button>
    </view>
  </view>
</template>

<script>
import language from '@/pages/account/language/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
    }
  },
  methods: {
    toNextStep() {
      uni.redirectTo({
        url: './exportPrivatekey'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .logo {
    margin-top: 88rpx;
    margin-bottom: 102rpx;
    text-align: center;
  }

  .content {
    padding: 0 40rpx;

    .title {
      height: 32rpx;
      margin-bottom: 24rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      line-height: 32rpx;
    }

    .hint {
      font-weight: 400;
      font-size: 28rpx;
      color: #8397B1;
      line-height: 40rpx;
    }

    .line {
      height: 2rpx;
      background-color: rgba(131,151,177, 0.3);
      margin: 48rpx 0;
    }

    .rules-item {
      display: flex;
      align-items: center;
      margin-bottom: 52rpx;

      &-icon {
        width: 10rpx;
        height: 10rpx;
        margin-right: 26rpx;
        border-radius: 50%;
        background-color: #8397B1;
        flex-shrink: 0;
      }

      &-describe {
        font-size: 28rpx;
        line-height: 44rpx;
        color: #8397B1;
      }
    }

    .btn {
      position: absolute;
      bottom: 64rpx;
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
  }
</style>

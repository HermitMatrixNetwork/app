<template>
  <view>
    <view class="loading">
      <view style="text-align: center; margin-top: 65rpx;">
        <u-loading-icon v-if="!success" class="u-loading" mode="circle" inactive-color="white"></u-loading-icon>
        <u-icon v-else :name="successIcon" size="64rpx"></u-icon>
      </view>
      <view class="message">{{ loadingText }}</view>
    </view>
    <view class="mask" :showMask="showMask"></view>
  </view>
</template>

<script>
export default {
  props: {
    loading: {
      default: true
    },
    loadingText: {
      default: '执行中...'
    },
    showMask: {
      default: true
    },
    success: {
      default: false
    },
    successIcon: {
      default: '/static/img/chenggong.png'
    }
  }
}
</script>

<style lang="scss" scoped>
  .loading {
    position: fixed;
    background-color: rgba(0, 0, 0, .6);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 240rpx;
    height: 240rpx;
    text-align: center;
    .message {
      margin-top: 20rpx;
      color: #fff;
    }
    z-index: 99999;
    
    /deep/ .u-icon--right {
      justify-content: center;
    }
  }
  .mask {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .2);
    z-index: 99998;
  }
</style>

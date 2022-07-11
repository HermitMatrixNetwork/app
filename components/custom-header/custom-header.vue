<template>
  <view style="padding-left: 18rpx" :style="customStyle">
    <!-- 状态栏 -->
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>

    <view class="container">
      <view class="goBack">
        <u-icon name="arrow-left" color="#8397B1" @click="goBack"></u-icon>
      </view>
      <view class="title">
        {{ title }}
      </view>
      <view class="right">
        <slot name="customIcon"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    customStyle: Object,
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 112rpx;

    .title {
      height: 32rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #0F172A;
      line-height: 32rpx;
    }

    .goBack {
      padding-left: 18rpx;
      display: flex;
      align-items: center;

      /deep/ .u-icon__icon {
        font-size: 48rpx !important;
        width: 48rpx;
        height: 48rpx;
      }

      /deep/ .u-icon {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .right {
      padding-right: 32rpx;
    }
  }
</style>

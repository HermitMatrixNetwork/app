<template>
  <view :style="customStyle">
    <!-- 状态栏 -->
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>

    <view class="container">
      <view class="left">
        <u-icon v-if="showGoBack" name="arrow-left" color="#8397B1" @click="beforeGoBack"></u-icon>
        <slot v-else name="left"></slot>
      </view>
      <view class="center">
        <text v-if="title">{{ title }}</text>
        <slot v-else name="center"></slot>
      </view>
      <view class="right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    customStyle: Object,
    showGoBack: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    backUrl: {
      type: String,
      default: ''
    },
    tabUrl: {
      type: String,
      default: ''
    },
    redirUrl: {
      type: String,
      default: ''
    },
    delay: Number,
    delayHandler: Function
  },
  data() {
    return {

    }
  },
  methods: {
    beforeGoBack() {
      if (this.delay) {
        this.delayHandler()
        setTimeout(this.goBack, this.delay)
      } else {
        this.goBack()
      }
    },
    goBack() {
      if (this.backUrl) {
        uni.navigateTo({
          url: this.backUrl
        })
      } else if(this.tabUrl) {
        uni.switchTab({
          url: this.tabUrl
        })
      } else if (this.redirUrl) {
        uni.redirectTo({
          url: this.redirUrl
        })
      } else {
        uni.navigateBack()
      }
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

    .center {
      height: 32rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #0F172A;
      line-height: 32rpx;
    }

    .left {
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

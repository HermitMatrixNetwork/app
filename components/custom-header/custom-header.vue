<template>
  <view :style="customStyle" class="page-header">
    <!-- 状态栏 -->
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>

    <view class="container">
      <view class="left">
        <view v-if="showGoBack" @click="beforeGoBack" class="back_button">
          <image  src="/static/img/black.png"  style="width:48rpx;height:48rpx"></image>  
        </view>
        <slot v-else name="left"></slot>
      </view>
      <view class="center">
        <text v-if="title" class="title">{{ title }}</text>
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
    relaunchUrl: {
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
      } else if (this.relaunchUrl) {
        uni.reLaunch({
          url: this.relaunchUrl
        })
      } else {
        uni.navigateBack()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  image {
    will-change: transform;
  }
  
  .page-header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #fff;
  }
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .container {
    position: relative;
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
      
      .title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
      }
    }

    .left {
      .back_button {
        padding: 0 0 0 18rpx;
        height: 112rpx;
        display: flex;
        align-items: center;
      }

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

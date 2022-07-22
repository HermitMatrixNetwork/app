<template>
  <view class="touchId">
    <custom-header title="指纹识别"></custom-header>
    <view class="content">
      <view class="title">
        <text>请输入指纹完成验证</text>
      </view>
      <view class="middle">
        <view class="line"></view>
        <view class="figure-pic">
          <image src="/static/img/placeholder.jpeg"></image>
        </view>
        <view class="around middle-top-left"></view>
        <view class="around middle-top-right"></view>
        <view class="around middle-bottom-left"></view>
        <view class="around middle-bottom-right"></view>
        <view class="toast" v-show="showToast">
          <view class="toast-icon">
            <image :src="toast.icon"></image>
          </view>
          <view class="toast-content">
            <text>{{ toast.msg }}</text>
          </view>
        </view>
      </view>
    </view>
    
        <view class="logo">Hermit Wallet</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showToast: false,
      toast: {
        icon: '/static/img/mine/loading.gif',
        // msg: '失败次数超出限制，请稍后再设置',
        msg: '验证指纹中'
      }
    }
  },
  mounted() {
    // #ifdef APP-PLUS
    this.verify()
    // #endif
  },
  methods: {
    show(options) {

    },
    hide() {},
    verify() {
      const eventChannel = this.getOpenerEventChannel()

      plus.fingerprint.authenticate(res => {
        this.toast.msg = '验证指纹中'
        this.toast.icon = '/static/img/mine/loading.gif'
        this.showToast = true
        setTimeout(() => {
          this.toast.msg = '验证成功'
          this.toast.icon = '/static/img/chenggong.png'
          eventChannel.emit('success')
        }, 1000)

      }, e => {
        console.log(e)
        this.toast.msg = '验证指纹中'
        this.toast.icon = '/static/img/mine/loading.gif'
        this.showToast = true
        setTimeout(() => {
          this.toast.icon = '/static/img/shibai1.png'
          switch (e.code) {
          case e.UNKNOWN_ERROR:
          case e.AUTHENTICATE_OVERLIMIT:
            plus.nativeUI.closeWaiting() //兼容Android平台关闭等待框
            this.toast.msg = '失败次数超出限制，请稍后再设置'
            this.$cache.set('_AUTHENTICATE_OVERLIMIT', true, 300)
            break

          default:
            plus.nativeUI.closeWaiting() //兼容Android平台关闭等待框
            this.toast.msg = '指纹匹配失败，请重新验证'
          }
          eventChannel.emit('fail')
        }, 1000)
      })
    }
  },
  watch: {
    showToast: {
      handler(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.showToast = false
            if (this.toast.msg == '验证成功' || this.toast.msg == '失败次数超出限制，请稍后再设置') uni.navigateBack()
          }, 3000)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .touchId {
    height: 100vh;
    background-color: #F4F6F9;
  }

  .toast {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) !important;
    width: 240rpx;
    height: 240rpx;
    background: rgba(0, 0, 0, .6);
    padding: 0 !important;
    justify-content: center;
    border-radius: 6rpx;
    z-index: 999999999;

    &-icon {
      text-align: center;
      margin-top: 65rpx;

      image {
        width: 65rpx;
        height: 65rpx;
      }
    }

    &-content {
      margin-top: 20rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #FFFFFF;
      text-align: center;
    }
  }

  .content {
    width: 632rpx;
    height: 760rpx;
    margin: 64rpx auto 0;
    background: #FFFFFF;
    box-shadow: 0 32rpx 32rpx 0 rgba(0, 0, 0, 0.04);
    border-radius: 32rpx;

    .title {
      height: 32rpx;
      padding-top: 80rpx;
      font-weight: 400;
      font-size: 32rpx;
      color: #8397B1;
      text-align: center;
      line-height: 32rpx;
    }

    .middle {
      position: relative;
      margin: 122rpx auto 0;
      width: 332rpx;
      height: 318rpx;
      border-radius: 16rpx;
      overflow: hidden;

      .figure-pic {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        image {
          width: 242rpx;
          height: 242rpx;
        }
      }

      @keyframes radar-beam {
        0% {
          transform: translateY(100%);
        }

        100% {
          transform: translateY(0%);
        }
      }

      .line {
        position: absolute;
        z-index: 9998;
        height: calc(100% - 2px);
        width: 100%;
        background: linear-gradient(180deg, rgba(84, 211, 134, 0.41) 0%, rgba(30, 94, 255, 0.00) 100%);
        border-top: 3px solid #54D386;
        transform: translateY(100%);
        animation: radar-beam 2s infinite alternate;
        animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
        animation-delay: 1.4s;
      }

      .around {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        z-index: 9999;
      }

      &-top-left {
        top: 0;
        left: 0;
        border-top-left-radius: 16rpx;
        border-top: 8rpx solid #1E5EFF;
        border-left: 8rpx solid #1E5EFF;
      }

      &-top-right {
        top: 0;
        right: 0;
        border-top-right-radius: 16rpx;
        border-top: 8rpx solid #1E5EFF;
        border-right: 8rpx solid #1E5EFF;
      }

      &-bottom-left {
        bottom: 0;
        left: 0;
        border-bottom-left-radius: 16rpx;
        border-bottom: 8rpx solid #1E5EFF;
        border-left: 8rpx solid #1E5EFF;
      }

      &-bottom-right {
        bottom: 0;
        right: 0;
        border-bottom-right-radius: 16rpx;
        border-bottom: 8rpx solid #1E5EFF;
        border-right: 8rpx solid #1E5EFF;
      }
    }
  }
  
  .logo {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 120rpx;
    height: 44rpx;
    font-weight: bold;
    font-size: 44rpx;
    color: #8397B1;
    letter-spacing: 0;
    line-height: 44rpx;
  }
</style>

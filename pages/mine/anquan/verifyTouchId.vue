<template>
  <view class="touchId">
    <custom-header :title="language.text32"></custom-header>
    <view class="content">
      <view class="title">
        <text>{{ language.text34 }}</text>
      </view>
      <view class="middle">
        <view class="line"></view>
        <view class="figure-pic">
          <image src="/static/img/mine/zhiwen2.png"></image>
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
    <u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
      <view class="modalContent">
        <image src="/static/img/tishi2.png" style="width: 64rpx; height: 64rpx;"></image>
        <view class="modal-title">{{ language.text89 }}</view>
        <text class="modal-content">{{ language.text111 }}</text>
        <button @click="confirm">{{ language.text29 }}</button>
      </view>
    </u-modal>
    
    
        <view class="logo">Hermit Wallet</view>
        
        <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import language from '../language/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      showToast: false,
      aa: false,
      toast: {
        icon: '/static/img/mine/loading.gif',
        // msg: '失败次数超出限制，请稍后再设置',
        msg: language[this.$cache.get('_language')].text111
      }
    }
  },
  mounted() {
    // #ifdef APP-PLUS
    this.verify()
    // #endif
  },
  onUnload() {
    plus.fingerprint.cancel()
  },
  methods: {
    verify() {
      const eventChannel = this.getOpenerEventChannel()

      plus.fingerprint.authenticate(res => {
        this.toast.msg = `${this.language.text102}...`
        this.toast.icon = '/static/img/mine/loading.gif'
        this.showToast = true
        setTimeout(() => {
          // 验证成功
          this.verifyTouchID = 1
          this.toast.msg = this.language.text112
          this.toast.icon = '/static/img/mine/success.png'
          // this.showToast = false
          // this.$refs.notify.show('', this.language.text36, { bgColor: ' #275EF1' })
          eventChannel.emit('success')
        }, 1000)

      }, e => {
        console.log(e)
        if (e.code == 6) {
          plus.fingerprint.cancel()
          // uni.navigateBack()
        } else {
          this.toast.msg = `${this.language.text102}...`
          this.toast.icon = '/static/img/mine/loading.gif'
          this.showToast = true
        }
        setTimeout(() => {
          // this.showToast = false
          
          switch (e.code) {
          case e.UNKNOWN_ERROR:
          case e.AUTHENTICATE_OVERLIMIT:
            plus.nativeUI.closeWaiting() //兼容Android平台关闭等待框
            // this.$refs.notify.show('', this.language.text103)
            // 提示：失败次数过多，请稍后重试！（具体重试时间参考本机指纹验证规则）
            this.showToast = false
            this.toast.msg = this.language.text111
            this.aa = true
            this.$cache.set('_AUTHENTICATE_OVERLIMIT', true, 300)
            this.verifyTouchID = 2
            break
          case e.CANCEL:
            // uni.navigateBack()
            break
          default:
            this.verifyTouchID = 0
            this.toast.icon = '/static/img/mine/fail.png'
            // this.$refs.notify.show('', this.language.text35)
            plus.nativeUI.closeWaiting() //兼容Android平台关闭等待框
            // 错误提示：录入指纹错误，请重新录入！
            this.toast.msg = this.language.text35
          }
          eventChannel.emit('fail')
        }, 1000)
      })
    },
    verifyTouchIDSuccess() {
      uni.navigateBack()
    },
    confirm() {
      this.aa = false
      uni.navigateBack()
    }
  },
  watch: {
    showToast: {
      handler(newVal) {
        if (newVal) {
          setTimeout(() => {
            
            switch (this.verifyTouchID) {
            case 1:
              this.showToast = false
              this.verifyTouchIDSuccess && this.verifyTouchIDSuccess()
              break
            case 0:
              this.showToast = false
              this.verifyTouchIDFail && this.verifyTouchIDFail()
              break
            case 2:
              this.verifyTouchIDOverTime && this.verifyTouchIDOverTime()
              break
            case 3:
              break
            default:
              this.showToast = false
              this.verifyTouchIDFail && this.verifyTouchIDFail()
            }
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
    padding-top: calc(112rpx + var(--status-bar-height));
    background-color: #F4F6F9;
  }

  .toast {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) !important;
    width: 240rpx;
    padding: 0 20rpx 32rpx;
    background: rgba(0, 0, 0, .6);
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
    position: relative;
    width: 632rpx;
    height: 760rpx;
    margin: 64rpx auto 0;
    background: #FFFFFF;
    box-shadow: 0 32rpx 32rpx 0 rgba(0, 0, 0, 0.04);
    border-radius: 32rpx;

    .title {
      padding: 80rpx 32rpx 0;
      font-weight: 400;
      font-size: 32rpx;
      color: #8397B1;
      text-align: center;
      line-height: 56rpx;
    }

    .middle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
  
  /deep/ .hintModal {
  
    .u-modal__content {
      padding: 32rpx;
      padding-top: 48rpx !important;
    }
  
    .modalContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
  
      .modal-title {
        font-size: 32rpx;
        color: #2c365a;
        font-weight: 600;
        line-height: 32rpx;
         margin-top: 32rpx;
      }
  
      .modal-content {
        font-size: 28rpx;
        color: #8397b1;
        line-height: 42rpx;
        margin-top: 32rpx;
        margin-bottom: 48rpx;
      }
  
      button {
        width: 622rpx;
        height: 96rpx;
        font-size: 32rpx;
        line-height: 96rpx;
        background: #002fa8;
        color: #ffffff;
      }
    }
  }
</style>

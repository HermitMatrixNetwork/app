<template>
  <view class="anquan">
    <custom-header :title="language.text31" :customStyle="{ 'background-color': '#fff' }">
    </custom-header>
    <view class="border"></view>
    <view class="top">
      <view class="import-type" v-for="(item, index) in top" :key="item.name">
        <view class="content">
          <view class="content-icon">
            <image :src='`/static/img/mine/${ item.icon }`'></image>
          </view>
          <view class="content-content">
            <view class="content-content-name">{{ item.name }}</view>
          </view>
          <view class="content-arrow-right" v-if="item.icon !== 'zhiwen.png'">
            <u-icon name="arrow-right" color="#8397B1" size="32rpx"></u-icon>
          </view>
          <view v-else class="content-switch">
            <view class="content-switch-bar"></view>
            <view class="content-switch-complete-bar"
              :class="[firsetIn ? (touchId ? 'barr' : 'barl') : (touchId ? 'bar-to-right' : 'bar-to-left')]"></view>
            <view class="content-switch-circle"
              :class="[firsetIn ? (touchId ? 'r0' : 'l0') : (touchId ? 'right' : 'left')]" @click="switchTouchId">
            </view>
          </view>
        </view>
       <view class="border">
        </view>
      </view>
    </view>
    
    <!-- 您未在手机设置处开启并录入指纹，Hermit Wallet 应用无法获取指纹信息，请先去设置！ -->
    <u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
      <view class="modalContent">
        <u-icon name="info-circle" size="64rpx" color="#FFA033" />
        <view class="modal-title">{{ language.text89 }}</view>
        <text class="modal-content">{{ language.text33 }}</text>
        <button @click="aa = false">{{ language.text29 }}</button>
      </view>
    </u-modal>
    
    <!-- 指纹识别次数超过限制，请稍后再设置 -->
    <u-modal :show="bb" width="686rpx" :showConfirmButton="false" class="hintModal">
      <view class="modalContent">
        <u-icon name="info-circle" size="64rpx" color="#FFA033" />
        <view class="modal-title">{{ language.text89 }}</view>
        <text class="modal-content">指纹识别次数超过限制，请稍后再设置</text>
        <button @click="bb = false">{{ language.text29 }}</button>
      </view>
    </u-modal>
  </view>
</template>

<script>
import language from '../language/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      top: [{
        name: language[this.$cache.get('_language')].text32,
        icon: 'zhiwen.png',
      }],
      touchId: this.$cache.get('_touchId'),
      firsetIn: true,
      aa: false,
      bb: false
    }
  },
  methods: {
    switchTouchId() {
      try {
        if (!plus || !plus.fingerprint.isSupport() || !plus.fingerprint.isEnrolledFingerprints()) return this.aa = true
        const AUTHENTICATE_OVERLIMIT = this.$cache.get('_AUTHENTICATE_OVERLIMIT')
        if (AUTHENTICATE_OVERLIMIT) return this.bb = true
        uni.navigateTo({
          url: './verifyTouchId',
          events: {
            // 0 未开启 ： 1 开启
            success: () => {
              this.firsetIn = false
              this.touchId = this.touchId ? 0 : 1
              this.$cache.set('_touchId', this.touchId, 0)
            },
            fail: () => {
              console.log('AUTHENTICATE_MISMATCH')
            }
          }
        })
      } catch (e) {
        return this.aa = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>  
  .anquan {
    height: 100vh;
    background-color: #F4F6F9;
  }

  .border {
    border: 1px solid #F4F6F9;
  }

  image {
    width: 44rpx;
    height: 44rpx;
  }

  .import-type {
    padding: 40rpx 0 0rpx 0;
    background-color: #fff;

    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32rpx 33rpx 48rpx;

      &-icon {
        width: 44rpx;
        height: 44rpx;
      }

      &-content {
        flex: 1;
        margin-left: 32rpx;

        &-name {
          font-weight: 600;
          font-size: 32rpx;
          color: #0F172A;
          line-height: 32rpx;
        }
      }

      &-switch {
        width: 72rpx;
        height: 40rpx;
        position: relative;

        &-bar {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 16rpx;
          width: 72rpx;
          border-radius: 16rpx;
          background-color: #8397B1;
        }

        &-complete-bar {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 16rpx;
          border-radius: 16rpx;
          background-color: #1E5EFF;

        }

        @keyframes barToRight {
          0% {
            width: 0%;
          }

          100% {
            width: 100%;
          }
        }

        @keyframes barToLeft {
          0% {
            width: 100%;
          }

          100% {
            width: 0%;
          }
        }

        .barl {
          width: 0rpx;
        }

        .barr {
          width: 100%;
        }

        .bar-to-right {
          animation: barToRight .5s ease 1 forwards
        }

        .bar-to-left {
          animation: barToLeft .5s ease 1 forwards
        }

        &-circle {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          background-color: #fff;
          border: 0 solid rgba(151, 151, 151, 0.12);
          box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
        }

        @keyframes toRight {
          0% {
            transform: translate(-10%, -50%)
          }

          100% {
            transform: translate(110%, -50%)
          }
        }

        @keyframes toLeft {
          0% {
            transform: translate(110%, -50%)
          }

          100% {
            transform: translate(-10%, -50%)
          }
        }

        .l0 {
          transform: translate(0%, -50%)
        }

        .r0 {
          transform: translate(100%, -50%)
        }

        .left {
          animation: toLeft .5s ease 1 forwards;
        }

        .right {
          animation: toRight .5s ease 1 forwards;
        }
      }
    }

    .border {
      border-bottom: 2rpx solid #F2F4F8;
    }

    &:last-child {
      .border {
        border-bottom: 0;
      }
    }
  }


  /deep/ .hintModal {
    .u-modal {
      height: 510rpx;
    }

    .u-modal__content {
      padding: 32rpx;
      padding-top: 48rpx !important;
    }

    .modalContent {
      height: 430rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .modal-title {
        font-size: 32rpx;
        color: #2c365a;
        font-weight: 600;
        line-height: 32rpx;
      }

      .modal-content {
        width: 570rpx;
        font-size: 28rpx;
        color: #8397b1;
        line-height: 42rpx;
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

<template>
  <!-- 提示窗口-->
  <u-modal :show="showHint" :closeOnClickOverlay="false" :showConfirmButton="false">
    <template slot="default">
      <view class="hint">
        <view class="hint-logo">
          <image class="hint-logo-image" src="@/static/img/jietu.png"></image>
        </view>
        <view class="hint-title">
          {{ language.text135 }}
        </view>
        <view class="hint-content">
          {{ language.text215 }}
        </view>
        <u-button class="hint-btn" @click="confrimHint">{{ language.text50 }}</u-button>
      </view>
    </template>
  </u-modal>
</template>

<script>
import language from '@/pages/account/language/index.js'
export default {
  data() {
    return {
      showHint: true,
      language: language[this.$cache.get('_language')],
    }
  },
  methods: {
    confrimHint() {
      this.showHint = false
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .u-modal {
    width: 686rpx;
    border-radius: 16rpx;

    .u-modal__content {
      display: block;
      padding: 0 32rpx 32rpx !important;
    }

    .hint {
      background-color: #fff;

      &-logo {
        width: 100rpx;
        height: 100rpx;
        margin: 48rpx auto 0;

        &-image {
          width: 100rpx;
          height: 100rpx;
        }
      }

      &-title {
        margin: 24rpx 0 30rpx;
        font-weight: 600;
        font-size: 32rpx;
        color: #2C365A;
        text-align: center;
      }

      &-content {
        width: 544rpx;
        margin: auto;
        margin-bottom: 48rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #8397B1;
      }

      &-btn {
        height: 96rpx;
        background-color: #002FA7;
        border-radius: 16rpx;
        font-weight: 400;
        font-size: 32rpx;
        color: #FCFCFD;
      }
    }
  }
</style>

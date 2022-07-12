<template>
  <view>
    <custom-header></custom-header>

    <view class="logo">
      <image src="/static/img/placeholder.jpeg" style="width: 174rpx; height: 174rpx;"></image>
    </view>

    <view class="content">
      <view class="title">
        备份提示
      </view>
      <view class="hint">
        获得Keystore等于拥有钱包资产所有权
      </view>
      <view class="line"></view>
      <view class="rules">
        <view class="rules-item">
          <view class="rules-item-icon"></view>
          <view class="rules-item-describe">
            请离线保存，勿保存至邮箱、聊天应用等在线工具，
            存在泄漏风险
          </view>
        </view>
        <view class="rules-item">
          <view class="rules-item-icon"></view>
          <view class="rules-item-describe">
            请勿通过网络工具传输，如被获取将可能被盗取账
            户资产，且无法找回
          </view>
        </view>
        <view class="rules-item">
          <view class="rules-item-icon"></view>
          <view class="rules-item-describe">
            请勿向任何人透漏或分享私钥，掌握Keystore将获
            得资产所有权
          </view>
        </view>
      </view>
      <u-button class="btn" @click="toNextStep">下一步</u-button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    toNextStep() {
      uni.navigateTo({
        url: './exportKeystore'
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
      height: 28rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #8397B1;
      line-height: 28rpx;
    }

    .line {
      height: 2rpx;
      background-color: #8397B1;
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

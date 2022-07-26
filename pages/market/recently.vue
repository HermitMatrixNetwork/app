<template>
  <view>
    <custom-header title="最近使用"></custom-header>
    <view class="border"></view>

    <view class="list">
      <view class="content" v-for="item in 2">
        <view class="item">
          <view class="logo">
            <image src="/static/img/account/uGHM.png"></image>
          </view>
          <view class="article">
            <view class="title">
              区块浏览器
            </view>
            <view class="describe">
              这是Hermit 区块浏览器
            </view>
            <view class="article-border">
              
            </view>
          </view>
        </view>
        <view class="border"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  .border {
    height: 2rpx;
    opacity: 0.16;
    background-color: #8397B1;
  }

  .list {
    .border {
      margin-left: 129rpx;
    }
    .item {
      padding: 32rpx 0 36rpx 32rpx;
      display: flex;
      align-items: center;

      .logo {
        margin-right: 25rpx;

        image {
          width: 72rpx;
          height: 72rpx;
        }
      }

      .article {
        
        .title {
          font-weight: 400;
          font-size: 28rpx;
          color: #2C365A;
          line-height: 28rpx;
          margin-bottom: 16rpx;
        }

        .describe {
          font-weight: 400;
          font-size: 24rpx;
          color: #8397B1;
          line-height: 24rpx;
        }

      }
    }
  }
</style>

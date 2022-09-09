<template>
  <view>
    <custom-header :title="language.text08"></custom-header>
    <view class="border"></view>

    <view class="list">
      <view class="content" v-for="(item, index) in recently" :key="index">
        <view class="item">
          <view class="logo">
            <image src="/static/img/account/uGHM.png"></image>
          </view>
          <view class="article">
            <view class="title">
              {{ item.name }}
            </view>
            <view class="describe">
              {{ item.des }}
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
	import language from './language/index.js'
export default {
  data() {
    return {
      recently: [],
			language: language[this.$cache.get('_language')]
    }
  },
  created() {
    this.recently = this.$cache.get('_recently')
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
      margin-right: 32rpx;
    }
    .item {
      padding: 32rpx 32rpx 36rpx 32rpx;
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
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

      }
    }
  }
</style>

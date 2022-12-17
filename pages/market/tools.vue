<template>
  <view class="page-wrapper">
    <custom-header :title="language.text09"></custom-header>
    <view class="border"></view>

    <view class="list">
      <view class="content" v-for="(item, index) in tools" :key="item.url" @click="toWebView(item)">
        <view class="item">
          <view class="logo">
            <image :src="item.logo"></image>
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
  </view>
</template>

<script>
import language from './language/index.js'
export default {
  data() {
    return {
      tools: [],
      faucet: [],
      language: language[this.$cache.get('_language')],
      recently: []
    }
  },
  created() {
    this.tools = this.$cache.get('_tools')
    this.faucet = this.$cache.get('_faucet')
  },
  methods: {
    toWebView(item) { // Tools
    
    const itemIndex = this.recently.findIndex(ren => ren.url == item.url)
    item.timeout = Date.now() + 604800000 // 7天过期
    if (itemIndex == -1) {
      this.recently.push(item)
    } else {
      this.recently.splice(itemIndex, 1, item)
    }
    
    this.$cache.set('_recently', this.recently, 0)
    
      uni.navigateTo({
        url: `./webview?jumpUrl=${item.url}`
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .page-wrapper {
    height: 100vh;
    padding-top: calc(112rpx + var(--status-bar-height));
  }
  
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

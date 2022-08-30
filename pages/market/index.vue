<template>
  <view class="market">
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>
    <view class="header">
      <u--input placeholder="搜索DAPP或输入链接访问" prefixIcon="search" prefixIconStyle="font-size: 22px;color: #909399">
      </u--input>
    </view>

    <view class="banner-wrap">
      <div class="banner"></div>
    </view>

    <view class="recently">
      <view class="heade">
        <view class="left">最近</view>
        <view class="right" @click="toRecently">
          <text>全部</text>
          <image src="/static/img/ic-arrow1.png"></image>
        </view>
      </view>
      <view class="content">
        <view class="item" v-for="(item, index) in recently.slice(0, 2)" :key="index">
          <image :src="item.logo"></image>
          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="tools">
      <view class="heade">
        <view class="left">Tools</view>
        <view class="right">
          <text>全部</text>
          <image src="/static/img/ic-arrow1.png"></image>
        </view>
      </view>
      <view class="content" v-for="(item, index) in list" :key="index" @click="toWebView(item)">
        <view class="logo">
          <image :src="item.logo"></image>
        </view>
        <view class="article">
          <view class="title">{{ item.name }}</view>
          <view class="describe">{{ item.des }}</view>
        </view>
      </view>
    </view>
    <tab-bar :current-page="1" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: '区块浏览器',
          des: '这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器这是一个区块浏览器这是一个区块浏览器',
          url: '',
          logo: '/static/img/account/uGHM.png'
        }
      ],
      recently: [ {
        name: '区块浏览器',
        des: '这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器这是一个区块浏览器这是一个区块浏览器',
        url: '',
        logo: '/static/img/account/uGHM.png'
      }]
    }
  },
  created() {
    this.recently = this.$cache.get('_recently') || this.recently
    this.$cache.set('_recently', this.recently, 0)
  },
  methods: {
    toRecently() {
      uni.navigateTo({
        url: './recently'
      })
    },
    toWebView(item) {
      uni.navigateTo({
        url: `./webview?jumpUrl=${'http://www.baidu.com'}`
      })
    }
  }
}
</script>


<style lang="scss" scoped>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .market {
    height: 100vh;
    background-color: #F4F6F9;
  }

  .header {
    height: 112rpx;
    padding: 20rpx 32rpx;
    background-color: #fff;

    /deep/ .u-input {
      background-color: #F4F6F9;
      border-radius: 36rpx;

      input {
        color: #2C365A !important;
      }
    }
  }

  .banner-wrap {
    padding: 12rpx 32rpx 32rpx;
    margin-bottom: 24rpx;
    background-color: #fff;

    .banner {
      height: 240rpx;
      border: 1px solid orange;
    }
  }

  .heade {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      height: 32rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      line-height: 32rpx;
    }

    .right {
      display: flex;
      align-items: center;
      height: 24rpx;
      font-size: 24rpx;
      color: #8397B1;
      letter-spacing: 0;
      line-height: 24rpx;

      image {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }

  .recently {
    height: 240rpx;
    padding: 32rpx;
    background-color: #fff;

    .content {
      display: flex;
      justify-content: space-between;
      margin-top: 24rpx;

      .item {
        display: flex;
        align-items: center;
        width: 324rpx;
        height: 116rpx;
        padding-left: 28rpx;

        background: rgba(131, 151, 177, 0.08);
        border-radius: 16rpx;

        text {
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
        }

        image {
          width: 52rpx;
          height: 52rpx;
          margin-right: 20rpx;
        }
      }
    }
  }

  .tools {
    height: 240rpx;
    padding: 32rpx;
    background-color: #fff;
    margin-top: 24rpx;
    
    .content {
      display: flex;
      align-items: center;
      margin-top: 32rpx;
      .logo {
        margin-right: 24rpx;
        image {
          width: 96rpx;
          height: 96rpx;
        }
      }
      .title {
        height: 28rpx;
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
        line-height: 28rpx;
        margin-bottom: 12rpx;
      }
      .describe {
        font-size: 24rpx;
        color: #8397B1;
        line-height: 36rpx;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
</style>

<template>
  <view class="market">
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>
    <view class="header">
      <u-search :showAction="false" :placeholder="language.text02" shape="round" :clearabled="true" v-model="searchVal" @search="search" searchIcon="/static/img/delegate/search2.png"></u-search>
    </view>

    <view class="banner-wrap">
      <view class="uni-margin-wrap">
        <swiper class="swiper" circular :indicator-dots="indicatorDots" :indicator-color="'rgba(255,255,255,0.55)'" :indicator-active-color="'#fff'" :autoplay="autoplay" :interval="interval"
          :duration="duration">
          <swiper-item v-for="(item, index) in bannerList" :key="index" @click="jump(item.link)">
            <image class="swiper-item" :src="item.url" style="width: 100%"/>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <view class="recently">
      <view class="heade">
        <view class="left">{{ language.text03 }}</view>
        <view class="right" @click="toRecently">
          <text>{{ language.text04 }}</text>
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
          <text>{{ language.text04 }}</text>
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
import language from './language/index.js'
import { getBannerList } from '@/api/token.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      list: [{
        name: '区块浏览器',
        des: '这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器这是一个区块浏览器这是一个区块浏览器',
        url: '',
        logo: '/static/img/account/uGHM.png'
      }],
      recently: [{
        name: '区块浏览器',
        des: '这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器这是一个区块浏览器这是一个区块浏览器',
        url: '',
        logo: '/static/img/account/uGHM.png'
      }],
      bannerList: [],
      background: ['#ff0', '#f00', '#0ff'],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      searchVal: '',
      searchStyle: {
        fontSize: '28rpx',
        color: '#275EF1'
      },
    }
  },
  async created() {
    this.recently = this.$cache.get('_recently') || this.recently
    this.$cache.set('_recently', this.recently, 0)
    const res = (await getBannerList()).data.data.banner.photos.photos
    this.bannerList = res
  },
  methods: {
    toRecently() {
      uni.navigateTo({
        url: './recently'
      })
    },
    toWebView(item) {
      uni.navigateTo({
        url: `./webview?jumpUrl=${'http://localhost:8082/'}`
      })
    },
    jump(link) {
      uni.navigateTo({
        url: `./webview?jumpUrl=${link}`
      })
    },
    search() {}
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
  
  	.uni-margin-wrap {
  		width: 690rpx;
  		width: 100%;
  	}
  	.swiper {
  		height: 300rpx;
      border-radius: 20rpx;
      overflow: hidden;

  	}
  	.swiper-item {
  		display: block;
  		height: 300rpx;
  		line-height: 300rpx;
  		text-align: center;
  	}
  	.swiper-list {
  		margin-top: 40rpx;
  		margin-bottom: 0;
  	}
  	.uni-common-mt {
  		margin-top: 60rpx;
  		position: relative;
  	}
  	.info {
  		position: absolute;
  		right: 20rpx;
  	}
  	.uni-padding-wrap {
  		width: 550rpx;
  		padding: 0 100rpx;
  	}
</style>

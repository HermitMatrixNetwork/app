<template>
  <view class="market">
    <view class="page-header">
      <view class="status_bar">
        <!-- APP下会占用系统原生消息因此需要该占位符 -->
      </view>
      <view class="header">
        <u-search :showAction="false" :placeholder="language.text02" shape="round" :clearabled="true"
          v-model="searchVal" @search="search" searchIcon="/static/img/delegate/search2.png"></u-search>
      </view>
    </view>
    <view class="container">
      <view class="banner-wrap">
        <view class="uni-margin-wrap">
          <swiper class="swiper" circular :indicator-dots="indicatorDots" :indicator-color="'rgba(255,255,255,0.55)'"
            :indicator-active-color="'#fff'" :autoplay="autoplay" :interval="interval" :duration="duration"
            :current="current">
            <swiper-item v-for="(item, index) in bannerList" :key="index" @click="jump(item.link, item)">
              <image class="swiper-item" :src="item.url" style="width: 100%" />
            </swiper-item>
          </swiper>
        </view>
      </view>

      <view class="recently">
        <view class="heade">
          <view class="left">
            <text class="recentl" :class="{ active: tabActive == 0 }" @click="clickItem('recently')">{{ language.text03 }}</text>
            <text class="collect" :class="{ active: tabActive == 1 }" @click="clickItem('collection')">{{ language.text14 }}</text>
          </view>
          <view class="right" @click="toRecently">
            <text>{{ language.text04 }}</text>
            <image src="/static/img/ic-arrow1.png"></image>
          </view>
        </view>
        <view class="content" v-if="tabActive  == 0 ? recently.length : collection.length">
          <view class="item" v-for="(item, index) in (tabActive == 0 ? recently.slice(0, 2) : collection.slice(0, 2))" :key="index" @click="toWebView(item)">
            <image :src="item.logo"></image>
            <text>{{ item.name }}</text>
          </view>
        </view>
        <view class="content" v-else>
          <!-- <text class="no-data">{{ language.text10 }}</text> -->
          <no-data class="no-data"></no-data>
        </view>
      </view>

      <view class="tools">
        <view class="heade">
          <view class="left">Tools</view>
          <view class="right" @click="toTools">
            <text>{{ language.text04 }}</text>
            <image src="/static/img/ic-arrow1.png"></image>
          </view>
        </view>
        <view class="content" v-for="(item, index) in tools" :key="index" @click="toWebView(item)">
          <view class="logo">
            <image :src="item.logo"></image>
          </view>
          <view class="article">
            <view class="title">{{ item.name }}</view>
            <view class="describe">{{ item.des }}</view>
          </view>
        </view>
      </view>
      <view class="tools">
        <view class="heade">
          <view class="left">PriFi</view>
        </view>
        <view class="content">
          <image src="/static/img/prifi.png" style="width: 686rpx;height: 240rpx;;"></image>
        </view>
      </view>
      <view class="tools">
        <view class="heade">
          <view class="left">NFTs</view>
        </view>
        <view class="content">
          <image src="/static/img/nfts.png" style="width: 686rpx;height: 240rpx;;"></image>
        </view>
      </view>
      <view class="tools">
        <view class="heade">
          <view class="left">GameFi</view>
        </view>
        <view class="content">
          <image src="/static/img/gamefi.png" style="width: 686rpx;height: 240rpx;;"></image>
        </view>
      </view>

    </view>

    <tab-bar :current-page="1" />
  </view>
</template>

<script>
import language from './language/index.js'
import {
  getBannerList
} from '@/api/token.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      tools: [{
        name: '区块浏览器',
        des: '这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器，这是一个区块浏览器这是一个区块浏览器这是一个区块浏览器',
        // url: 'http://158.247.237.78/home',
        url: 'http://192.168.0.171:8888',
        logo: '/static/img/account/uGHM.png'
      }],
      recently: [],
      collection: [],
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
      current: 0,
      tabActive: 0,
    }
  },
  async created() {
    this.recently = this.$cache.get('_recently') || []
    
    if (this.recently.length) {
      this.recently = this.recently.filter(item => item.timeout > Date.now())
      this.recently.sort((a, b) => b.timeout - a.timeout)
    }
    
    this.$cache.set('_recently', this.recently, 0)

    // this.tools = this.$cache.get('_tools') || this.tools
    // this.$cache.set('_tools', this.tools, 0)
    const res = (await getBannerList()).data.data.banner.photos.photos
    this.bannerList = res
  },
  onShow() {
    this.collection = this.$cache.get('_collectionList') || []
    if (this.$cache.get('_tempCollection')) {
      const data = this.$cache.get('_tempCollection')
      if (data.collect) { // 收藏
        const alreadyExist = this.collection.find(item => item.url == data.url)
        if (!alreadyExist) {
          const collectData = this.tools.find(item => item.url == data.url)
          this.collection.unshift(collectData)
        }
      } else { // 取消收藏
        const collectIndex = this.collection.findIndex(item => item.url == data.url)
        if (collectIndex > -1) {
          this.collection.splice(collectIndex, 1)
        }
      }
      this.$cache.delete('_tempCollection')
    } 
    this.$cache.set('_collectionList', this.collection, 0)
    

  },
  methods: {
    clickItem(action) {
      this.action = action
      if (action == 'recently') {
        this.tabActive = 0
      } else if (action === 'collection') {
        this.tabActive = 1
      }
    },
    toRecently() {
      if (this.action == 'recently') {
        uni.navigateTo({
          url: './recently'
        })
      } else if (this.action == 'collection') {
        uni.navigateTo({
          url: './collection'
        })
      }
    },
    toTools() {
      uni.navigateTo({
        url: './tools'
      })
    },
    toWebView(item) { // Tools
      // todo 添加进最近访问列表
      const itemIndex = this.recently.findIndex(ren => ren.url == item.url)
      if (itemIndex == -1) {
        item.timeout = Date.now() + 604800 // 7天过期
        this.recently.push(item)
      } else {
        item.timeout = Date.now() + 604800
        this.recently.splice(itemIndex, 1, item)
      }
      
      this.$cache.set('_recently', this.recently, 0)
      
      uni.navigateTo({
        url: `./webview?jumpUrl=${item.url}&name=${item.name}`
      })
    },
    jump(link, item) { // 轮播图
      console.log(item);
      uni.navigateTo({
        url: `./webview?jumpUrl=${link}&name=${item.name}`
      })
    },
    search() {}
  },
  async onPullDownRefresh() {
    const res = (await getBannerList()).data.data.banner.photos.photos
    this.bannerList = res
    this.current = 0
    setTimeout(function() {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  watch: {
    searchVal(val) {
      this.searchVal = val.replace(/[\>\<\"\'\&]/g, '')
    }
  }
}
</script>


<style lang="scss" scoped>
  .page-header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99;
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
    background-color: #F4F6F9;
  }

  .market {
    height: 100vh;
    padding-top: calc(112rpx + var(--status-bar-height));
    // padding-bottom: calc( 120rpx + 56rpx);
    background-color: #F4F6F9;
    // overflow-y: scroll;
    // box-sizing: ;
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
    padding: 32rpx;
    background-color: #fff;
    .heade {
      padding-bottom: 22rpx;
    }
    
    .left {
      display: flex;
      .active {
        &:after {
          display: block;
          content: '';
          height: 2rpx;
          width: 65%;
          background-color: blue;
          margin: 20rpx auto 0;
        }
      }
    }
    .recentl {
      
    }
    
    .collect {
      margin-left: 32rpx;
    }
    
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

  .container {
    // height: calc(100vh - 112rpx - var(--status-bar-height) - 120rpx - 56rpx);
    // overflow-y: scroll;
    padding-bottom: calc(120rpx + 56rpx);
    position: relative;
    z-index: 1;
  }

  /deep/ uni-image>img {
    position: static !important;
  }
  
  .no-data {
    justify-content: center;
    width: 100vw;
    // font-family: PingFangSC-Regular;
    // font-size: 24rpx;
    // color: #8397B1;
    // line-height: 24rpx;
    /deep/ .no-img {
      margin-bottom: 0 !important;
      width: 120rpx !important;
      height: 120rpx !important;
    }
  }
</style>

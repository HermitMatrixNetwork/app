<template>
  <view class="page-wrapper">
   <custom-notify  ref="notify" style="z-index: 99"></custom-notify>
   <!-- :showGoBack="false" -->
   <custom-header  :title="name" :customStyle="{ 'z-index': 98 }">
     <!-- <template #left>
        <view class="back_button">
          <image  @click="goback"  src="/static/img/black.png"  style="width:48rpx;height:48rpx"></image> 
        </view>
      </template> -->
      <template #right>
        <view class="capsule">
          <image src="/static/img/mine/more.png" @click="showup"></image>
          <view class="border"></view>
          <image src="/static/img/mine/close.png" @click="back"></image>
        </view>
      </template>
    </custom-header>
    <iframe v-if="refreshIframe" id="iframe" style="width: 100vw; height: calc(100vh - 112rpx - var(--status-bar-height));" :src="jumpUrl" frameborder="0"></iframe>
     <u-popup class="popup" :show="show" @close="close">
       <view class="popup-top" style="text-align: right; padding: 32rpx 25rpx 0 0;">
         <image src="/static/img/mine/close.png" @click="close" style="width:32rpx; height: 32rpx;"></image>
       </view>
        <view class="control_btn">
            <view class="item" @click="copylink">
              <image src="/static/img/mine/copylink.png" style="width:100rpx; height: 100rpx;"></image>
              <text>{{ language.text12 }}</text>
            </view>
            <view class="item" @click="refresh">
              <image src="/static/img/mine/refresh.png" style="width:100rpx; height: 100rpx;"></image>
              <text>{{ language.text13 }}</text>
            </view>
            <view class="item" @click="collection">
              <image :src="this.isCollect ? '/static/img/mine/collection2.png' : '/static/img/mine/collection.png'" style="width:100rpx; height: 100rpx;"></image>
              <text>{{ this.isCollect ? language.text20 : language.text14 }}</text>
            </view>
        </view>
      </u-popup>
      
      <view :callBack="callBack" :change:callBack="render.localtionBack"></view>
  </view>
</template>

<script>
import uniImageMenu from './share.js'
import language from './language/index.js'
var wv
export default {
  onLoad(options) {
    // console.log(uni.getSystemInfoSync().statusBarHeight)
    this.jumpUrl = options.jumpUrl
    console.log(this.jumpUrl)
    this.name = options.name
    this.collectionList = this.$cache.get('_collectionList') || []
    this.isCollect = this.collectionList.find(item => item.url === this.jumpUrl)
    // // #ifdef APP-PLUS
    // wv = plus.webview.create('', 'custom-webview', {
    //   plusrequire: 'none', //禁止远程网页使用plus的API，有些使用mui制作的网页可能会监听plus.key，造成关闭页面混乱，可以通过这种方式禁止
    //   'uni-app': 'none', //不加载uni-app渲染层框架，避免样式冲突
    //   top: uni.getSystemInfoSync().statusBarHeight + 56 //放置在titleNView下方。如果还想在webview上方加个地址栏的什么的，可以继续降低TOP值
    // })
    // wv.loadURL(options.jumpUrl)
    // // wv.loadURL(this.jumpUrl)
    // var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
    // currentWebview.append(wv) //一定要append到当前的页面里！！！才能跟随当前页面一起做动画，一起关闭
    // setTimeout(function() {
    //   console.log(wv.getStyle())
    // }, 1000) //如果是首页的onload调用时需要延时一下，二级页面无需延时，可直接获取
    // // #endif
  },
  data() {
    return {
      name: '',
      hidden: false,
      firstIn: true,
      show: false,
      refreshIframe: 1,
      callBack: 0,
      language: language[this.$cache.get('_language')],
      collectionList: []
    }
  },
  methods: {
    showup() {
      this.firstIn = false
      this.hidden = false
      this.show = true
      // var that = this
      // var sharedata = {
      //   strShareUrl: 'www.baidu.com',
      //   strShareTitle: 'www.baidu.com',
      //   strShareSummary: 'www.baidu.com',
      //   strShareImageUrl: 'www.baidu.com',
      //   id: 'www.baidu.com'
      // }
      // uniImageMenu.show({
      //   sharedata:sharedata //分享的内容
      // }, index => {
      //   // that.shareNum(index)
      //   //此处是你执行的操作
      // })
    },
    close() {
      this.show = false
      this.hidden = true
    },
    back() {
      uni.navigateBack()
    },
    copylink() {
      uni.setClipboardData({
        data: this.jumpUrl,
        showToast: false,
        success: () => {
          this.show = false
          this.$refs.notify.show('', this.language.text15, { bgColor: '#275EF1' })
        },
        fail: () => {
          // this.$refs.notify.show('error', this.language.copyfailure)
        }
      })
    },
    refresh() {
      this.show = false
      this.refreshIframe = 0
      this.$nextTick(() => {
        this.refreshIframe = 1
      })
    },
    collection() {
      if (!this.isCollect) {
        this.isCollect = true
        this.$refs.notify.show('', this.language.text16, { bgColor: '#275EF1' })
        this.$cache.set('_tempCollection', { url: this.jumpUrl, collect: true }, 0)
      } else {
        this.isCollect = false
        this.$refs.notify.show('', this.language.text17, { bgColor: '#275EF1' })
        this.$cache.set('_tempCollection', { url: this.jumpUrl, collect: false }, 0)
      }
      this.show = false      
    },
    goback() {
      this.callBack++
    }
  }
}
</script>

<script module="render" lang="renderjs">
  export default {
    data() {
      return {
        dom: ''
      }
    },
    mounted() {
      this.dom = document.getElementById('iframe')
    },
    methods: {
      localtionBack(val) {
        if (val == 0) return
        // console.log('123123123', val);
        console.dir(this.dom);
        console.log(this.dom.contentDocument);
        console.log(this.dom.contentWindow.history);
      }
    }
  }
</script>

<style lang="scss" scoped>
  // .status_bar {
  //   height: var(--status-bar-height);
  //   width: 100%;
  // }
  
  /deep/ .u-popup {
    position: fixed;
    z-index: 99999 !important;
    .u-transition {
      z-index: 9999 !important;
    }
  }
  
  .pop-up {
    position: fixed;
    bottom: 0;
    height: 300rpx;
    width: 100vw;
    background-color: #fff;
    
  }
  
  .h0 {
    bottom: -300rpx;
  }
  
  .h300 {
    bottom: 0;
  }
  
  .capsule {
    // width: 200rpx;
    display: flex;
    // rgba(255, 255, 255, .5)
    padding: 10rpx 24rpx;
    border-radius: 27rpx;
    border: 2rpx solid #f4f4f4;
    
    .border {
      margin: 0 20rpx;
      border: 2rpx solid #f4f4f4;

    }
    image {
      width: 32rpx;
      height: 32rpx;
    }
  }
  
  .page-wrapper {
    height: 100vh;
    padding-top: calc(112rpx + var(--status-bar-height));
  }
  
  /deep/ .popup {
    // height: 360rpx;
    .u-popup__content {
      flex-shrink: 0 !important;
      flex-basis: 360rpx !important;
      border-top-right-radius: 16rpx;
      border-top-left-radius: 16rpx;
      background: #F7F8FA;
    }
  }
  
  .control_btn {
    display: flex;
    margin-top: 32rpx;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 50rpx;
      text {
        margin-top: 18rpx;
        font-family: PingFangSC-Regular;
        font-size: 22rpx;
        color: #2C365A;
        text-align: center;
      }
    }
  }
</style>

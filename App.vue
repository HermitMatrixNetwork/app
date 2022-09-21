<script>
import {
  isTor
} from '@/utils/index.js'
import {
  MINERS_GAS,
  DEFAULT_RPC
} from '@/config/index.js'
export default {
  data() {
    return {
      language: {
        CN: {
          // text01: '请开启洋葱代理服务器'
        },
        EN: {
          // text01: 'Please open onion proxy server!'
        }
      }
    }
  },
  async onLaunch() {
    uni.hideTabBar({
      animation: false
    })
    if (this.$cache.get('_currentWallet') == null) {
      uni.clearStorageSync()
    }
    this.$cache.get('_language') || this.$cache.set('_language', 'CN', 0)
    this.$cache.get('_addressBook') || this.$cache.set('_addressBook', [], 0)
    this.$cache.get('_touchId') || this.$cache.set('_touchId', 0, 0)
    this.$cache.get('_MINERS_GAS') || this.$cache.set('_MINERS_GAS', MINERS_GAS, 0)
    this.$cache.get('_currentRpc') || this.$cache.set('_currentRpc', DEFAULT_RPC.link, 0)
    // 0 表示第一次进入
    this.$cache.get('_appInit') || this.$cache.set('_appInit', 0, 0)
    let _appInit = this.$cache.get('_appInit')
    console.log('_appInit', _appInit)
    // #ifdef APP-PLUS
    if (this.$cache.get('_currentWallet') == null) { // 本地缓存没有钱包（直接进入首页）
      console.log(2)
      this.$cache.set('_agree_protocol', false, 0)
      uni.reLaunch({
        url: '/pages/index/index',
        success: () => {
          plus.navigator.closeSplashscreen()
        }
      })
    } else if (_appInit == 0 && this.$cache.get('_touchId') == 1) { // 本地缓存有钱包 且开启了指纹锁
      console.log(3)
      uni.navigateTo({
        url: '/pages/mine/anquan/backgroundVerify?redirectUrl=/pages/account/index&type=reLaunch',
        animationType: 'none',
        success: () => {
          plus.navigator.closeSplashscreen()
        }
      })
    } else if (_appInit !== 1) { // 本地缓存有钱包 且没有开启指纹锁
      console.log(4)
      uni.reLaunch({
        url: '/pages/account/index',
        success: () => {
          plus.navigator.closeSplashscreen()
        }
      })
    }
    // #endif

  },
  async onShow() {
    uni.hideTabBar({
      animation: false
    })
    var pages = getCurrentPages()
    var page = pages[pages.length - 1]
    // #ifdef APP-PLUS
    if (this.$cache.get('_appInit') == 1) {
      // const _appInit = this.$cache.get('_appInit')
      // 从后台唤起
      if (this.$cache.get('_touchId') == 1) {
        uni.navigateTo({
          url: '/pages/mine/anquan/backgroundVerify?redirectUrl=',
          animationType: 'none',
          success: () => {
            plus.navigator.closeSplashscreen()
          }
        })
      } else if (this.$cache.get('_currentWallet') !== null && !page) {
        uni.reLaunch({
          url: '/pages/account/index',
          success: () => {
            plus.navigator.closeSplashscreen()
          }
        })
  
      }
      this.$cache.set('_appInit', 0, 0)
    }
    // #endif
  },
  onHide() {
    this.$cache.set('_appInit', 1, 0)
  }
}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
  /deep/ .uni-body {
    // height: auto !important;
    // overflow-y: scroll;
  }
</style>

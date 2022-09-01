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
      isTor: false,
      language: {
        CN: {
          text01: '请开启洋葱代理服务器'
        },
        EN: {
          text01: 'Please open onion proxy server!'
        }
      }
    }
  },
  async onLaunch() {
    this.$cache.get('_language') || this.$cache.set('_language', 'CN', 0)
    this.$cache.get('_addressBook') || this.$cache.set('_addressBook', [], 0)
    this.$cache.get('_touchId') || this.$cache.set('_touchId', 0, 0)
    this.$cache.get('_MINERS_GAS') || this.$cache.set('_MINERS_GAS', MINERS_GAS, 0)
    this.$cache.get('_currentRpc') || this.$cache.set('_currentRpc', DEFAULT_RPC.link, 0)
      
    // #ifdef APP-PLUS
    // 判断是否是被洋葱代理服务代理
    this.isTor = await isTor()

    if (!this.isTor) {
      uni.reLaunch({
        url: '/pages/index/index',
        success: () => {
            
          plus.navigator.closeSplashscreen()
            
        }
      })
    } 
    // #endif
      
    // if (!this.isTor && this.$cache.get('_currentWallet') == null) {
    //   uni.clearStorageSync()
    //   this.$cache.set('_agree_protocol', false, 0)
    //   uni.reLaunch({
    //     url: '/pages/index/index',
    //     success: () => {
    //       // #ifdef APP-PLUS
    //       plus.navigator.closeSplashscreen()
    //       // #endif
    //     }
    //   })
    // } else {
    //   uni.reLaunch({
    //     url: '/pages/account/index',
    //     success: () => {
    //       // #ifdef APP-PLUS
    //       plus.navigator.closeSplashscreen()
    //       // #endif
    //     }
    //   })
    // }
  },
  async onShow() {
    uni.hideTabBar()
    // #ifdef APP-PLUS
    this.isTor = await isTor()
    if (!this.isTor) {
      uni.showToast({
        title: this.language[this.$cache.get('_language')].text01,
        icon: 'none'
      })
      // uni.reLaunch({
      //   url: '/pages/index/index',
      //   success: () => {

      //     plus.navigator.closeSplashscreen()

      //   }
      // })

      setTimeout(() => {
        // plus.runtime.quit()
      }, 1500)
    }
    // #endif
  }
}
</script>

<style lang="scss">
  /*每个页面公共css */
  @import "@/uni_modules/uview-ui/index.scss";
</style>

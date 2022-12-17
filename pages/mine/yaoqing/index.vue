<template>
  <view class="page-wrapper">
    <custom-header :title="language.text128" :customStyle="{ 'z-index': 99 }">
      <template #right>
        <view class="right">
          <image src="/static/img/mine/download.png" @click="save"></image>
          <image src="/static/img/mine/share.png" @click="share"></image>
        </view>
      </template>
    </custom-header>
      
    <view class="content">
      <image :src='`/static/img/mine/bg_${currentLnaguage}.png`' mode="aspectFill" ></image>
<!--      <view class="qrcode">
        <tki-qrcode ref="qrcode" :val="code.val" :size="code.size" :icon="code.icon" :unit="code.upx" :onval="code.onval"
          :loadMake="code.loadMake" :loadingText="language.text129" />
        <view class="tip-download">扫描二维码下载</view>
        <view class="dashbord">
        </view>
        <view class="tip-banner">让隐私成为一种选择</view>
      </view> -->
    </view>
    
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
// import tkiQrcode from 'tki-qrcode'
import language from '../language/index.js'
export default {
  // components: {
  //   tkiQrcode
  // },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      currentLnaguage: this.$cache.get('_language'),
      code: {
        //二维码参数
        val: 'www.baidu.com', //二维码的数据
        size: 208, //二维码大小
        unit: 'rpx', //二维码大小的单位
        icon: '/static/img/mine/qrlogo.png', //二维码中间的logo地址
        iconSize: 40, //二维码中间的logo大小
        onval: true, //val值变化时自动重新生成二维码
        loadMake: true //组件加载完成后自动生成二维码
      },
    }
  },
  methods: {
    share() {
      this.$cache.set('_donotVerify', true, 0)
      plus.share.sendWithSystem({
        type: 'image',
        pictures: [`/static/img/mine/bg_${this.currentLnaguage}.png`]
      }, () => {
        console.log('success')
      }, () => {
        console.log('error')
      })
    },
    save() {
      uni.saveImageToPhotosAlbum({
        filePath: `/static/img/mine/bg_${this.currentLnaguage}.png`,
        success: () => {
          this.$refs.uToast.show({
            type: 'default',
            message: this.language.text130,
          })
        },
        fail: () => {
          console.log('fail')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.right {
  height: 112rpx;
  display: flex;
  align-items: center;
  image {
    width: 44rpx;
    height: 44rpx;
    margin-left: 24rpx;
  }
}

.page-wrapper {
  padding-top: calc(112rpx + var(--status-bar-height));
  height: 100vh;
}

.content {
  position: relative;
  height: 1630rpx;
  // height: calc(100vh - 112rpx - var(--status-bar-height));
  width: 100vw;
  text-align: center;
  image {
    height: 100%;
    width: 100%;
  }
}

.qrcode {
  position: absolute;
  bottom: 5vh;
  left: 50%;
  transform: translateX(-50%);
}

.tip-download {
  margin-top: 48rpx;
  opacity: 0.7;
  font-family: AlibabaPuHuiTi_2_45_Light;
  font-weight: 300;
  font-size: 28rpx;
  color: #FFFFFF;
  text-align: center;
}

.dashbord {
  opacity: 0.7;
  border: 1rpx dashed #fff;
  width: 100vw;
  margin: 10rpx 0 64rpx;
}

.tip-banner {
  font-family: AlibabaPuHuiTi_2_65_Medium;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
  letter-spacing: 0;
  text-align: center;
}
</style>

<template>
  <view class="receive">
    <custom-header :title="language.text60" class="headerStyle"></custom-header>

    <view class="topPrompt">
      <view class="promptBg" />
      <view class="promptText">
        <image src="/static/img/account/prompt.png" style="width: 32rpx;height: 32rpx;"></image>
        {{ language.text52 }}
      </view>
    </view>

    <view class="receive_main">
      <view class="hint">
        {{ language.text53 }}
      </view>

      <view class="qrcode">
        <tki-qrcode ref="qrcode" :val="code.val" :size="code.size" :unit="code.upx" :onval="code.onval"
          :loadMake="code.loadMake" @result="qrR" :loadingText="language.text222" />
      </view>

      <text>{{ language.text54 }}</text>
      <view class="wallet_address">
        {{currentWallet.address}}
      </view>


      <view class="copy_btn">
        <view @click="copy(code['val'])">
          <image src="/static/img/account/copy2.png" style="width: 40rpx;height: 40rpx; margin-right:8rpx;"></image>
          <text style="font-size:28rpx; margin:0;">{{ language.text55 }}</text>
        </view>
        <view @click="capture">
          <image src="/static/img/account/mipmap-mdpi_copy2.png" style="width: 40rpx;height: 40rpx; margin-right:8rpx;">
          </image>
          <text style="font-size:28rpx; margin:0;">{{ language.text214 }}</text>
        </view>
      </view>

    </view>
    <view class="bottom_title">
      Hermit Wallet
    </view>
    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import tkiQrcode from 'tki-qrcode'
import mixin from './mixins/index.js'
import language from './language/index.js'
export default {
  mixins: [mixin],
  components: {
    tkiQrcode
  },
  data() {
    return {
      currentWallet: this.$cache.get('_currentWallet'),
      code: {
        //二维码参数
        val: '', //二维码的数据
        size: 368, //二维码大小
        unit: 'rpx', //二维码大小的单位
        icon: '', //二维码中间的logo地址
        iconSize: 40, //二维码中间的logo大小
        onval: true, //val值变化时自动重新生成二维码
        loadMake: true //组件加载完成后自动生成二维码
      },
      qrUrl: '',
      language: language[this.$cache.get('_language')]
    }
  },
  onLoad() {
    this.code.val = this.currentWallet.address
  },
  methods: {
    qrR(res) {
      this.qrUrl = res
    },
    //生成当前页面图片
    capture() {
      var pages = getCurrentPages() //获取当前页面信息
      var page = pages[pages.length - 1]
      var bitmap = null
      var currentWebview = page.$getAppWebview()
      bitmap = new plus.nativeObj.Bitmap('amway_img')
      // 将webview内容绘制到Bitmap对象中
      let _this = this
      currentWebview.draw(bitmap, function() {
        // console.log('截屏绘制图片成功');
        //这里我将文件名用四位随机数拼接了，不然会出现当前图片替换上一张图片只能保存一张图片的问题
        let rand = Math.floor(Math.random() * 10000)
        let saveUrl = '_doc/' + rand + 'a.jpg'
        bitmap.save(saveUrl, {}, function(i) {
          // console.log('保存图片成功：' + JSON.stringify(i));
          uni.share({
            provider: 'weixin',
            scene: 'WXSceneSession',
            type: 2,
            imageUrl: saveUrl,
            complete() {
              uni.showToast({
                title: _this.language.text223
              })
              uni.saveImageToPhotosAlbum({
                filePath: i.target,
                success: function() {
                  // bitmap.clear() //销毁Bitmap图片
                }
              })
            }
          })

        }, function(e) {
          console.log('保存图片失败：' + JSON.stringify(e))
        })
      }, function(e) {
        console.log('截屏绘制图片失败：' + JSON.stringify(e))
      })
      //currentWebview.append(amway_bit);
    },
  }
}
</script>

<style lang="scss" scoped>
  .headerStyle {
    background-color: #0F53C5;
    z-index: 999;
    /deep/ .container {
      .center {
        text {
          color: #FFFFFF !important;
        }
      }

      .u-icon__icon {
        color: #FFFFFF !important;
      }
    }
  }


  .receive {
    width: 100%;
    padding-top: calc(112rpx + var(--status-bar-height));
    background: #0F53C5;

    .topPrompt {
      position: relative;

      .promptBg {
        margin: 0 32rpx;
        height: 180rpx;
        opacity: 0.2;
        background: #FFFFFF;
        border: 2rpx solid #E5E6EB;
        box-shadow: 0 8rpx 10rpx 0 rgba(0, 0, 0, 0.10);
        border-radius: 16rpx;
      }
    }

    .promptText {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: flex-start;
      width: 568rpx;
      height: 120rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 28rpx;
      color: #FFFFFF;
      line-height: 40rpx;

      image {
        flex-shrink: 0;
        margin: 8rpx 16rpx 0 0;
      }

      /deep/ .u-icon__img {}
    }
  }

  .receive_main {
    margin: 0 32rpx;
    height: 952rpx;
    margin-top: 32rpx;
    // background: #F5F6FA;
    background: #FFFFFF;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

    .hint {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 28rpx;
      color: #8397B1;
      margin-top: 60rpx;
      text-align: center;
    }

    .qrcode {
      width: 428rpx;
      height: 428rpx;
      background-image: url('@/static/img/account/border.png');
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    text {
      height: 24rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 24rpx;
      color: #8397B1;
      line-height: 24rpx;
      margin-top: 62rpx;
    }

    .wallet_address {
      width: 532rpx;
      height: 80rpx;
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 28rpx;
      color: #2C365A;
      text-align: center;
      line-height: 40rpx;
      word-wrap: break-word;
      margin-top: -30rpx;
    }

    .copy_btn {
      height: 120rpx;
      width: 100%;
      border: none;
      outline: none;
      font-family: PingFangSC-Regular;
      color: #8397B1;
      letter-spacing: 0;
      font-weight: 400;
      font-size: 28rpx;
      background: #f5f7fb;
      display: flex;
      align-items: center;
      justify-content: center;

      >view {
        flex: 1;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        &:first-child {
          border-right: 1px solid #748BAA;
        }
      }
    }
  }


  .bottom_title {
    padding: 96rpx 0;
    font-family: AlibabaPuHuiTi-Bold;
    font-weight: Bold;
    font-size: 44rpx;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
  }
</style>

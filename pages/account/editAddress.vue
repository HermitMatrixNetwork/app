<template>
  <view class="address_pages">
    <custom-header :title="language.text12" :customStyle="headerStyle">
      <template #right>
        <text class="save" @click="saveAddress">{{ language.text43 }}</text>
      </template>
    </custom-header>
    <view class="main">
      <view style="position: relative;">
        <InputTitle :title="language.text05" :placeholder="language.text06" :isTextarea="true" ref="textarea"
          :inputVal.sync="book.walletAddress">
          <template #inputRight>
            <view class="scan">
              <image src="/static/img/account/mipmap-mdpi_saoma.png" @click="scanCode" style="width: 44rpx;height: 44rpx;"></image>
            </view>
          </template>
        </InputTitle>
      </view>
      <text class="errorTip" :style="{ opacity: showAddressError ? 1 : 0 }" v-text="language[addressError]"> </text>

      <InputTitle :title="language.text88"  isTextarea :isAutoHeight="$cache.get('_language') == 'CN'" :placeholder="language.text07" :inputVal.sync="book.walletName"></InputTitle>
      <text class="errorTip" :style="{ opacity: showWalletNameErrorTip ? 1 : 0 }">{{ language[walletNamerError] }}</text>
      <InputTitle style="margin-top: 32rpx;" isTextarea :isAutoHeight="$cache.get('_language') == 'CN'" :title="language.text87" :placeholder="language.text08" :inputVal.sync="book.walletDescribe"></InputTitle>
      <text class="errorTip" :style="{ opacity: walletDescribeError ? 1 : 0 }">{{ language.text121 }}</text>
    </view>
    <u-button class="btn" @click="deleteBook">{{ language.text15 }}</u-button>
    
    <u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
      <view class="modalContent">
        <image src="/static/img/tishi2.png" style="width: 64rpx; height: 64rpx;"></image>
        <view class="modal-title">{{ language.text89 }}</view>
        <text class="modal-content">{{ language.text16 }}</text>
        <view class="con_btn">
          <button @click="aa = false" class="con_btn_cancel">{{ language.text17 }}</button>
          <button @click="conConfim" class="con_btn_confirm" style="background-color: #002FA7;">{{ language.text29 }}</button>
        </view>
      </view>
    </u-modal>
    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import InputTitle from './send/components/Input-title.vue'
import language from '@/pages/mine/language/index.js'
import { checkAddress } from '@/utils/index.js'
export default {
  components: {
    InputTitle
  },
  onLoad(options) {
    this.book = JSON.parse(options.book)
  },
  data() {
    return {
      book: {},
      // walletName: '', //钱包名称
      // walletDescribe: '', //钱包描述
      // walletAddress: '', // 钱包地址
      headerStyle: {
        background: '#FFFFFF'
      },
      showAddressError: false,
      showWalletNameErrorTip: false,
      walletDescribeError: false,
      language: language[this.$cache.get('_language')],
      aa: false,
      walletNamerError: 'text101', // text101, text116 '钱包地址不能为空', '钱包名称不能超过10个字符'
      addressError: 'text100' // 钱包地址不能为空
    }
  },
  methods: {
    saveAddress() {
      const addressBook = this.$cache.get('_addressBook')
      
      if (this.book.walletAddress.trim() == '') {
        this.showAddressError = true
        this.addressError = 'text100'
      } else if (!checkAddress(this.book.walletAddress)) {
        this.showAddressError = true
        this.addressError = 'text120'
      } else {
        const bookIndex = addressBook.findIndex(item => item.walletAddress == this.book.walletAddress)
        if (addressBook.find((item, index) => bookIndex !== index && item.walletAddress == this.book.walletAddress)) {
          this.showAddressError = true
          this.addressError = 'text104'
        } else {
          this.showAddressError = false
        }
      }
      


      if (this.book.walletName.trim() == '') {
        this.showWalletNameErrorTip = true
        this.alletNamerError = 'text101'
      } else if (this.book.walletName.trim().length > 10) {
        this.showWalletNameErrorTip = true
        this.walletNamerError = 'text116'
      } else {
        this.showWalletNameErrorTip = false
      }
      
      if (this.book.walletDescribe.trim().length > 20) {
        this.walletDescribeError = true
      } else {
        this.walletDescribeError = false
      }
      
      if (!this.showWalletNameErrorTip && !this.showAddressError && !this.walletDescribeError) {
        const index = addressBook.findIndex(item => item.walletAddress == this.book.walletAddress)

        addressBook.splice(index, 1, this.book)

        this.$cache.set('_addressBook', addressBook, 0)

        this.$refs.notify.show('', this.language.text30, { bgColor: ' #275EF1' })
              
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    },
    conConfim() {
      this.aa = false
      const addressBook = this.$cache.get('_addressBook')
      
      const index = addressBook.findIndex(item => item.walletAddress == this.book.walletAddress)
      
      if (index > -1) {
        addressBook.splice(index, 1)
      
        this.$cache.set('_addressBook', addressBook, 0)
      
        this.$refs.notify.show('', this.language.text18, { bgColor: ' #275EF1' })
      
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } else {
      
        // this.$refs.uToast.show({
        //   type: 'error',
        //   message: '移除地址失败,请稍后再试'
        // })
      }
    },
    scanCode() { //扫码
      this.$cache.set('_donotVerify', true, 0)
      var mpaasScanModule = uni.requireNativePlugin('Mpaas-Scan-Module')
      mpaasScanModule.mpaasScan({
        // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
        'scanType': ['qrCode'],
        // 是否隐藏相册，默认false不隐藏
        'hideAlbum': false
      },
      (ret) => {
        // 返回值中，resp_code 表示返回结果值，10：用户取消，11：其他错误，1000：成功
        // 返回值中，resp_message 表示返回结果信息
        // 返回值中，resp_result 表示扫码结果，只有成功才会有返回
        // console.log('扫码',ret);
        // this.$cache.set('_donotVerify', false, 0)
        if (ret.resp_code == 1000) {
          this.$refs.textarea.childValue = ret.resp_result
        }
      })
      // uni.scanCode({
      //   onlyFromCamera: false,
      //   scanType: ['qrCode'],
      //   success: (res) => {
      //     if (res.scanType == 'EAN_8') {
      //       uni.showToast({
      //         title: 'Error',
      //         icon : 'none'
      //       })
      //     } else {
      //       this.$refs.textarea.childValue = res.result
      //     }
      //   },
      //   complete: (res) => {
      //     console.log('complete ')
      //     this.$cache.set('_donotVerify', false, 0)
      //     if (this.$cache.get('_touchId') == 1) {
      //       uni.navigateTo({
      //         url: '/pages/mine/anquan/backgroundVerify',
      //         animationType: 'none',
      //         success: () => {
      //           plus.navigator.closeSplashscreen()
      //         }
      //       })
      //     }
      //   }
      // })
    },
    deleteBook() {
      this.aa = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .address_pages {
    height: 100vh;
    background: #F4F6FA;
    padding-top: calc(112rpx + var(--status-bar-height));
  }

  .main {
    padding: 32rpx 32rpx 48rpx;
    background: #FFFFFF;

    view {

      &:nth-child(2),
      &:nth-child(3) {
        margin-top: 32rpx;
      }
    }
  }

  .save {
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 28rpx;
    color: #1E5EFF;
    letter-spacing: 0;
    line-height: 28rpx;
  }

  .scan {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 32rpx;
  }

  .errorTip {
    margin-top: 8rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #EC2828;
    letter-spacing: 0;
    line-height: 24rpx;
    height: 24rpx;
  }

  .btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    border-radius: 16rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #EC2828;
  }
  
  /deep/ .u-button--active::before {
    opacity: 0 !important;
  }
  
  /deep/ .hintModal {
    .u-modal {
    }
  
    .u-modal__content {
      padding: 32rpx;
      padding-top: 48rpx !important;
      width: 100%;
      flex-direction: column !important;
    }
  
    .modalContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
  
      .modal-title {
        font-weight: 600;
        font-size: 32rpx;
        color: #2C365A;
        margin-top: 32rpx;
      }
  
      .modal-content {
        width: 564rpx;
        font-size: 28rpx;
        color: #8397b1;
        line-height: 42rpx;
        margin-top: 32rpx;
        margin-bottom: 48rpx;
        text-align: center;
      }
      
      .con_btn {
        display: flex;
        justify-content: space-between;
        width: 100%;
        
        &_cancel {
          font-size: 32rpx;
          color: #8397B1;
          background-color: #fff;
          border: 2px solid rgba(131,151,177,0.30);
          
          &:after {
            border: 0 !important;
          }
        }
        
        &_confirm {
          font-size: 32rpx;
          color: #FCFCFD;
        }
      }
      
      uni-button {
        margin: 0 !important;
        width: 272rpx;
        height: 96rpx;
        font-size: 32rpx;
        line-height: 96rpx;
        border-radius: 16rpx;
      }
    }
  }
</style>

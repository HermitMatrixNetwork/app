<template>
  <view class="address_pages">
    <custom-header :title="language.text04" :customStyle="headerStyle">
      <template #right>
        <text class="save" @click="saveAddress">{{ language.text38 }}</text>
      </template>
    </custom-header>
    <view class="main">
      <view style="position: relative;">
        <InputTitle :title="language.text05" :placeholder="language.text06" :isTextarea="true" ref="textarea"
          :inputVal.sync="walletAddress">
          <template #inputRight>
            <view class="scan">
              <image src="/static/img/account/mipmap-mdpi_saoma.png" style="width: 44rpx;height: 44rpx;" @click="scanCode"></image>
            </view>
          </template>
        </InputTitle>
      </view>
      <text class="errorTip" :style="{ opacity: (showAddressErrorTipEmpty || showAddressErrorTipDuplicate) ? 1 : 0 }" v-text="showAddressErrorTipEmpty ? language.text101 : showAddressErrorTipDuplicate ? language.text104 : '1' "> </text>
      <InputTitle :title="language.text88" :placeholder="language.text07" :inputVal.sync="walletName"></InputTitle>
      <text class="errorTip" :style="{ opacity: showWalletNameErrorTip ? 1 : 0 }">{{ language.text100 }}</text>
      <InputTitle :title="language.text87" :placeholder="language.text08" :inputVal.sync="walletDescribe"></InputTitle>
    </view>

    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import InputTitle from './send/components/Input-title.vue'
import language from '@/pages/mine/language/index.js'
export default {
  components: {
    InputTitle
  },
  data() {
    return {
      walletName: '', //钱包名称
      walletDescribe: '', //钱包描述
      walletAddress: '', // 钱包地址
      headerStyle: {
        background: '#FFFFFF'
      },
      showAddressErrorTipEmpty: false,
      showAddressErrorTipDuplicate: false,
      showWalletNameErrorTip: false,
      language: language[this.$cache.get('_language')],
    }
  },
  methods: {
    saveAddress() {
      const addressBook = this.$cache.get('_addressBook')

      if (this.walletName.trim() == '') {
        this.showWalletNameErrorTip = true
      } else {
        this.showWalletNameErrorTip = false
      }

      if (this.walletAddress.trim() == '') {
        this.showAddressErrorTipEmpty = true
      } else {
        this.showAddressErrorTipEmpty = false
      }

      if (addressBook.find(item => item.walletAddress == this.walletAddress)) {
        this.showAddressErrorTipDuplicate = true
      } else {
        this.showAddressErrorTipDuplicate = false
      }

      if (!this.showWalletNameErrorTip && !this.showAddressErrorTipEmpty && !this.showAddressErrorTipDuplicate) {
        addressBook.push({
          walletName: this.walletName,
          walletDescribe: this.walletDescribe,
          walletAddress: this.walletAddress
        })

        this.$cache.set('_addressBook', addressBook, 0)

        this.$refs.notify.show('', this.language.text10, { bgColor: '#275EF1' })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    },
    scanCode() { //扫码
      uni.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: (res) => {
          this.$refs.textarea.childValue = res.result
        },
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .address_pages {
    height: 100vh;
    background: #F4F6FA;
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
</style>

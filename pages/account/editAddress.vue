<template>
  <view class="address_pages">
    <custom-header :title="'编辑地址'" :customStyle="headerStyle">
      <template #right>
        <text class="save" @click="saveAddress">保存</text>
      </template>
    </custom-header>
    <view class="main">
      <view style="position: relative;">
        <InputTitle :title="'地址信息'" :placeholder="'请输入地址'" :isTextarea="true" ref="textarea" disabled
          :inputVal.sync="book.walletAddress">
          <template #inputRight>
            <view class="scan">
              <u-icon :name="require('@/static/img/account/mipmap-mdpi_saoma.png')" size="44rpx" @click="scanCode">
              </u-icon>
            </view>
          </template>
        </InputTitle>
      </view>
      <text class="errorTip" v-if="showAddressErrorTipEmpty">{{ language['addressErrorTipEmpty'] }}</text>
      <text class="errorTip" v-if="showAddressErrorTipDuplicate">{{ language['addressErrorTipDuplicate'] }}</text>
      <InputTitle :title="'钱包名称'" :placeholder="'设置钱包名称（不超过10个字符）'" :inputVal.sync="book.walletName"></InputTitle>
      <text class="errorTip" v-if="showWalletNameErrorTip">{{ language['walletNameErrorTipEmpty'] }}</text>
      <InputTitle :title="'描述'" :placeholder="'描述（选填，不超过20个字符）'" :inputVal.sync="book.walletDescribe"></InputTitle>
    </view>
    <u-button class="btn" @click="deleteBook">移除地址</u-button>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import InputTitle from './send/components/Input-title.vue'
import language from './language/index.js'
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
      showAddressErrorTipEmpty: false,
      showAddressErrorTipDuplicate: false,
      showWalletNameErrorTip: false,
      language: language[this.$cache.get('_language')],
    }
  },
  methods: {
    saveAddress() {
      const addressBook = this.$cache.get('_addressBook')

      if (this.book.walletName.trim() == '') {
        this.showWalletNameErrorTip = true
      } else {
        this.showWalletNameErrorTip = false
      }

      if (!this.book.showWalletNameErrorTip) {
        const index = addressBook.findIndex(item => item.walletAddress == this.book.walletAddress)

        addressBook.splice(index, 1, this.book)

        this.$cache.set('_addressBook', addressBook, 0)

        this.$refs.uToast.show({
          type: 'success',
          message: '保存地址成功',
          complete() {
            uni.navigateBack()
          }
        })
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
    },
    deleteBook() {
      this.$refs.uToast.hide()
      const addressBook = this.$cache.get('_addressBook')

      const index = addressBook.findIndex(item => item.walletAddress == this.book.walletAddress)

      if (index > -1) {
        addressBook.splice(index, 1)

        this.$cache.set('_addressBook', addressBook, 0)

        this.$refs.uToast.show({
          type: 'success',
          message: '移除地址成功',
          complete() {
            uni.navigateBack()
          }
        })
      } else {

        this.$refs.uToast.show({
          type: 'error',
          message: '移除地址失败,请稍后再试'
        })
      }

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
</style>

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
      <text class="errorTip" :style="{ opacity: showAddressError ? 1 : 0 }" v-text="language[addressError]"> </text>
      <!-- <InputTitle @textareaFocus="textareaFocus" @textareaBlur="textareaBlur" ref="walletNameTextarea" :title="language.text88" :inputVal.sync="walletName" isTextarea :class="{ 'wallet-name-input': walletName == language.text07 }"></InputTitle> -->
      <view class="label-title">{{ language.text88 }}</view>
			<u--textarea v-model="walletName" :placeholder="language.text07" maxlength="60" class="textarea" :autoHeight="$cache.get('_language') == 'CN'"></u--textarea>
			<text class="errorTip" :style="{ opacity: showWalletNameErrorTip ? 1 : 0 }">{{ language[walletNamerError] }}</text>
      <InputTitle style="margin-top: 32rpx;" isTextarea :isAutoHeight="$cache.get('_language') == 'CN'" :title="language.text87" :placeholder="language.text08" :inputVal.sync="walletDescribe"></InputTitle>
      <text class="errorTip" :style="{ opacity: showWalletDescribeErrorTip ? 1 : 0 }">{{ language.text117 }}</text>
    </view>

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
  data() {
    return {
      walletName: '', //钱包名称 placeholder:language.text07
      walletDescribe: '', //钱包描述
      walletAddress: '', // 钱包地址
      headerStyle: {
        background: '#FFFFFF'
      },
      showAddressError: false,
      showWalletNameErrorTip: false,
      showWalletDescribeErrorTip: false,
      language: language[this.$cache.get('_language')],
      addressError: 'text104',
      walletNamerError: 'text101', // text101, text116 '钱包名字不能为空', '钱包名称不能超过10个字符'
    }
  },
  methods: {
    textareaFocus() {
      // if (this.$refs.walletNameTextarea.childValue == this.language.text07) {
      // 	this.$refs.walletNameTextarea.childValue = ''
      // }
    },
    textareaBlur() {
      // if (this.$refs.walletNameTextarea.childValue.trim() == '') {
      // 	this.$refs.walletNameTextarea.childValue = this.language.text07
      // }
    },
    saveAddress() {
      const addressBook = this.$cache.get('_addressBook')

      if (this.walletName.trim() == '') {
        this.showWalletNameErrorTip = true
        this.walletNamerError = 'text101'
      } else if (this.walletName.trim().length > 10) {
        this.showWalletNameErrorTip = true
        this.walletNamerError = 'text116'
      } else {
        this.showWalletNameErrorTip = false
      }

      if (this.walletAddress.trim() == '') {
        this.showAddressError = true
        this.addressError = 'text100' // '钱包地址不能为空'
      } else if (addressBook.find(item => item.walletAddress == this.walletAddress)){
        this.showAddressError = true
        this.addressError = 'text104' // '钱包地址已存在，请勿重复添加'
      } else if (!checkAddress(this.walletAddress)) {
        this.showAddressError = true
        this.addressError = 'text120' // '地址无效，请检查后重新输入',
      } else {
        this.showAddressError = false
      }
      
      if (this.walletDescribe.trim().length > 20) {
        this.showWalletDescribeErrorTip = true
      } else {
        this.showWalletDescribeErrorTip = false
      }

      if (!this.showWalletDescribeErrorTip && !this.showWalletNameErrorTip && !this.showAddressErrorTipEmpty && !this.showAddressErrorTipDuplicate) {
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
	
	/deep/ .wallet-name-input {
		.uni-textarea-textarea {
			color: #8397B1;
		}
	}
	
	.label-title {
		font-weight: 600;
		font-size: 28rpx;
		color: #2C365A;
		letter-spacing: 0;
	}
	
	//自动换行input
	.textarea {
	  /deep/ .u-textarea__field {
	    line-height: 60rpx !important;
	    font-size: 28rpx;
	    color: #2C365A;
	  }
	
	  /deep/ .uni-textarea-wrapper {
	    width: 560rpx !important;
	  }
	}
	
	.u-textarea {
	  background: #F2F4F8 !important;
	  margin-top: 16rpx;
	  padding: 18rpx 32rpx;
	
	  .uni-textarea-placeholder {
	    color: #8397B1 !important;
	    font-size: 28rpx !important;
	  }
	}
	
	.u-textarea--radius {
	  border-radius: 16rpx;
	}
</style>

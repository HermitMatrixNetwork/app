<template>
  <view class="container">
    <custom-header tabUrl="/pages/account/index" class="header" :title="language.text175"></custom-header>

    <view class="wallet-detail">
      <view class="wallet-detail-address item">
        <view class="label-address label">{{ language.text54 }}</view>
        <view class="item-address">{{ wallet.address }}</view>
      </view>
      <view class="border"></view>
      <view class="wallet-detail-name item" @click="clickItem('editName')">
        <text class="label-name label left">{{ language.text117 }}</text>
        <view class="right">
          <text class="item-name">{{ wallet.name }}</text>
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
      <view class="wallet-detail-name item" @click="toResetPassword">
        <text class="label-name label left">{{ language.text146 }}</text>
        <view class="right">
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
    </view>

    <view class="export-detail">
      <view v-show="wallet.mnemonic" class="export-detail-mnemonic item" @click="clickItem('Mnemonic')">
        <view class="label">
          {{ language.text119 }}
        </view>
        <view class="right">
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
      <view class="border"></view>
      <view class="export-detail-privatekey item" @click="clickItem('Privatekey')">
        <view class="label">
          {{ language.text120 }}
        </view>
        <view class="right">
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
      <view class="border"></view>
      <view class="export-detail-keystore item" @click="clickItem('Keystore')">
        <view class="label">
          {{ language.text121 }}
        </view>
        <view class="right">
          <image src="@/static/img/ic-arrow1.png" class="arrow-right"></image>
        </view>
      </view>
    </view>

    <uni-button class="remove-wallet-btn" @click="clickItem('removeWallet')">{{ language.text122 }}</uni-button>

    <!-- 修改钱包名字模态框 -->
    <u-modal class="edit-name-modal" :show="showEditWalletNameModal" :closeOnClickOverlay="false"
      :showConfirmButton="false">
      <template slot="default">
        <view>
          <view class="title">
            <text>{{ language.text123 }}</text>
          </view>
          <u--textarea :placeholder="language.text124"  border="surround" v-model="name" maxlength="60" :autoHeight="$cache.get('_language') == 'CN'"
            :class="{ 'error-edit-name': editNameError }" clearable class="textarea"  :placeholderStyle="placeholderStyle" :formatter="formatter">
          </u--textarea>
          <view class="error-tip" :style="{ opacity: editNameError ? 1 : 0 }">
            {{ language.text124 }}
          </view>
        </view>
      </template>
      <template slot="confirmButton">
        <view class="confirm-button">
          <uni-button class="cancel" @click="cancel('name')">{{ language.text125 }}</uni-button>
          <uni-button class="confirm" @click="confirm('name')">{{ language.text112 }}</uni-button>
        </view>
      </template>
    </u-modal>

    <!-- 密码确认模态框 -->
    <u-modal class="confirm-password-modal" :show="showConfirmPasswordModal" :closeOnClickOverlay="false"
      :showConfirmButton="false">
      <template slot="default">
        <view>
          <view class="title">
            <view>
            	{{ verifyMethod == 'touchID' ? language.text196 : language.text48 }}
            	<text v-if="verifyMethod == 'touchID' && verifyTouchErrorTip !== ''"
            		class="verifyTouchErrorTip">({{ verifyTouchErrorTip }})</text>
            </view>
            <image src="@/static/img/ic-close.png" @click="cancel('password')"></image>
          </view>
          <view v-if="verifyMethod == 'password'">
            <view class="input-view">
              <u-input :type="showPassword ? 'text' : 'password'" :placeholder="language.text49" :formatter="formatter"
                border="surround" v-model="password" class="edit-name-input" :class="{ 'error-edit-name': editNameError }">
                <template slot="suffix">
                  <image :src="showPassword? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'" @click="showPassword = !showPassword" style="width: 32rpx; height: 32rpx;"></image>
                </template>
              </u-input>
            </view>
            <view class="error-tip" :style="{ opacity: confirmPasswordError ? 1 : 0 }">
              {{ language.text150 }}
            </view>
          </view>
          <view v-else class="touch-verify">
            <view class="logo">
            	<image src="/static/img/mine/zhiwen.png" style="width: 88rpx; height: 88rpx;"></image>
            </view>
          </view>
          <view v-if="touchId" class="changeVerifyMethod" @click="changeVerifyMethod">{{ language.text197 }}
          </view>

        </view>
      </template>
      <template slot="confirmButton" v-if="verifyMethod == 'password'">
        <view class="confirm-button">
          <uni-button class="confirm" @click="confirm('password')">{{ language.text144 }}</uni-button>
        </view>
      </template>
    </u-modal>
    
    <u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
      <view class="modalContent">
        <image src="/static/img/tishi2.png" style="width: 64rpx; height: 64rpx;"></image>
        <view class="modal-title">{{ language.text159 }}</view>
        <text class="modal-content">{{ language.text160 }}</text>
        <view class="con_btn">
          <button @click="aa = false" class="con_btn_cancel">{{ language.text14 }}</button>
          <button @click="conConfim" class="con_btn_confirm" style="background-color: #002FA7;">{{ language.text50 }}</button>
        </view>
      </view>
    </u-modal>
    
    <!-- 指纹验证 -->
    <view class="toast" v-show="showToast">
    	<view class="toast-icon">
    		<image :src="toast.icon"></image>
    	</view>
    	<view class="toast-content">
    		<text>{{ toast.msg }}</text>
    	</view>
    </view>
    
    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import language from '@/pages/account/language/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
import verifyTouchID from '@/pages/account/mixins/verifyTouchID.js'
import mixins from '@/pages/account/mixins/index.js'
export default {
  mixins: [verifyTouchID,mixins],
  data() {
    return {
      wallet: this.$cache.get('_currentWallet') || {},
      language: language[this.$cache.get('_language')],
      name: '', // 钱包名称
      showEditWalletNameModal: false,
      editNameError: false, // 校验编辑钱包名称是否失败
      showConfirmPasswordModal: false,
      confirmPasswordError: false, // 校验资金密码是否失败
      password: '', // 资金密码
      showPassword: false, // 是否明文显示密码
      aa: false,
      placeholderStyle: {
        color: 'red',
        'font-size': '100rpx'
      },
      verifyMethod: 'password',
      touchId: this.$cache.get('_touchId'),
      verifyTouchErrorTip: '',
      showToast: false,
      toast: {
        icon: '/static/img/mine/loading.gif',
        // msg: '失败次数超出限制，请稍后再设置',
        msg: '失败次数超出限制，请切换其它方式验证'
      },
    }
  },
  onLoad() {
    if (this.touchId) this.verifyMethod = 'touchID'
  },
  methods: {
    changeVerifyMethod() {
      this.verifyMethod == 'password' ? this.verifyMethod = 'touchID' : this.verifyMethod = 'password'
      if (this.verifyMethod == 'touchID') {
        this.verify()
      } else {
        plus.fingerprint.cancel()
      }
    },
    verifyTouchIDFail() {
      this.showToast = false
    },
    verifyTouchIDOverTime() {
      this.showToast = false
    },
    hideModel() {
      this.showConfirmPasswordModal = false
    },
    verifyTouchIDSuccess() {
      this.$nextTick(() => {
        // this.checkSuccess = this.sendFormData
        this.transferLoading = true
        this.verifyTouchID = 3
        this.showToast = false
        console.log(this.target)
        if (this.target === 'editName') {
          const name = this.name.trim()
          if (name.length > 10 || name == '') {
            this.editNameError = true
            return
          }
          this.wallet.name = name
          this.$cache.set('_currentWallet', this.wallet, 0)
          this.editNameError = false
          this.showEditWalletNameModal = false
          this.$refs.notify.show('', this.language.text127, { bgColor: '#275EF1' })
          this.name = ''
        } else if (this.target === 'removeWallet') {
          // 删除当前钱包
          this.removeWallet()
        } else if (this.target === 'resetPassword') {
          uni.navigateTo({
            url: './resetPassword'
          })
        } else {
          uni.navigateTo({
            url: `/pages/walletManager/export${this.target}Reminder`
          })
        }
        // this.showConfirmPasswordModal = true
        // this.verifyMethod = 'password'
        // this.toast.msg = `${this.language.text198}...`
        // this.toast.icon = '/static/img/mine/loading.gif'
        // uni.showToast({
        //   title: `${this.language.text198}...`,
        //   icon: 'loading',
        //   duration: 999999999
        // })
      })
    },
    conConfim() {
      this.aa = false
      this.showConfirmPasswordModal = true
      if (this.touchId) {
        this.verify()
      }
    },
    toResetPassword() {
      this.target = 'resetPassword'
      this.showConfirmPasswordModal = true
      this.firstTime = true
      if (this.touchId) {
        this.verify()
      }
    },
    clickItem(target) {
      this.target = target
      if (target === 'editName') {
        this.showEditWalletNameModal = true
      } else if(target === 'removeWallet'){
        this.aa = true
      } else {
        this.showConfirmPasswordModal = true
        this.firstTime = true
        if (this.touchId) {
          this.verify()
        }
      }
    },
    cancel(target) {
      if (target === 'name') {
        this.name = ''
        this.editNameError = false
        this.showEditWalletNameModal = false
      } else if (target === 'password') {
        this.password = ''
        if (this.$cache.get('_touchId')) this.verifyMethod = 'touchID'
        if (this.touchId) {
          plus.fingerprint.cancel()
        }
        this.confirmPasswordError = false
        this.showConfirmPasswordModal = false
      }
    },
    verifyPawword() {
      const walletPassword = WalletCrypto.decode(this.wallet.password)
      const password = this.password.trim()
      if (password !== walletPassword) {
        this.confirmPasswordError = true 
        return false
      }
      this.confirmPasswordError = false
      if (this.$cache.get('_touchId')) this.verifyMethod = 'touchID'
      this.showConfirmPasswordModal = false
      this.password = ''
      return true
    },
    removeWallet() {
      const walletList = this.$cache.get('_walletList')
      this.$refs.notify.show('error', this.language.text211, { bgColor: '#275EF1' })
      let url = ''
      this.$cache.delete('_tokenContent_accountTransfer_data')
      this.$cache.delete('_tokenContent_unBoundingBalance_data')
      this.$cache.delete('_tokenContent_locakAmount_data')
      this.$cache.delete('_my_list_data')
      this.$cache.delete('_my_cumulativeReward_data')
      this.$cache.delete('_my_unBoundingBalance_data')
      this.$cache.delete('_ident_delegationsBlance_data')
      this.$cache.delete('_delegateInfo')
      this.$cache.delete('_tokenContent_locakAmount_data')
      this.$cache.delete('_tokenContent_unBoundingBalance_data')
      this.$cache.delete('_my_totalReward_data')
      this.$cache.delete('_tokenContent_balance_data')
      console.log('delete');
      if (walletList.length > 1) {
        walletList.shift()
        this.$cache.set('_currentWallet', walletList[0], 0)
        this.$cache.set('_walletList', walletList, 0)
        url = '/pages/account/index'
      } else {
        this.$cache.delete('_walletList')
        this.$cache.delete('_currentWallet')
        url = '/pages/index/index'
      }
      setTimeout(() => {
        uni.reLaunch({ url })
      }, 1500)
    },
    confirm() {
      if (this.target === 'editName') {
        const name = this.name.trim()
        if (name.length > 10 || name == '') {
          this.editNameError = true
          return
        }
        this.wallet.name = name
        this.$cache.set('_currentWallet', this.wallet, 0)
        this.editNameError = false
        this.showEditWalletNameModal = false
        this.$refs.notify.show('', this.language.text127, { bgColor: '#275EF1' })
        this.name = ''
      } else if (this.target === 'removeWallet') {
        const result = this.verifyPawword()
        if (!result) return
        // 删除当前钱包
        this.removeWallet()
      } else if (this.target === 'resetPassword') {
        const result = this.verifyPawword()
        if (!result) return
        uni.navigateTo({
          url: './resetPassword'
        })
      } else {
        const result = this.verifyPawword()
        if (!result) return
        uni.navigateTo({
          url: `/pages/walletManager/export${this.target}Reminder`
        })
      }
    },
    closeConfirmPasswordModal() {
      this.password = ''
      if (this.$cache.get('_touchId')) this.verifyMethod = 'touchID'
      this.confirmPasswordError = false
      this.showConfirmPasswordModal = false
      if (this.touchId) {
        plus.fingerprint.cancel()
      }
    },
    formatter(val){
      return this.dealInputValue(val)
    }
  },
  onBackPress(event) {
    if (event.from === 'backbutton') {
      uni.switchTab({
        url: '/pages/account/index'
      })
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    background-color: #F4F6F9;
    padding-top: calc(112rpx + var(--status-bar-height));
    width: 100vw;
    height: 100vh;
  }

  .header {
    background-color: #fff;
  }

  .wallet-detail {
    margin-top: 2rpx;
    background-color: #fff;

    &-address {
      .item-address {
        height: 28rpx;
        margin-top: 14rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #8397B1;
        line-height: 28rpx;
      }
    }

    &-name {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .right {
        display: flex;
        align-items: center;

        .item-name {
          height: 28rpx;
          font-weight: 400;
          font-size: 28rpx;
          color: #2C365A;
          line-height: 28rpx;
        }
      }

    }
  }

  .export-detail {
    background-color: #fff;
    margin-top: 24rpx;

    >view {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .remove-wallet-btn {
    margin: 96rpx 32rpx 32rpx;
    width: auto;
    height: 96rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #EC2828;
    text-align: center;
    line-height: 96rpx;
    background-color: #fff;
    border-radius: 16rpx;

    &:after {
      border: 0 !important;
    }
  }


  .edit-name-modal,
  .confirm-password-modal {
    /deep/ .u-modal {
      width: 686rpx !important;
    }

    /deep/ .u-modal__content {
      display: block !important;
      padding: 0 32rpx 0;
    }

    .title {
      height: 32rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      line-height: 32rpx;
      margin-bottom: 64rpx;
    }

    /deep/ .edit-name-input {
      // background-color: #F2F4F8;
      // height: 96rpx;

      .uni-input-input {
        height: 48rpx;
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
        line-height: 48rpx;
      }

      .input-placeholder {
        height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        color: #8397B1 !important;
        line-height: 48rpx !important;
      }
    }

    .error-tip {
      height: 24rpx;
      margin-top: 16rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #EC2828;
      line-height: 24rpx;
    }

    /deep/ .u-modal__button-group--confirm-button {
      padding: 0;
    }

    .confirm-button {
      display: flex;
      margin-top: 40rpx;
      margin-bottom: 48rpx;
      padding: 0 32rpx;
      justify-content: space-between;

      uni-button {
        width: 292rpx;
        height: 96rpx;
        font-weight: 400;
        font-size: 32rpx;
        line-height: 96rpx;
        color: #FCFCFD;
        border-radius: 16rpx;
      }

      .confirm {
        background-color: #002FA7;
      }

      /deep/ .cancel {
        color: #8397B1;
        background-color: rgba(0, 47, 167, 0.00);
        border: 1px solid rgba(131, 151, 177, 0.30);
        &:after {
          border: 0 !important
        }
      }
    }
  }

  .confirm-password-modal {
    .title {
      display: flex;
      justify-content: space-between;

      image {
        width: 32rpx;
        height: 32rpx;
      }
    }

    .confirm-button {
      uni-button {
        width: 100%;
      }
    }
  }

  /deep/ .error-edit-name {
    border: 2rpx solid #EC2828;
    background-color: rgba(236, 40, 40, 0.06);

    .uni-input-input {
      color: #EC2828;
    }
  }



  .label {
    height: 32rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #2C365A;
    line-height: 32rpx;
  }

  .item {
    padding: 32rpx 0 32rpx 32rpx;
  }

  .arrow-right {
    width: 32rpx;
    height: 32rpx;
    margin-right: 20rpx;
    margin-left: 24rpx;
  }

  .border {
    height: 2rpx;
    background-color: #F4F6F9;
    margin-left: 32rpx;
  }
  
  /deep/ .hintModal {
    .u-modal {
    }
  
    .u-modal__content {
      padding: 32rpx;
      padding-top: 48rpx !important;
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
          border: 2rpx solid rgba(131,151,177,0.30);
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
      word-break: break-word;
	  }
	}
	
	.u-textarea--radius {
	  border-radius: 16rpx;
	}
  
  .input-view {
    background-color: #F2F4F8;
    height: 96rpx;
    display: flex;
    align-items: center;
    border-radius: 16rpx;
  }
  
  .verifyTouchErrorTip {
  	color: red;
  	font-size: 24rpx;
  }
  
  .toast {
  	position: fixed;
  	left: 50%;
  	top: 50%;
  	transform: translate(-50%, -50%) !important;
  	width: 240rpx;
  	background: rgba(0, 0, 0, .6);
  	padding: 0 20rpx 32rpx;
  	justify-content: center;
  	border-radius: 6rpx;
  	z-index: 999999999;
  
  	&-icon {
  		text-align: center;
  		margin-top: 65rpx;
  
  		image {
  			width: 65rpx;
  			height: 65rpx;
  		}
  	}
  
  	&-content {
  		margin-top: 20rpx;
  		font-weight: 400;
  		font-size: 28rpx;
  		color: #FFFFFF;
  		text-align: center;
  	}
  }
  
  // 指纹验证
  .touch-verify {
  	margin-top: 80rpx;
    margin-bottom: 32rpx;
  	.logo {
  		text-align: center;
  	}
  }
  
  .changeVerifyMethod {
  	text-align: right;
  	font-family: PingFangSC-Regular;
  	font-size: 28rpx;
  	color: #1E5EFF;
  	margin-top: 20rpx;
    margin-bottom: 5rpx;
  }
</style>

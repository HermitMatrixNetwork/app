<template>
  <view class="container">
    <view class="mask" v-show="loading"></view>
    <custom-header :title="language.text96" style="background-color: #fff;"></custom-header>
    <view class="address-main" style="position: relative;">
      <InputTitle :title="language.text97" :type="'text'" :placeholder="language.text98" ref="addressInptval"
        :inputVal.sync="formData.withdrawAddress" :inputContainerStyle="inputContainerStyle"
        :inputOtherStyle="{ 'padding-right': '80rpx' }">
        <template #inputRight>
          <view class="scan">
            <image src="/static/img/account/mipmap-mdpi_saoma.png" style="width: 32rpx;height: 32rpx;" @click="scanCode"></image>
          </view>
        </template>
      </InputTitle>
    </view>


    <miners-column @getMinersCost="getMinersCost"></miners-column>

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
      :safeAreaInsetBottom="true">
      <view class="submitPopup">
        <view class="main">
          <view class="popup-title">
    	       {{ language.text25 }}
            <image src="/static/img/account/close.png" style="width:32rpx;height:32rpx" @click="submitPopupIsShow=false"> </image>
          </view>

          <!-- 发送账户 -->
          <view class="send-address">
            <text>{{ language.text26 }}</text>
            <text>{{ formData.delegatorAddress }}</text>
          </view>

          <!-- 接收账户 -->
          <view class="receive_address">
            <text>{{ language.text27 }}</text>
            <text>{{ formData.withdrawAddress }}</text>
          </view>

          <!--矿工费-->
    		    <view class="miners_fee">
            <text>{{ language.text29 }}</text>
    		      <view>
              <view>25000 GWEI * {{ formData.gas }} GasPrice</view>
              <view class="price">{{ 25000 * formData.gas }} GHM</view>
    		      </view>
    	     </view>
        </view>
        <view class="submit-btn" @click="submitAgain">
    	     {{ language.text30 }}
        </view>
      </view>
    </u-popup>

    <u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
      <view class="modal_main">
        <view class="modal_title">
          <view>
            {{ verifyMethod == 'touchID' ? language.text83 : language.text66 }}
            <text v-if="verifyMethod == 'touchID' && verifyTouchErrorTip !== ''"
              class="verifyTouchErrorTip">({{ verifyTouchErrorTip }})</text>
          </view>
          <image src="/static/img/account/close.png" style="width: 32rpx;height: 32rpx;"
            @click="closeModalPasswordIsShow"></image>
        </view>
        <view v-if="verifyMethod == 'password'">
          <view class="item">
            <view class="item-input item-input-password">
              <u-input :password="!passwordEye" v-model="payPassword" :placeholder="language.text67">
              </u-input>
              <image :src="passwordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'"
                @click="passwordEye = !passwordEye"
                style="width: 32rpx; height: 32rpx; margin-right: 36rpx; border-radius: 0 16rpx 16rpx 0;"></image>
            </view>
          </view>
          <text :style="{opacity: passwordCheck ? 1 : 0 }" class="waringPrompt">{{ language.text69 }}</text>
          <u-button @click="passwordButton" class="pass_confirm">{{ language.text68 }}</u-button>
        </view>
        <view v-else class="touch-verify">
          <view class="logo">
            <image src="/static/img/mine/zhiwen.png" style="width: 88rpx; height: 88rpx;"></image>
          </view>
        </view>
        <view v-if="touchId" class="changeVerifyMethod" @click="changeVerifyMethod">{{ language.text82 }}</view>
      </view>
    </u-modal>

    <view class="btn" :class="{ complete: formData.withdrawAddress !== '' }">
      <u-button @click="confirmProtocol">{{ language.text68 }}</u-button>
    </view>

    <view :callRender="callRender" :change:callRender="render.withdraw"></view>

    <!-- 指纹验证 -->
    <view class="toast" v-show="showToast">
      <view class="toast-icon">
        <image :src="toast.icon"></image>
      </view>
      <view class="toast-content">
        <text>{{ toast.msg }}</text>
      </view>
    </view>
  </view>
</template>

<script>
  import InputTitle from '@/pages/account/send/components/Input-title.vue'
  import WalletCrypto from '@/utils/walletCrypto.js'
  import verifyTouchID from './mixins/verifyTouchID.js'
  import language from './language/index.js'
  export default {
    mixins: [verifyTouchID],
    components: {
      InputTitle
    },
    data() {
      return {
        inputContainerStyle: 'input-style',
        minersMsg: '',
        callRender: 0,
        payPassword: '',
        submitPopupIsShow: false,
        passwordCheck: false,
        passwordEye: false,
        modalPasswordIsShow: false,
        formData: {
          delegatorAddress: this.$cache.get('_currentWallet').address,
          withdrawAddress: '',
          gas: ''
        },
        loading: false,
        // 指纹验证
        touchId: this.$cache.get('_touchId'),
        showToast: false,
        toast: {
          icon: '/static/img/mine/loading.gif',
          // msg: '失败次数超出限制，请稍后再设置',
          msg: '失败次数超出限制，请切换其它方式验证'
        },
        verifyMethod: 'password',
        verifyTouchErrorTip: '',
        language: language[this.$cache.get('_language')]
      }
    },
    onLoad() {
      if (this.touchId) this.verifyMethod = 'touchID'
    },
    methods: {
      verifyTouchIDOverTime() {
        this.showToast = false
      },
      verifyTouchIDFail() {
        this.showToast = false
      },
      closeModalPasswordIsShow() {
        this.modalPasswordIsShow = false
        if (this.touchId) {
          plus.fingerprint.cancel()
        }
      },
      changeVerifyMethod() {
        this.verifyMethod == 'password' ? this.verifyMethod = 'touchID' : this.verifyMethod = 'password'
        if (this.verifyMethod == 'touchID') {
          this.verify()
        } else {
          plus.fingerprint.cancel()
        }
      },
      hideModel() {
        this.modalPasswordIsShow = false
      },
      verifyTouchIDSuccess() {
        this.$nextTick(() => {
          this.passwordCheck = false
          this.callRender = this.formData // 调用render.sendToken
          this.loading = true
          this.verifyTouchID = 3
          this.showToast = true
          this.toast.msg = this.language.text77 + '...'
          this.toast.icon = '/static/img/mine/loading.gif'
          // this.$nextTick(() => {
          //   uni.showToast({
          //     title: `${this.language.text77}...`,
          //     icon: 'loading',
          //     duration: 999999999
          //   })
          // })
        })
      },
      submitAgain() {
        this.modalPasswordIsShow = true
        // #ifdef APP-PLUS
        if (this.touchId) {
          this.verify()
        }
        // #endif

        // #ifndef APP-PLUS
        this.touchId = 0
        // #endif

        this.submitPopupIsShow = false
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
      getMinersCost(val) {
        this.formData.gas = val.amount
      },
      confirmProtocol() {
        this.submitPopupIsShow = true
      },
      passwordButton() {
        const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
        if (this.payPassword != decode) {
          this.passwordCheck = true
        } else {
          this.passwordCheck = false
          this.callRender = this.formData // 调用render.sendToken
          this.loading = true
          this.modalPasswordIsShow = false
          this.verifyTouchID = 3
          this.showToast = true
          this.toast.msg = this.language.text77 + '...'
          this.toast.icon = '/static/img/mine/loading.gif'
          // uni.showToast({
          //   title: `${this.language.text77}...`,
          //   icon: 'loading',
          //   mask: true,
          //   duration: 999999999
          // })
        }
      },
      handlerResult(res) {
        this.callRender = 0
        this.loading = false
        console.log(res)
        if (res.code == 0) {
          this.$cache.set('_updateDelegateInfo', true, 0)
          const wallet = this.$cache.get('_currentWallet')
          wallet.withdrawAddress = this.formData.withdrawAddress
          this.$cache.set('_currentWallet', wallet, 0)
          this.updateWalletList(wallet)
          this.verifyTouchID = 3
          this.showToast = true
          this.toast.msg = this.language.text78
          this.toast.icon = '/static/img/mine/success.png'
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
          // uni.showToast({
          //   title: this.language.text78,
          //   image: '/static/img/mine/success.png',
          //   mask: true,
          //   duration: 3000,
          //   complete: () => {
          //     setTimeout(() => {
          //       uni.navigateBack()
          //     }, 1500)
          //   }
          // })
        } else {
          this.verifyTouchID = 3
          this.showToast = true
          this.toast.msg = this.language.text79
          this.toast.icon = '/static/img/mine/fail.png'
          setTimeout(() => {
            this.showToast = false
          }, 3000)
          // uni.showToast({
          //   title: this.language.text79,
          //   image: '/static/img/mine/fail.png',
          //   mask: true,
          //   duration: 3000,
          // })
          console.log(res)
        }
      },
      updateWalletList(wallet) {
        const walletList = this.$cache.get('_walletList') || []
        if (!wallet) return false
        const walletIndex = walletList.findIndex(item => item.address === wallet.address)
        if (walletIndex > -1) {
          walletList.splice(walletIndex, 1)
        }
        walletList.unshift(wallet)
        this.$cache.set('_walletList', walletList, 0)
        return true
      }
    }
  }
</script>

<script lang="renderjs" module="render">
  import {
    setWithdrawAddress
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'
  export default {
    methods: {
      async withdraw(val) {

        if (val == 0) return
        console.log(val);
        let res = {}
        try {
          let gas = val.gas * mainCoin.decimals
          res = await setWithdrawAddress(val, gas)
        } catch (e) {
          console.log(e)
          res.code = 7
        }
        renderUtils.runMethod(this._$id, 'handlerResult', res, this)

      }
    }
  }
</script>

<style lang="scss" scoped>
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .5) !important;
    z-index: 9999;
  }

  .container {
    height: 100vh;
    width: 100vw;
    background-color: #F4F6F9;
  }

  .scan {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 32rpx;
  }

  /deep/ .input-style {
    position: relative;
  }

  .address-main {
    padding: 40rpx 32rpx;
    border-top: 2rpx solid #F4F6F9;
    background-color: #fff;
  }

  .btn {
    opacity: .2;
    position: fixed;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);

    .u-button {
      width: 622rpx;
      height: 96rpx;
      background: #002FA7;
      border-radius: 16rpx;
      font-size: 32rpx;
      color: #FCFCFD;
    }
  }

  .complete {
    opacity: 1;
  }

  //弹出层
  .submitPopup {
    width: 100%;
    height: 1028rpx;

    .main {
      margin: 0 32rpx;

      .popup-title {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        font-size: 32rpx;
        color: #2C365A;
        letter-spacing: 0;
        padding: 48rpx 0 16rpx 0;
        line-height: 32rpx;
      }

      >view:not(:first-child) {
        font-size: 28rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dddddd80;

        text:nth-child(2) {
          width: 400rpx;
          word-wrap: break-word;
          text-align: right;
          font-weight: 400;
          color: #030319;
          letter-spacing: 0;
          line-height: 36rpx;
  	     }

        text:nth-child(1) {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: #8F9BB3;
          letter-spacing: 0;
        }
      }

      .send-address,
      .receive_address {
        padding: 33rpx 0;
      }

      .transfer_amount,
      .memo_type {
  	     padding-top: 33rpx;
        padding-bottom: 43rpx;
      }

      .miners_fee {
        padding: 33rpx 0 39rpx 0;

        view {
          height: 80rpx;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 28rpx;

          .price {
            color: #8F9BB3;
            margin-top: 24rpx;
          }
        }
      }

    }

  }

  .submit-btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
    text-align: center;
    line-height: 96rpx;
  }

  .modal_main {
    width: 100%;

    .modal_title {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      letter-spacing: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal_submit {
      background: #002FA7;
      border-radius: 16rpx;
      height: 96rpx;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 32rpx;
      color: #FCFCFD;
      letter-spacing: 0;
      line-height: 96rpx;
      margin-top: 80rpx;
    }
  }

  .item {
    margin-top: 64rpx;

    &-input {

      .u-input {
        height: 96rpx;
        background-color: #F2F4F8;
        border-radius: 16rpx 0 0 16rpx;
        padding-left: 0 !important;

        /deep/ input {
          color: #2C365A !important;
          font-size: 28rpx !important;
          padding-left: 32rpx;
          line-height: 48rpx !important;
        }
      }

      /deep/ .input-placeholder {
        // height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        // color: #8397B1 !important;
        color: #8397B1 !important;
        // line-height: 48rpx !important;
      }

      &-password {
        display: flex;
        background-color: #F2F4F8;
        height: 96rpx;
        align-items: center;
        border-radius: 16rpx;

        .u-icon {
          padding-right: 36rpx;
          border-radius: 0 16rpx 16rpx 0 !important;
        }
      }
    }
  }

  .pass_confirm {
    height: 96rpx;
    background: #002FA7;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #FCFCFD;
    text-align: center;
    margin-top: 56rpx;
  }

  .waringPrompt {
    margin-top: 8rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #EC2828;
    letter-spacing: 0;
    line-height: 24rpx;
    height: 24rpx;
    position: absolute;
  }

  .touch-verify {
    margin-top: 80rpx;

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

  .verifyTouchErrorTip {
    color: red;
    font-size: 24rpx;
  }
</style>

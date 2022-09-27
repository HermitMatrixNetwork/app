<template>
  <view class="container">
    <view :callSimulate="callSimulate" :change:callSimulate="render.simulateFee"></view>
    <view class="mask" v-show="loading"></view>
    <custom-header :title="language.text104" style="background-color: #fff;"></custom-header>
    <view class="perform_contract" style="background-color: #fff;">
      <view class="title">
        {{ language.text105 }}
      </view>
      <textarea v-model="formData.view_key" cols="30" rows="10" :placeholder="language.text205" disabled
        class="viewkey_input"></textarea>
    </view>
    <view style="height: 16rpx;background: #F4F6FA;" />

    <view style="padding: 40rpx 32rpx 48rpx; background-color: #fff;">
      <InputTitle title="Memo" isBlod :placeholder="language.text106" :inputVal.sync="formData.memo"></InputTitle>
    </view>

    <miners-column @getMinersCost="getMinersCost" @getMinimumGas="getMinimumGas"></miners-column>
    <view style="height: 40rpx;background: #fff;" />

    <view class="submit-button">
      <Submitbtn @click.native="setViekey" :loadingIsShow="btnLoading">{{ language.text107 }}</Submitbtn>
    </view>

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
      :safeAreaInsetBottom="true">
      <view class="submitPopup">
        <view class="main">
          <view class="popup-title">
            {{ language.text108 }}
            <image src="/static/img/account/close.png" style="width: 32rpx; height: 32rpx;"
              @click="submitPopupIsShow=false"></image>
          </view>

          <view class="item">
            <view class="label">
              {{ language.text109 }}
            </view>
            <view class="value">
              {{ token.contract_address }}
            </view>
          </view>
          <view class="item">
            <view class="label">
              {{ language.text110 }}
            </view>
            <view class="value">
              {{ formData.view_key }}
            </view>
          </view>
          <view class="item">
            <view class="label">
              Memo
            </view>
            <view class="value memo_type">
              {{ formData.memo }}
            </view>
          </view>
          <view class="item">
            <view class="label">
              {{ language.text111 }}
            </view>
            <!-- <custom-loading v-if="feeLoading"></custom-loading> -->
            <view class="value">
              {{ formData.gas }} * {{ formData.gasPrice }} ughm
              <view class="price">{{ totalGas }} GHM</view>
            </view>
          </view>

          <u-button class="btn" @click="submitAgain">{{ language.text107 }}</u-button>
        </view>
      </view>
    </u-popup>
    <view :callRender="callRender" :change:callRender="render.setViewkey"></view>

    <u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
      <view class="modal_main">
        <view class="modal_title">
          <view>
            {{ verifyMethod == 'touchID' ? language.text196 : language.text48 }}
            <text v-if="verifyMethod == 'touchID' && verifyTouchErrorTip !== ''" class="verifyTouchErrorTip">({{
            verifyTouchErrorTip }})</text>
          </view>
          <image src="/static/img/account/close.png" style="width: 32rpx; height: 32rpx;"
            @click="closeModalPasswordIsShow"></image>
        </view>
        <view v-if="verifyMethod == 'password'">
          <view class="item">
            <view class="item-input item-input-password">
              <u-input :password="!passwordEye" v-model="payPassword" :placeholder="language.text49">
              </u-input>
              <image :src="passwordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'"
                @click="passwordEye = !passwordEye"
                style="width: 32rpx; height: 32rpx; margin-right: 36rpx; border-radius: 0 16rpx 16rpx 0;"></image>
            </view>
          </view>
          <!-- <input type="text"> -->
          <text v-show="passwordCheck" class="waringPrompt">{{ language.text51 }}</text>
          <!-- <Submitbtn class="modal_submit" @click.native="passwordButton" >确认</Submitbtn> -->
          <u-button @click="passwordButton" class="confirm_btn">{{ language.text107 }}</u-button>
        </view>
        <view v-else class="touch-verify">
          <view class="logo">
            <image src="/static/img/mine/zhiwen.png" style="width: 88rpx; height: 88rpx;"></image>
          </view>
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
import InputTitle from './components/Input-title.vue'
import WalletCrypto from '@/utils/walletCrypto.js'
import Submitbtn from './components/submit-btn.vue'
import verifyTouchID from '../mixins/verifyTouchID.js'
import { getRamNumber } from '@/utils/index.js'
import language from '../language/index.js'
import decimal from 'decimal'
import mainCoin from '@/config/index.js'
export default {
  mixins: [verifyTouchID],
  components: {
    InputTitle,
    Submitbtn
  },
  data () {
    return {
      language: language[this.$cache.get('_language')],
      submitPopupIsShow: false,
      formData: {
        gas: '',
        gasPrice: '',
        view_key: '',
        memo: '',
        contract_address: '',
        address: this.$cache.get('_currentWallet').address
      },
      callRender: 0,
      token: {},
      loading: false,
      success: false,
      modalPasswordIsShow: false,
      passwordEye: false,
      payPassword: '',
      passwordCheck: false, //密码校验
      // 指纹验证
      touchId: this.$cache.get('_touchId'),
      showToast: false,
      toast: {
        icon: '/static/img/mine/loading.gif',
        // msg: '失败次数超出限制，请稍后再设置',
        msg: '失败次数超出限制，请稍后再设置',
      },
      verifyMethod: 'password',
      verifyTouchErrorTip: '',
      isCustomFess: false,
      feeLoading: true,
      callSimulate: {},
      btnLoading: false
    }
  },
  onLoad (options) {
    if (this.touchId) this.verifyMethod = 'touchID'
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
    Object.assign(this.formData, this.token)
    if (!this.token.view_key) {
      this.formData.view_key = getRamNumber()
    }
  },
  methods: {
    verifyTouchIDFail () {
      this.showToast = false
    },
    verifyTouchIDOverTime () {
      this.showToast = false
    },
    closeModalPasswordIsShow () {
      this.modalPasswordIsShow = false
      if (this.$cache.get('_touchId')) this.verifyMethod = 'touchID'
      this.payPassword = ''
      if (this.touchId) {
        plus.fingerprint.cancel()
      }
    },
    changeVerifyMethod () {
      this.verifyMethod == 'password' ? this.verifyMethod = 'touchID' : this.verifyMethod = 'password'
      if (this.verifyMethod == 'touchID') {
        this.verify()
      } else {
        plus.fingerprint.cancel()
      }
    },
    hideModel () {
      this.modalPasswordIsShow = false
    },
    verifyTouchIDSuccess () {
      this.$nextTick(() => {
        // this.passwordCheck = false
        // this.loading = true
        // this.callRender = this.formData
        this.verifyTouchID = 3
        this.modalPasswordIsShow = true
        this.verifyMethod = 'password'
        this.showToast = false
        // this.toast.msg = `${this.language.text184}...`
        // this.toast.icon = '/static/img/mine/loading.gif'
        // this.$nextTick(() => {
        //   uni.showToast({
        //     title: `${this.language.text184}...`,
        //     icon: 'loading',
        //     duration: 999999999
        //   })
        // })
      })
    },
    submitAgain () {
      this.firstTime = true
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
    getMinersCost (val) {
      if (val.speed == this.language.text27) {
        // this.sendFormData.gas = val.
        this.formData.gas = val.minersGas
        this.isCustomFess = true
      } else {
        this.isCustomFess = false
      }
      this.formData.gasPrice = val.amount
    },
    passwordButton () {
      // 通过校验
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.loading = true
        this.callRender = this.formData
        this.modalPasswordIsShow = false
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = `${this.language.text184}...`
        this.toast.icon = '/static/img/mine/loading.gif'
        // this.$nextTick(() => {
        //   uni.showToast({
        //     title: `${this.language.text184}...`,
        //     icon: 'loading',
        //     mask: true,
        //     duration: 999999999
        //   })
        // })
      }
    },
    close () {
      console.log('close')
      this.passwordCheck = false
      this.payPassword = ''
    },
    handlerResult (res) {
      this.loading = false
      this.callRender = 0
      if (res.code == 0) {
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text185
        this.toast.icon = '/static/img/mine/success.png'
        this.token.view_key = this.formData.view_key
        this.token.loadingBalance = true
        this.token.showWarn = false
        const wallet = this.$cache.get('_currentWallet')
        const coinList = wallet.coinList
        const coinIndex = coinList.findIndex(item => item.ID == this.token.ID)
        coinList.splice(coinIndex, 1, this.token)
        wallet.coinList = coinList
        this.$cache.set('_currentWallet', wallet, 0)
        this.updateWalletList(wallet)
        setTimeout(() => {
          uni.reLaunch({
            url: `/pages/account/send/token_content_other?tokenID=${this.token.ID}`
          })
        }, 3000)
      } else {
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text182
        this.toast.icon = '/static/img/mine/fail.png'
        setTimeout(() => {
          this.showToast = false
        }, 3000)
      }
    },
    setViekey () {
      if (this.btnLoading) return
      if (this.formData.gas !== '') return this.submitPopupIsShow = true
      if (this.validate()) {
        if (!this.isCustomFess) {
          // this.feeLoading = true
          this.btnLoading = true
        }
        this.callSimulate = JSON.parse(JSON.stringify(this.formData))
        // this.submitPopupIsShow = true
      }
    },
    validate () {
      if (this.formData.view_key.trim() === '') {
        this.$refs.notify.show('error', this.language.text210, {
          bgColor: '#EC6665'
        })
        return false
      } else {
        this.$refs.notify.close()
        return true
      }
    },
    updateWalletList (wallet) {
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1)
      }
      walletList.unshift(wallet)
      this.$cache.set('_walletList', walletList, 0)
      return true
    },
    handlerGas (res) {
      // this.feeLoading = false
      if (this.btnLoading) {
        this.submitPopupIsShow = true
        this.btnLoading = false
      }
      if (!res.code) {
        this.$cache.set('_minimumGas', res, 0)
      }
      if (res.code || this.isCustomFess) return
      this.formData.gas = res
    },
    getMinimumGas () {
      this.$cache.set('_minimumGas', 0, 0)
      const data = JSON.parse(JSON.stringify(this.formData))
      this.callSimulate = {}
      this.$nextTick(() => {
        this.callSimulate = data
      })
    },
    gasError (res) {
      console.log(res)
      this.$refs.notify.show('', this.language.text237)
      this.btnLoading = false
      this.callSimulate = {}
    }
  },
  computed: {
    totalGas () {
      return new decimal(this.formData.gas + '').mul(new decimal(this.formData.gasPrice)).div(new decimal(mainCoin.decimals)).toString()
    }
  },
}
</script>

<script lang="renderjs" module="render">
  import {
    setViewKey,
    getSecret
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'
  import secretjs from '@/utils/secretjs/index.js'
  export default {
    methods: {
      async setViewkey(data) {
        if (data == 0) return
        let res = {}
        try {
          res = await setViewKey(data, data.gas, data.gasPrice)
        } catch (e) {
          console.log(res, e)
          res.code = 7
        }
        renderUtils.runMethod(this._$id, 'handlerResult', res, this)
      },
      async simulateFee(val) {
        if (!val.address) return
        let res = {}
        let codeHash
        const Secret = await getSecret()
        
        try {
          if (!val.codeHash) {
            codeHash = await Secret.query.snip20.contractCodeHash(val.contract_address)
          }

          const msgExecuteContract = new secretjs.MsgExecuteContract({
            sender: val.address,
            contractAddress: val.contract_address,
            codeHash,
            msg: { set_viewing_key: { key: val.view_key } },
            sentFunds: []
          })
          res = await Secret.tx.simulate([msgExecuteContract], {
            feeDenom: 'ughm',
          })
          let gas = Math.ceil(res.gasInfo.gasUsed * 1.15)
          renderUtils.runMethod(this._$id, 'handlerGas', gas, this)
        } catch (e) {
          console.log(e);
          res.code = 7
					renderUtils.runMethod(this._$id, 'gasError', e, this) //错误调用gasError方法
        }
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
  padding-top: calc(112rpx + var(--status-bar-height));
  background-color: #F4F6FA;
  height: 100vh;
}

.perform_contract {
  width: 100%;
  padding: 48rpx 32rpx 38rpx;

  .title {
    height: 28rpx;
    font-family: PingFangSC-Medium;
    font-weight: 600;
    font-size: 28rpx;
    color: #2C365A;
    letter-spacing: 0;
    line-height: 28rpx;
    margin-bottom: 24rpx;
  }

  .viewkey_input {
    width: 100%;
    height: 250rpx;
    background: #F7F8FA;
    border-radius: 16rpx;

    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 28rpx;
    color: #2C365A;
    letter-spacing: 0;
    line-height: 40rpx;
    padding: 32rpx;
  }
}

.submitPopup {
  width: 100%;
  height: 1028rpx;

  .main {

    .popup-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      letter-spacing: 0;
      padding: 32rpx;
      line-height: 32rpx;
      background: #F6F8FA;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }


    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 33rpx 0;
      margin: 0 33rpx;
      border-bottom: 2rpx solid rgba(131, 151, 177, .16);

      .label {
        flex: 1 0;
        font-size: 28rpx;
        color: #8F9BB3;
      }

      .value {
        width: 400rpx;
        word-break: break-word;
        font-size: 28rpx;
        color: #030319;
        text-align: right;
        flex: 2;
      }
    }
  }

}

.submit-button {
  margin: 96rpx 32rpx 0;
}

.btn {
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
}

.confirm_btn {
  height: 96rpx;
  border-radius: 16rpx;
  background-color: #002FA7 !important;
  color: #FCFCFD;
  margin-top: 80rpx;
  font-size: 32rpx;
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
    margin-top: 80rpx;
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
        height: 96rpx;
        background-color: #F2F4F8;
        align-items: center;
        border-radius: 16rpx;

        .u-icon {
          padding-right: 36rpx;
          border-radius: 0 16rpx 16rpx 0 !important;
        }
      }
    }
  }
}

/deep/ .u-popup__content {
  border-top-right-radius: 16rpx;
  border-top-left-radius: 16rpx;

  .u-modal__content {
    padding: 48rpx 32rpx !important;
  }
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

.price {
  color: #8F9BB3;
  margin-top: 24rpx;
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

.memo_type {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<template>
  <view class="sendPage">
    <view :callSimulate="callSimulate" :change:callSimulate="render.simulateFee"></view>
    <view :callRenderGetBanlance="callRenderGetBanlance" :change:callRenderGetBanlance="render.getBalance"></view>
    <view class="mask" v-show="loading"></view>
    <view :callWithdraw="callWithdraw" :change:callWithdraw="render.withdraw"></view>
    <custom-notify ref="notify" style="z-index: 3"></custom-notify>
    <custom-header :title="language.text31" :style="titleStyle" :customStyle="{ 'z-index': 2 }">
      <!-- 			<template #right>
				<u-icon :name="require('@/static/img/account/saoma.png')" size="44rpx" @click="scanCode" />
			</template> -->
    </custom-header>
    <view class="main-top">
      <view class="content">
        <view class="content-top">
          <view class="title">
            {{ language.text91 }}
          </view>
          <view class="change-token"
            @click="selectNode(`/pages/delegate/selectNode?selectIndex=${selectIndex}&redirectURL=/pages/delegate/income`)">

            <view v-if="selData.validator">
              <view class="name">{{selData.validator.description.moniker}}</view>
              <view class="address">{{selData.validator.operatorAddress| sliceAddress(10, -10)}}</view>
            </view>
            <text v-else>{{ language.text14 }}</text>
            <view class="icon-right">
              <!-- <image src="/static/img/ic-arrow1.png"></image> -->
              <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAWFJREFUWEftlk1OwzAQRv3F5iSIUyCBs0aiq2QFXSHUE0DhAFXVC1DY8bNKdiC6jek5OEnTZNCEgCIhSJ2EWpWafTTPz9+MB0TkCYcftgAbZcAYU+RFa513FRurDAAoCndpbWUALj65ne1mMsXVWe89IpLBpwZqY6MWgLX7vr/k4gtKLwUBCvQ4HPTmURTJIAjWBDB92VsQXZRXgB1PPQwHR/MkSZTWmiEagdQa4IKxEAiBbDx9PUjzZR9AUcyT4un6/PitjYmVAL7umHMwuns+zDNx0pUJGwAYY8B56NKEDUAhIo5jhGGYdWXCGkAIUWvCZk40AfhhIsvpFMTBJE9B3XN3lHOitjMaA1RNjG5m+znSvhDgbpRSiTEPq7JF/xzbmwtQDeO6r8BtCF22Ye3Jm4xkqxA6G8VOH6PvfcDVc+x8Iak+xU5Wsuq+53QpZRDna3mb7fe3f63mwBbgPwx8ANfjvhB3Zf9jAAAAAElFTkSuQmCC"></image>
            </view>
          </view>
        </view>
      </view>
      <view class="line" style="margin: 30rpx 0;"></view>
      <view class="content">
        <view class="content-top">
          <!-- 收款地址 -->
          <view class="collection-adres">
            <InputTitle :title="language.text32" :type="'text'" ref="addressInptval"
              disabled :inputVal.sync="receiveAddress">
              <template slot="title-icon">
                <view style="font-size: 24rpx; color: #1E5EFF;" @click="toSetAddress">
                  <text>{{ language.text92 }}</text>
                </view>
              </template>
            </InputTitle>

          </view>
          <view class="tip">
            {{ language.text33 }}
          </view>
        </view>
      </view>
      <view class="line">

      </view>

      <view class="content">


        <!-- 输入取消委托数量 -->
        <view class="send-amount">
          <view class="amount">
            <view class="label">
              <text>{{ language.text34 }}</text>
            </view>
            <view class="value">
              <u--input :placeholder="language.text35" v-model="balance" disabled></u--input>
              <view class="right">
                <text class="denom">GHM</text>
   <!--             <view class="border"></view>
                <text class="all" @click="testAmount">{{ language.text18 }}</text> -->
              </view>
            </view>
          </view>
<!--          <view class="other">
            <div class="title">{{ language.text94 }}：</div>
            <div class="num">{{ selectIndex == -1 ? 0 : balance }} GHM</div>
          </view> -->
          <!-- 					<text v-if="sendAmount>balance" class="waringPrompt">输入金额超过钱包可用余额，请重新输入</text> -->
        </view>
      </view>
    </view>

    <view class="main-bottom">
      <miners-column ref="miners" @getMinersCost="getMinersCost" @getMinimumGas="getMinimumGas"></miners-column>

      <view class="btn" @click="transferConfirm">
        <!-- {{ language.text20 }} -->
				<Submitbtn :loadingIsShow="btnLoading">{{ language.text20 }}</Submitbtn>
      </view>
    </view>

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
      :safeAreaInsetBottom="true">
      <view class="submitPopup">
        <view class="main">
          <view class="popup-title">
            {{ language.text25 }}
              <image src="/static/img/account/close.png" style="width:32rpx;height:32rpx" @click="submitPopupIsShow=false"></image>
            </u-icon>
          </view>

          <!-- 发送账户 -->
          <view class="send-address">
            <text>{{ language.text26 }}</text>
            <text>{{ userAddress }}</text>
          </view>

          <!-- 接收账户 -->
          <view class="receive_address">
            <text>{{ language.text27 }}</text>
            <text>{{ receiveAddress }}</text>
          </view>

          <view class="receive_address">
            <text>{{ language.text95 }}</text>
            <text>{{ balance }} {{ mainCoin.alias_name }}</text>
          </view>

          <!--矿工费-->
          <view class="miners_fee">
            <text>{{ language.text29 }}</text>
            <view>
              <view>{{ formData.gas }} * {{ formData.gasPrice }} ughm</view>
              <view class="price">{{ totalGas }} GHM</view>
            </view>
          </view>
        </view>
        <view class="submit-btn" @click="submitAgain">
          {{ language.text20 }}
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
          <u-button @click="passwordButton" class="pass_confirm">{{ language.text20 }}</u-button>
        </view>
        <view v-else class="touch-verify">
          <view class="logo">
            <image src="/static/img/mine/zhiwen.png" style="width: 88rpx; height: 88rpx;"></image>
          </view>
        </view>
        <view v-if="touchId" class="changeVerifyMethod" @click="changeVerifyMethod">{{ language.text82 }}</view>
      </view>
    </u-modal>

    <view :callWithdrawAddress="callWithdrawAddress" :change:callWithdrawAddress="render.getWithdrawAddress"></view>

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
// https://secretjs.scrt.network/interfaces/MsgWithdrawDelegatorRewardParams
import InputTitle from '@/pages/account/send/components/Input-title.vue'
import Submitbtn from '@/pages/account/send/components/submit-btn.vue'
import {
  sliceAddress
} from '@/utils/filters.js'
import mainCoin from '@/config/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
import verifyTouchID from './mixins/verifyTouchID.js'
import language from './language/index.js'
import decimal from 'decimal'
export default {
  mixins: [verifyTouchID],
  components: {
    InputTitle,
    Submitbtn
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      tokenUrl: '@/static/img/placeholder.jpeg',
      currentWallet: this.$cache.get('_currentWallet'),
      tokenName: 'GHM',
      inputVal: '',
      balance: 0,
      receiveAddress: '', //接收地址
      sendAmount: 123, //发送金额
      payPassword: '', //资金密码
      passwordCheck: false, //密码校验
      submitPopupIsShow: false,
      passwordEye: false,
      modalPasswordIsShow: false,
      userAddress: this.$cache.get('_currentWallet').address,
      titleStyle: {
        background: '#FFFFFF'
      },
      //发送金额样式
      sendAmountStyle: {
        height: '144rpx',
        fontSize: '40rpx',
        color: '#2C365A',
        fontWeight: '500'
      },
      formData: {
        delegatorAddress: this.$cache.get('_currentWallet').address,
        validatorAddress: '',
        gas: '',
        gasPrice: ''
      },
      amount: '100',
      selData: '',
      selectIndex: -1,
      loading: false,
      callWithdraw: 0,
      callWithdrawAddress: 0,
      mainCoin,
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
      callRenderGetBanlance: 0,
      callSimulate: {},
      feeLoading: true,
      btnLoading:false
    }
  },
  onLoad(options) {
    if (this.touchId) this.verifyMethod = 'touchID'
    const index = options.selectIndex

    if (index > -1) {
      this.selData = this.$cache.get('_delegateInfo').list[index]
      this.balance = (this.selData.rewards.amount / mainCoin.delegateDecimals).toFixed(5)
      this.selectIndex = index
    }


  },
  onShow() {
    let wallet = this.$cache.get('_currentWallet')
    if (wallet.withdrawAddress) {
      this.$refs.addressInptval ? this.$refs.addressInptval.childValue = wallet.withdrawAddress : this.receiveAddress =
          wallet.withdrawAddress
    }
    // const wallet = this.currentWallet
    // if (!wallet.withdrawAddress) {
    // this.callWithdrawAddress = wallet.address // @test delay
    // } else {
    //   this.$refs.addressInptval ? this.$refs.addressInptval.childValue = wallet.withdrawAddress : this.receiveAddress = wallet.withdrawAddress
    // }
  },
  onReady() {
    const wallet = this.currentWallet
    this.callWithdrawAddress = wallet.address
  },
  filters: {
    sliceAddress
  },
  methods: {
    verifyTouchIDFail() {
      this.showToast = false
    },
    verifyTouchIDOverTime() {
      this.showToast = false
    },
    closeModalPasswordIsShow() {
      this.modalPasswordIsShow = false
      // if (this.$cache.get('_touchId')) this.verifyMethod = 'touchID'
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
      this.passwordCheck = false
      this.formData.validatorAddress = this.selData.delegation.validatorAddress
      this.callWithdraw = this.formData
      this.loading = true
      this.verifyTouchID = 3
      this.showToast = true
      // this.modalPasswordIsShow = true
      
      // this.verifyMethod = 'password'
      this.toast.msg = `${this.language.text77}...`
      this.toast.icon = '/static/img/mine/loading.gif'
      // this.$nextTick(() => {
      //   uni.showToast({
      //     title: `${language.text77}...`,
      //     icon: 'loading',
      //     duration: 999999999
      //   })          
      // })
    },
    submitAgain() {
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
    toSetAddress() {
      uni.navigateTo({
        url: './setWithdrawAddress'
      })
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
          this.receiveAddress = this.$refs.addressInptval.childValue = ret.resp_result
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
      //       this.receiveAddress = this.$refs.addressInptval.childValue = res.result
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
    chooseAddress() {
      uni.navigateTo({
        url: './adres_book'
      })
    },
    chooseToken() {
      uni.navigateTo({
        url: './token_list'
      })
    },
    transferConfirm() { //转账确认
      if(this.btnLoading) return
      if (this.formData.gas !== '') return this.submitPopupIsShow = true
      let verify = true

      if (!this.selData) {
        verify = false
        this.$refs.notify.show('error', this.language.text106)
      }
      
      if (!this.receiveAddress) {
        verify = false
        this.$refs.notify.show('error', this.language.text107)
      }

      if (verify) {
        this.formData.validatorAddress = this.selData.delegation.validatorAddress
        // if (!this.isCustomFess) {
        this.btnLoading = true
        // }
        this.callSimulate = JSON.parse(JSON.stringify(this.formData))
        // this.submitPopupIsShow = true
      }
    },
    passwordButton() {
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.formData.validatorAddress = this.selData.delegation.validatorAddress
        this.callWithdraw = this.formData // 调用render.sendToken
        this.loading = true
        this.modalPasswordIsShow = false
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = `${this.language.text77}...`
        this.toast.icon = '/static/img/mine/loading.gif'
        // uni.showToast({
        //   title: `${language.text77}...`,
        //   icon: 'loading',
        //   mask: true,
        //   duration: 999999999
        // })
      }
    },
    testAmount() {
      // this.sendAmount = this.balance 
    },
    handlerWithdraw(res) {
      this.callWithdraw = 0
      this.loading = false
      if (res.code == 0) {
        this.$cache.set('_updateDelegateInfo', true, 0)
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = `${this.language.text78}`
        this.toast.icon = '/static/img/mine/success.png'
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/account/send/transactionDetails?data=${JSON.stringify(res)}`
          })
        }, 1500)
      } else {
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text79
        this.toast.icon = '/static/img/mine/fail.png'
        console.log(res)
        setTimeout(() => {
          this.showToast = false
        }, 3000)
      }
      this.callRenderGetBanlance++
    },
    handlerWithdrawAddress(res) {
      console.log(res, 'res response')
      this.callWithdrawAddress = 0
      if (res.withdrawAddress) {
        const wallet = this.currentWallet
        wallet.withdrawAddress = res.withdrawAddress
        // this.$refs.addressInptval.childValue = res.withdrawAddress
        this.$refs.addressInptval ? this.$refs.addressInptval.childValue = res.withdrawAddress : this.receiveAddress =
            res.withdrawAddress
        this.$cache.set('_currentWallet', wallet, 0)
        this.updateWalletList(wallet)
      } else {
        console.log('获取收益领取地址失败')
      }
    },
    getMinersCost(val) {
      if (val.speed == this.language.text108) {
        // this.sendFormData.gas = val.
        this.formData.gas = val.minersGas
        this.isCustomFess = true
      } else {
        this.isCustomFess = false
      }
      this.formData.gasPrice = val.amount
      this.formData.gas = ''
    },
    toAddressBook() {
      uni.navigateTo({
        url: '/pages/account/send/adres_book',
        events: {
          reciveAddress: (address) => {
            this.$refs.addressInptval.childValue = address
          }
        }
      })
    },
    selectNode(url) {
      // uni.redirectTo({
      //   url
      // })
      let _this = this
      uni.navigateTo({
        url,
        events: {
          indexChange: (index) => {
            this.selectIndex = index
            this.selData = this.$cache.get('_delegateInfo').list[index]
            this.formData.gas = ''
            this.balance = this.selData.rewards ? (this.selData.rewards.amount / mainCoin.delegateDecimals).toFixed(5) : 0
          }
        }
      })
    },
    handlerBalance(res) {
      const wallet = this.$cache.get('_currentWallet')
      
      const tokenList = wallet.coinList
      
      const tokenIndex = tokenList.findIndex(item => item.alias_name == mainCoin.alias_name)
      
      const token = tokenList.find(item => item.alias_name == mainCoin.alias_name)
      
      token.balance = res.balance.amount / mainCoin.decimals
      
      tokenList.splice(tokenIndex, 1, token)
      
      wallet.coinList = tokenList
      
      this.$cache.set('_currentWallet', wallet, 0)
      
      this.updateWalletList(wallet)
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
    },
    handlerGas(res) {
      if(this.btnLoading){
        this.btnLoading = false
        this.submitPopupIsShow = true
      }
      if (!res.code) {
        this.$cache.set('_minimumGas', res, 0)
      }
      if (res.code) return
      this.formData.gas = res
    },
    getMinimumGas() {
      if(!this.selData.delegation) return
      this.$cache.set('_minimumGas', 0, 0)
      this.formData.validatorAddress = this.selData.delegation.validatorAddress
      const data = JSON.parse(JSON.stringify(this.formData))
      this.callSimulate = {}
      this.$nextTick(() => {
        this.callSimulate = data
      })
    },
    gasError(res) {
		  // console.log(res)
		  this.$refs.notify.show('', this.language.text111)
		  this.btnLoading = false
      this.callSimulate = {}
    }
  },
  computed: {
    totalGas() {
      return new decimal(this.formData.gas + '').mul(new decimal(this.formData.gasPrice)).div(new decimal(mainCoin.decimals)).toString()
    }
  },
  onPullDownRefresh() {
    this.callWithdrawAddress = ''
    this.selData = ''
    this.balance = ''
    this.currentWallet = this.$cache.get('_currentWallet')
    this.formData.gas = ''
    this.isCustomFess = false
    this.formData.gasPrice = 0.015
    this.selectIndex = -1
    this.$refs.miners.resetMiners()
    
    this.$nextTick(() => {
      this.callWithdrawAddress = this.currentWallet.address
      uni.stopPullDownRefresh()
    })
  },
  onHide() {
    uni.stopPullDownRefresh()
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    withdrawDelegatorReward,
    getWithdrawAddress,
    getBalance,
    getSecret
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'
  import secretjs from '@/utils/secretjs/index.js'
  export default {
    methods: {
      async withdraw(val) {
        if (val == 0) return
        let res = {}
        try {
          // let gas = val.gas * mainCoin.decimals
          // console.log(val)
          res = await withdrawDelegatorReward(val, val.gas, val.gasPrice)
        } catch (e) {
          console.log(e)
          res.code = 7
        }
        renderUtils.runMethod(this._$id, 'handlerWithdraw', res, this)

      },
      async getWithdrawAddress(address) {
        if (address == 0) return
        let res = {}
        try {
          res = await getWithdrawAddress(address)
        } catch (e) {
          console.log(e)
          res.code = 7
        }
        renderUtils.runMethod(this._$id, 'handlerWithdrawAddress', res, this)
      },
      async getBalance(val) {
        if (val == 0) return;
        let wallet;
        //#ifdef APP-PLUS
        wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
        //#endif
        
        //#ifndef APP-PLUS 
        wallet = uni.getStorageSync('_currentWallet').data
        //#endif
        let res = await getBalance(wallet.address)
        
        renderUtils.runMethod(this._$id, 'handlerBalance', res, this)
      },
      async simulateFee(val) {
        if (!val.validatorAddress) return
        let res = {}
        const Secret = await getSecret()
        try {
          const msgWithdrawDelegationReward = new secretjs.MsgWithdrawDelegationReward(val)
          res = await Secret.tx.simulate([msgWithdrawDelegationReward], {
            feeDenom: 'ughm',
						gasPriceInFeeDenom:val.gasPrice
          })
          let gas = Math.ceil(res.gasInfo.gasUsed * 1.15)
          renderUtils.runMethod(this._$id, 'handlerGas', gas, this)
        } catch (e) {
          console.log(e);
          res.code = 7
					renderUtils.runMethod(this._$id, 'gasError', res, this) //错误调用gasError方法
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

  .sendPage {
    padding-top: calc(112rpx + var(--status-bar-height));
    background: #F4F6F9;
    height: 100vh;
  }

  .main-top {
    background: #FFFFFF;
		padding-bottom: 32rpx;
    width: 100%;

    .content {
      margin: 0 32rpx;
    }

    .line {
      height: 24rpx;
      background: #F4F6F9;
    }

    .content-top {

      .title {
        padding: 32rpx 0;
        font-weight: bold;
        font-size: 28rpx;
        color: #2C365A;
      }

      .tip {
        line-height: 36rpx;
        font-size: 24rpx;
        color: #EC2828;
      }
    }

    //收款地址
    .collection-adres {
      width: 100%;
      height: 156rpx;
    }

    .other {
      display: flex;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 24rpx;
      color: #2C365A;

      .title {
        flex: 1;
      }

      .num {
        flex: 1;
        text-align: right;
      }
    }

    .send-memo {
      margin-top: 32rpx;
    }
  }


  .main-bottom {
    width: 100%;
    background: #F4F6FA;

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
    }
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

  /deep/ .u-popup__content {
    border-top-left-radius: 16rpx !important;
    border-top-right-radius: 16rpx !important;


    .u-modal__content {
      padding: 48rpx 32rpx !important;
    }
  }

  .amount {

    .label {
      margin-bottom: 24rpx;
      padding-top: 32rpx;

      text {
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
      }
    }

    .value {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 144rpx;
      background-color: #F2F4F8;
      padding: 0 32rpx;
      border-radius: 16rpx;

      /deep/ .u-input {
        color: #2C365A;

        .uni-input-input {
          font-size: 40rpx;
          font-weight: 600;
        }

        .input-placeholder {
          font-size: 28rpx !important;
          color: #8397B1 !important;
        }
      }

      .right {
        display: flex;
        align-items: center;

        text {
          font-size: 28rpx;
          color: #2C365A;
        }

        .border {
          width: 2px;
          height: 24rpx;
          opacity: 0.4;
          background-color: #8397B1;
          margin: 0 23rpx;
        }

        .denom {
          font-weight: 600;
        }

        .all {
          color: #1E5EFF;
        }
      }

    }
  }

  .memo {
    .value {
      height: 96rpx;

      /deep/ .u-input {
        color: #2C365A;

        .uni-input-input {
          font-size: 32rpx;
          font-weight: 400;
        }
      }
    }
  }

  .btn {
    margin: 96rpx 32rpx 48rpx;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
    text-align: center;
    line-height: 96rpx;
  }

  .content-top {
    .title {
      padding: 32rpx 0;
      font-weight: bold;
      font-size: 28rpx;
      color: #2C365A;
    }

    .tip {
      font-size: 24rpx;
      color: #EC2828;
      line-height: 24rpx;
    }
  }

  .change-token {
    background: #FFFFFF;
    border: 2rpx solid rgba(131, 151, 177, 0.16);
    border-radius: 16rpx;
    height: 112rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 52rpx 32rpx;

    // margin-bottom: 24rpx;
    .name {
      font-size: 28rpx;
      color: #2C365A;
    }

    .address {
      font-size: 24rpx;
      color: #8397B1
    }

    &>image {
      width: 56rpx;
      height: 56rpx;
      margin-left: 32rpx;
      margin-right: 12rpx;
    }

    &>text {
      font-size: 28rpx;
      color: #8397B1;
    }

    .icon-right {
      image {
        width: 32rpx;
        height: 32rpx;
      }
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
        height: 96rpx;
        background-color: #F2F4F8;
        border-radius: 16rpx;
        align-items: center;

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
</style>

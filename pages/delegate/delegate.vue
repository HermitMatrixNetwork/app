<template>
  <view class="sendPage">
        <custom-notify ref="notify" style="z-index: 99"></custom-notify>
    <view :callSimulate="callSimulate" :change:callSimulate="render.simulateFee"></view>
    <view :callRenderGetBanlance="callRenderGetBanlance" :change:callRenderGetBanlance="render.getBalance"></view>
    <view class="mask" v-show="loading"></view>
    <view :updataDelegate="updataDelegate" :change:updataDelegate="render.delegate"></view>
    <custom-header :customStyle="{ 'z-index': 98 }" :title="language.text58" :style="titleStyle">
    </custom-header>
    <view class="top-border"></view>
    <view class="main-top">
      <view class="validator">
        <view class="label">
          <text>{{ delegatorInfo.validator_name }}</text>
        </view>
        <view class="value">
          <text>{{ delegatorInfo.operator_address }}</text>
        </view>
      </view>
      <view class="border"></view>
      <view class="content">
        <!-- 输入取消委托数量 -->
        <view class="send-amount">
          <view class="amount">
            <view class="label">
              <text>{{ language.text59 }}</text>
            </view>
            <view class="value">
              <u--input type="number" :placeholder="language.text60" v-model="formData.amount.amount" @input="sendAmountChange" :formatter="formatter"></u--input>
            </view>
          </view>
          <view class="other">
            <div class="title">{{ language.text61 }}：</div>
            <div class="num">{{ balance }} GHM</div>
          </view>
          <!--          <text v-if="sendAmount>balance" class="waringPrompt">输入金额超过钱包可用余额，请重新输入</text> -->
        </view>

        <view class="amount memo">
          <view class="label">
            <text>Memo</text>
          </view>
          <view class="value">
            <u--input :placeholder="language.text65" v-model="formData.memo" :formatter='dealFormatter'></u--input>
          </view>
        </view>
      </view>
    </view>
    <miners-column ref="miners" @getMinersCost="getMinersCost" :redirectUrl="redirectUrl" :minusIndex="minusIndex" :customData="minusData" @getMinimumGas="getMinimumGas"></miners-column>
    <view class="main-bottom">
      <view class="btn" @click="transferConfirm">
        <!-- {{ language.text68 }} -->
				<Submitbtn :loadingIsShow="btnLoading">{{ language.text68 }}</Submitbtn>
      </view>
    </view>

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
      :safeAreaInsetBottom="true">
      <view class="submitPopup">
        <view class="main">
          <view class="popup-title">
            {{ language.text25 }}
            <image src="/static/img/account/close.png" style="width: 32rpx;height: 32rpx;"
              @click="submitPopupIsShow=false"></image>
          </view>

          <!-- 发送账户 -->
          <view class="send-address">
            <text>{{ language.text26 }}</text>
            <text>{{userAddress}}</text>
          </view>

          <!-- 接收账户 -->
          <view class="receive_address">
            <text>{{ language.text27 }}</text>
            <text>{{receiveAddress}}</text>
          </view>

          <!-- 委托数量 -->
          <view class="transfer_amount">
            <text>{{ language.text59 }}</text>
            <text>{{ formData.amount.amount ? formData.amount.amount:'0' }}{{ mainCoin.alias_name }}</text>
          </view>

          <!--Memo-->
          <view class="memo_type">
            <text>Memo</text>
            <text class="memo">{{ formData.memo }}</text>
          </view>

          <!--矿工费-->
          <view class="miners_fee">
            <text>{{ language.text29 }}</text>
            <!-- <custom-loading v-if="feeLoading"></custom-loading> -->
            <view>
              <view>{{ formData.gas }} * {{ formData.gasPrice }} ughm</view>
              <view class="price">{{ totalGas }} GHM</view>
            </view>
          </view>
        </view>
        <view class="submit-btn" @click="submitAgain">
          {{ language.text68 }}
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
import Submitbtn from '@/pages/account/send/components/submit-btn.vue'
import mainCoin from '@/config/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
import verifyTouchID from './mixins/verifyTouchID.js'
import language from './language/index.js'
import decimal from 'decimal'
import reflsh from '@/utils/reflesh.js'
import mixins from '@/pages/delegate/mixins/index.js'
export default {
  mixins: [verifyTouchID, reflsh,mixins],
  components: {
    InputTitle,
    Submitbtn
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      confirmData: {},
      updataDelegate: 0, //更新委托
      tokenUrl: '@/static/img/placeholder.jpeg',
      tokenName: 'GHM',
      inputVal: '',
      balance: 0,
      receiveAddress: this.$cache.get('_currentWallet').address, //接收地址
      wallet: this.$cache.get('_currentWallet'),
      payPassword: '', //资金密码
      passwordEye: false,
      passwordCheck: false, //密码校验
      submitPopupIsShow: false,
      modalPasswordIsShow: false,
      userAddress: this.$cache.get('_currentWallet').address,
      titleStyle: {
        background: '#FFFFFF'
      },
      delegatorInfo: {},
      //发送金额样式
      sendAmountStyle: {
        fontSize: '28rpx',
        color: '#8397B1',
        marginTop: '0'
      },
      formData: {
        amount: {
          amount: '',
          denom: 'ughm'
        }, //发送金额
        memo: '',
        gas: '',
        gasPrice: '',
        delegatorAddress: '',
        validatorAddress: ''
      },
      mainCoin,
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
      callRenderGetBanlance: 0,
      callSimulate: {},
      feeLoading: true,
      minusIndex: 1,
      minusData: {},
      btnLoading:false,
    }
  },
  onLoad(value) {
    if (this.touchId) this.verifyMethod = 'touchID'
    this.balance = this.wallet.coinList[0].balance
    this.delegatorInfo = JSON.parse(value.data)
    this.formData.validatorAddress = this.delegatorInfo.operator_address
    this.formData.delegatorAddress = this.userAddress
    this.redirectUrl = `/pages/delegate/delegate?data=${value.data}`
    if (value.minusIndex) {
      this.minusIndex = Number(value.minusIndex)
    }
    
    if (value.minusData) {
      this.minusData = JSON.parse(value.minusData)
      this.redirectUrl = `/pages/delegate/delegate?data=${value.data}&minusIndex=${value.minusIndex}&minusData=${value.minusData}`
    }
  },
  methods: {
    verifyTouchIDOverTime() {
      this.showToast = false
    },
    verifyTouchIDFail() {
      this.showToast = false
    },
    closeModalPasswordIsShow() {
      this.payPassword = ''
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
    sendAmountChange(val) {
      this.showAmountError = this.balance < this.formData.amount.amount ? true : false
    },
    formatter(val) {
      let num = val.replace(/[^\d.]/g,'')
      	
      if (num.split('.')[1] && num.split('.')[1].length > 6) {
        return `${num.split('.')[0]}.${num.split('.')[1].substr(0, 6)}`
      } else {
        return num
      }
    },
    hideModel() {
      this.modalPasswordIsShow = false
    },
    verifyTouchIDSuccess() {
      this.$nextTick(() => {
        // this.passwordCheck = false
        // this.loading = true
        // this.updataDelegate = this.formData
        // @todo 跳转到资产详情页再执行交易
        this.verifyTouchID = 3
        this.showToast = false
        // this.modalPasswordIsShow = true
        // this.verifyMethod = 'password'
        // this.toast.msg = this.language.text77 + '...'
        // this.toast.icon = '/static/img/mine/loading.gif'
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
    passwordButton() {
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.loading = true
        this.passwordCheck = false
        this.updataDelegate = this.formData // 调用render.sendToken
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
        this.modalPasswordIsShow = false
      }
    },
    chooseAddress() {
      uni.navigateTo({
        url: './adres_book'
      })
    },
    goTo(url) {
      uni.navigateTo({
        url
      })
    },
    transferConfirm() { //转账确认
			
      if(this.btnLoading) return
      if (this.formData.gas !== '') return this.submitPopupIsShow = true
      let verify = true
      let amount = this.formData.amount.amount
      if (amount == '' || amount <= 0) {
        verify = false
        this.$refs.notify.show('error', this.language.text80)
      } else if (amount > this.balance) {
        verify = false
        this.$refs.notify.show('error', this.language.text81)
      } else {
        this.$refs.notify.close()
      }

      if (verify) {
        // if (!this.isCustomFess) {
        // this.feeLoading = true
        this.btnLoading = true
        // }
        this.callSimulate = JSON.parse(JSON.stringify(this.formData))
        // this.submitPopupIsShow = true
      }
    },
    testAmount() {
      this.formData.amount.amount = this.balance
    },
    getMinersCost(val) {
      this.formData.gasPrice = val.amount
      if(this.minusData.amount) {
        this.formData.gas = this.minusData.minersGas
        this.formData.gasPrice = this.minusData.amount
        this.isCustomFess = true
      } else if (val.speed == this.language.text108) {
        // this.sendFormData.gas = val.
        this.formData.gas = val.minersGas
        this.isCustomFess = true
      } else {
        this.isCustomFess = false
      }
     
    },
    handlerResult(res) {
      console.log(res)
      this.loading = false
      this.updataDelegate = 0
      if (res.code == 0) {
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text78
        this.toast.icon = '/static/img/mine/success.png'
        this.$cache.set('_updateDelegateInfo', true, 0)

        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/account/send/transactionDetails?data=${JSON.stringify(res)}&redirectUrl=/pages/delegate/index`
          })
        }, 1500)
      } else {
        // uni.showToast({
        //   title: this.language.text79,
        //   image: '/static/img/mine/fail.png',
        //   mask: true,
        //   duration: 3000,
        // })
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text79
        this.toast.icon = '/static/img/mine/fail.png'
        setTimeout(() => {
          this.showToast = false
        }, 3000)
      }
      this.callRenderGetBanlance++
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
      // this.feeLoading = false
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
      if(!this.formData.amount.amount) return
      this.$cache.set('_minimumGas', 0, 0)
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
		  this.formData.amount.amount = ''
    },
    dealFormatter(val){
      return this.dealInputValue(val)
    }
  },
  computed: {
    totalGas() {
      return new decimal(this.formData.gas + '').mul(new decimal(this.formData.gasPrice)).div(new decimal(mainCoin.decimals)).toString()
    }
  },
  watch:{
    'formData.amount.amount':{
		  handler(val){
		    // console.log(val)
		    this.formData.gas = ''
		  },
		  deep:true
    },
  },
  onPullDownRefresh() {
    this.$refs.miners.resetMiners()
    this.formData.gas = ''
    this.isCustomFess = false
    this.formData.gasPrice = 0.015
    this.formData.amount.amount = ''
    this.formData.memo = ''
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1500)
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    toDelegate,
    getBalance,
    getSecret
  } from '@/utils/secretjs/SDK'
  import mainCoin from '@/config/index.js'
  import renderUtils from '@/utils/render.base.js'
  import secretjs from '@/utils/secretjs/index.js'
  export default {
    methods: {
      async delegate(val) {
        if (val == 0) return
        let {
          memo,
          ...data
        } = JSON.parse(JSON.stringify(val))
        let res = {}
        data.amount.amount = data.amount.amount * mainCoin.decimals + ''
        try {
          res = await toDelegate(data, memo, data.gas, data.gasPrice)
        } catch (e) {
          console.log(e)
          res.code = 7
        }
        renderUtils.runMethod(this._$id, 'handlerResult', res, this)
      },
      async getBalance(val) {
        if (val == 0) return
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
        let {
          memo,
          ...data
        } = JSON.parse(JSON.stringify(val))
        let res = {}
        data.amount.amount = data.amount.amount * mainCoin.decimals + ''
        const Secret = await getSecret()
        try {
          const msgDelegate = new secretjs.MsgDelegate(data)
          res = await Secret.tx.simulate([msgDelegate], {
            feeDenom: 'ughm',
          })
          let gas = Math.ceil(res.gasInfo.gasUsed * 1.15)
          renderUtils.runMethod(this._$id, 'handlerGas', gas, this)
        } catch (e) {
          console.log(e);
          res.code = 7
					renderUtils.runMethod(this._$id, 'gasError', res, this) //错误调用gasError方法
        }
      }
    },
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
    padding-bottom: 48rpx;

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
        font-size: 24rpx;
        color: #EC2828;
        line-height: 24rpx;
        padding: 24rpx 0;
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

    //收款地址
    .collection-adres {
      width: 100%;
      height: 156rpx;
    }

    //发送金额
    .send-amount {
      margin-top: 32rpx;
      position: relative;

      .balance {
        font-weight: 400;
        font-size: 24rpx;
        color: #8397B1;
        letter-spacing: 0;
        text-align: right;
        line-height: 24rpx;
      }

      .choose-num {
        font-size: 28rpx;
        background-color: #F2F4F8;
        color: #2C365A;



      }

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

    .send-memo {}
  }


  .main-bottom {
    width: 100%;

    .submit-btn {
      margin: 0 64rpx;
      height: 96rpx;
      position: relative;
      top: 116rpx;
      background: #002FA7;
      border-radius: 16rpx;
      text-align: center;
      line-height: 96rpx;
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
        .memo {
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
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
          }
        }
      }

    }

  }


  .submit-btn {
    margin: 0 64rpx;
    height: 96rpx;
    position: relative;
    top: 116rpx;
    background: #002FA7;
    border-radius: 16rpx;
    text-align: center;
    line-height: 96rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
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
          font-weight: 400;
        }
      }

      text {
        font-size: 28rpx;
        color: #1E5EFF;
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

  .validator {
    background-color: #fff;
    padding: 48rpx 32rpx 33rpx;

    .label {
      font-weight: 600;
      font-size: 28rpx;
      color: #2C365A;
      margin-bottom: 16rpx;
    }

    .value {
      font-size: 24rpx;
      color: #8397B1;
    }
  }

  .border {
    height: 2rpx;
    background-color: rgba(131, 151, 177, 0.20);
    margin: 0 32rpx;
  }

  .top-border {
    height: 2rpx;
    background-color: rgba(131, 151, 177, 0.20);
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

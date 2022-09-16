<template>
  <view class="sendPage">
    <view :callRenderGetBanlance="callRenderGetBanlance" :change:callRenderGetBanlance="render.getBalance"></view>
    <view :callSimulate="callSimulate" :change:callSimulate="render.simulateFee"></view>
    <view class="mask" v-show="loading"></view>
    <view :updataDelegate="updataDelegate" :change:updataDelegate="render.unDelegate"></view>
    <custom-header tabUrl="/pages/delegate/index" :title="language.text06" :style="titleStyle">
    </custom-header>
    <view class="scroll-view">
      <view class="main-top">
        <!-- 选择取消委托节点 -->
        <view class="content">
          <view class="content-top">
            <view class="title">
              {{ language.text13 }}
            </view>
            <view class="change-token"
              @click="selectNode(`/pages/delegate/selectNode?selectIndex=${selectIndex}&redirectURL=/pages/delegate/cancel`)">
      
              <view v-if="selData">
                <view class="name">{{selData.validator.description.moniker}}</view>
                <view class="address">{{selData.validator.operatorAddress| sliceAddress(10, -10)}}</view>
              </view>
              <text v-else>{{ language.text14 }}</text>
              <view class="icon-right">
                <image src="/static/img/ic-arrow1.png"></image>
              </view>
            </view>
            <view class="tip">
              {{ language.text15 }}
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
                <text>{{ language.text16 }}</text>
              </view>
              <view class="value">
                <u--input :placeholder="language.text17" type="number" v-model="formData.amount.amount"
                  @change="sendAmountChange" :formatter="formatter">
                </u--input>
                <text @click="testAmount">{{ language.text18 }}</text>
              </view>
            </view>
            <!-- 输入金额超过选中节点委托数量，请重新输入 -->
              <text class="waringPrompt" :style="{ opacity: showAmountError ? 1 : 0 }">{{ language.text102 }}</text>
            <view class="other">
              <div class="title">{{ language.text19 }}：</div>
              <div class="num" v-if="selData">{{selData.balance.amount / mainCoin.decimals }} GHM</div>
              <div class="num" v-else>0 GHM</div>
            </view>
          </view>
      
          <view class="amount memo">
            <view class="label">
              <text>Memo</text>
            </view>
            <view class="value">
              <u--input :placeholder="language.text65" v-model="formData.memo"></u--input>
            </view>
          </view>
        </view>
      </view>
      <miners-column @getMinersCost="getMinersCost"></miners-column>
      <view class="main-bottom">
        <view class="btn" @click="transferConfirm">
          {{ language.text20 }}
        </view>
      </view>
      
      <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" :safeAreaInsetBottom="true">
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
              <text>{{ formData.delegatorAddress }}</text>
            </view>
      
            <!-- 接收账户 -->
            <view class="receive_address">
              <text>{{ language.text27 }}</text>
              <text>{{ formData.delegatorAddress }}</text>
            </view>
      
            <!-- 取消委托数量 -->
            <view class="transfer_amount">
              <text>{{ language.text28 }}</text>
              <text>{{formData.amount.amount ? formData.amount.amount : '0' }}{{tokenName}}</text>
            </view>
      
            <!--Memo-->
            <view class="memo_type">
              <text>Meno</text>
              <text>{{ formData.memo }}</text>
            </view>
      
            <!--矿工费-->
            <view class="miners_fee">
              <text>{{ language.text29 }}</text>
              <custom-loading v-if="feeLoading"></custom-loading>
              <view v-else>
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
      
      <custom-notify ref="notify"></custom-notify>
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

  </view>
</template>

<script>
import InputTitle from '@/pages/account/send/components/Input-title.vue'
import mixin from './mixins/index.js'
import mainCoin from '@/config/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
import verifyTouchID from './mixins/verifyTouchID.js'
import language from './language/index.js'
import decimal from 'decimal'
export default {
  mixins: [mixin, verifyTouchID],
  components: {
    InputTitle
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      selData: '', //选择的委托
      confirmData: {},
      updataDelegate: 0, //更新委托
      tokenUrl: '@/static/img/placeholder.jpeg',
      tokenName: 'GHM',
      inputVal: '',
      balance: 0,
      payPassword: '', //资金密码
      passwordCheck: false, //密码校验
      submitPopupIsShow: false,
      modalPasswordIsShow: false,
      titleStyle: {
        background: '#FFFFFF'
      },
      //发送金额样式
      sendAmountStyle: {
        fontSize: '28rpx',
        color: '#8397B1',
        marginTop: '0'
      },
      showAmountError: false,
      passwordEye: false,
      selectIndex: -1,
      mainCoin,
      formData: {
        amount: {
          amount: '',
          denom: 'ughm'
        }, //发送金额
        memo: '', //Memo
        delegatorAddress: this.$cache.get('_currentWallet').address,
        validatorAddress: '',
        gas: '',
        gasPrice: ''
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
      callRenderGetBanlance: 0,
      callSimulate: {},
      feeLoading: true
    }
  },
  onLoad(options) {
    if (this.touchId) this.verifyMethod = 'touchID'
    const index = options.selectIndex
    if (index > -1) {
      this.selData = this.$cache.get('_delegateInfo').list[index]
      this.balance = this.selData.balance.amount / mainCoin.decimals
      this.selectIndex = index
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
    hideModel() {
      this.modalPasswordIsShow = false
    },
    verifyTouchIDSuccess() {
      this.$nextTick(() => {
        this.passwordCheck = false
        this.formData.validatorAddress = this.selData.delegation.validatorAddress
        this.updataDelegate = this.formData
        this.loading = true
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text77 + '...'
        this.toast.icon = '/static/img/mine/loading.gif'
        // this.$nextTick(() => {
        //   uni.showToast({
        //     title: `${language.text77}...`,
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
    transferConfirm() { //转账确认
      let verify = true

      if (this.showAmountError) {
        verify = false
      }

      if (this.formData.amount.amount == '' || this.formData.amount.amount == 0) {
        verify = false
        this.$refs.notify.show('error', this.language.text105)
      }

      if (!this.selData) {
        verify = false
        this.$refs.notify.show('error', this.language.text106)
      }

      if (verify) {
        this.formData.validatorAddress = this.selData.delegation.validatorAddress
        this.callSimulate = this.formData
        this.submitPopupIsShow = true
      }

    },
    passwordButton() {
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.formData.validatorAddress = this.selData.delegation.validatorAddress
        this.updataDelegate = this.formData // 调用render.sendToken
        this.loading = true
        this.modalPasswordIsShow = false
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text77 + '...'
        this.toast.icon = '/static/img/mine/loading.gif'
        // uni.showToast({
        //   title: `${language.text77}...`,
        //   icon: 'loading',
        //   mask: true,
        //   duration: 999999999
        // })
      }
    },
    handlerResult(res) {
      this.updataDelegate = 0
      this.loading = false
      if (res.code == 0) {
        this.$cache.set('_updateDelegateInfo', true, 36000)
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text78
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
        setTimeout(() => {
          this.showToast = false
        }, 3000)
        console.log(res)
      }
      this.callRenderGetBanlance++
    },
    testAmount() {
      this.showAmountError = false
      this.formData.amount.amount = this.balance
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
    },
    selectNode(url) {
      uni.redirectTo({
        url
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
      this.feeLoading = false
      if (res.code || this.isCustomFess) return
      this.formData.gas = res
    },
  },
  computed: {
    totalGas() {
      return new decimal(this.formData.gas + '').mul(new decimal(this.formData.gasPrice)).div(new decimal(mainCoin.decimals)).toString()
    }
  },
  watch: {
    modalPasswordIsShow: {
      handler(val) {
        if (!val) {
          this.passwordCheck = false
          this.payPassword = ''
        }
      }
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    unDelegate,
    getBalance,
    getSecret
  } from '@/utils/secretjs/SDK'
  import mainCoin from '@/config/index.js'
  import renderUtils from '@/utils/render.base.js'
  import secretjs from '@/utils/secretjs/index.js'
  export default {
    methods: {
      async unDelegate(val) {
        if (val == 0) return
        let {
          memo,
          ...data
        } = JSON.parse(JSON.stringify(val))
        let res = {}
        data.amount.amount = data.amount.amount * mainCoin.decimals + ''
        try {
          res = await unDelegate(data, memo, data.gas, data.gasPrice)
        } catch (e) {
          console.log(e)
          res.code = 7
        }
        renderUtils.runMethod(this._$id, 'handlerResult', res, this)
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
        let {
          memo,
          ...data
        } = JSON.parse(JSON.stringify(val))
        let res = {}
        data.amount.amount = data.amount.amount * mainCoin.decimals + ''
        const Secret = await getSecret()
        try {
          const msgUndelegate = new secretjs.MsgUndelegate(data, )
          res = await Secret.tx.simulate([msgUndelegate], {
            feeDenom: 'ughm',
          })
          let gas = Math.ceil(res.gasInfo.gasUsed * 1.15)
          renderUtils.runMethod(this._$id, 'handlerGas', gas, this)
        } catch (e) {
          console.log(e);
          res.code = 7
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .scroll-view {
    height: calc(100vh - 112rpx - var(--status-bar-height));
    overflow-y: scroll;
  }
  
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
    height: 100vh;
    overflow: hidden;
    background: #F4F6F9;
  }

  .main-top {
    background: #FFFFFF;
    padding-bottom: 48rpx;
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
        font-size: 24rpx;
        color: #EC2828;
        line-height: 24rpx;
        padding: 24rpx 0;
        line-height: 30rpx;
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
      font-size: 24rpx;
      color: #2C365A;
      margin-top: 10rpx;

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
    // position: absolute;
    // bottom: 64rpx;
    // left: 50%;
    // transform: translateX(-50%);
    margin: 48rpx auto 0;
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
        align-items: center;
        background-color: #F2F4F8;
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

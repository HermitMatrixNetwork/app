<template>
  <view class="sendPage">
    <view class="mask" v-show="transferLoading"></view>
    <custom-header :title="language.text15" :style="titleStyle">
      <template #right>
        <u-icon :name="require('@/static/img/account/saoma.png')" size="44rpx" @click="scanCode" />
      </template>
    </custom-header>
    <view class="main-top">

      <view class="content">

        <!-- 代币选择 -->
        <view class="change-token" @click="jumpTokenlist">
          <image :src="token.logo"></image>
          <text>{{ token.alias_name }}</text>
          <view class="icon-right">
            <u-icon name="arrow-right" />
          </view>
        </view>

        <!-- 收款地址 -->
        <view class="collection-adres">
          <InputTitle :title="language.text16" :type="'text'" :placeholder="language.text17" ref="addressInptval"
            :inputVal.sync="sendFormData.receiveAddress">
            <template #title-icon>
              <u-icon :name="require('../../../static/img/account/addressbook.png')" size="44rpx"
                @click="toAddressBook"></u-icon>
            </template>
          </InputTitle>
          <text :style="{ opacity: showAddressErrorTip ? 1 : 0 }" class="waringPrompt">收款地址不能为空</text>
        </view>

        <!-- 发送金额 -->
        <view class="send-amount">
          <view class="send-amount">
            <view class="amount">
              <view class="label">
                <text>{{ language.text18 }}</text>
                <view class="can-be-use">
                  可用： 
                  <custom-loading v-if="loading"></custom-loading>
                  <text v-else>{{ token.balance || '0.00' }} {{ token.alias_name }}</text>
                </view>
              </view>
              <view class="value">
                <u--input placeholder="请输入金额" type="number" v-model="sendFormData.sendAmount"></u--input>
                <view class="value-info">
                  <text class="denom">{{ token.alias_name }}</text>
                  <view class="border"></view>
                  <text class="all" @click="testAmount">{{ language.text21 }}</text>
                </view>
              </view>
            </view>
          </view>
          <text v-if="sendFormData.sendAmount > token.balance" class="waringPrompt">输入金额超过钱包可用余额，请重新输入</text>
          <text v-else-if="showAmountErrorTip" class="waringPrompt">转账金额不能为0</text>
        </view>

        <view class="send-memo">
          <InputTitle :title="'Memo'" :type="'text'" :placeholder="language.text106" :inputVal.sync="sendFormData.memo">
          </InputTitle>
        </view>
      </view>
    </view>

    <view class="main-bottom">
      <miners-column @getMinersCost="getMinersCost"></miners-column>

      <view class="submit-btn" @click="transferConfirm">
        <Submitbtn>{{ language.text144 }}</Submitbtn>
      </view>
    </view>

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" class="double-check-popup"
      :safeAreaInsetBottom="true">
      <view class="submitPopup">
        <view class="main">
          <view class="popup-title">
            {{ language.text42 }}
            <u-icon :name="require('../../../static/img/account/close.png')" size="32rpx"
              @click="submitPopupIsShow=false"></u-icon>
          </view>

          <!-- 发送账户 -->
          <view class="send-address">
            <text>{{language.text43}}</text>
            <text>{{sendFormData.userAddress}}</text>
          </view>

          <!-- 接收账户 -->
          <view class="receive_address">
            <text>{{ language.text174 }}</text>
            <text>{{sendFormData.receiveAddress}}</text>
          </view>

          <!-- 转账金额 -->
          <view class="transfer_amount">
            <text>{{ language.text45 }}</text>
            <text>{{sendFormData.sendAmount?sendFormData.sendAmount:'0'}} {{ token.alias_name }}</text>
          </view>

          <!--Memo-->
          <view class="memo_type">
            <text>Meno</text>
            <text>{{ sendFormData.memo }}</text>
          </view>

          <!--矿工费-->
          <view class="miners_fee">
            <text>{{language.text46}}</text>
            <view>
              <view>{{ token.alias_name == mainCoin.alias_name ? 25000 : 40000 }} GWEI * {{ sendFormData.gas }} GasPrice</view>
              <view class="price">{{ token.alias_name == mainCoin.alias_name ? 25000 * sendFormData.gas : 40000 * sendFormData.gas }} GHM</view>
            </view>
          </view>
        </view>
        <view class="submit-btn" @click="submitAgain">
          <Submitbtn>{{ language.text47 }}</Submitbtn>
        </view>
      </view>
    </u-popup>

    <u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
      <view class="modal_main">
        <view class="modal_title">
          <view>
            {{ verifyMethod == 'touchID' ? `指纹验证` : language.text48 }}
            <text v-if="verifyMethod == 'touchID' && verifyTouchErrorTip !== ''" class="verifyTouchErrorTip">({{ verifyTouchErrorTip }})</text>
          </view>
          <u-icon :name="require('../../../static/img/account/close.png')" size="32rpx"
            @click="closeModalPasswordIsShow"></u-icon>
        </view>
        <!--  -->
        <view v-if="verifyMethod == 'password'">
          <view class="item">
            <view class="item-input item-input-password">
              <u-input :password="!passwordEye" v-model="payPassword" :placeholder="language.text49">
              </u-input>
              <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'"
                @click="passwordEye = !passwordEye">
              </u-icon>
            </view>
          </view>
          <text v-if="passwordCheck" class="waringPrompt">{{ language.text51 }}</text>
          <u-button @click="passwordButton" class="btn">{{ language.text107 }}</u-button>
        </view>
        <view v-else class="touch-verify">
          <view class="logo">
            <image src="/static/img/mine/zhiwen.png" style="width: 88rpx; height: 88rpx;"></image>
          </view>
        </view>
        <view v-if="touchId" class="changeVerifyMethod" @click="changeVerifyMethod">切换验证方式</view>
      </view>
    </u-modal>
    <view :check="checkSuccess" :change:check="render.sendToken"></view>
    
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
import InputTitle from './components/Input-title.vue'
import languages from '../language/index.js'
import Submitbtn from './components/submit-btn.vue'
import {
  SendTokentoOtherAddress,
  getBalance
} from '@/utils/secretjs/SDK.js'
import mixin from '../mixins/index.js'
import verifyTouchID from '../mixins/verifyTouchID.js'
import WalletCrypto from '@/utils/walletCrypto.js'
import mainCoin from '@/config/index.js'
export default {
  mixins: [mixin, verifyTouchID],
  components: {
    InputTitle,
    Submitbtn
  },
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      verifyMethod: 'password',
      tokenUrl: '/static/img/account/uGHM.png',
      tokenName: 'GHM',
      inputVal: '',
      payPassword: '', //资金密码
      passwordCheck: false, //密码校验
      verifyTouchErrorTip: '',
      submitPopupIsShow: false,
      modalPasswordIsShow: false,
      checkSuccess: 0,
      sendFormData: {
        userAddress: this.$cache.get('_currentWallet').address,
        receiveAddress: '', //接收地址
        sendAmount: '', //发送金额
        memo: '',
        token: {},
        gas: '',
        decimals: null
      },
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
      token: {},
      showAddressErrorTip: false,
      showAmountErrorTip: false,
      passwordEye: false,
      loading: false,
      transferLoading: false,
      // 指纹验证
      touchId: this.$cache.get('_touchId'),
      showToast: false,
      toast: {
        icon: '/static/img/mine/loading.gif',
        // msg: '失败次数超出限制，请稍后再设置',
        msg: '失败次数超出限制，请切换其它方式验证'
      },
      mainCoin
    }
  },
  onLoad(options) {
    if (this.touchId) this.verifyMethod = 'touchID'
    if (options.tokenID) {
      this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
    } else {
      this.token = this.$cache.get('_currentWallet').coinList[0]
    }
    this.sendFormData.decimals = this.token.decimals || 1
    
    this.sendFormData.token = this.token
    
    clearInterval(this.timer)
    if (this.token.loadingBalance) {
      this.loading = true
      this.timer = setInterval(() => {
        const latestTokenInfo = this.$cache.get('_currentWallet').coinList.find(item => item.ID == this.token.ID)
        this.token.balance = latestTokenInfo.balance
        if (!latestTokenInfo.loadingBalance) {
          clearInterval(this.timer)
          this.loading = false
        }
      }, 1000)
    }
  },
  methods: {
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
    hideModel() {
      this.modalPasswordIsShow = false
    },
    verifyTouchIDSuccess() {
      this.$nextTick(() => {
        this.checkSuccess = this.sendFormData
        this.transferLoading = true
        this.$nextTick(() => {
          uni.showToast({
            title: '交易中',
            icon: 'loading',
            duration: 999999999
          })          
        })
      })
    },
    async submitAgain() {
      this.modalPasswordIsShow = true
      // #ifdef APP-PLUS
      if (this.touchId ) {
        this.verify()
      }
      // #endif
      
      // #ifndef APP-PLUS
      this.touchId = 0
      // #endif
      
      this.submitPopupIsShow = false
    },
    async transferConfirm() { //转账确认
      const {
        receiveAddress,
        sendAmount,
        memo
      } = this.sendFormData
      
      if (receiveAddress.trim() === '') {
        this.showAddressErrorTip = true
      } else {
        this.showAddressErrorTip = false
      }

      if (sendAmount == '' || sendAmount <= 0) {
        this.showAmountErrorTip = true
      } else {
        this.showAmountErrorTip = false
      }

      // && this.sendFormData.sendAmount < this.token.balance   
      console.log(this.showAddressErrorTip, this.showAmountErrorTip, this.sendFormData.sendAmount <= this.token.balance)
      if (!this.showAddressErrorTip && !this.showAmountErrorTip && this.sendFormData.sendAmount <= this.token.balance) {
        this.submitPopupIsShow = true
      }
    },
    async passwordButton() {
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.checkSuccess = this.sendFormData // 调用render.sendToken
        this.modalPasswordIsShow = false
        this.transferLoading = true
        uni.showToast({
          title: '交易中',
          icon: 'loading',
          mask: true,
          duration: 999999999
        })
      }
    },
    testAmount() {
      this.sendFormData.sendAmount = this.token.balance
    },
    getMinersCost(val) {
      this.sendFormData.gas = val.amount
    },
    scanCode() { //扫码
      uni.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: (res) => {
          this.receiveAddress = this.$refs.addressInptval.childValue = res.result
        },
      })
    },
    jumpTokenlist() { //代币选择
      uni.navigateTo({
        url: '/pages/account/send/token_list',
        events: {
          changeToken: (data) => {
            this.token = data
            this.sendFormData.token = this.token
            clearInterval(this.timer)
            if (this.token.loadingBalance) {
              this.loading = true
              this.timer = setInterval(() => {
                const latestTokenInfo = this.$cache.get('_currentWallet').coinList.find(item => item.ID == this.token.ID)
                this.token.balance = latestTokenInfo.balance
                if (!latestTokenInfo.loadingBalance) {
                  clearInterval(this.timer)
                  this.loading = false
                }
              }, 1000)
            }
          }
        }
      })
    },
    dealSuccessJump({ res: result, otherToken }) {
      this.transferLoading = false
      this.checkSuccess = 0
      let fee, usedAmount
      if (!otherToken && result.tx) {
        fee = result.tx.authInfo.fee.amount[0].amount / (this.token.decimals || 1)
        usedAmount = this.sendFormData.sendAmount
      }
      uni.hideToast()
      const eventChannel = this.getOpenerEventChannel()
      if (result.code == 0) {
        uni.showToast({
          title: '交易成功',
          image: '/static/img/mine/success.png',
          mask: true,
          duration: 3000,
          complete: () => {
            setTimeout(() => {
              uni.redirectTo({
                url: `./transactionDetails?data=${JSON.stringify(result)}`
              })
              eventChannel.emit('addRecordToSendList', result)
            }, 1500)
          }
        })

        !otherToken && fee && (this.token.balance = this.token.balance - fee - usedAmount)
      } else {
        uni.showToast({
          title: '交易失败',
          image: '/static/img/mine/fail.png',
          mask: true,
          duration: 3000
        })
        !otherToken && fee && (this.token.balance = this.token.balance - fee)
      }

      const wallet = this.$cache.get('_currentWallet')

      const tokenList = wallet.coinList

      const tokenIndex = tokenList.findIndex(item => item.alias_name == this.token.alias_name)

      tokenList.splice(tokenIndex, 1, this.token)

      wallet.coinList = tokenList

      this.$cache.set('_currentWallet', wallet, 0)

      this.updateWalletList(wallet)
      
      this.checkSuccess = 0
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
    SendTokentoOtherAddress,
    getBalance,
    transferOtherToken,
    getOtherTransationHistory
  } from '@/utils/secretjs/SDK.js'
  import WalletCrypto from '@/utils/walletCrypto.js'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'
  export default {
    methods: {
      async sendToken(newValue) {
        if (newValue == 0) return
        let res = {}
        let otherToken = false
        let {
          receiveAddress,
          userAddress,
          sendAmount,
          memo,
          gas,
          decimals
        } = newValue
        gas = gas * mainCoin.decimals
        if (newValue.token.alias_name == mainCoin.alias_name) {
          sendAmount = sendAmount * mainCoin.decimals
          try {
            res = await SendTokentoOtherAddress(userAddress, receiveAddress, sendAmount, memo, gas)
          } catch (e) {
            console.log(e);
            res.code = 7
          }
        } else {
          try {
            otherToken = true
            const result = await transferOtherToken({
              sender: userAddress,
              contractAddress: newValue.token.contract_address,
              codeHash: newValue.token.codeHash,
              msg: {
                transfer: {
                  recipient: receiveAddress,
                  amount: sendAmount * newValue.token.decimals + ''
                }
              }
            }, newValue.memo, gas)
            if (result.code !== 0) throw result
            res = (await getOtherTransationHistory({
              contract: { address: newValue.token.contract_address, codeHash: newValue.token.codeHash },
              address: userAddress,
              auth: { key: newValue.token.view_key }
            }, {
              page_size: 1,
              page: 1
            }, newValue.token)).transaction_history.txs[0]
            console.log('record', res)
            for(let val of Object.values(res.action)) {
              res.to_address = val.recipient
              res.from_address = val.from
              res.sender = val.sender
            }
            res.type = res.to_address == userAddress ? 'recipient' : 'transfer'
            
            res.amount = res.coins.amount / newValue.token.decimals + newValue.token.alias_name
            res.timestamp = new Date(res.block_time * 1000).toLocaleString()
            res.code = 0
          } catch(e) {
            console.log(e);
            res.code = 7
          }
        }
        renderUtils.runMethod(this._$id, 'dealSuccessJump', { res, otherToken }, this)

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
    background: rgba(0,0,0,.5) !important;
    z-index: 9999;
  }
  .sendPage {
    width: 100%;
    height: 100%;
    background: #F4F6FA;
  }

  .main-top {
    background: #FFFFFF;
    padding-top: 48rpx;
    height: 812rpx;
    width: 100%;

    .content {
      margin: 0 32rpx;
    }

    .change-token {
      background: #FFFFFF;
      border: 2rpx solid rgba(131, 151, 177, 0.16);
      border-radius: 16rpx;
      height: 112rpx;
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 40rpx;

      &>image {
        width: 56rpx;
        height: 56rpx;
        margin-left: 32rpx;
        margin-right: 12rpx;
      }

      &>text {
        font-size: 32rpx;
        color: #2C365A;
        font-family: PingFangSC-Medium;
        font-weight: 600;
      }

      .icon-right {
        position: absolute;
        right: 20rpx;
      }
    }

    //收款地址
    .collection-adres {
      width: 100%;
      // height: 156rpx;
    }

    //发送金额
    .send-amount {
      margin-top: 56rpx;
      position: relative;

      .balance {
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 24rpx;
        color: #8397B1;
        letter-spacing: 0;
        text-align: right;
        line-height: 24rpx;
      }

      .choose-num {
        position: absolute;
        top: 50%;
        right: 32rpx;
        transform: translateY(20%);
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
        width: 172rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        text:nth-child(2) {}

        text:nth-child(3) {
          color: #1E5EFF;
        }

      }

    }

    .send-memo {
      margin-top: 56rpx;
    }
  }


  .main-bottom {
    width: 100%;
    height: 612rpx;
    background: #F4F6FA;
    position: absolute;
    bottom: 0;

    .submit-btn {
      margin: 0 64rpx;
      position: relative;
      top: 116rpx;
    }
  }

  //弹出层
  .submitPopup {
    width: 100%;
    height: 1028rpx;

    .main {
      margin: 0 32rpx;

      .popup-title {
        font-weight: 600;
        font-size: 32rpx;
        color: #2C365A;
        letter-spacing: 0;
        padding: 48rpx 0 16rpx 0;
        line-height: 32rpx;
        border-bottom: 0 !important;
      }

      >view {
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

      .transfer_amount {}

      .miners_fee {
        padding: 33rpx 0 39rpx 0;

        view {
          height: 80rpx;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 28rpx;
          font-size: 28rpx;
          color: #030319;

          .price {
            color: #8F9BB3;
            margin-top: 24rpx;
          }
        }
      }

    }

  }


  .submit-btn {
    margin: 0 64rpx;
    position: relative;
    top: 116rpx;
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
    border-top-right-radius: 16rpx;
    border-top-left-radius: 16rpx;

    .u-modal__content {
      padding: 48rpx 32rpx !important;
    }
  }

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

  .amount {

    .label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24rpx;

      text {
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
      }

      .can-be-use {
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 24rpx;
        color: #8397B1;
        text {
          font-weight: 400;
          font-size: 24rpx;
          color: #8397B1;
        }
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
        padding: 0 !important;

        .uni-input-input {
          font-size: 40rpx;
          font-weight: 600;
        }

        .input-placeholder {
          font-size: 28rpx;
          color: #8397B1 !important;
          font-weight: 400;
        }
      }

      .value-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .border {
          height: 24rpx;
          width: 2rpx;
          background-color: #8397B1;
          opacity: .4;
          margin: 0 23rpx;
        }

        text {
          font-size: 28rpx;
          line-height: 28rpx;
        }

        .denom {
          font-weight: 600;
          color: #2C365A;
        }

        .all {
          color: #1E5EFF;
        }
      }
    }
  }

  .btn {
    height: 96rpx;
    margin-top: 80rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
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

        .u-icon {
          height: 96rpx;
          padding-right: 36rpx;
          background-color: #F2F4F8;
          border-radius: 0 16rpx 16rpx 0 !important;
        }
      }
    }
  }
  
  
  // 指纹验证
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

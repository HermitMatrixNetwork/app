<template>
  <view class="sendPage">
    <custom-header :title="'发送'" :style="titleStyle">
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
          <InputTitle :title="'收款地址'" :type="'text'" :placeholder="'输入或粘贴钱包地址'" ref="addressInptval"
            :inputVal.sync="sendFormData.receiveAddress">
            <template #title-icon>
              <u-icon :name="require('../../../static/img/account/addressbook.png')" size="44rpx"
                @click="toGo('/pages/account/send/adres_book')"></u-icon>
            </template>
          </InputTitle>
          <text v-if="showAddressErrorTip" class="waringPrompt">{{ language['addressErrorTip'] }}</text>
        </view>

        <!-- 发送金额 -->
        <view class="send-amount">
          <view class="send-amount">
            <view class="amount">
              <view class="label">
                <text>发送金额</text>
                <view class="can-be-use">
                  <text>可用： {{ token.balance }} {{ token.alias_name }}</text>
                </view>
              </view>
              <view class="value">
                <u--input placeholder="请输入金额" v-model.number="sendFormData.sendAmount"></u--input>
                <view class="value-info">
                  <text class="denom">{{ token.alias_name }}</text>
                  <view class="border"></view>
                  <text class="all" @click="testAmount">全部</text>
                </view>
              </view>
            </view>
          </view>
          <text v-if="sendFormData.sendAmount > token.balance" class="waringPrompt">输入金额超过钱包可用余额，请重新输入</text>
          <text v-if="showAmountErrorTip" class="waringPrompt">{{ language.amountErrorTip }}</text>
        </view>

        <view class="send-memo">
          <InputTitle :title="'Memo'" :type="'text'" :placeholder="'请输入Memo（选填）'" :inputVal.sync="sendFormData.memo">
          </InputTitle>
        </view>
      </view>
    </view>

    <view class="main-bottom">
      <miners-column @getMinersCost="getMinersCost"></miners-column>

      <view class="submit-btn" @click="transferConfirm">
        <Submitbtn>确认</Submitbtn>
      </view>
    </view>

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" class="double-check-popup"
      :safeAreaInsetBottom="true">
      <view class="submitPopup">
        <view class="main">
          <view class="popup-title">
            转账确认
            <u-icon :name="require('../../../static/img/account/close.png')" size="32rpx"
              @click="submitPopupIsShow=false"></u-icon>
          </view>

          <!-- 发送账户 -->
          <view class="send-address">
            <text>发送账户</text>
            <text>{{sendFormData.userAddress}}</text>
          </view>

          <!-- 接收账户 -->
          <view class="receive_address">
            <text>接收账户</text>
            <text>{{sendFormData.receiveAddress}}</text>
          </view>

          <!-- 转账金额 -->
          <view class="transfer_amount">
            <text>转账金额</text>
            <text>{{sendFormData.sendAmount?sendFormData.sendAmount:'0'}} {{ token.alias_name }}</text>
          </view>

          <!--Memo-->
          <view class="memo_type">
            <text>Meno</text>
            <text>{{ sendFormData.memo }}</text>
          </view>

          <!--矿工费-->
          <view class="miners_fee">
            <text>矿工费</text>
            <view>
              <view>21000 GWEI*2100 GasPrice</view>
              <view class="price">0.000287 GHM</view>
            </view>
          </view>
        </view>
        <view class="submit-btn" @click="submitAgain">
          <Submitbtn>确认</Submitbtn>
        </view>
      </view>
    </u-popup>

    <u-modal :show="modalPasswordIsShow" :showConfirmButton="false" @close="close">
      <view class="modal_main">
        <view class="modal_title">
          密码确认
          <u-icon :name="require('../../../static/img/account/close.png')" size="32rpx"
            @click="modalPasswordIsShow=false"></u-icon>
        </view>
        <view class="item">
          <view class="item-input item-input-password">
            <u-input :password="!passwordEye" v-model="payPassword" placeholder="输入资金密码">
            </u-input>
            <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'"
              @click="passwordEye = !passwordEye">
            </u-icon>
          </view>
        </view>
        <!-- <input type="text"> -->
        <text v-if="passwordCheck" class="waringPrompt">资金密码错误，请确认后重新输入!</text>
        <!-- <Submitbtn class="modal_submit" @click.native="passwordButton" >确认</Submitbtn> -->
        <u-button @click="passwordButton" :sendFormData="sendFormData" :change:sendFormData="render.receiveMsg"
          :check="chechSuccess" :change:check="render.sendToken" class="btn">确认</u-button>
      </view>
    </u-modal>
  </view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
import languages from './language/index.js'
import Submitbtn from './components/submit-btn.vue'
import {
  SendTokentoOtherAddress,
  getBalance
} from '@/utils/secretjs/SDK.js'
import mixin from '../mixins/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  mixins: [mixin],
  components: {
    InputTitle,
    Submitbtn
  },
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      tokenUrl: '/static/img/account/uGHM.png',
      tokenName: 'GHM',
      inputVal: '',
      payPassword: '', //资金密码
      passwordCheck: false, //密码校验
      submitPopupIsShow: false,
      modalPasswordIsShow: false,
      chechSuccess: 0,
      sendFormData: {
        userAddress: this.$cache.get('_currentWallet').address,
        receiveAddress: 'ghm189k0gud8npz4jsyz0nvvku8x2ul9n4pdalq6yt', //接收地址
        sendAmount: 100, //发送金额
        memo: 'test1',
        gas: '',
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
      passwordEye: false
    }
  },
  onLoad(value) {
    if (value.token) {
      this.token = JSON.parse(value.token)
    } else {
      this.token = this.$cache.get('_currentWallet').coinList[0]
    }
    this.sendFormData.rate = this.token.rate || 1
    this.receiveAddress = value.receiveAddress
  },
  methods: {
    submitAgain() {
      this.modalPasswordIsShow = true
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

      if (sendAmount == '') {
        this.showAmountErrorTip = true
      } else {
        this.showAmountErrorTip = false
      }
      
      // && this.sendFormData.sendAmount < this.token.balance
      if (!this.showAddressErrorTip && !this.showAmountErrorTip ) {
        this.submitPopupIsShow = true
      }
    },
    async passwordButton() {
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.chechSuccess = 1 // 调用render.sendToken
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
      console.log('接收到值', val)
      this.minersMsg = val
    },
    scanCode() { //扫码
      uni.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: (res) => {
          console.log('条码内容：' + res.result)
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
          }
        }
      })
    },
    dealSuccessJump(result) {
      console.log('交易结果', result)
      const fee = result.tx.authInfo.fee.amount[0].amount / (this.token.rate || 1)
      const usedAmount = this.sendFormData.sendAmount
      uni.hideToast()
      const eventChannel = this.getOpenerEventChannel()
      if (result.code == 0) {
        uni.showToast({
          title: '交易成功',
          image: '/static/img/chenggong.png',
          mask: true,
          duration: 3000,
          complete: () => {
            this.chechSuccess = 0
            this.modalPasswordIsShow = false
            setTimeout(() => {
              uni.redirectTo({
                url: `./transactionDetails?transactionHash=${result.transactionHash}`
              })
              eventChannel.emit('addRecordToSendList', result)
            }, 1500)
          }
        })
        
        this.token.balance = this.token.balance - fee - usedAmount
      } else {
        this.token.balance = this.token.balance - fee
      }
      
      const wallet = this.$cache.get('_currentWallet')
      
      const tokenList = wallet.coinList
      
      const tokenIndex = tokenList.findIndex(item => item.alias_name == this.token.alias_name)
      
      tokenList.splice(tokenIndex, 1, this.token)

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
    close() {
      this.passwordCheck = false
      this.payPassword = ''
    }
  }
}
</script>
<script lang="renderjs" module="render">
  import {
    SendTokentoOtherAddress,
    getBalance
  } from '@/utils/secretjs/SDK.js'
  import WalletCrypto from '@/utils/walletCrypto.js'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'
  export default {
    data() {
      return {
        message: {},
      }
    },
    methods: {
      async sendToken(newValue, oldValue, ownerVm, vm) {
        if (newValue == 0) return
        console.log('校验通过开始调用');
        let {
          receiveAddress,
          userAddress,
          sendAmount,
          memo,
          gas,
          rate
        } = this.message
        console.log(rate);
        sendAmount = sendAmount * mainCoin.rate
        console.log('接收地址', receiveAddress);
        const res = await SendTokentoOtherAddress(userAddress, receiveAddress, sendAmount, memo, gas)
        renderUtils.runMethod(this._$id, 'dealSuccessJump', res, this)

      },
      receiveMsg(value) {
        this.message = value
      }
    }
  }
</script>
<style lang="scss" scoped>
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
      height: 156rpx;
    }

    //发送金额
    .send-amount {
      margin-top: 32rpx;
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
        font-weight: 500;
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
      margin-top: 32rpx;
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

</style>

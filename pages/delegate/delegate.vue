<template>
  <view class="sendPage">
    <view :updataDelegate="updataDelegate" :change:updataDelegate="render.unDelegate"></view>
    <custom-header :title="'确认委托'" :style="titleStyle">
    </custom-header>
    <view class="border"></view>
    <view class="main-top">
      <view class="validator">
        <view class="label">
          <text>验证人名称</text>
        </view>
        <view class="value">
          <text>ghm63212ABCBA108DDB2Ea21545Ff1515DdC22318</text>
        </view>
      </view>
      <view class="border"></view>
      <view class="content">
        <!-- 输入取消委托数量 -->
        <view class="send-amount">
          <view class="amount">
            <view class="label">
              <text>委托数量</text>
            </view>
            <view class="value">
              <u--input placeholder="请输入委托数量" v-model="sendAmount"></u--input>
            </view>
          </view>
          <view class="other">
            <div class="title">可用余额：</div>
            <div class="num" v-if="selData">{{selData.balance.amount}} GHM</div>
            <div class="num" v-else>0 GHM</div>
          </view>
<!--          <text v-if="sendAmount>balance" class="waringPrompt">输入金额超过钱包可用余额，请重新输入</text> -->
        </view>

        <view class="amount memo">
          <view class="label">
            <text>Memo</text>
          </view>
          <view class="value">
            <u--input placeholder="请输入Memo（选填）" v-model="memoValue"></u--input>
          </view>
        </view>
      </view>
    </view>
    <miners-column @getMinersCost="getMinersCost"></miners-column>
    <view class="main-bottom">
     <view class="btn" @click="transferConfirm">
        确认
      </view>
    </view>

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
      :safeAreaInsetBottom="true">
      <view class="submitPopup">
        <view class="main">
          <view class="popup-title">
            交易确认
            <u-icon :name="require('@/static/img/account/close.png')" size="32rpx" @click="submitPopupIsShow=false">
            </u-icon>
          </view>

          <!-- 发送账户 -->
          <view class="send-address">
            <text>操作账户</text>
            <text>{{userAddress}}</text>
          </view>

          <!-- 接收账户 -->
          <view class="receive_address">
            <text>接收账户</text>
            <text>{{receiveAddress}}</text>
          </view>

          <!-- 取消委托数量 -->
          <view class="transfer_amount">
            <text>取消委托数量</text>
            <text>{{sendAmount?sendAmount:'0'}}{{tokenName}}</text>
          </view>

          <!--Memo-->
          <view class="memo_type">
            <text>Meno</text>
            <text>transfer</text>
          </view>

          <!--矿工费-->
          <view class="miners_fee">
            <text>矿工费</text>
            <view>
              <veiw>21000 GWEI*2100 GasPrice</veiw>
              <veiw class="price">0.000287 GHM</veiw>
            </view>
          </view>
        </view>
        <view class="submit-btn" @click="submitAgain">
          确认
        </view>
      </view>
    </u-popup>

    <u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
      <view class="modal_main">
        <view class="modal_title">
          密码确认
          <u-icon :name="require('@/static/img/account/close.png')" size="32rpx" @click="modalPasswordIsShow=false">
          </u-icon>
        </view>
        <InputTitle :type="'password'" :placeholder="'请输入资金密码'" :inputVal.sync="payPassword"
          :warningStyleisShow="passwordCheck">
        </InputTitle>
        <text v-if="passwordCheck" class="waringPrompt">资金密码错误，请确认后重新输入!</text>
        <button class="modal_submit" @click="passwordButton">确认</button>
      </view>
    </u-modal>
  </view>
</template>

<script>
import InputTitle from '@/pages/account/send/components/Input-title.vue'
import mixin from './mixins/index.js'
export default {
  mixins: [mixin],
  components: {
    InputTitle
  },
  data() {
    return {
      selData: '', //选择的委托
      confirmData: {},
      updataDelegate: 0, //更新委托
      tokenUrl: '@/static/img/placeholder.jpeg',
      tokenName: 'GHM',
      inputVal: '',
      balance: 0,
      receiveAddress: this.$cache.get('_currentWallet').address, //接收地址
      sendAmount: '', //发送金额
      memoValue: '', //Memo
      payPassword: '123', //资金密码
      passwordCheck: false, //密码校验
      submitPopupIsShow: false,
      modalPasswordIsShow: false,
      userAddress: this.$cache.get('_currentWallet').address,
      titleStyle: {
        background: '#FFFFFF'
      },
      //发送金额样式
      sendAmountStyle: {
        fontSize: '28rpx',
        color: '#8397B1',
        marginTop: '0'
      },
    }
  },
  onLoad(value) {

  },
  onShow() {
    uni.$on('selList', data => {
      this.selData = data
      console.log(data)
      this.balance = Number(data.balance.amount)
    })
  },
  methods: {
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
    submitAgain() {
      this.modalPasswordIsShow = true
      this.submitPopupIsShow = false
    },
    transferConfirm() { //转账确认
      const {
        receiveAddress,
        sendAmount,
        memoValue,
        balance
      } = this.$data
      if (!(receiveAddress && sendAmount && memoValue)) {
        return console.log('输入不能为空')
      }
      if (sendAmount > balance || balance == 0) {
        return console.log('余额不足')
      }
      this.submitPopupIsShow = true
    },
    passwordButton() {
      const {
        memoValue,
        balance
      } = this.$data
      if (this.payPassword != 123) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.updataDelegate++

        // uni.navigateTo({
        //   url: `./transactionDetails?transactionObject=${JSON.stringify(obj)}`
        // })
        // this.modalPasswordIsShow = false
      }
      this.payPassword = ''
    },
    testAmount() {
      this.sendAmount = this.balance
    },
    getMinersCost(val) {
      console.log('接收到值', val)
      this.minersMsg = val
    }
  },
}
</script>

<script lang="renderjs" module="render">
  import {
    unDelegate
  } from '@/utils/secretjs/SDK'
  export default {
    methods: {
      async unDelegate(newValue, oldValue, ownerInstance, instance) {
        if (newValue == 0) return

        // console.log('newVal',newValue)
        // console.log('oldValue',oldValue)
        // console.log('ownerInstance',ownerInstance.$vm)
        // console.log('instance',instance)
        // console.log('datarend',data);
        // unDelegate(data)
        let data = ownerInstance.$vm
        let data1 = {
          amount: data.selData.balance,
          ...data.selData.delegation
        }
        delete data1.shares
        data1.amount.amount = String(data.balance)
        let data2 = {
          gasPriceInFeeDenom: 0.25,
          feeDenom: 'uGHM',
          gasLimit: 50000
        }
        let result = await unDelegate(data1, data2)
      }
    },
  }
</script>

<style lang="scss" scoped>
  .sendPage {
    height: 100vh;
    overflow: hidden;
    background: #F4F6F9;
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
        font-weight: 500;
        font-size: 32rpx;
        color: #2C365A;
        letter-spacing: 0;
        padding: 48rpx 0 16rpx 0;
        line-height: 32rpx;
      }

      view {
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
      font-weight: 500;
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
    border-radius: 16rpx !important;

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
          font-size: 28rpx;
          color: #8397B1;
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
    background-color: rgba(131,151,177,0.20);
    margin: 0 32rpx;
  }
</style>

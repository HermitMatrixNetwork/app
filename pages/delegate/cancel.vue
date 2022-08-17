<template>
  <view class="sendPage">
    <view class="mask" v-show="loading"></view>
    <view :updataDelegate="updataDelegate" :change:updataDelegate="render.unDelegate"></view>
    <custom-header :title="'取消委托'" :style="titleStyle">
    </custom-header>
    <view class="main-top">
      <!-- 选择取消委托节点 -->
      <view class="content">
        <view class="content-top">
          <view class="title">
            选择取消委托节点
          </view>
          <view class="change-token" @click="selectNode(`/pages/delegate/selectNode?selectIndex=${selectIndex}&redirectURL=/pages/delegate/cancel`)">

            <view v-if="selData">
              <view class="name">{{selData.validator.description.moniker}}</view>
              <view class="address">{{selData.validator.operatorAddress| sliceAddress(10, -10)}}</view>
            </view>
            <text v-else>点击去选择</text>
            <view class="icon-right">
              <image src="/static/img/ic-arrow1.png"></image>
            </view>
          </view>
          <view class="tip">
            注：取消委托交易成功后，需等待2天才可成功到账！
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
              <text>输入取消委托数量</text>
            </view>
            <view class="value">
              <u--input placeholder="请输入金额" type="number" v-model="formData.amount.amount" @change="sendAmountChange"></u--input>
              <text @click="testAmount">全部</text>
            </view>
          </view>
          <text class="waringPrompt" :style="{ opacity: showAmountError ? 1 : 0 }">输入金额超过选中节点委托数量，请重新输入</text>
          <view class="other">
            <div class="title">当前节点委托：</div>
            <div class="num" v-if="selData">{{selData.balance.amount / mainCoin.decimals }} GHM</div>
            <div class="num" v-else>0 GHM</div>
          </view>
        </view>

        <view class="amount memo">
          <view class="label">
            <text>Memo</text>
          </view>
          <view class="value">
            <u--input placeholder="请输入Memo（选填）" v-model="formData.memo"></u--input>
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

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom"
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
            <text>{{ formData.delegatorAddress }}</text>
          </view>

          <!-- 接收账户 -->
          <view class="receive_address">
            <text>接收账户</text>
            <text>{{ formData.delegatorAddress }}</text>
          </view>

          <!-- 取消委托数量 -->
          <view class="transfer_amount">
            <text>取消委托数量</text>
            <text>{{formData.amount.amount ? formData.amount.amount : '0' }}{{tokenName}}</text>
          </view>

          <!--Memo-->
          <view class="memo_type">
            <text>Meno</text>
            <text>{{ formData.memo }}</text>
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
          确认
        </view>
      </view>
    </u-popup>

    <u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
      <view class="modal_main">
        <view class="modal_title">
          密码确认
          <u-icon :name="require('static/img/account/close.png')" size="32rpx"
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
        <text :style="{opacity: passwordCheck ? 1 : 0 }" class="waringPrompt">资金密码错误，请确认后重新输入!</text>
        <u-button @click="passwordButton" class="pass_confirm">确认</u-button>
      </view>
    </u-modal>
    
    <custom-notify ref="notify"></custom-notify>
    
  </view>
</template>

<script>
import InputTitle from '@/pages/account/send/components/Input-title.vue'
import mixin from './mixins/index.js'
import mainCoin from '@/config/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
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
          denom: 'uGHM'
        }, //发送金额
        memo: '', //Memo
        delegatorAddress: this.$cache.get('_currentWallet').address,
        validatorAddress: ''
      },
      loading: false
    }
  },
  onLoad(options) {
    const index = options.selectIndex
    if (index > -1) {
      this.selData = this.$cache.get('_delegateInfo').list[index]
      this.balance = this.selData.balance.amount / mainCoin.decimals
      this.selectIndex = index
    }
  },
  methods: {
    sendAmountChange(val) {
      this.showAmountError = this.balance < this.formData.amount.amount ? true : false
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
    submitAgain() {
      this.modalPasswordIsShow = true
      this.submitPopupIsShow = false
    },
    transferConfirm() { //转账确认
      let verify = true
      
      if(this.showAmountError) {
        verify = false
      }
      
      if (this.formData.amount.amount == '' || this.formData.amount.amount == 0) {
        verify = false
        this.$refs.notify.show('error', '委托数量不能为空')        
      }
      
      if (!this.selData) {
        verify = false
        this.$refs.notify.show('error', '委托节点不能为空')
      }
     
      if (verify) {
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
        uni.showToast({
          title: '执行中...',
          icon: 'loading',
          mask: true,
          duration: 999999999
        })
      }
    },
    handlerResult(res) {
      this.updataDelegate = 0
      this.loading = false
      if (res.code == 0) {
        this.$cache.set('_updateDelegateInfo', true, 36000)
        uni.showToast({
          title: '执行成功',
          image: '/static/img/chenggong.png',
          mask: true,
          duration: 3000,
          complete: () => {
            setTimeout(() => {
              uni.redirectTo({
                url: `/pages/account/send/transactionDetails?data=${JSON.stringify(res)}`
              })
            }, 1500)
          }
        })
      } else {
        uni.showToast({
          title: '执行失败',
          image: '/static/img/shibai1.png',
          mask: true,
          duration: 3000,
        })
        console.log(res)
      }
    },
    testAmount() {
      this.showAmountError = false
      this.formData.amount.amount = this.balance
    },
    getMinersCost(val) {
      console.log('接收到值', val)
      this.minersMsg = val
    },
    selectNode(url) {
      uni.redirectTo({
        url
      })
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
    unDelegate
  } from '@/utils/secretjs/SDK'
  import mainCoin from '@/config/index.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      async unDelegate(val) {
        if (val == 0) return
        let { memo, ...data } = JSON.parse(JSON.stringify(val))
        let res = {}
        data.amount.amount = data.amount.amount * mainCoin.decimals + ''
        console.log({ data, memo });
        try {
          res = await unDelegate(data, memo)
        } catch (e) {
          console.log(e)
          res.code = 7
        }
        renderUtils.runMethod(this._$id, 'handlerResult', res, this)
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
    background: rgba(0,0,0,.5) !important;
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
      // margin-top: 10rpx;

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
      
      

      > view:not(:first-child) {
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
  
  .pass_confirm {
    height: 96rpx;
    background: #002FA7;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #FCFCFD;
    text-align: center;
    margin-top: 56rpx;
  }
</style>

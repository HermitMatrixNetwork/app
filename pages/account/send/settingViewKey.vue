<template>
  <view class="container">
    <page-loading v-if="loading" :success="success" :loadingText="loadingText"/>
    <custom-header :title="'设置viewkey'" style="background-color: #fff;"></custom-header>
    <view class="perform_contract" style="background-color: #fff;">
      <view class="title">
        执行合约
      </view>
      <textarea v-model="formData.view_key" cols="30" rows="10" placeholder="当前viewkey" class="viewkey_input"></textarea>
    </view>
    <view style="height: 16rpx;background: #F4F6FA;" />

    <view style="padding: 40rpx 32rpx 48rpx; background-color: #fff;">
      <InputTitle title="Memo" isBlod :placeholder="'请输入Memo （选填）'" :inputVal.sync="formData.memo"></InputTitle>
    </view>
    
    <miners-column ></miners-column>
    <view style="height: 40rpx;background: #fff;" />

    <view class="submit-button">
      <Submitbtn @click.native="setViekey">确认</Submitbtn>
    </view>

    <u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
      :safeAreaInsetBottom="true">
      <view class="submitPopup">
        <view class="main">
          <view class="popup-title">
            交易确认
            <u-icon :name="require('../../../static/img/account/close.png')" size="32rpx"
              @click="submitPopupIsShow=false"></u-icon>
          </view>

          <view class="item">
            <view class="label">
              执行合约
            </view>
            <view class="value">
              {{ formData.address }}
            </view>
          </view>
          <view class="item">
            <view class="label">
              详情
            </view>
            <view class="value">
              {{ formData.view_key }}
            </view>
          </view>
          <view class="item">
            <view class="label">
              Memo
            </view>
            <view class="value">
              {{ formData.memo }}
            </view>
          </view>
          <view class="item">
            <view class="label">
              矿工费
            </view>
            <view class="value">
              21000 GWEI*2100 GasPrice
            </view>
          </view>
          
          <u-button :loadingText="loadingText" class="btn" @click="setviewkey">确认</u-button>
        </view>
      </view>
    </u-popup>
    <view :callRender="callRender" :change:callRender="render.setViewkey"></view>
    <Notify ref="notify"></Notify>
    
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
        <text v-show="passwordCheck" class="waringPrompt">资金密码错误，请确认后重新输入!</text>
        <!-- <Submitbtn class="modal_submit" @click.native="passwordButton" >确认</Submitbtn> -->
        <u-button @click="passwordButton" class="confirm_btn">确认</u-button>
      </view>
    </u-modal>
  </view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
import Notify from './components/notify.vue'
import WalletCrypto from '@/utils/walletCrypto.js'
import Submitbtn from './components/submit-btn.vue'
export default {
  components: {
    InputTitle,
    Notify,
    Submitbtn
  },
  data() {
    return {
      loadingText: '执行中...',
      submitPopupIsShow: false,
      formData: {
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
    }
  },
  onLoad(options) {
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
    Object.assign(this.formData, this.token)
  },
  methods: {
    passwordButton() {
      // 通过校验
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.loading = true
        this.callRender = this.formData
      }
    },
    close() {
      this.passwordCheck = false
      this.payPassword = ''
    },
    verify(res) {
      if (res.code == 0) {
        this.success = true
        this.loadingText = '执行成功'
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
          this.loading = false
          uni.reLaunch({
            url: `/pages/account/send/token_content_other?tokenID=${this.token.ID}`
          })
        }, 2000)
      } else {
        this.loading = false
        this.$refs.notify.show('error', '出现了预期之外的错误', { bgColor: '#EC6665' })
      }
    },
    setViekey() {
      if (this.validate()) {
        this.submitPopupIsShow = true
      }
    },
    setviewkey() {
      this.modalPasswordIsShow = true
      this.submitPopupIsShow = false
    },
    validate() {
      if (this.formData.view_key.trim() === '') {
        this.$refs.notify.show('error', 'viewkey不能为空', { bgColor: '#EC6665' })
        return false
      } else {
        this.$refs.notify.close()
        return true
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
    setViewKey
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      async setViewkey(data) {
        if (data == 0)return
        try {
          const res = await setViewKey(data)
          renderUtils.runMethod(this._$id, 'verify', res, this)
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    background-color: #F4F6FA;
  }
  .perform_contract {
    width: 100%;
    height: 540rpx;
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
      height: 402rpx;
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
        }
      }
    }

  }

  .submit-button {
    width: 100%;
    padding: 130rpx 64rpx 64rpx;
    position: absolute;
    bottom: 0;

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
    
          .u-icon {
            height: 96rpx;
            padding-right: 36rpx;
            background-color: #F2F4F8;
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

</style>

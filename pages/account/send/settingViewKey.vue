<template>
  <view class="container">
    <custom-header :title="'设置viewkey'" style="background-color: #fff;"></custom-header>
    <view class="perform_contract" style="background-color: #fff;">
      <view class="title">
        执行合约
      </view>
      <textarea v-model="formData.viewkey" cols="30" rows="10" placeholder="当前viewkey" class="viewkey_input"></textarea>
    </view>
    <view style="height: 16rpx;background: #F4F6FA;" />

    <view style="padding: 40rpx 32rpx 48rpx; background-color: #fff;">
      <InputTitle title="Memo" isBlod :placeholder="'请输入Memo （选填）'" :inputVal.sync="formData.memo"></InputTitle>
    </view>
    
    <miners-column ></miners-column>
    <view style="height: 40rpx;background: #fff;" />

    <view class="submit-button">
      <Submitbtn @click.native="submitPopupIsShow = true">确认</Submitbtn>
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
              {{ formData.viewkey }}
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
          
          <u-button class="btn" @click="setViekey">确认</u-button>
        </view>
      </view>
    </u-popup>
    <view :callRender="callRender" :change:callRender="render.validator"></view>
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
import Notify from './components/notify.vue'
import Submitbtn from './components/submit-btn.vue'
export default {
  components: {
    InputTitle,
    Notify,
    Submitbtn
  },
  data() {
    return {
      submitPopupIsShow: false,
      formData: {
        viewkey: '1321321321',
        memo: '',
        contractAddress: '12312321',
        address: this.$cache.get('_currentWallet').address        
      },
      callRender: 0
    }
  },
  methods: {
    verify(res) {
      if (res.code == 0) {
          
      } else {
          
      }
    },
    setViekey() {
      this.callRender = this.formData
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
        // console.log(data);
        // const res = await setViewKey(data)
        // renderUtils.runMethod(this.$_id, 'verify', res, this)
      },
      validator(data) {
        if (data || data.contractAddress == '' || data.address == '' || data.viewkey == '') return;
        this.setViewkey(data)
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

    }

  }

  .submit-button {
    width: 100%;
    padding: 130rpx 64rpx 64rpx;
    position: absolute;
    bottom: 0;

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
</style>

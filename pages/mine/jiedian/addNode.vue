<template>
  <view class="container">
    <custom-header class="header" :title="language.text39" :customStyle="{ 'background-color': '#fff' }">
      <template slot="right">
        <view class="save" @click="addNode">
          {{ language.text43 }}
        </view>
      </template>
    </custom-header>

    <view class="wallet-name item">
      <view class="wallet-name-label">
        {{ language.text40 }}
      </view>
      <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
      <u-input class="wallet-name-input" v-model="formData.name" :formatter='formatter' :placeholder="language.text105"></u-input>
      <view class="error-tip" :style="{ opacity: nameError ? 1 : 0 }">
        {{ language.nameErrorTip }}
      </view>
    </view>

    <view class="wallet-name item">
      <view class="wallet-name-label">
        {{ language.text41 }}
      </view>
      <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
      <u-input class="wallet-name-input" v-model="formData.link" :formatter='formatter' :placeholder="language.text106"></u-input>
      <view class="error-tip" :style="{ opacity: linkError ? 1 : 0 }">
        {{ language[linkErrorList[linkErrorTip]] }}
      </view>
    </view>

    <view class="wallet-name item">
      <view class="wallet-name-label">
        Chain ID
      </view>
      <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
      <u-input class="wallet-name-input" v-model="formData.chainId" :placeholder="language.text107" disabled></u-input>
    </view>

    <view :callRender="callRender" :change:callRender="render.checkRpcVerify"></view>
    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import language from '../language/index.js'
import mixins from '@/pages/account/mixins/index.js'
export default {
  mixins:[mixins],
  data() {
    return {
      language: language[this.$cache.get('_language')],
      linkErrorList: ['text45', 'text44', 'text46'],
      linkErrorTip: '',
      nameError: false,
      linkError: false,
      formData: {
        name: '',
        link: '',
        chainId: 'ghm-testnet'
      },
      callRender: 0
    }
  },
  methods: {
    addNode() {
      let nodeList = this.$cache.get('_nodeList')
      let verify = true
      if (!(this.formData.link.startsWith('http://') || this.formData.link.startsWith('https://'))) {
        this.linkErrorTip = 1
        this.linkError = true
        verify = false
      } else if (this.checkExist(nodeList)) {
        this.linkErrorTip = 2
        this.linkError = true
        verify = false
      }
        
      if (this.formData.name.trim() == '') {
        this.nameError = true
        verify = false
      } else {
        this.nameError = false
      }

      verify && this.checkVerify()
    },
    handerResult(res) {
      this.callRender = 0
      if (res.code == 7) {
        this.linkErrorTip = 0
        this.linkError = true
      } else {        
        this.linkError = false
        let nodeList = this.$cache.get('_nodeList')
        nodeList.push(this.formData)
        this.$cache.set('_nodeList', nodeList, 0)
        this.$refs.notify.show('', this.language.text60, { bgColor: '#275EF1' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      }
    },
    checkExist(nodeList) {
      const node = nodeList.find(item => item.link == this.formData.link)
      return node
    },
    checkVerify() {
      this.callRender = this.formData
    },
    formatter(val){
      return this.dealInputValue(val)
    }
  },
  onBackPress(event) {
    if (event.from == 'backbutton') {
      // uni.redirectTo({
      //   url: './index'
      // })
      uni.navigateBack()
      return true
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import renderUtils from '@/utils/render.base.js'
  import {
    SecretNetworkClient
  } from 'secretjs-hmt'
  
  export default {
    methods: {
      async checkRpcVerify(val) {
        if (val == 0) return
        let wallet;
        let res = {}
        //#ifdef APP-PLUS
        wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
        //#endif
        
        //#ifndef APP-PLUS 
        wallet = uni.getStorageSync('_currentWallet').data
        //#endif
        console.log(val.link);
        let client = await SecretNetworkClient.create({
          grpcWebUrl: val.link,
          chainId: val.chainId,
          wallet,
          walletAddress: wallet.address
        })
        try {
          res = await client.query.bank.balance({
            address: wallet.address,
            denom: 'ughm'
          })
          console.log(res);
        } catch (e) {
          res.code = 7
        }
        
        renderUtils.runMethod(this._$id, 'handerResult', res, this)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    min-height: 100vh;
    padding-top: calc(112rpx + var(--status-bar-height));
    background-color: #F4F6F9;
  }

  .header {
    border-bottom: 2rpx solid #F4F6F9;
  }

  .save {
    font-size: 28rpx;
    color: #1E5EFF;
  }

  .item {
    background-color: #fff;
    padding: 32rpx;
  }

  .wallet-name {
    &-label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-weight: 600;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      line-height: 28rpx;
    }

    .u-input {
      height: 96rpx;
      background-color: #F2F4F8;

      /deep/ input {
        color: #2C365A !important;
        font-size: 28rpx !important;
      }

      /deep/ .input-placeholder {
        height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        color: #8397B1 !important;
        line-height: 48rpx !important;
      }
    }
  }

  .wallet-name {

    /deep/ .u-input {
      border-radius: 16rpx !important;
    }
  }

  .error-tip {
    height: 24rpx;
    margin-top: 16rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #EC2828;
    line-height: 24rpx;
  }

  .error {
    background-color: rgba(230, 55, 51, 0.12) !important;

    /deep/ .uni-input-input {
      color: #E63733 !important;
    }

    /deep/ .uni-input-wrapper .input-placeholder {
      color: #E63733 !important;
    }
  }
</style>

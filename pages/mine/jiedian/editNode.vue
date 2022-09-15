<template>
  <view class="container">
    <custom-header backUrl="./index" class="header" :title="language.text108" :customStyle="{ 'background-color': '#fff' }">
      <template slot="right">
        <view class="save" @click="confirm">
          {{ language.text49 }}
        </view>
      </template>
    </custom-header>

    <view class="wallet-name item">
      <view class="wallet-name-label">
        {{ language.text40 }}
      </view>
      <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
      <u-input class="wallet-name-input" v-model="formData.name" :placeholder="language.text105"></u-input>
      <view class="error-tip" :style="{ opacity: nameError ? 1 : 0 }">
        {{ language.nameErrorTip }}
      </view>
    </view>

    <view class="wallet-name item">
      <view class="wallet-name-label">
        RPC {{ language.text90 }}
      </view>
      <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
      <u-input class="wallet-name-input" v-model="formData.link" :placeholder="language.text106"></u-input>
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

    <uni-button class="remove-wallet-btn" @click="removeNode">{{ language.text109 }}</uni-button>

    <u-modal :show="showWarn" width="686rpx" :showConfirmButton="false" class="hintModal">
      <view class="modalContent">
        <image src="/static/img/tishi2.png" style="width: 64rpx; height: 64rpx;"></image>
        <view class="modal-title">{{ language.text89 }}</view>
        <text class="modal-content-top">
          {{ language.text53 }}
        </text>
        <text class="modal-content-bottom">
          {{ language.text91 }}
        </text>
        <button @click="showWarn = false">{{ language.text29 }}</button>
      </view>
    </u-modal>

    <u-modal :show="showDeleteWarn" width="686rpx" :showConfirmButton="false" class="hintModal delete-warn">
      <view class="modalContent">
        <image src="/static/img/tishi2.png" style="width: 64rpx; height: 64rpx;"></image>
        <view class="modal-title">{{ language.text89 }}</view>
        <text class="modal-content-top">
          {{ language.text50 }}
        </text>
        <text class="modal-content-bottom">
          {{ language.text110 }}
        </text>
        <view class="control_btn">
          <button @click="showDeleteWarn = false" class="cancel_btn">{{ language.text17 }}</button>
          <button @click="delectNode" class="confirm_btn">{{ language.text29 }}</button>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import language from '../language/index.js'
import {
  getSecret
} from '@/utils/secretjs/SDK.js'
import {
  getCurrentRpc
} from '@/config/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      linkErrorList: ['text45', 'text44', 'text46'],
      linkErrorTip: '',
      nameError: false,
      linkError: false,
      showWarn: false,
      showDeleteWarn: false,
      formData: {
        name: '',
        link: '',
        chainId: 'ghmdev'
      },
      callRender: 0,
      nodeIndex: 0,
    }
  },
  onLoad(options) {
    this.formData = JSON.parse(options.node)
    this.nodeIndex = this.$cache.get('_nodeList').findIndex(item => item.link == this.formData.link)
  },
  methods: {
    removeNode() {
      const currentNode = getCurrentRpc()
      if (currentNode == this.formData.link) {
        this.showWarn = true
      } else {
        this.showDeleteWarn = true
      }
    },
    delectNode() {
      const nodeList = this.$cache.get('_nodeList')
      nodeList.splice(this.nodeIndex, 1)
      this.$cache.set('_nodeList', nodeList, 0)
      this.showDeleteWarn = false
      this.$refs.notify.show('', this.language.text54, {
        bgColor: '#275EF1'
      })
      setTimeout(() => {
        uni.redirectTo({
          url: './index'
        })
      }, 1000)
    },
    confirm() {
      let nodeList = this.$cache.get('_nodeList') || []
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
    checkExist(nodeList) {
      const nodeIndex = nodeList.findIndex(item => item.link == this.formData.link)
      return nodeIndex !== -1 && (nodeIndex === this.nodeIndex ? false : true)
    },
    checkVerify() {
      this.callRender = this.formData
    },
    handerResult(res) {
			let nodeList = this.$cache.get('_nodeList') || []
      this.callRender = 0
      if (res.code == 7) {
        this.linkErrorTip = 0
        this.linkError = true
      } else {
        this.linkError = false
        nodeList.splice(this.nodeIndex, 1, this.formData)
        this.$cache.set('_nodeList', nodeList, 0)
        this.$refs.notify.show('', this.language.text60, {
          bgColor: '#275EF1'
        })
        setTimeout(() => {
          uni.redirectTo({
            url: './index'
          })
        }, 1000)
      }
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
    height: 100vh;
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

  .remove-wallet-btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #EC2828;
    text-align: center;
    line-height: 96rpx;
    background-color: #fff;
    border-radius: 16rpx;

    &:after {
      border: 0 !important;
    }
  }

  /deep/ .hintModal {

    .u-modal__content {
      padding: 32rpx;
      padding-top: 48rpx !important;
    }

    .modalContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .modal-title {
        font-size: 32rpx;
        color: #2c365a;
        font-weight: 600;
        line-height: 32rpx;
        margin-top: 32rpx;
      }

      .modal-content-top {
        font-size: 28rpx;
        color: #8397b1;
        line-height: 42rpx;
        margin-top: 32rpx;
        ;
      }

      .modal-content-bottom {
        font-size: 28rpx;
        color: #2C365A;
        line-height: 42rpx;
        margin-bottom: 48rpx;
      }

      button {
        width: 622rpx;
        height: 96rpx;
        font-size: 32rpx;
        line-height: 96rpx;
        background: #002fa8;
        color: #FCFCFD;
      }
    }
  }

  /deep/ .delete-warn {
    .u-modal__content {
      padding: 48rpx 0 32rpx;
    }

    .modal-content-top,
    .modal-content-bottom {
      padding: 0 60rpx;
    }

    .modal-content-bottom {
      align-self: flex-start;
      color: #2C365A;
      font-weight: 600;
      margin-top: 20rpx;
    }

    .control_btn {
      width: 100%;
      display: flex;
      justify-content: space-between;

      button {
        width: 292rpx;
        height: 96rpx;
      }

      .cancel_btn {
        background: rgba(0, 47, 167, 0.00);
        border: 2rpx solid rgba(131, 151, 177, 0.30);
        border-radius: 16rpx;
        color: #8397B1;
      }

      .confirm_btn {
        color: #FCFCFD;
      }
    }
  }
</style>

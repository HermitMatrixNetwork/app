<template>
  <view class="page-wrapper">
    <view :callGetContractInfo="callGetContractInfo" :change:callGetContractInfo="render.getContractInfo"></view>
    <custom-notify ref="notify" style="z-index: 99;"></custom-notify>
    <custom-header :title="language.text242" :customStyle="{ 'z-index': 98 }">
      <template #right>
        <view class="save" @click="add">
          {{ language.text263 }}
        </view>
      </template>
    </custom-header>
    
    <view class="main">
      <view class="label-title">{{ language.text261 }}</view>
      <u--textarea v-model="contract" :placeholder="language.text262" :formatter='formatter'
        maxlength="60" class="textarea" :autoHeight="true"></u--textarea>
    </view>
    <u-popup :show="show" mode="bottom">
      <view class="contain">
          <view class="head">
            <text>{{ language.text264 }}</text>
            <image src="/static/img/ic-close.png" style="height:32rpx; width: 32rpx;" @click="show = false"></image>
          </view>
          
          <view class="content">
            <view class="logo">
              <image :src="token.logo" style="width: 72rpx; height: 72rpx;"></image>
              <!-- <image src="/static/img/account/uGHM.png" style="width: 72rpx; height: 72rpx;"></image> -->
            </view>
            <view class="des">
           <!--   <view class="token_name">Forever Fomo Duck Squad</view>
              <view class="token_address">0x20591e93af..9768c40eeb39</view> -->
              <view class="token_name">{{ token.full_name }}</view>
              <view class="token_address">{{ token.address | format }}</view>
            </view>
          </view>
          
          <u-button class="btn" @click="confirm">{{ language.text09 }}</u-button>
      </view>
    </u-popup>
  </view>
</template>

<script>
import languages from '@/pages/account/language/index.js'
import Request from '@/utils/luch-request/index.js'
const http = new Request()
export default {
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      contract: '',
      callGetContractInfo: '',
      show: false,
      token: {},
      adding: false
    }
  },
  filters: {
    format(val) {
      return val && val.slice(0, 12) + '...' + val.slice(-12)
    }
  },
  methods: {
    formatter(val) {
      let string = val.replace(/[\>\<\&\'\"]/g, '')
      // console.log(string);
      return string
    },
    async add() {
      if (this.adding) return
      this.adding = true
      let nftToken = this.$cache.get('_nft_tokens_list') || []
      if (this.contract.trim() == '') {
        // 请完成代币信息填写
        this.$refs.notify.show('error', this.language.text252)
        this.adding = false
      } else if (nftToken.find(item => item.contract_address === this.contract)) {
        // 已存在该代币，请勿重复添加
        this.$refs.notify.show('error', this.language.text253)
        this.adding = false
      } else {
        let localTokens = []
        let token = {}
        // 本地是否已存在NFT代币列表
        if (this.$cache.get('_nft_all_tokens')) {
          localTokens = this.$cache.get('_nft_all_tokens')
        } else {
          const res = await http.get('https://raw.githubusercontent.com/HermitMatrixNetwork/NonFungibleToken-list/main/NFTlist.json')
          const list = res.data.tokens.map(item => {
            return Object.assign(item, {
              'alias_name': item.symbol,
              'full_name': item.name,
              'logo': item.logoURI,
              'desc': item.description,
              'contract_address': item.address,
              'apply_type': 'NFT',
              view_key: '',
              loadingBalance: true
            })
          })
          this.$cache.set('_nft_all_tokens', list, 0)
          localTokens = list
        }
        
        // 本地查询
        token = localTokens.find(item => item.contract_address == this.contract)
        
        if (token) {
          this.token = token
          this.show = true
          this.adding = false
          return
        } else {
          this.callGetContractInfo = this.contract
        }
        
      }
      // this.callGetContractInfo = this.contract
    },
    handlerContractInfo(res) {
      console.log('res', res)
    },
    confirm() {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('addToken', this.token)
      // let nftToken = this.$cache.get('_nft_tokens_list') || []
      // nftToken.push(this.token)
      // this.$cache.set('_nft_tokens_list', nftToken, 0)
      this.$refs.notify.show('error', this.language.text167, { bgColor: '#275EF1' })
      this.show = false
      this.adding = false
      
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    querySnip721Contract
  } from '@/utils/secretjs/SDK'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      async getContractInfo(contract) {
        if (contract == '') return
        let res = {}
        try {
          res = await querySnip721Contract(contract)
        } catch (e) {
          res.code = 7
          console.log('e', e);
        }
        renderUtils.runMethod(this._$id, 'handlerContractInfo', res, this)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
  }
  
  .save {
    font-size: 28rpx;
    color: #1E5EFF;
  }
  
  .main {
    padding: 32rpx 32rpx 48rpx;
  }
  
  .label-title {
    font-weight: 600;
    font-size: 28rpx;
    color: #2C365A;
    letter-spacing: 0;
    margin-top: 32rpx;
  }
  
  .u-textarea {
    background: #F2F4F8 !important;
    margin-top: 16rpx;
    padding: 18rpx 32rpx;
  
    .uni-textarea-placeholder {
      color: #8397B1 !important;
      font-size: 28rpx !important;
    }
  }
  
  .u-textarea--radius {
    border-radius: 16rpx;
  }
  
  .textarea {
    /deep/ .u-textarea__field {
      line-height: 60rpx !important;
      font-size: 28rpx;
      color: #2C365A;
    }
  }
  
  /deep/ .u-transition, /deep/  .u-popup__content {
    border-top-left-radius: 16rpx;
    border-top-right-radius: 16rpx;
  }
  
  .contain {
    // height: 500rpx;
    .head {
      display: flex;
      justify-content: space-between;
      padding: 48rpx 32rpx 0;
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
    }
    
    .content {
      margin: 64rpx 32rpx 0;
      display: flex;
      
      .des {
        
        margin-left: 24rpx;
        
        .token_name {
          font-family: PingFangSC-Medium;
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
          line-height: 28rpx;
        }
        
        .token_address {
          margin-top: 12rpx;
          font-family: PingFangSC-Regular;
          font-size: 24rpx;
          color: #8397B1;
          letter-spacing: 0.2px;
          line-height: 24rpx;
        }
      }
    }
  }
  
  .btn {
    margin: 96rpx 64rpx 32rpx;
    width: auto;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
  }
</style>

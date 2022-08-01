<template>
  <view class="asset-manage">
    <view :reAddress="reAddress" :change:reAddress="render.search"></view>
    <view class="top">
      <u-search :placeholder="language.searchPlaceholder" shape="round" :clearabled="true" v-model="address"
        actionText="取消" :actionStyle="searchStyle" @search="searchCoin" @custom="goBack"></u-search>
    </view>
    <custom-loading v-if="loading" class="loading"></custom-loading>
    <view class="list" v-else-if="list.length">
      <view class="denom" v-for="(item, index) in list" :key="index">
        <view class="item">
          <view class="logo">
            <image :src="item.logo"></image>
          </view>
          <view class="content">
            <view class="title">
              <text>{{ item.full_name }}</text>
            </view>
            <view class="contract-address">
              <text>{{ item.contract_address }}</text>
            </view>
          </view>
          <view class="right" v-if="item.full_name !== mainCoin.full_name">
            <u-icon v-if="tokenAddressList.includes(item.contract_address)" :name="require('@/static/img/account/ic-delect.png')" size="44rpx" @click="deleteToken(item)"></u-icon>
            <u-icon v-else :name="require('@/static/img/account/ic-add.png')" size="44rpx" @click="addToken(item)">
            </u-icon>
          </view>
        </view>
        <view class="border">
          
        </view>
      </view>
    </view>
    <view v-else class="noData">
      <img v-if="reAddress!=''" class="data" src="@/static/img/account/nodata.png" alt="">
      <img v-else class="searchbg" src="@/static/img/account/searchbg.png" alt="">
      <view class="tip">
        {{reAddress?'未搜索到相关代币':'支持所有 Hermit Matrix Network 代币请输入代币合约地址进行搜索'}}
      </view>
    </view>
  </view>
</template>

<script>
import languages from './language/index.js'
import List from './components/List.vue'
import mainCoin from '@/config/index.js'
export default {
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      reAddress: '', //renderjs调用
      address: '', //查询地址
      list: [], //查询结果
      tokenAddressList: [],
      tokenList: [],
      currentWallet: {},
      searchStyle: {
        fontSize: '28rpx',
        color: '#275EF1'
      },
      mainCoin,
      loading: true
    }
  },
  components: {
    List
  },
  onLoad(options) {
    if (options.address) {
      this.address = options.address
      this.reAddress = options.address
    }
  },
  created() {
    this.currentWallet = this.$cache.get('_currentWallet')
    this.tokenList = this.currentWallet.coinList
    this.tokenList.forEach(item => this.tokenAddressList.push(item.contract_address))
  },
  methods: {
    //查询合约
    searchCoin() {
      this.loading = true
      this.reAddress = this.address
    },
    goBack() {
      uni.navigateBack()
    },
    goTo() {

    },
    //查询结果
    searchData(data) {
      console.log(data)
      this.list[0] = data
      this.loading = false
      this.reAddress = ''
    },
    addToken(token) {
      const { contract_address, full_name, logo } = token
      this.tokenList.push({ contract_address, full_name, logo })
      
      this.tokenAddressList.push(token.contract_address)
      this.currentWallet.coinList = this.tokenList
      this.$cache.set('_currentWallet', this.currentWallet, 0)
      this.updateWalletList(this.currentWallet)
    },
    deleteToken(token) {
      this.tokenAddressList = this.tokenAddressList.filter(item => item.contract_address !== token.contract_address)
      this.tokenList = this.tokenList.filter(item => item.contract_address !== token.contract_address)
      this.currentWallet.coinList = this.tokenList
      this.$cache.set('_currentWallet', this.currentWallet, 0)
      this.updateWalletList(this.currentWallet)
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
    searchCoin
  } from '@/api/token.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      async search(address) {
        if (address == '') return
        let data = await searchCoin(address)
        renderUtils.runMethod(this._$id, 'searchData', data.data.data.result, this)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .top {
    padding: 20rpx 32rpx;
    margin-bottom: 32rpx;
  }

  .hot-asset {
    padding: 32rpx 30rpx 32rpx 32rpx;

    .title {
      height: 62rpx;
      padding-top: 16rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #2C365A;
    }
  }

  .noData {
    padding: 330rpx 130rpx 0 130rpx;
    text-align: center;

    .data {
      width: 240rpx;
      height: 240rpx;
    }

    .searchbg {
      width: 200rpx;
      height: 200rpx;
    }

    .tip {
      font-size: 28rpx;
      color: #8397B1;
    }
  }

  .loading {
    margin-top: 100rpx;
  }
  
  .denom {
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30rpx 30rpx 32rpx;
      
      .logo {
        margin-right: 24rpx;
        
        image {
          width: 72rpx;
          height: 72rpx;
        }
      }
      
      .content {
        flex: 1;
        
        .title {
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
          margin-bottom: 12rpx;
        }
        
        .contract-address {
          font-size: 24rpx;
          color: #8397B1;
        }
      }
    }
    
    .border {
      height: 2rpx;
      background-color: rgba(131,151,177,0.20);
      margin-left: 126rpx;
    }
  }
</style>

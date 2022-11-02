<template>
  <view class="asset-manage">
    <custom-header class="header" :showRight="false">
      <view slot="center" class="search">
        <u-search :placeholder="language.text165" shape="round" :clearabled="true" v-model="address"
          :showAction="false" @search="searchCoin" searchIcon="/static/img/delegate/search2.png"></u-search>
      </view>
    </custom-header>
    <view class="home-assets" data-url="/pages/assetManage/home" @click="goTo">
      <view class="title">
        {{language.text164}}
      </view>
      <image src="/static/img/ic-arrow1.png"></image>
    </view>
    <view class="space" />
    <view class="home-assets" data-url="/pages/assetManage/customToken" @click="goTo">
      <view class="title">
        {{language.text241}}
      </view>
      <image src="/static/img/ic-arrow1.png"></image>
    </view>
    <view class="space" />
    <view class="hot-asset">
      <view class="title">{{language.text166}}</view>
    </view>
    <custom-loading v-if="loading" style="margin-top: 100rpx;"></custom-loading>
    <view class="list" v-else-if="list.length">
      <List ref="list" :list="list" @change="updateCoinList" />
    </view>
    <view v-else class="noData">
      <image class="data" src="@/static/img/account/nodata.png" />
      <view class="tip">
        {{ language.text212 }}
      </view>
    </view>
  </view>
</template>

<script>
import languages from '@/pages/account/language/index.js'
import List from './components/List.vue'
import {
  getHotList
} from '@/api/token.js'
export default {
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      address: '', //查询地址
      list: [],
      tokenList: this.$cache.get('_currentWallet').coinList,
      loading: false
    }
  },
  components: {
    List
  },
  onShow() {
    this.tokenList = this.$cache.get('_currentWallet').coinList
    this.$refs.list && this.$refs.list.init()
  },
  async mounted() {
    if (this.$cache.get('_hot_assets_list')) {
      this.list = this.$cache.get('_hot_assets_list')
      this.$nextTick(() => {
        this.$refs.list && this.$refs.list.init()
      })
      this.loading = false
    } else {
      this.loading = true
    }
    const res = (await getHotList()).data.data
    this.list = res.hot_assets_list
    this.$cache.set('_hot_assets_list', this.list, 0)
    this.loading = false
    this.$nextTick(() => {
      this.$refs.list && this.$refs.list.init()
    })
    // this.$refs.list.init()
  },
  methods: {
    searchCoin() {
      if (this.address == '') {
        return uni.showToast({
          icon: 'none',
          title: '合约地址不能为空'
        })
      }
      this.address = this.address.trim()
      uni.navigateTo({
        url: `/pages/assetManage/search?address=${this.address}`,
        events: {
          handlerChange: () => {
            this.tokenList = this.$cache.get('_currentWallet').coinList
          }
        }
      })
      this.address = ''
    },
    goTo(e) {
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    updateCoinList({ coinList }) {
      this.tokenList = coinList
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
  },
  onUnload() {
    const wallet = this.$cache.get('_currentWallet')
    wallet.coinList = this.tokenList
    this.$cache.set('_currentWallet', wallet, 0)
    this.updateWalletList(wallet)
  },
  onHide() {
    const wallet = this.$cache.get('_currentWallet')
    wallet.coinList = this.tokenList
    this.$cache.set('_currentWallet', wallet, 0)
    this.updateWalletList(wallet)
  },
  onBackPress(event) {
    if (event.from == 'backbutton') {
      // uni.switchTab({
      //   url: '/pages/account/index'
      // })
      // return true
    }
  },
  watch:{
    address(value){
      this.address = value.replace(/[\<\>\'\"\&]/g,'')
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    z-index: 9999;
  }
  .asset-manage {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
      
    .search {
      width: 628rpx;
      margin: -16rpx 0 0 24rpx;

      .u-search__content {
        width: 628rpx;
      }

      /deep/ input {
        font-weight: 600 !important;
        color: #8397B1 !important;
      }
    }

    .home-assets {
      display: flex;
      padding: 32rpx;
      align-items: center;
      justify-content: space-between;
      font-size: 32rpx;
      color: #2C365A;

      image {
        width: 32rpx;
        height: 32rpx;
      }
    }

    .space {
      height: 16rpx;
      background-color: #F4F6FA;
    }

    .hot-asset {
      padding: 32rpx 30rpx 32rpx 32rpx;

      .title {
        padding-top: 16rpx;
        font-size: 32rpx;
        font-weight: 600;
        color: #2C365A;
      }
    }
  }

  .noData {
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
  
  /deep/ .uni-input-placeholder {
    overflow: visible !important;
  }
</style>

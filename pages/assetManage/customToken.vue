<template>
  <view class="page-wrapper">
    <custom-notify ref="notify" style="z-index: 99;"></custom-notify>
    <custom-header :title="language.text241" :customStyle="{ 'z-index': 98 }"></custom-header>
    <view class="home-assets" data-url="/pages/assetManage/addToken" @click="goTo">
      <view class="title">
        {{language.text242}}
      </view>
      <image src="/static/img/ic-arrow1.png"></image>
    </view>
    <view class="space" />
    <view class="hot-asset">
      <view class="title">{{language.text243}}</view>
    </view>
    <custom-loading v-if="loading" style="margin-top: 100rpx;"></custom-loading>
    <view class="list">
      <List ref="list" :list="list" @change="updateCoinList" showSwiper @deleteItem="deleteItem" v-if="show"/>
    </view>
    <view v-if="list.length == 0" class="noData">
      <image class="data" src="@/static/img/account/nodata.png" />
      <view class="tip">
        {{ language.text255 }}
      </view>
    </view>
  </view>
</template>

<script>
import languages from '@/pages/account/language/index.js'
import List from './components/List.vue'
import mainCoin from '@/config/index.js'
export default {
  components: {
    List
  },
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      loading: false,
      list: this.$cache.get('_custom_tokens_list') || [],
      tokenList: this.$cache.get('_currentWallet').coinList,
      show: true
    }
  },
  onShow() {
    this.list = this.$cache.get('_custom_tokens_list') || [],
    this.tokenList = this.$cache.get('_currentWallet').coinList || []
    // let tokenAddress = []
    // this.tokenList.forEach(item => item.alias_name !== mainCoin.alias_name && tokenAddress.push(item.contract_address))
    // this.list = this.list.filter(item => tokenAddress.includes(item.contract_address))
    // this.$cache.set('_custom_tokens_list', this.list, 0)
    this.$refs.list && this.$refs.list.init()
  },
  async mounted() {
    if (this.$cache.get('_custom_tokens_list')) {
      this.list = this.$cache.get('_custom_tokens_list')
    }
    this.$nextTick(() => {
      this.$refs.list && this.$refs.list.init()
    })
  },
  methods: {
    goTo(e) {
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
        events: {
          addToken: (res) => {
            this.show = false
            this.list.unshift(res)
            this.currentWallet = this.$cache.get('_currentWallet')
            this.tokenList = this.currentWallet.coinList
            this.tokenList.push(res)
            this.currentWallet.coinList = this.tokenList
            this.$cache.set('_currentWallet', this.currentWallet, 0)
            this.updateWalletList(this.currentWallet)
            this.$cache.set('_custom_tokens_list', this.list, 0)
            setTimeout(() => {
              this.show = true
              this.$nextTick(() => {
                this.$refs.list && this.$refs.list.init()
              })
            }, 1560)
          }
        }
      })
    },
    deleteItem(contract) {
      this.list = this.list.filter(item => item.contract_address !== contract)
      this.$cache.set('_custom_tokens_list', this.list, 0)
      this.$refs.notify.show('error', this.language.text251, { bgColor: '#275EF1' })
    },
    updateCoinList({ coinList, contract }) {
      this.tokenList = coinList
    },
    updateWalletList(wallet) {
    
      const walletList = this.$cache.get('_walletList') || []
    
      if (!wallet) return false
    
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
    
      if (walletIndex > -1) {
    
        walletList.splice(walletIndex, 1, wallet)
    
      } else {
        walletList.unshift(wallet)
        
      }
    
    
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
}
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
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
</style>

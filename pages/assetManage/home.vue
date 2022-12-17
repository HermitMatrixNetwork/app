<template>
	<view class="asset-manage">
		<custom-header :showRight="false" :customStyle="{ 'z-index': 99, 'background-color': '#fff' }">
			<view slot="center" class="search">
				<u-search :placeholder="language.text169" shape="round" :clearabled="true" v-model="address" :showAction="false" @search="searchCoin" searchIcon="/static/img/delegate/search2.png"></u-search>
			</view>
		</custom-header>
		<view class="space"/>
		<view class="list">
			<List ref="list" :list="list" @change="updateCoinList"/>
		</view>
	</view>
</template>

<script>
import languages from '@/pages/account/language/index.js'
import List from './components/List.vue'

export default {
  data(){
    return {
		  language: languages[this.$cache.get('_language')],
      address: '',//查询地址
      list: this.$cache.get('_currentWallet').coinList.filter(item => item.apply_type !== 'NFT'),
      tokenList: this.$cache.get('_currentWallet').coinList
    }
  },
  components: {
    List
  },
  onShow() {
    this.list = this.$cache.get('_currentWallet').coinList.filter(item => item.apply_type !== 'NFT')
    this.tokenList = this.$cache.get('_currentWallet').coinList
    this.$refs.list && this.$refs.list.init()
  },
  onUnload() {
    const wallet = this.$cache.get('_currentWallet')
    wallet.coinList = this.tokenList
    this.$cache.set('_currentWallet', wallet, 0)
    this.updateWalletList(wallet)
  },
  mounted() {
    this.$refs.list.init()
  },
  methods: {
    updateCoinList({ coinList }) {
      this.tokenList = coinList
    },
    searchCoin(){
      if(this.address==''){
        return uni.showToast({
        	icon:'none',
          title: '合约地址不能为空'
        })
      }
      uni.navigateTo({
        url:`/pages/assetManage/search?address=${this.address}`,
        events: {
          handlerChange: () => {
            this.tokenList = this.$cache.get('_currentWallet').coinList
          }
        }
      })
    },
    goTo(e){
      uni.navigateTo({
      	url:e.currentTarget.dataset.url
      })
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
  }
}
</script>


<style lang="scss" scoped>
	.asset-manage {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
		.search {
			width: 628rpx;
			margin: -16rpx 0 0 24rpx;
			.u-search__content {
				width: 628rpx;
			}
		}
		.home-assets {
			display: flex;
			height: 98rpx;
			padding: 32rpx;
			margin-bottom: 16rpx;
			vertical-align: middle;
			font-size: 32rpx;
			color: #2C365A;
			.title {
				width: 100%;
			}
			.right {
				width: 32rpx;
				height: 32rpx;
			}
		}
		.space {
			height: 2rpx;
			background-color: rgba(131, 151, 177, .2);
		}
		.hot-asset {
			padding:32rpx 30rpx 32rpx 32rpx; 
			.title {
				height: 62rpx;
				padding-top: 16rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #2C365A;
			}
		}
	}
  
  /deep/ .uni-input-placeholder {
    overflow: visible !important;
  }
</style>
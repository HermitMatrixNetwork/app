<template>
	<view class="asset-manage">
		<custom-header :showRight="false">
			<view slot="center" class="search">
				<u-search :placeholder="language.searchPlaceholder" shape="round" :clearabled="true" v-model="address" :showAction="false" @search="searchCoin"></u-search>
			</view>
		</custom-header>
		<view class="space"/>
		<view class="list">
			<List :list="list"/>
		</view>
	</view>
</template>

<script>
import languages from './language/index.js'
import List from './components/List.vue'
import mainCoin from '@/config/index.js'
export default {
  data(){
    return {
		  language: languages[this.$cache.get('_language')],
      address: '',//查询地址
      list: this.$cache.get('_currentWallet').coinList
    }
  },
  components: {
    List
  },
  methods: {
    searchCoin(){
      if(this.address==''){
        return uni.showToast({
        	icon:'none',
          title: '合约地址不能为空'
        })
      }
      uni.navigateTo({
        url:`/pages/assetManage/search?address=${this.address}`
      })
    },
    goTo(e){
      uni.navigateTo({
      	url:e.currentTarget.dataset.url
      })
    },
  }
}
</script>


<style lang="scss" scoped>
	.asset-manage {
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
</style>
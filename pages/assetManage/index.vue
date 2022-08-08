<template>
	<view class="asset-manage">
		<custom-header tabUrl="/pages/account/index" :showRight="false">
			<view slot="center" class="search">
				<u-search :placeholder="language.searchPlaceholder" shape="round" :clearabled="true" v-model="address" :showAction="false" @search="searchCoin"></u-search>
			</view>
		</custom-header>
		<view class="home-assets" data-url="/pages/assetManage/home" @click="goTo">
			<view class="title">
				{{language.homeAssets}}
			</view>
			<image src="/static/img/ic-arrow1.png"></image>
		</view>
		<view class="space"/>
		<view class="hot-asset">
			<view class="title">{{language.hotAssets}}</view>
		</view>
    <custom-loading v-if="loading" style="margin-top: 100rpx;"></custom-loading>
		<view class="list" v-else-if="list.length">
			<List :list="list" />
		</view>
    <view v-else class="noData">
      <image class="data" src="@/static/img/account/nodata.png" />
      <view class="tip">
        暂无热门代币
      </view>
    </view>
	</view>
</template>

<script>
import languages from './language/index.js'
import List from './components/List.vue'
import { getHotList } from '@/api/token.js'
export default {
  data(){
    return {
		  language: languages[this.$cache.get('_language')],
      address: '',//查询地址
      list: [
        // {
        //   alias_name: 'BTC',
        //   contract_address: '0x20591e93afasdasd9768c40eeb39',
        //   apply_type: 'token'
        // },
      ],
      refresh: true,
      loading: true
    }
  },
  components: {
    List
  },
  onShow() {
    this.refreshList()
  },
  async created() {
    const res = (await getHotList()).data.data
    this.list = res.hot_assets_list
    this.loading = false
  },
  methods: {
    searchCoin(){
      if(this.address==''){
        return uni.showToast({
        	icon:'none',
          title: '合约地址不能为空'
        })
      }
      this.address = this.address.trim()
      uni.navigateTo({
        url:`/pages/assetManage/search?address=${this.address}`
      })
      this.address = ''
    },
    goTo(e){
      uni.navigateTo({
      	url: e.currentTarget.dataset.url,
      })
    },
    refreshList() {
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    }
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
      /deep/ input {
        font-weight: 500 !important;
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
			padding:32rpx 30rpx 32rpx 32rpx; 
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
</style>
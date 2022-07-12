<template>
	<view class="asset-manage">
		<custom-header :showRight="false">
			<view slot="center" class="search">
				<u-search :placeholder="language.searchPlaceholder" shape="round" :clearabled="true" v-model="keyword" :showAction="false"></u-search>
			</view>
		</custom-header>
		<view class="home-assets">
			<view class="title">
				{{language.homeAssets}}
			</view>
				  <u-icon class="right" name="arrow-right" color="#8397B1" @click="goTo"></u-icon>
		</view>
		<view class="space"/>
		<view class="hot-asset">
			<view class="title">{{language.hotAssets}}</view>
		</view>
		<view class="list">
			<List />
		</view>
	</view>
</template>

<script>
import languages from './language/index.js'
import List from './components/List.vue'
export default {
  data(){
    return {
		  language: languages[this.$cache.get('_language')],
      keyword: '',
    }
  },
  components: {
    List
  },
  methods: {
    goTo() {
			
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
			height: 16rpx;
			background-color: #F4F6FA;
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
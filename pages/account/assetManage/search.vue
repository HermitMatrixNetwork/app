<template>
	<view class="asset-manage">
		<view class="top">
			<u-search :placeholder="language.searchPlaceholder" shape="round" :clearabled="true" v-model="keyword" actionText="取消" :actionStyle="searchStyle" ></u-search>
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
      searchStyle: {
        fontSize: '28rpx',
        color: '#275EF1'
      }
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
		.top {
			padding: 20rpx 32rpx;
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
</style>
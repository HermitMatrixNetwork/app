<template>
	<view class="asset-manage">
			<view :reAddress="reAddress" :change:reAddress="render.search"></view>
		<view class="top">
			<u-search :placeholder="language.searchPlaceholder" shape="round" :clearabled="true" v-model="address" actionText="取消" :actionStyle="searchStyle"  @search="searchCoin" @custom="goBack"></u-search>
		</view>
		<view class="list">
			<List :list="list"/>
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
      reAddress: '',//renderjs调用
      address: '',//查询地址
      list: [],//查询结果
      searchStyle: {
        fontSize: '28rpx',
        color: '#275EF1'
      }
    }
  },
  components: {
    List
  },
  onLoad(options){
    if(options.address){
      this.address =options.address
      this.reAddress = options.address
    }
  },
  methods: {
    //查询合约
    searchCoin(){
		  this.reAddress = this.address
    },
    goBack(){
      uni.navigateBack()
    },
    goTo() {
			
    },
    //查询结果
    searchData(data){
      let list = []
      list.push(data)
      this.list = list
    }
  }
}
</script>
<script lang="renderjs" module="render">
import {getContractInfo} from '@/utils/secretjs/SDK'
import renderUtils from '@/utils/render.base.js'
export default {
	methods:{
		async search(address){
			console.log('address',address)
			if(address=='') return
			let data = await getContractInfo(address)
			data = {
				...data,
				...data.ContractInfo,
				logo: ''
			}
			renderUtils.runMethod(this._$id, 'searchData', data, this)
		
			console.log(data)
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
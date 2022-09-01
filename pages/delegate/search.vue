<template>
	<view class="asset-manage">
			<view :reAddress="reAddress" :change:reAddress="render.search"></view>
		<view class="top">
			<u-search :placeholder="language.text86" shape="round" :clearabled="true" v-model="address" actionText="取消" :actionStyle="searchStyle"  @search="searchCoin" @custom="goBack"></u-search>
		</view>
		<view class="list" v-if="list.length > 0">
			<List :list="list"/>
		</view>
		<view v-else class="noData">
			<img v-if="reAddress!=''" class="data" src="@/static/img/account/nodata.png" alt="">
			<img v-else class="searchbg" src="@/static/img/account/searchbg.png" alt="">
			<view class="tip">
				{{ reAddress ? '未搜索到相关节点' : '请输入验证人地址进行搜索' }}
			</view>
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
    // if(options.address){
    //   this.address =options.address
    //   this.reAddress = options.address
    // }
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
      if(data){
        let list = []
        list.push(data)
        this.list = list
      }else {
        this.list = []
      }
      
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
      console.log('111111111111', data);
			// if(data){
			// 	data = {
			// 		...data,
			// 		...data.ContractInfo,
			// 		logo: ''
			// 	}
			// }
			// renderUtils.runMethod(this._$id, 'searchData', data, this)
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
</style>
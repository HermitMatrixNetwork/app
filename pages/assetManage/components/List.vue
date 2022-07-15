<template>
	<view class="list">
		<view class="item" v-for="(item,index) in list" :key="item.address">
			<view class="left">
					<u-icon :name="require('../../../static/img/placeholder.jpeg')" size="72rpx"></u-icon>
			</view>
			<view class="center">
				<view class="title">{{item.label}}</view>
				<view class="address">
					{{item.address|sliceAddress}}
				</view>
			</view>
			<view class="right" v-if="item.label!=mainCoin.label">
				<u-icon v-if="searchList.includes(item.address)" :name="require('@/static/img/account/ic-delect.png')" size="44rpx" @click="changeCoin(index,'del')"></u-icon>
				<u-icon v-else  :name="require('@/static/img/account/ic-add.png')" size="44rpx" @click="changeCoin(index,'add')"></u-icon>
		
			</view>
		</view>
	</view>
</template>

<script>
	import {
		  sliceAddress
	} from '@/utils/filters.js'
	import mainCoin from '@/config/index.js'
export default {
	filters: {
		sliceAddress
	},
  props: {
		list: {
			type: Array,
			default: ()=>{
				return []
			}
		}
  },
  data(){
    return {
			searchList: [],//选择的代币列表地址数组	
			mainCoin: {}//主网币参数
    }
  },
	created(){
		this.mainCoin = mainCoin
		let currentWallte = this.$cache.get('_currentWallet')
		let coinList = currentWallte.coinList
		coinList.forEach(item=>{
			this.searchList.push(item.address)
		})
		console.log('coinList',coinList)
		console.log('	this.searchList',	this.searchList)
	},
	methods: {
		//修改coin列表，index选择索引，type类型 add添加，del为删除
		changeCoin(index,type){
			let currentWallte = this.$cache.get('_currentWallet')
			let walletList = this.$cache.get('_walletList')
			let curIndex = walletList.findIndex(item=>item.address==currentWallte.address)
			let coinList = currentWallte.coinList||[] 
			if(type=='add'){
				coinList.push(this.list[index])
			}else {
				coinList.splice(index,1)
			}
			
			currentWallte.coinList = coinList
			walletList[curIndex] = currentWallte
			console.log('currentWallte',currentWallte)
			console.log('_walletList',walletList)
			this.$cache.set('_currentWallet', currentWallte, 0)
			this.$cache.set('_walletList', walletList, 0)
			// uni.showToast({
			// 	icon: 'none',
			// 	title: '添加成功'
			// })
		}
	}
}
	
</script>

<style lang="scss" scoped>
	.list {
		.item {
			display: flex;
			height: 138rpx;
			padding: 33rpx 32rpx;
			border-bottom: 2rpx solid rgba(131, 151, 177, 0.2);
			.left{
				width: 72rpx;
			}
			.center {
				width: 100%;
				padding-left: 24rpx;
				.title {
					margin-bottom: 12rpx;
					font-size: 28rpx;
					color: #2C365A;
				}
				.address {
					font-size: 24rpx;
					color: #8397B1;
				}
			}
			.right {
				width: 44rpx;
				line-height: 44rpx;
				padding-top: 14px
			}
		}
	}
</style>
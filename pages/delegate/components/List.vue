<template>
	<view class="list">
		<view class="item" v-for="(item,index) in list" :key="index">
			<view class="left">
				<view class="name">
					{{item.validator.description.moniker}}
				</view>
				<view class="address">
					{{item.validator.operatorAddress|sliceAddress(7,8)}}
				</view>
			</view>
			<div class="right">
				<text class="num">{{item.balance.amount}}</text>
				<u-radio-group class="radioBox" @change="selRadio(index)"><u-radio shape="circle"></u-radio></u-radio-group>
			</div>
		</view>
	</view>
</template>

<script>
import {
	  sliceAddress
} from '@/utils/filters.js'
export default {
  filters: {
	  sliceAddress
  },
  props: {
    list: {
      type:Array,
      default(){
        return []
      }
    }
  },
  methods: {
	 selRadio(index){
		 uni.$emit('selList',this.list[index])
		 uni.navigateBack({
		 	delta:1
		 })
	 }
  }
	
}
</script>

<style lang="scss" scoped>
	.list {
		.item {
			display: flex;
			height: 133rpx;
			padding: 32rpx 0;
			border-bottom: 2rpx solid rgba(131,151,177,0.20);
			.left {
				flex: 2;
				.name {
					font-size: 28rpx;
					color: #2C365A;
				}
				.address {
					font-size: 24rpx;
					color: #8397B1;
				}
			}
			.right {
				flex:1;
				line-height: 72rpx;
				display: flex;
				justify-content: right;
				align-items: center;
				.num {
					margin-right: 24rpx;
				}
				.radioBox {
					flex:none
				}
			}
		}
	}
</style>
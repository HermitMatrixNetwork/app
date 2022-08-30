<template>
	<view class="list">
		<view class="item" v-for="(item,index) in list" :key="index" @click="clickItem(index)">
			<view class="left">
				<view class="name">
					{{item.validator.description.moniker}}
				</view>
				<view class="address">
					{{item.validator.operatorAddress|sliceAddress(7, -8)}}
				</view>
			</view>
			<div class="right">
				<text class="num" v-if="redirectURL !== '/pages/delegate/income'">{{item.balance.amount / mainCoin.decimals }}</text>
				<text class="num" v-else>{{ (item.rewards.amount / mainCoin.delegateDecimals).toFixed(5) }}</text>
        <radio class="radio" shape="circle" :checked="index == selectIndex"></radio>
			</div>
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
      type:Array,
      default(){
        return []
      }
    },
    redirectURL: {
      type: String,
      required: true
    },
    selectIndex: Number
  },
  data() {
    return {
      mainCoin
    }
  },
  methods: {
	 selRadio(index){
      console.log(index)
	 },
    clickItem(i) {
      uni.redirectTo({
        url: `${this.redirectURL}?selectIndex=${i}`
      })
    },
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
				display: flex;
				justify-content: right;
				align-items: center;
				.num {
					margin-right: 24rpx;
				}
				.radio {
					width: 32rpx;
          height: 32rpx;
				}
			}
		}
	}
  
  /deep/ .uni-radio-input {
    width: 32rpx !important;
    height: 32rpx !important;
    vertical-align: inherit !important;
  }
  
  /deep/ uni-radio .uni-radio-wrapper {
    vertical-align: inherit !important;
  }
</style>
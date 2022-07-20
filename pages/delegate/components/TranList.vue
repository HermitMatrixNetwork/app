<template>
	<view class="list">
		<view class="item" @click="goTo('/pages/delegate/transactionDetails')">
			<view class="left">
				<u-icon :name="require('@/static/img/placeholder.jpeg')" size="72rpx"></u-icon>
			</view>
			<view class="center">
				<view class="address">
					ghm63212AB...15DdC22318
				</view>
				<view class="name">
					22/06/2022 14:55:03
				</view>
			</view>
			<div class="right">
				<text class="num">0.2 GHM</text>
			</div>
		</view>
	</view>
</template>

<script>
export default {
  methods: {
		  goTo(url){
		    uni.navigateTo({
		      url
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
				margin-right: 20rpx
			}
			.center {
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
				.num {
					margin-right: 24rpx;
				}
			}
		}
	}
</style>
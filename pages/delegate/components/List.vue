<template>
	<view class="list">
		<view class="item">
			<view class="left">
				<view class="name">
					验证人名称
				</view>
				<view class="address">
					ghm63212AB...15DdC22318
				</view>
			</view>
			<div class="right">
				<text class="num">100.00</text>
				<u-radio shape="circle"></u-radio>
			</div>
		</view>
	</view>
</template>

<script>
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
				.num {
					margin-right: 24rpx;
				}
			}
		}
	}
</style>
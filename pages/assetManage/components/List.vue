<template>
	<view class="list">
		<view class="item">
			<view class="left">
					<u-icon :name="require('../../../static/img/placeholder.jpeg')" size="72rpx"></u-icon>
			</view>
			<view class="center">
				<view class="title">BTC</view>
				<view class="address">
					0x20591e93af..9768c40eeb39
				</view>
			</view>
			<view class="right">
				<u-icon :name="require('../../../static/img/account/ic-add.png')" size="44rpx"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  props: {
			
  },
  data(){
    return {
				
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
			}
		}
	}
</style>
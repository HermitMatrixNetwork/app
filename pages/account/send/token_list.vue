<template>
	<view class="choose_token">
		<custom-header :title="'代币选择'" />
		<view class="token-list">
			<view class="coinbox-item">
				<image src="../../../static/img/placeholder.jpeg"></image>
				<text class="coinName">uGHM</text>
				<view class="coinNumber">
					<view class="number">0.00000000</view>
					<view class="money">$0.00000</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
  data(){
    return{
				
    }
  }
}
</script>

<style lang="scss" scoped>
	.token-list{
		margin: 32rpx 32rpx 0;
	}
	.coinbox-item {
		display: flex;
		align-items: flex-start;
		width: 100%;
		height: 120rpx;
		position: relative;
		image {
			width: 80rpx;
			height: 80rpx;
		}
	
		text {
			padding: 24rpx 0 0 24rpx;
			font-family: PingFangSC-Medium;
			font-weight: 500;
			font-size: 32rpx;
			color: #2C365A;
			line-height: 32rpx;
		}
	
		.coinNumber {
			position: absolute;
			right: 0;
			top: 0;
			text-align: right;
			font-family: 'din-medium';
	
			.number {
				font-size: 32rpx;
			}
	
			.money {
				font-size: 28rpx;
			}
		}
	}
</style>
<template>
	<view class="token_content">
		<custom-header :title="tokenName">
			<template #customIcon>
				<text>详情</text>
			</template>
		</custom-header>
		
		<view class="main_token">
			<view class="coinbox-item">
				<image src="../../../static/img/placeholder.jpeg"></image>
				<text class="coinName">uGHM</text>
				<view class="coinNumber">
					<view class="number">0.00000000</view>
					<view class="money">$0.00000</view>
				</view>
			</view>
			
			<view class="token_details">
				<view class="available">
					<text>可用</text>
					<view class="quantity">
						<view>0.00000000</view>
						<view>$0.00000</view>
					</view>
				</view>
				<view class="lock">
					<text>锁定</text>
					<view class="quantity">
						<view>0.00000000</view>
						<view>$0.00000</view>
					</view>
				</view>
			</view>
			
		</view>
	
		
	
	</view>
</template>

<script>
export default {
  data(){
    return{
      tokenName:'GHM'
    }
  },
  onLoad() {
		
  }
}
</script>

<style lang="scss" scoped>
	.token_content{
		width: 100%;
		height: 100vh;
		background: #FFFFFF;
	}
	.main_token{
		width: 100%;
		height: 378rpx;
		padding: 32rpx;
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
	
		.token_details{
			height: 208rpx;
			background: #F8FAFB;
			background: #8397B110;
			border-radius: 8rpx;
			padding:0 24rpx;
			.available,.lock{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 103rpx;
				.quantity{
					text-align: right;
				}
			}
			.available{
				border-bottom: 2rpx solid #80808020;
			}
		}
	
	}
</style>

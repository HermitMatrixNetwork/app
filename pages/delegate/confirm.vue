<template>
	<view class="confirm">
		<custom-header :title="'确认委托'">
		</custom-header>
		<u-gap height="12" bgColor="#F4F6F9"></u-gap>
		<view class="lists">
			<view class="item">
				<view class="item-info">
					<view class="line title">
						委托交易信息<text class="index">1</text>
					</view>
					<view class="line">
						<view class="left h58">
							验证人名称
						</view>
						<view class="right">
							<view class="name">
								验证节点名称
							</view>
							<view class="address">
								ghm63212AB...15DdC22318
							</view>
						</view>
					</view>
					<view class="line">
						<view class="left h44">
						委托数量
						</view>
						<view class="right">
							<view class="num">
								10000.00
							</view>
						</view>
					</view>		
					<view class="line">
						<view class="left h44">
						Memo<text class="tip">（选填）</text>
						</view>
						<view class="right">
							  <u--input></u--input>
							<!-- <view class="num">
								10000.00
							</view> -->
						</view>
					</view>
				</view>
				<miners-column @getMinersCost="getMinersCost"></miners-column>
			</view>
		</view>
		<view class="main-bottom">
		<view class="submit-btn" @click="transferConfirm">
			确认
		</view>
	</view>
	</view>
</template>

<script>
export default {
  data(){
    return {
      list:[]
    }
  },
  onLoad(option){
    let data = JSON.parse(decodeURIComponent(option.data))
    this.list = data
    console.log('data',data)
  }
}
</script>

<style lang="scss" scoped>
	.confirm {
		position: relative;
		height: 100vh;
		background: #F4F6F9;
	}
	.lists {
		.item {
			background: #fff;
		}
		.item-info {
					padding: 0 32rpx;
		}
		.line {
			display: flex;
			padding: 32rpx 0;
			font-size: 28rpx;
			color: #2C365A;
			border-bottom: 2rpx solid rgba(131, 151, 177, .16);
			.left {
				flex: 1;
				.tip {
					color: #8F9BB3;
				}
			}
			.right {
				flex: 1;
				text-align: right;
				.name {
					font-size: 24rpx;
				}
				.address {
					font-size: 22rpx;
					color: #8397B1;
				}
			}
			.h58 {
				height: 58rpx;
				line-height: 58rpx;
			}
			.h44 {
				height: 44rpx;
				line-height: 44rpx;
			}
		}
		.title {
			// height: 92rpx;
			// line-height: 92rpx;
			font-weight: bold;
			.index {
				display: inline-block;
				width: 28rpx;
				height: 28rpx;
				margin-top: 6rpx;
				line-height: 28rpx;
				border-radius: 28rpx;
				border: 2rpx solid #2C365A;
				text-align: center;
			}
		}
	}
	.submit-btn {
			position: absolute;
			left: 64rpx;
			right: 64rpx;
			bottom: 64rpx;
			background: #002FA7;
			border-radius: 16rpx;
			text-align: center;
			line-height: 96rpx;
			font-weight: 400;
			font-size: 32rpx;
			color: #FCFCFD;
		}
</style>

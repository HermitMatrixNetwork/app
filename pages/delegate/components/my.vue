<template>
	<view class="my">
		<view class="header"></view>
		<view class="account-box">
			<view class="account-column">
				  <view class="column-item" @click="toSend">
				    <u-icon
				      :name="require('@/static/img/account/send.png')"
				      size="80rpx"
				    ></u-icon>
				    <text>发送</text>
				  </view>
				  <view class="column-item" @click="receivePopup">
				    <u-icon
				      :name="require('@/static/img/account/receive.png')"
				      size="80rpx"
				    ></u-icon>
				    <text>接收</text>
				  </view>
				  <view class="column-item">
				    <u-icon
				      :name="require('@/static/img/account/delegate.png')"
				      size="80rpx"
				    ></u-icon>
				    <text>委托</text>
				  </view>
			</view>
		</view>
		<view class="my-delegate">
			<view class="title">
				我的委托
			</view>
			<view class="list">
				<view class="list-title">
					<view class="left">节点</view>
					<view class="center">待领取收益</view>
					<view class="right">委托数量</view>
				</view>
				<view class="list-data">
					<view class="list-item">
						<view class="left">
							<view class="name">节点名称</view>
							<view class="other">gh212AB...C22T5218</view>
						</view>
						<view class="center">
							0.00023 GHM
						</view>
						<view class="right">
							<view class="name">10000.00</view>
							<view class="other">2022.06.28 11:30:30</view>
						</view>
					</view>
				</view>
				<no-data tip="暂无委托，点击" btnTx="参与委托" />
			</view>
		</view>
	</view>
</template>

<script>
	
</script>

<style  lang="scss" scoped>
	.my {
		.header {
			width: 686rpx;
			height: 280rpx;
		}
		.account-box {
			padding: 0 32rpx;
		}
		.account-column {
		  width: 100%;
		  height: 188rpx;
		  margin-top: 24rpx;
		  display: flex;
		  border-radius: 24rpx;
		  justify-content: space-around;
		  border: 2px solid rgba(44, 54, 90, 0.06);
		  .column-item {
		    width: 25%;
		    color: #2c4364;
		    font-size: 28rpx;
		    font-weight: 400;
		    text-align: center;
		    height: 100%;
		    display: flex;
		    flex-direction: column;
		    align-items: center;
		    justify-content: center;
		
		    text {
		      padding-top: 16rpx;
		    }
		  }
		}
		.my-delegate {
			padding-top: 12rpx;
			.title {
				padding: 0 32rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-weight: bold;
				font-size: 32rpx;
				color: #2C365A;
			}
			.list {
				.left {
					width: 212rpx;
				}
				.center {
					width: 266rpx;
					text-align: center;
				}
				.right {
					width: 212rpx;
					text-align: right;
				} 
				.list-title {
					display: flex;
					height: 64rpx;
					line-height: 64rpx;
					padding: 0 32rpx;
					font-size: 24rpx;
					background: rgba(30,94,255,0.04);
					color: #8397B1;
				}
				.list-data {
					padding: 0 32rpx;
					.list-item {
						display: flex;
						padding:  32rpx 0 36rpx 0;
						border-bottom: 2rpx solid rgba(151, 151, 151, .1) ;
						.name {
							font-size: 24rpx;
							color: #2C365A;
						}
						.other {
							font-size: 22rpx;
							color: #8397B1;
						}
					}
				}
	
			}
		}
		
	}
</style>
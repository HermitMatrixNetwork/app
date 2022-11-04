<template>
	<view>
		<custom-header :title="'NFT详情'">
			<template #right>
				<text>交易记录</text>
			</template>
		</custom-header>

		<view class="NFT_info">
			<view class="basic">
				<view class="image">
					<image src="../../static/img/account/createvalidate.png"></image>
				</view>
				<view class="words">
					<view>Forever Fomo Duck Squad</view>
					<view>ghmhUAHv3pFY...2qPBobmniBkJ</view>
				</view>
			</view>

			<view class="introduce">
				<u--text :lines="2" size='14px' color="#8397B1"
					text="Forever FOMO Duck Squad is the genesis collectio of NFTs for fdsafsdafsdajflasfjsaldjfl ">
				</u--text>
				<text>更多</text>
			</view>

			<view class="btn">
				<u-button type="primary" color="#002FA7" text="查看或设置viewkey"></u-button>
			</view>
		</view>

		<view class="NFT_list">
			<view class="title">
				我的NFT
			</view>
			<view class="line" />

			<scroll-view scroll-y="true" class="scrollView" v-if="hasAssets">
				<view class="nft_list_box">
					<view class="list-item">
						<view class="nft_image">
							<image src="../../static/icon/update_logo.png" mode=""></image>
						</view>
						<view class="nft_id">
							#1296
						</view>
					</view>
					<view class="list-item">
						<view class="nft_image">
							<image src="../../static/icon/update_logo.png" mode=""></image>
						</view>
						<view class="nft_id">
							#1296
						</view>
					</view>
					<view class="list-item">
						<view class="nft_image">
							<image src="../../static/icon/update_logo.png" mode=""></image>
						</view>
						<view class="nft_id">
							#1296
						</view>
					</view>	
				</view>
			</scroll-view>
			
			<view class="no-assets" v-else>
				<image src="../../static/img/mipmap.png" mode=""></image>
				<text>暂无资产</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      hasAssets:true
    }
  }
}
</script>

<style lang="scss" scoped>
	.NFT_info {
		width: 100%;
		height: 360rpx;
		margin-top: 112rpx;

		.basic {
			display: flex;
			align-items: center;
			height: 142rpx;
			padding: 32rpx;

			.image {
				>image {
					width: 80rpx;
					height: 80rpx;
				}


			}

			.words {
				padding-left: 32rpx;

				view:nth-child(1) {
					font-family: PingFangSC-S0pxibold;
					font-weight: 600;
					font-size: 32rpx;
					color: #2C365A;
					line-height: 32rpx;
					white-space: nowrap;
				}

				view:nth-child(2) {
					font-family: PingFangSC-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #2C365A;
					line-height: 28rpx;
					margin-top: 16rpx;
				}
			}
		}

		.introduce {
			padding: 0 32rpx;
			height: auto;

			>text {
				position: absolute;
				right: 32rpx;
				transform: translateY(-100%);
				width: 56rpx;
				height: 28rpx;
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				color: #1E5EFF;
				line-height: 28rpx;
			}
		}

		.btn {
			padding: 32rpx;
		}
	}

	.NFT_list {
		margin-top: 24rpx;

		.title {
			height: 92rpx;
			padding: 32rpx;
			font-family: PingFangSC-Medium;
			font-weight: bold;
			font-size: 28rpx;
			color: #2C365A;
			letter-spacing: 0;
			line-height: 28rpx;
		}

		.line {
			height: 2rpx;
			margin: 0 32rpx;
			background: #8397B1;
			opacity: 0.16;
		}

		.scrollView {
			padding: 0 32rpx;
			height: 1042rpx;

			.nft_list_box {
				width: 100%;
				height: auto;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				align-content: flex-start
			}

			.list-item {
				padding-top: 32rpx;

				.nft_image {
					width: 328rpx;
					height: 328rpx;
					border-radius: 16rpx;
					overflow: hidden;

					>image {
						width: 100%;
						height: 100%;
					}
				}

				.nft_id {
					height: 32rpx;
					font-family: PingFangSC-Medium;
					font-weight: bold;
					font-size: 32rpx;
					color: #2C365A;
					letter-spacing: 0;
					line-height: 32rpx;
					margin: 16rpx 0 8rpx 0;
					width: 328rpx;
				}
			}
		}
	
		.no-assets{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			>image{
				width: 240rpx;
				height: 240rpx;
			}
			>text{
				display: block;
				text-align: center;
				height: 28rpx;
				opacity: 0.6;
				font-family: PingFangSC-Regular;
				font-size: 28rpx;
				color: #8397B1;
				line-height: 28rpx;
			}
		}
	}
</style>

<template>
	<view>
		<custom-header :title="'NFT详情'"></custom-header>
		<view class="main">
			<view class="nft-icon">
				<image src="../../static/icon/update_logo.png" mode=""></image>
			</view>

			<view class="nft-describe">
				<view class="title">
					Forever Fomo Duck Squad
				</view>
				<text class="id">#1296</text>
			</view>

			<view class="nft-introduce">
				<view class="introduce">
					介绍
				</view>
				<view class="content">
					Forever FOMO Duck Squad is the genesis collection of NFTs for Highstreet World,made of 7,500
					procedurally generated (and 500 celebrity-inspired) FOMO duck designed to have continuing utility
					within our metaverse
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
	.main {
		padding-top: 112rpx;
		// background: red;
	}

	.nft-icon {
		text-align: center;
		width: 100%;
		height: 670rpx;

		>image {
			width: 670rpx;
			height: 670rpx;
		}
	}

	.nft-describe {
		padding: 0 32rpx;
		margin-bottom: 64rpx;

		.title {
			font-family: PingFangSC-S0pxibold;
			font-weight: 600;
			font-size: 40rpx;
			color: #2C365A;
			line-height: 32rpx;
			margin: 32rpx 0 24rpx 0;
		}

		.id {
			font-family: PingFangSC-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #8397B1;
			line-height: 28rpx;
		}
	}

	.nft-introduce {
		padding: 0 32rpx;

		.introduce {
			font-family: PingFangSC-Medium;
			font-weight: bold;
			font-size: 28rpx;
			color: #2C365A;
			line-height: 28rpx;
			margin-bottom: 24rpx;
		}
		.content{
			font-family: PingFangSC-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #8397B1;
			letter-spacing: 1.2px;
			line-height: 28rpx;
		}
	}
</style>

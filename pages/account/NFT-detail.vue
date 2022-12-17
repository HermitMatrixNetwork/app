<template>
	<view class="page-wrapper">
		<custom-header :title="language.text265"></custom-header>
		<view class="main">
			<view class="nft-icon">
				<image :src="token.logo" mode=""></image>
			</view>

			<view class="nft-describe">
				<view class="title">
					{{ NFT.full_name }}
				</view>
				<text class="id">#{{ token.id }}</text>
			</view>

			<view class="nft-introduce">
				<view class="introduce">
					{{ language.text271 }}
				</view>
				<view class="content">
					{{ NFT.desc}}
				</view>
			</view>
      
      <u-button class="btn" @click="toSend">{{ language.text03 }}</u-button>
		</view>
	</view>
</template>

<script>
import language from './language/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      NFT: {},
      token: {}
    }
  },
  onLoad(options) {
    this.NFT = this.$cache.get('_currentWallet').coinList.find(item => item.symbol == options.symbol)
    this.token = this.NFT.tokenList.find(item => item.id == options.id)
    console.log(this.token)
  },
  methods: {
    toSend() {
      uni.navigateTo({
        url: `./NFT-send?symbol=${this.NFT.symbol}&id=${this.token.id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
  }
	.main {
		// padding-top: 112rpx;
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
  
  .btn {
    margin: 96rpx 32rpx;
    width: auto;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
  }
</style>

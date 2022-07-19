<template>
	<view class="TokenVolumn" :style="tokenColumnStyle">
		<view class="item">
			<view class="left">
				<u-icon :name="tokenIcon" size="72rpx"></u-icon>
			</view>
			<view class="center">
				<view class="title">{{tokenName}}</view>
				<view class="address" :style="{display:tokenAddress?'block':'none'}">
					{{tokenAddress}}
				</view>
			</view>
			<view class="right">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
export default {
  props: {
    tokenName: {
      type: String,
      default: 'uGHM'
    },
    tokenAddress: {
      type: String,
      default: ''
    },
    tokenIcon: {
      type: String,
      default: require('../../../../static/img/placeholder.jpeg')
    },
    tokenColumnStyle: Object
  },
  data() {
    return {

    }
  },
  onLoad() {

  }
}
</script>

<style lang="scss" scoped>
	.TokenVolumn {
		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			height: 72rpx;
			position: relative;

			.left {
				padding-right: 24rpx;
			}

			.center {
				width: 332rpx;

				.title {
					font-family: PingFangSC-Medium;
					font-weight: 500;
					font-size: 28rpx;
					color: #2C365A;
					letter-spacing: 0;
					line-height: 28rpx;
				}

				.address {
					height: 24rpx;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #8397B1;
					letter-spacing: 0;
					line-height: 24rpx;
				}
			}

			.right {
				width: 250rpx;
				height: 72rpx;
				font-size: 28rpx;
				font-family: DIN-Medium;
				font-weight: 500;
				color: #2C365A;
				letter-spacing: 0;
				line-height: 28rpx;
				text-align: right;
			}
		}
	}
</style>

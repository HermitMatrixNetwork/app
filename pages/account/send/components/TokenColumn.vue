<template>
	<view class="TokenVolumn" :style="tokenColumnStyle">
		<view class="item">
			<view class="left">
        <image :src="tokenIcon" style="width: 72rpx; height: 72rpx"></image>
			</view>
			<view class="center">
				<view class="title">{{tokenName}}</view>
				<view class="address" :style="{display:tokenAddress?'block':'none'}">
					{{ tokenAddress | sliceAddress }}
				</view>
			</view>
			<view class="right">
				<slot name="right"></slot>
			</view>
		</view>
    <custom-border></custom-border>
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
      // default: require('@/static/img/account/uGHM.png')
      default: ''
    },
    tokenColumnStyle: Object
  },
  filters: {
    sliceAddress(val) {
      return val.substr(0, 8) + '...' + val.substr(-8)
    }
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
			position: relative;
      padding-bottom: 38rpx;

			.left {
				padding-right: 24rpx;
			}

			.center {
				flex: 1;

				.title {
					font-weight: 600;
					font-size: 28rpx;
					color: #2C365A;
					letter-spacing: 0;
					line-height: 28rpx;
				}

				.address {
					height: 24rpx;
					font-weight: 400;
					font-size: 24rpx;
					color: #8397B1;
					letter-spacing: 0;
					line-height: 24rpx;
					margin-top: 16rpx;
				}
			}

			.right {
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

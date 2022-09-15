<template>
	<view class="header-item">
		<view class="hi-left" :style="'background:'+radioBg"></view>
		<view class="hi-right">
			<view class="num" :style="'color:'+radioBg">{{ valueFormat(value) }}</view>
			<view class="tip" :style="'color:'+radioBg">{{title}}</view>
		</view>
	</view>
</template>

<script>
export default {
  props: {
    radioBg: {
      type: String,
      default: '#fff'
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type:Number|String,
      default: 0
    },
    needFormat: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    valueFormat(val) {
      return this.needFormat ? Number(val).toFixed(6) : val
    }
  }
}
	
</script>

<style lang="scss" scoped>
	.header-item {
		width: 343rpx;
		display: flex;
		padding: 24rpx  48rpx;
		.hi-left {
			width: 14rpx;
			height: 14rpx;
			margin: 12rpx 30rpx 0 0;
			border-radius: 14rpx;
			opacity: 0.5;
      flex-shrink: 0;
		}
		.hi-right {
			height: 68rpx;
			.num {
				height: 32rpx;
				line-height: 32rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
			.tip {
				font-size: 24rpx;
				opacity: 0.8;
			}
		}
	
	}
</style>
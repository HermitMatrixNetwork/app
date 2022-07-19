<template>
	<view>
		<button>
			<slot>确认</slot>
		</button>
	</view>
</template>

<script>
export default {
  props:{
    content:{
      type:String,
      default:'确认'
    }
  }
}
</script>

<style lang="scss" scoped>
	button{
		border-radius: 16rpx;
		height: 96rpx;
		color: #FFFFFF;
		line-height: 96rpx;
		font-weight: 400;
		font-size: 32rpx;
		letter-spacing: 0;
		background: #002FA8;
	}
</style>
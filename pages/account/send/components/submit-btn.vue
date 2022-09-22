<template>
	<view>
		<button :style="{'background':loadingIsShow?'#ccd5ed':'#002FA8'}">
			<slot>确认</slot>
			<custom-loading v-if="loadingIsShow" class='btnLoading'></custom-loading>
		</button>
	</view>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '确认'
    },
    loadingIsShow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
	button {
		border-radius: 16rpx;
		height: 96rpx;
		color: #FFFFFF;
		line-height: 96rpx;
		font-weight: 400;
		font-size: 32rpx;
		letter-spacing: 0;
		background: #002FA8;
	}

	.btnLoading {
		position: absolute;
		left: 56%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>

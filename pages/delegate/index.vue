<template>
	<view class="delegate">
		<view class="container">
			<div class="top">
					<view class="left">
						我的委托
						<view class="line"/>
					</view>
					<view class="right">
						验证人
						<view class="line"/>
					</view>
			</div>
			<My/>
		</view>
		<tab-bar :current-page="2" />
	</view>
</template>

<script>
import My from './components/my.vue'
export default {
  components: {
    My
  },
  data() {
    return {
      list: [{
        name: '我的委托',
      }, {
        name: '验证人',
      }, ]
    }
  }
}
</script>

<style lang="scss" scoped>
	.delegate {
		.container {
			.top {
				display: flex;
				height: 104rpx;
				padding: 26rpx 32rpx;
				font-size: 40rpx;
				color: #2C365A;
				border-radius: 2px;
			}

			.left {
				width: 160rpx;
				text-align: center;

			}

			.right {
				width: 120rpx;
				margin-left: 32rpx;
			}

			.line {
				height: 4rpx;
				margin-top: 12rpx;
				background: #275EF1;
				border-radius: 32px;

			}
		}
	}
</style>

<template>
	<view class="receive">
		<custom-header :title="'接收'" class="headerStyle"></custom-header>

		<view class="topPrompt">
			<view class="promptBg" />
			<view class="promptText">
				<u-icon :name="require('@/static/img/account/prompt.png')" size="32rpx"></u-icon>
				该地址仅支持 Hermit Matrix Network 资产，
				请勿转入其他公链资产
			</view>
		</view>

		<view class="receive_main">
			<view class="hint">
				扫二维码，转入 Hermit Matrix Network 资产
			</view>

			<view class="qrcode">
				<tki-qrcode ref="qrcode" :val="code.val" :size="code.size" :unit="code.upx" :onval="code.onval"
					:loadMake="code.loadMake" @result="qrR" />
			</view>

			<text>钱包地址</text>
			<view class="wallet_address">
				{{currentWallet.address}}
			</view>


			<button class="copy_btn" @click="copy(code['val'])">
				<u-icon :name="require('@/static/img/account/copy2.png')" label="复制地址" label-size="28rpx" size="40rpx">
				</u-icon>
			</button>

		</view>
		<view class="bottom_title">
			Hermit Wallet
		</view>
	</view>
</template>

<script>
import tkiQrcode from 'tki-qrcode'
import mixin from './mixins/index.js'
export default {
  mixins:[mixin],
  components: {
    tkiQrcode
  },
  data() {
    return {
      currentWallet: this.$cache.get('_currentWallet'),
      code: {
        //二维码参数
        val: '', //二维码的数据
        size: 368, //二维码大小
        unit: 'rpx', //二维码大小的单位
        icon: '', //二维码中间的logo地址
        iconSize: 40, //二维码中间的logo大小
        onval: true, //val值变化时自动重新生成二维码
        loadMake: true //组件加载完成后自动生成二维码
      },
      qrUrl: ''
    }
  },
  onLoad() {
    this.code.val = this.currentWallet.address
  },
  methods: {
    qrR(res){
      this.qrUrl = res
    },
  }
}
</script>

<style lang="scss" scoped>
	.headerStyle{
	/deep/	.container{
			.center{
				text{
					color: #FFFFFF !important;
				}
			}
			.u-icon__icon{
				color: #FFFFFF !important;
			}
		}
	}
	
	
	.receive {
		width: 100%;
		height: 100vh;
		background: #0F53C5;

		.topPrompt {
			position: relative;

			.promptBg {
				margin: 0 32rpx;
				height: 144rpx;
				opacity: 0.2;
				background: #FFFFFF;
				border: 2rpx solid #E5E6EB;
				box-shadow: 0 8rpx 10rpx 0 rgba(0, 0, 0, 0.10);
				border-radius: 16rpx;
			}
		}

		.promptText {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			align-items: flex-start;
			width: 568rpx;
			height: 80rpx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			font-size: 28rpx;
			color: #FFFFFF;
			line-height: 40rpx;

			/deep/ .u-icon__img {
				margin: 8rpx 16rpx 0 0 !important;
			}
		}
	}

	.receive_main {
		margin: 0 32rpx;
		height: 952rpx;
		margin-top: 32rpx;
		background: #F5F6FA;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		position: relative;
		overflow: hidden;

		.hint {
			height: 40rpx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			font-size: 28rpx;
			color: #8397B1;
			margin-top: 60rpx;
		}

		.qrcode {
			width: 428rpx;
			height: 428rpx;
			background-image: url('@/static/img/account/border.png');
			background-size: 100% 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		text {
			height: 24rpx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #8397B1;
			line-height: 24rpx;
			margin-top: 62rpx;
		}

		.wallet_address {
			width: 532rpx;
			height: 80rpx;
			font-family: PingFangSC-Medium;
			font-weight: 600;
			font-size: 28rpx;
			color: #2C365A;
			text-align: center;
			line-height: 40rpx;
			word-wrap: break-word;
			margin-top: -30rpx;
		}

		.copy_btn {
			height: 120rpx;
			width: 100%;
			border: none;
			outline: none;
			font-family: PingFangSC-Regular;
			color: #8397B1;
			letter-spacing: 0;
			font-weight: 400;
			font-size: 28rpx;
			background: #f5f7fb;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}


	.bottom_title {
		height: 44rpx;
		font-family: AlibabaPuHuiTi-Bold;
		font-weight: Bold;
		font-size: 44rpx;
		color: #FFFFFF;
		letter-spacing: 0;
		line-height: 44rpx;
		text-align: center;
		position: absolute;
		bottom: 120rpx;
		left: 50%;
		transform: translateX(-50%);
	}
</style>

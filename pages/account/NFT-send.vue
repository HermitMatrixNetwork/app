<template>
	<view>
		<custom-header :title="language.text15" :customStyle="{ 'z-index': 98 }">
			<template #right>
				<!-- <image src="/static/img/account/saoma.png" style="width:44rpx; height: 44rpx;" @click="scanCode"> -->
				<image
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsBAMAAADsqkcyAAAAIVBMVEUAAACEmLKEmLKEmLKEmLKGmrKEmrOInrSFmbKDmLOEl7Iuf7PGAAAAC3RSTlMAn1mlS0RbBpglhaOo7aEAAACASURBVCjPYyAVTFFSUkotgLDZw4AcTxCLRVhQUFDYASLMYgjkGII4EzvQhTskgSznLnRDVpgAWYpCKDaBRQZGOFEMRQwmEmyKIgYTKXFHFUSI0B+UJikhAbVwmDsFUYApXmFMQwYC4AhYHNGAI9IGVarCluxxZBIcWQpHBiQRAACNgim1+covDwAAAABJRU5ErkJggg=="
					style="width:44rpx; height: 44rpx;">
				</image>
			</template>
		</custom-header>
		<view class="main">
			<view class="receive-address">
				<view class="name-icon">
					<text>收款账户</text>
					<image
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAOVBMVEUAAACEmbKGl7GEmLKFmbSEmLOJnbWGmbSEmbSEmLKEmLOEl7KFmLOFmbKDmLOEmLGEmLKFmbWFmbJIAxtDAAAAE3RSTlMAojqbQY8LGDJriIBQWS2VdCRlwQkDFwAAAV5JREFUOMu1lcGWgyAMRX0EkADC0P//2MnUVrSUzKKnd+GG64MTY1i+zlrMlLJeVXZQcHzSi6g6rhy5DpSyNRNsTgT3zGYQ+0XBM4GP4CSuaqdndAHyy9q6vrydgf3UAbDnBcMpxsRmOWGBsC8Cp4X1h3CHfvaNuzPILYIoMkcixKbLXtx03zAksb0qb7L7w/Bynk2TvevV/yup84ps9rC+jVHkDApdDoSsyBtq63Kr2D5P1s/8eTUkDL3OwPbfF0QKovuQoH9BoTkQJeZEBDf0xth1eKB0XSfconPxJjXU5I738lBkjc9lH4y9YIKfyI0rDVRu72RbIVxVCNWOcgYhbfaFLYGQr7JdjORkvwz4TCSeFbkPmQiyy1ssIfYhU4AcAF4msIgZKMdgvAFhJgfglo4+Z9RKcZ3Ja6RK4P5LVHLZTMiOqgSfrgkiTCGCK+PoHOkDteObdrU1v3yZX4MfDRW7cqiQAAAAAElFTkSuQmCC"
						style="width:44rpx; height: 44rpx;" mode=""></image>
				</view>
				<view class="input-box">
					<u--textarea v-model="sendFormData.receiveAddress" class='textarea' placeholder="请输入内容" autoHeight>
					</u--textarea>
				</view>
			</view>

			<view class="nft-card">
				<view class="title">
					发送
				</view>
				<view class="card-msg">
					<view class="icon">
						<image src="../../static/img/account/USDT.png" mode=""></image>
					</view>
					<view class="words">
						<view>Forever Fomo Duck Squad</view>
						<view>#1296</view>
					</view>
				</view>
			</view>

			<!-- 矿工费 -->
			<miners-column ref="miners" @getMinersCost="getMinersCost" @getMinimumGas="getMinimumGas"></miners-column>

			<!-- 按钮 -->
			<view class="send-btn">
				<u-button type="primary" text="发送" color="#002FA7" :customStyle="{borderRadius:'16rpx'}"></u-button>
			</view>

			<!-- 弹窗 -->
			<u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" class="double-check-popup"
				:safeAreaInsetBottom="true">
				<view class="submitPopup">
					<view class="main">
						<view class="popup-title">
							{{ language.text42 }}
							<image src="/static/img/account/close.png" style="width: 32rpx; height: 32rpx;"
								@click="submitPopupIsShow=false"></image>
						</view>

						<!-- 发送账户 -->
						<view class="send-address">
							<text>{{language.text43}}</text>
							<text>{{sendFormData.userAddress}}</text>
						</view>

						<!-- 调用合约 -->
						<view class="receive_address">
							<text>调用合约</text>
							<text>{{sendFormData.userAddress}}</text>
						</view>

						<!-- 发送内容 -->
						<view class="send-address send-nftmsg">
							<text>发送内容</text>
							<image src="../../static/img/account/USDT.png" mode=""></image>
						</view>

						<!--矿工费-->
						<view class="miners_fee">
							<text>{{language.text46}}</text>
							<!-- <custom-loading v-if="feeLoading"></custom-loading> -->
							<view>
								<view>{{ sendFormData.gas }} * {{ sendFormData.gasPrice }}
									ughm
								</view>
								<view class="price">
									{{ totalGas }}
									GHM
								</view>
							</view>
						</view>
					</view>
					<view class="submit-btn" @click="submitAgain"
						style="position: absolute; bottom: 64rpx; width: 622rpx;">
						<u-button color="#002FA8" :text="language.text47"></u-button>
					</view>
				</view>
			</u-popup>
			
			<!-- 密码 -->

		</view>
	</view>
</template>

<script>
import languages from './language/index.js'
import decimal from 'decimal'
import mainCoin from '@/config/index.js'
export default {
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      sendFormData: {
        userAddress: this.$cache.get('_currentWallet').address,
        receiveAddress: '', //接收地址
        sendAmount: '', //发送金额
        memo: '',
        token: {},
        gas: '',
        gasPrice: '',
        decimals: null
      },
      submitPopupIsShow: true,
      modalPasswordIsShow:true
    }
  },
  methods: {
    getMinersCost(val) {
      // console.log('油费',val)
      // this.sendFormData.gas = ''
      // this.callSimulate = {}
      // if (val.speed == this.language.text27) {
      //   // this.sendFormData.gas = val.
      //   this.sendFormData.gas = val.minersGas
      //   this.isCustomFess = true
      // } else {
      //   this.isCustomFess = false
      // }
      // this.sendFormData.gasPrice = val.amount
    },
    getMinimumGas() {
      // this.$cache.set('_minimumGas', 0, 0)
      // const data = JSON.parse(JSON.stringify(this.sendFormData))
      // this.callSimulate = {}
      // this.$nextTick(() => {
      //   this.callSimulate = data
      // })
    },
    submitAgain() {

    }
  },
  computed: {
    totalGas() {
      return ''
      // return new decimal(this.sendFormData.gas + '').mul(new decimal(this.sendFormData.gasPrice)).div(
      //   new decimal(this.mainCoin.decimals)).toString()
    }
  },


}
</script>

<style lang="scss" scoped>
	.main {
		background: #F4F6FA;
		padding-top: 112rpx;
		width: 100%;
		height: 100vh;

		.receive-address {
			background: #FFF;
			padding: 0 32rpx;
			margin-bottom: 24rpx;

			.name-icon {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 32rpx 0 16rpx 0;

				>text {
					font-family: PingFangSC-Medium;
					font-weight: bold;
					font-size: 28rpx;
					color: #2C365A;
					letter-spacing: 0;
					line-height: 28rpx;
				}
			}
		}
	}

	.nft-card {
		width: 100%;
		height: 228rpx;
		background: #FFFFFF;

		.title {
			font-family: PingFangSC-Medium;
			font-weight: bold;
			font-size: 28rpx;
			color: #2C365A;
			line-height: 28rpx;
			padding: 32rpx;
		}

		.card-msg {
			padding: 0 32rpx;
			display: flex;
			justify-content: flex-start;

			.icon {
				margin-right: 32rpx;

				>image {
					width: 96rpx;
					height: 96rpx;
				}
			}

			.words {
				view:nth-child(1) {
					font-family: PingFangSC-S0pxibold;
					font-weight: 600;
					font-size: 32rpx;
					color: #2C365A;
					letter-spacing: 1px;
					line-height: 32rpx;
				}

				view:nth-child(2) {
					margin-top: 36rpx;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #8397B1;
					letter-spacing: 1.2px;
					line-height: 28rpx;
				}
			}
		}
	}

	.send-btn {
		position: absolute;
		width: 100%;
		padding: 0 64rpx;
		bottom: 64rpx;
	}


	.input-box {
		padding-bottom: 40rpx;
	}

	//自动换行input
	.textarea {
		/deep/ .u-textarea__field {
			line-height: 60rpx !important;
			font-size: 28rpx;
			color: #2C365A;
		}

		/deep/ .uni-textarea-wrapper {
			width: 560rpx !important;
		}
	}

	.u-textarea {
		background: #F2F4F8 !important;
		padding: 18rpx 32rpx;

		.uni-textarea-placeholder {
			color: #8397B1 !important;
			font-size: 28rpx !important;
		}
	}

	.u-textarea--radius {
		border-radius: 16rpx;
	}


	.submitPopup {
		width: 100%;
		height: 1028rpx;

		.main {
			padding: 0 32rpx;

			.popup-title {
				font-weight: 600;
				font-size: 32rpx;
				color: #2C365A;
				letter-spacing: 0;
				padding: 48rpx 0 16rpx 0;
				line-height: 32rpx;
				border-bottom: 0 !important;
			}

			>view {
				font-size: 28rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #dddddd80;

				text:nth-child(2) {
					width: 400rpx;
					word-wrap: break-word;
					text-align: right;
					font-weight: 400;
					color: #030319;
					letter-spacing: 0;
					line-height: 36rpx;
				}

				text:nth-child(1) {
					font-family: PingFangSC-Regular;
					font-weight: 400;
					color: #8F9BB3;
					letter-spacing: 0;
				}
			}

			.send-address,
			.receive_address {
				padding: 33rpx 0;
			}

			.send-nftmsg {
				align-items: flex-start;

				>image {
					width: 96rpx;
					height: 96rpx;
				}
			}

			.miners_fee {
				padding: 33rpx 0 39rpx 0;

				view {
					height: 80rpx;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					line-height: 28rpx;
					font-size: 28rpx;
					color: #030319;

					.price {
						color: #8F9BB3;
						margin-top: 24rpx;
					}
				}
			}
		}

	}

	.submit-btn {
		margin: 0 64rpx;
	}
</style>

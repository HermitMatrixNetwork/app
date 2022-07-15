<template>
	<view class="account">
		<!-- 钱包主页 -->
		<view class="status_bar">
			<!-- APP下会占用系统原生消息因此需要该占位符 -->
		</view>
		<view class="main">
			<view class="account-header">
				<text>我的钱包</text>
				<view class="header-icon">
					<u-icon name="scan" size="44rpx" color="#333655" @click="scanCode" />
					<u-icon name="setting" size="44rpx" color="#333655" />
				</view>
			</view>
			<view class="basic-data">
				<view class="user-msg">
					<view class="allassets">
						<!-- 总资产 -->
						<u-icon :name="eyeAsset?'eye':'eye-off'" size="32rpx" color="#FFFFFF" label="总资产"
							labelPos="left" labelSize="28rpx" labelColor="#FFFFFF" space="8rpx" @click="assentIsShow" />
					</view>
					<view class="user-balance">
						${{eyeAsset?allassets:"∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗"}}
					</view>
					<view class="user-address">
						{{newuserAdres}}
						<u-icon :name="require('../../static/img/account/copy.png')" color="#FFFFFF" size="32rpx" />
					</view>
				</view>
			</view>

			<view class="account-column">
				<view class="column-item" @click="toSend">
					<u-icon :name="require('../../static/img/account/send.png')" size="80rpx"></u-icon>
					<text>发送</text>
				</view>
				<view class="column-item" @click="receivePopup">
					<u-icon :name="require('../../static/img/account/receive.png')" size="80rpx"></u-icon>
					<text>接收</text>
				</view>
				<view class="column-item">
					<u-icon :name="require('../../static/img/account/delegate.png')" size="80rpx"></u-icon>
					<text>委托</text>
				</view>
				<view class="column-item" @click="dealBtn">
					<u-icon :name="require('../../static/img/account/transaction.png')" size="80rpx"></u-icon>
					<text>交易</text>
				</view>
			</view>

			<u-popup :show="show" mode="bottom" @close="close" duration="400">
				<view style="height: 800rpx;">
					这里是接收弹出层，点击接收弹出二维码
				</view>
			</u-popup>

			<u-modal :show="false" width="686rpx" :showConfirmButton="false" class="hintModal">
				<view class="modalContent">
					<u-icon name="info-circle" size="64rpx" color="#FFA033" />
					<view class="modal-title">提示</view>
					<text class="modal-content">当前viewkey与链上不一致，代币余额和交易记录将无法获取，请进入代币详情页点击设置viewkey。</text>
					<button @click="aa=false">确认</button>
				</view>
			</u-modal>

			<view class="coin-list">
				<u-tabs :list="coinList" lineColor="#2C365A" @click="click" :inactiveStyle="inactiveStyle"
					:activeStyle="activeStyle" lineWidth="20" lineHeight="3" :itemStyle="itemStyle">
					<view slot="right" style="padding-bottom: 8rpx;">
						<u-icon :name="require('../../static/img/account/add.png')" size="48rpx" color="#8895b0" bold>
						</u-icon>
					</view>
				</u-tabs>
				<scroll-view class="coinbox" scroll-y>
					<view class="content">
						<TokenColumn @click.native="queryToken">
							<template #right>
								<view class="coinNumber">
									<view class="number">0.00000000</view>
									<view class="money">$0.00000</view>
								</view>
							</template>
						</TokenColumn>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import TokenColumn from './send/components/TokenColumn.vue'
import languages from './language'
import {sliceAddress} from '@/utils/filters.js'
export default {
  components: {
    TokenColumn
  },
  data() {
    return {
      languages: languages[this.$cache.get('_language')],
      coinList: [{
        name: '代币'
      },
      {
        name: 'NFT'
      }
      ],
      inactiveStyle: {
        fontSize: '32rpx',
        color: '#8397B1',
        fontWeight: '500'
      },
      activeStyle: {
        fontSize: '34rpx',
        color: '#2C365A',
        fontWeight: '600'
      },
      itemStyle: {
        height: '60rpx',
        alignItems: 'flex-start'
      },
      show: false,
      allassets: 66666666, //总资产
      eyeAsset: true,
      userAdres: '', //用户地址
      newuserAdres: '',
      aa: true
    }
  },
  onLoad() {
    const {address} = this.$cache.get('_currentWallet')
    this.userAdres = address
    this.newuserAdres = sliceAddress(address)
    this.getUserbalance()
  },
  methods: {
    click(item) {
      console.log('item', item)
    },
    scanCode() {
      uni.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success(res) {
          console.log('条码类型：' + res.scanType)
          console.log('条码内容：' + res.result)
        }
      })
    },
    receivePopup() {
      this.show = !this.show
    },
    close() {
      this.show = false
    },
    dealBtn() {
      uni.showToast({
        title: '暂未开放',
        icon: 'none'
      })
    },
    assentIsShow() { //用户总资产是否显示
      this.eyeAsset = !this.eyeAsset
      this.aa = true
    },
    toSend() {
      console.log(111111111)
      uni.navigateTo({
        url: './send/index'
      })
    },
    queryToken() {
      uni.navigateTo({
        url: './send/token_content'
      })
    },
    async getUserbalance(){
      
    }
	
  }
}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.account {
		width: 100%;
		height: 100%;
	}

	.main {
		margin-left: 38rpx;
		margin-right: 26rpx;
		height: 100%;

		.account-header {
			width: 100%;
			font-size: 34rpx;
			padding-top: 20rpx;
			padding-bottom: 32rpx;
			font-weight: 500;
			color: #2C3457;
			letter-spacing: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.header-icon {
				display: flex;
				align-items: center;
				width: 120rpx;
				justify-content: space-around;
			}
		}

		.basic-data {
			width: 100%;
			height: 280rpx;
			background-image: url('@/static/img/account/card1.png');
			background-size: 100% 100%;
			border-radius: 24rpx;

			.user-msg {
				color: #FFFFFF;
				padding: 40rpx 32rpx 48rpx 32rpx;
				height: 100%;
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-between;

				.user-balance {
					font-family: DIN-Medium;
					font-weight: 500;
					font-size: 64rpx;
					color: #FFFFFF;
					letter-spacing: 0;
					line-height: 64rpx;
				}

				.user-address {
					font-size: 24rpx;
					display: flex;
					align-items: center;
					width: 420rpx;
					// overflow: hidden;
				}
			}
		}

		.account-column {
			width: 100%;
			height: 188rpx;
			margin-top: 24rpx;
			display: flex;
			border-radius: 24rpx;
			justify-content: space-around;
			border: 2px solid rgba(44, 54, 90, 0.06);

			.column-item {
				width: 25%;
				color: #2C4364;
				font-size: 28rpx;
				font-weight: 400;
				text-align: center;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				text {
					padding-top: 16rpx;
				}
			}
		}

		.coin-list {
			width: 100%;
			height: 60rpx;
			margin-top: 48rpx;

			.coinbox {
				margin-top: 48rpx;
				width: 100%;
				height: 600rpx;
			}
		}
	}

	/deep/ .hintModal {
		.u-modal {
			height: 510rpx;
		}

		.u-modal__content {
			padding: 32rpx;
			padding-top: 48rpx !important;
		}

		.modalContent {
			height: 430rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.modal-title {
				font-size: 32rpx;
				color: #2C365A;
				font-weight: 500;
				line-height: 32rpx;
			}

			.modal-content {
				width: 564rpx;
				font-size: 28rpx;
				color: #8397B1;
				line-height: 42rpx;
			}

			button {
				width: 622rpx;
				height: 96rpx;
				font-size: 32rpx;
				line-height: 96rpx;
				background: #002FA8;
				color: #FFFFFF;
			}
		}
	}

	/deep/ .u-tabs__wrapper {
		justify-content: space-between;
	}

	/deep/ .u-tabs__wrapper__scroll-view-wrapper {
		flex: none;
	}
</style>

<template>
	<view class="account">
		<!-- 钱包主页 -->
		<view class="status_bar">
			<!-- APP下会占用系统原生消息因此需要该占位符 -->
		</view>
		<view :address="address" :change:address="render.init"></view>
		<view class="main">
			<view class="account-header">
				<text>我的钱包</text>
				<view class="header-icon">
					<u-icon name="scan" size="44rpx" color="#333655" @click="scanCode" />
					<u-icon name="setting" size="44rpx" color="#333655" @click="toGo('/pages/walletManager/index')"/>
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
						<text v-if="eyeAsset">{{currentWallet.address|sliceAddress}}</text>
						<text v-else>∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗</text>
						<!-- {{eyeAsset?(currentWallet.address|sliceAddress):'∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗'}} -->
						<u-icon name="file-text" color="#FFFFFF" size="32rpx" />
					</view>
				</view>
			</view>

			<view class="account-column">
				<view class="column-item">
					<u-icon :name="require('../../static/img/account/send.png')" size="80rpx"></u-icon>
					<text>发送</text>
				</view>
				<view class="column-item" @click="receivePopup">
					<u-icon :name="require('../../static/img/account/receive.png')" size="80rpx"></u-icon>
					<text>接收</text>
				</view>
				<view class="column-item">
					<u-icon :name="require('../../static/img/account/entrust.png')" size="80rpx"></u-icon>
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

			<u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
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
					<view slot="right" style="padding-bottom: 8rpx;" data-url="/pages/assetManage/index" @click="goTo">
						<u-icon name="plus-circle" size="48rpx" color="#8895b0" bold></u-icon>
					</view>
				</u-tabs>
				<scroll-view class="coinbox" scroll-y>
					<view class="content">
						<view class="coinbox-item">
							<image src="../../static/img/placeholder.jpeg"></image>
							<text class="coinName">uGHM</text>
							<view class="coinNumber">
								<view class="number">0.00000000</view>
								<view class="money">$0.00000</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	 <TabBar />
	</view>
</template>

<script>
import {
	  sliceAddress
} from '@/utils/filters.js'
import {exceptE6} from '@/utils/format.js'
export default {
  filters:{
	  sliceAddress,
    exceptE6
  },
  data() {
    return {
      address: '',
      currentWallet: this.$cache.get('_currentWallet'),
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
      userAdres: 'dalfjlkajflajflafsdafsafsadfsadfsdafsdfasdfasdfa', //用户地址
      newuserAdres: '',
      aa: true
    }
  },
  onLoad() {
    this.newuserAdres = this.userAdres.replace(this.userAdres.slice(16, 36), '***')
  },
  created(){
    this.address = this.currentWallet.address
  },
  mounted(){
		 // console.log('_currentWallet',this.$cache.get('_currentWallet'))
    //  this.currentWallet = this.$cache.get('_currentWallet')
    // console.log('currentWallet',this.currentWallet)
   
  },
  methods: {
    click(item) {
      console.log('item', item)
    },
    //页面跳转
    goTo(e){
      console.log(e)
      uni.navigateTo({
      	url:e.currentTarget.dataset.url
      })
    },//页面跳转
    toGo(url){
      uni.navigateTo({
      	url
      })
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
    }
  }
}
</script>



<script lang="renderjs" module="render">
import {getBalance,QueryStakingValidators} from '@/utils/account.js'
	export default {
		methods: {
			async init(address){
				console.log('address',address)
				//获取主网币余额
				let res = await getBalance(address)
				console.log('res',res)
				// let res2 = await QueryStakingValidators()
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
			background: #002FA8;
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

				.content {
					width: 100%;
					position: relative;

					.coinbox-item {
						display: flex;
						align-items: flex-start;
						width: 100%;
						height: 120rpx;
						border-bottom: 2rpx solid rgba(131, 151, 177, .16);
						image {
							width: 80rpx;
							height: 80rpx;
						}

						text {
							padding: 24rpx 0 0 24rpx;
							font-family: PingFangSC-Medium;
							font-weight: 500;
							font-size: 32rpx;
							color: #2C365A;
							line-height: 32rpx;
						}

						.coinNumber {
							position: absolute;
							right: 0;
							top: 0;
							text-align: right;
							font-family: 'din-medium';

							.number {
								font-size: 32rpx;
							}

							.money {
								font-size: 28rpx;
							}
						}
					}
				}
			}
		}
	}

	/deep/ .hintModal {
		.u-modal{
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

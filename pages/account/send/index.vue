<template>
	<view class="sendPage">
		<custom-header :title="'发送'" :style="titleStyle">
			<template #customIcon>
				<u-icon name="scan" size="44rpx" />
			</template>
		</custom-header>
		<view class="main-top">

			<view class="content">

				<!-- 代币选择 -->
				<view class="change-token" @click="chooseToken">
					<image :src="tokenUrl"></image>
					<text>{{tokenName}}</text>
					<view class="icon-right">
						<u-icon name="arrow-right" />
					</view>
				</view>

				<!-- 收款地址 -->
				<view class="collection-adres">
					<InputTitle :title="'收款地址'" :type="'text'" :placeholder="'输入或粘贴钱包地址'"
						:inputVal.sync="receiveAddress">
						<template #title-icon>
							<u-icon :name="require('../../../static/img/account/addressbook.png')" size="44rpx"
								@click="chooseAddress"></u-icon>
						</template>
					</InputTitle>
				</view>

				<!-- 发送金额 -->
				<view class="send-amount">
					<InputTitle :title="'发送金额'" :type="'number'" :placeholder="'请输入金额'" :inputVal.sync="sendAmount"
						:maxlength="19" :warningStyleisShow="sendAmount>balance?true:false"
						:inputOtherStyle="sendAmountStyle">
						<template #title-icon>
							<text class="balance">可用：{{balance.toFixed(2)}}GHM</text>
						</template>
						<template #inputRight>
							<view class="choose-num">
								<text>{{tokenName}}</text>|<text></text>
								<text>全部</text>
							</view>
						</template>
					</InputTitle>
					<text v-if="sendAmount>balance" class="waringPrompt">输入金额超过钱包可用余额，请重新输入</text>
				</view>

				<view class="send-memo">
					<InputTitle :title="'Memo'" :type="'text'" :placeholder="'请输入Memo（选填）'" :inputVal.sync="memoValue">
					</InputTitle>
				</view>
			</view>
		</view>

		<view class="main-bottom">
			<view class="miners-cost">
				<view class="content">
					<text class="title">矿工费</text>
					<view class="miners-list">
						<view v-for="(item,index) in minersList" :key="index"
							:class="[selectedMiners==index?'selectedMiners':'',item.price?'':'custom']"
							@click="costChoose(item,index)">
							<text>{{item.title}}</text>
							<text :style="{display:item.quantity?'':'none'}">{{item.quantity}}</text>
							<text :style="{display:item.price?'':'none'}">{{item.price}}</text>
							<text :style="{display:item.time?'':'none'}">{{item.time}}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="submit-btn" @click="submitPopupIsShow=true">
				确认
			</view>
		</view>

		<u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
			:closeable="true" closeIconPos="top-right" :safeAreaInsetBottom="true">
			<view class="submitPopup">
				<view class="main">
					<view class="popup-title">
						转账确认
					</view>

					<!-- 发送账户 -->
					<view class="send-address">
						<text>发送账户</text>
						<text>ghmc7b1C272F7CBE1950e11134078075Ff07D68310</text>
					</view>

					<!-- 接收账户 -->
					<view class="receive_address">
						<text>接收账户</text>
						<text>{{receiveAddress}}</text>
					</view>

					<!-- 转账金额 -->
					<view class="transfer_amount">
						<text>转账金额</text>
						<text>{{sendAmount?sendAmount:'0'}}{{tokenName}}</text>
					</view>

					<!--Memo-->
					<view class="memo_type">
						<text>Meno</text>
						<text>transfer</text>
					</view>

					<!--矿工费-->
					<view class="miners_fee">
						<text>矿工费</text>
						<view>
							<veiw>21000 GWEI*2100 GasPrice</veiw>
							<veiw class="price">0.000287 GHM</veiw>
						</view>
					</view>
				</view>
				<view class="submit-btn" @click="submitAgain">
					确认
				</view>
			</view>
		</u-popup>

		<u-modal :show="false" :showConfirmButton="false">
			<view class="modal_main">
				<view class="modal_title">
					密码确认
				</view>
				<InputTitle :type="'password'" :placeholder="'请输入资金密码'" :inputVal.sync="payPassword"
					:warningStyleisShow="passwordCheck">
				</InputTitle>
				<text v-if="passwordCheck" class="waringPrompt">资金密码错误，请确认后重新输入!</text>
				<button class="modal_submit"
					@click="payPassword!=123?passwordCheck=true:passwordCheck=false">确认</button>
			</view>
		</u-modal>
	</view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
export default {
  components: {
    InputTitle
  },
  data() {
    return {
      tokenUrl: '../../../static/img/placeholder.jpeg',
      tokenName: 'GHM',
      inputVal: '',
      balance: 0,
      receiveAddress: '', //接收地址
      sendAmount: '', //发送金额
      memoValue: '', //Memo
      payPassword: '', //资金密码
      passwordCheck: false, //密码校验
      selectedMiners: 1,
      submitPopupIsShow: false,
      titleStyle: {
        background: '#FFFFFF'
      },
      //发送金额样式
      sendAmountStyle: {
        height: '144rpx',
        fontSize: '40rpx',
        color: '#2C365A',
        fontWeight: '500'
      },
      minersList: [{
        title: '慢',
        quantity: '0.000215GHM',
        price: '$0.0002',
        time: '15'
      },
      {
        title: '推荐',
        quantity: '0.000215GHM',
        price: '$0.0002',
        time: '5'
      },
      {
        title: '快',
        quantity: '0.000357ETH',
        price: '$0.0002',
        time: '3'
      },
      {
        title: '自定义',
        quantity: '',
        price: '',
        time: ''
      }
      ]
    }
  },
  onLoad(value) {
    
  },
  methods: {
    chooseAddress() {
      console.log(1111111111)
      uni.navigateTo({
        url: './adres_book'
      })
    },
    chooseToken() {
      console.log('代币选择')
      uni.navigateTo({
        url: './token_list'
      })
    },
    costChoose(item, index) {
      if (index == 3) {
        let that = this
        uni.navigateTo({
          url: './custom_cost',
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            someEvent: function(data) {
              console.log('接收的数据', data)
              that.minersList[3].price = data['price']
              that.minersList[3].quantity = data['num']
              that.selectedMiners = 3
            }
          },
        })
        return
      }
      this.selectedMiners = index
    },
    submitAgain() {
      if (this.sendAmount > this.balance) return console.log('大于')
      console.log(this.minersList[this.selectedMiners])
      uni.navigateTo({
        url: './transactionDetails'
      })
    }
  },
}
</script>

<style lang="scss" scoped>
	.sendPage {
		width: 100%;
		height: 100%;
		background: #F4F6FA;
	}

	.main-top {
		background: #FFFFFF;
		padding-top: 48rpx;
		height: 812rpx;
		width: 100%;

		.content {
			margin: 0 32rpx;
		}

		.change-token {
			background: #FFFFFF;
			border: 2rpx solid rgba(131, 151, 177, 0.16);
			border-radius: 16rpx;
			height: 112rpx;
			display: flex;
			align-items: center;
			position: relative;
			margin-bottom: 40rpx;

			&>image {
				width: 56rpx;
				height: 56rpx;
				margin-left: 32rpx;
				margin-right: 12rpx;
			}

			&>text {
				font-size: 32rpx;
				color: #2C365A;
				font-family: PingFangSC-Medium;
				font-weight: 500;
				letter-spacing: 0;
			}

			.icon-right {
				position: absolute;
				right: 20rpx;
			}
		}

		//收款地址
		.collection-adres {
			width: 100%;
			height: 156rpx;
		}

		//发送金额
		.send-amount {
			margin-top: 32rpx;
			position: relative;

			.balance {
				font-family: PingFangSC-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #8397B1;
				letter-spacing: 0;
				text-align: right;
				line-height: 24rpx;
			}

			.choose-num {
				position: absolute;
				top: 50%;
				right: 32rpx;
				transform: translateY(20%);
				font-weight: 500;
				font-size: 28rpx;
				color: #2C365A;
				width: 172rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				text:nth-child(2) {
					// width: 2rpx;
					// height: 24rpx;
					// opacity: 0.4;
					// border: 1px solid #8397B150;
				}

				text:nth-child(3) {
					color: #1E5EFF;
				}

			}

		}

		.send-memo {
			margin-top: 32rpx;
		}
	}


	.main-bottom {
		width: 100%;
		height: 612rpx;
		background: #F4F6FA;
		position: absolute;
		bottom: 0;

		.miners-cost {
			width: 100%;
			height: 312rpx;
			background: #FFFFFF;
			position: relative;
			top: 24rpx;

			.content {
				padding: 32rpx 32rpx 48rpx;

				.title {
					font-weight: 500;
					font-size: 28rpx;
					color: #2C365A;
					letter-spacing: 0;
				}

				.miners-list {
					height: 180rpx;
					margin-top: 16rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					view {
						display: flex;
						flex-direction: column;
						align-items: center;
						position: relative;
						width: 158rpx;
						height: 180rpx;
						background: #FFFFFF;
						border: 2rpx solid rgba(131, 151, 177, 0.20);
						border-radius: 8rpx;
						overflow: hidden;

						text:nth-child(1) {
							height: 60rpx;
							line-height: 60rpx;
							font-size: 28rpx;
							font-weight: 400;
							color: #2C365A;
							letter-spacing: 0;
						}

						text:nth-child(2),
						text:nth-child(3) {
							padding-bottom: 6rpx;
							font-weight: 400;
							font-size: 20rpx;
							color: #8397B1;
						}

						text:nth-child(4) {
							width: 100%;
							height: 40rpx;
							position: absolute;
							bottom: 0;
							text-align: center;
							line-height: 40rpx;
							background: #F5F6F8;
							border-radius: 0 0 8rpx 4rpx;
							border-radius: 0 0 4rpx 4rpx;
							color: #8397B1;
							font-size: 20rpx;
						}
					}

					.selectedMiners {
						border: 2rpx solid rgba(30, 94, 255, 0.60);
						box-sizing: border-box;

						text {
							color: #1E5EFF !important;
						}

						text:nth-child(4) {
							border-top: 2rpx solid rgba(30, 94, 255, 0.60);
						}
					}

					.custom {
						text:nth-child(1) {
							height: 180rpx;
							line-height: 180rpx;
						}
					}
				}
			}
		}

		.submit-btn {
			margin: 0 64rpx;
			height: 96rpx;
			position: relative;
			top: 116rpx;
			background: #002FA7;
			border-radius: 16rpx;
			text-align: center;
			line-height: 96rpx;
			font-weight: 400;
			font-size: 32rpx;
			color: #FCFCFD;
		}
	}

	//弹出层
	.submitPopup {
		width: 100%;
		height: 1028rpx;

		.main {
			margin: 0 32rpx;

			.popup-title {
				font-weight: 500;
				font-size: 32rpx;
				color: #2C365A;
				letter-spacing: 0;
				padding: 48rpx 0 16rpx 0;
				line-height: 32rpx;
			}

			view {
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

			.transfer_amount,
			.memo_type {
				padding-top: 33rpx;
				padding-bottom: 43rpx;
			}

			.miners_fee {
				padding: 33rpx 0 39rpx 0;

				view {
					height: 80rpx;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					line-height: 28rpx;

					.price {
						color: #8F9BB3;
					}
				}
			}

		}

	}


	.submit-btn {
		margin: 0 64rpx;
		height: 96rpx;
		position: relative;
		top: 116rpx;
		background: #002FA7;
		border-radius: 16rpx;
		text-align: center;
		line-height: 96rpx;
		font-weight: 400;
		font-size: 32rpx;
		color: #FCFCFD;
	}

	.modal_main {
		width: 100%;

		.modal_title {
			font-family: PingFangSC-Medium;
			font-weight: 500;
			font-size: 32rpx;
			color: #2C365A;
			letter-spacing: 0;
		}

		.modal_submit {
			background: #002FA7;
			border-radius: 16rpx;
			height: 96rpx;
			font-family: PingFangSC-Regular;
			font-weight: 400;
			font-size: 32rpx;
			color: #FCFCFD;
			letter-spacing: 0;
			line-height: 96rpx;
			margin-top: 80rpx;
		}
	}

	.waringPrompt {
		margin-top: 8rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #EC2828;
		letter-spacing: 0;
		line-height: 24rpx;
		height: 24rpx;
		position: absolute;
	}

	/deep/ .u-popup__content {
		border-radius: 16rpx !important;

		.u-modal__content {
			padding: 48rpx 32rpx !important;
		}
	}
</style>

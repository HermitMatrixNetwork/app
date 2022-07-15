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
						ref="sendAmountInput" :maxlength="19" :warningStyleisShow="sendAmount>balance?true:false"
						:inputOtherStyle="sendAmountStyle">
						<template #title-icon>
							<text class="balance">可用：{{balance.toFixed(2)}}GHM</text>
						</template>
						<template #inputRight>
							<view class="choose-num">
								<text>{{tokenName}}</text>|<text></text>
								<text @click="testAmount">全部</text>
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
			<miners-column @getMinersCost="getMinersCost"></miners-column>

			<view class="submit-btn" @click="transferConfirm">
				确认
			</view>
		</view>

		<u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
			:safeAreaInsetBottom="true">
			<view class="submitPopup">
				<view class="main">
					<view class="popup-title">
						转账确认
						<u-icon :name="require('../../../static/img/account/close.png')" size="32rpx"
							@click="submitPopupIsShow=false"></u-icon>
					</view>

					<!-- 发送账户 -->
					<view class="send-address">
						<text>发送账户</text>
						<text>{{userAddress}}</text>
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

		<u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
			<view class="modal_main">
				<view class="modal_title">
					密码确认
					<u-icon :name="require('../../../static/img/account/close.png')" size="32rpx"
						@click="modalPasswordIsShow=false"></u-icon>
				</view>
				<InputTitle :type="'password'" :placeholder="'请输入资金密码'" :inputVal.sync="payPassword"
					:warningStyleisShow="passwordCheck">
				</InputTitle>
				<text v-if="passwordCheck" class="waringPrompt">资金密码错误，请确认后重新输入!</text>
				<button class="modal_submit" @click="passwordButton">确认</button>
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
      balance: 1231,
      receiveAddress: '0xe5362b301e581d24507a91b8376139E03dBF04bb', //接收地址
      sendAmount: 123, //发送金额
      memoValue: '123', //Memo
      payPassword: '123', //资金密码
      passwordCheck: false, //密码校验
      submitPopupIsShow: false,
      modalPasswordIsShow: false,
      userAddress: this.$cache.get('_currentWallet').address,
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
    submitAgain() {
      this.modalPasswordIsShow = true
      this.submitPopupIsShow = false
    },
    transferConfirm() { //转账确认
      const {
        receiveAddress,
        sendAmount,
        memoValue,
        balance
      } = this.$data
      if (!(receiveAddress && sendAmount && memoValue)) {
        return console.log('输入不能为空')
      }
      if (sendAmount > balance || balance == 0) {
        return console.log('余额不足')
      }
      this.submitPopupIsShow = true
    },
    passwordButton() {
      const {
        receiveAddress,
        sendAmount,
        memoValue,
        balance
      } = this.$data
      const obj = {
        sendAmount,
        minersfee: this.minersMsg,
        receiveAddress,
        payAddress: this.userAddress,
        memoValue,
        aaa: '交易号'
      }
      if (this.payPassword != 123) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        console.log()
        uni.navigateTo({
          url: `./transactionDetails?transactionObject=${JSON.stringify(obj)}`
        })
        this.modalPasswordIsShow = false
      }
      this.payPassword = ''
    },
    testAmount() {
      // this.sendAmount = this.balance 
      // console.log(this)
    },
    getMinersCost(val){
      console.log('接收到值',val)
      this.minersMsg = val
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

				text:nth-child(2) {}

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
			display: flex;
			justify-content: space-between;
			align-items: center;
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

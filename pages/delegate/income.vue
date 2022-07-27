<template>
	<view class="sendPage">
		<custom-header :title="'收益领取'" :style="titleStyle">
			<template #right>
				<u-icon :name="require('@/static/img/account/saoma.png')" size="44rpx" @click="scanCode" />
			</template>
		</custom-header>
		<view class="main-top">
			<!-- 选择取消委托节点 -->
			<view class="content">
				<view class="content-top">
					<!-- 收款地址 -->
					<view class="collection-adres">
						<InputTitle :title="'收益领取接收地址'" :type="'text'" :placeholder="'输入或粘贴钱包地址'" ref="addressInptval"
							:inputVal.sync="receiveAddress">
							<template #title-icon>
								<u-icon :name="require('@/static/img/account/addressbook.png')" size="44rpx"
									@click="toGo('/pages/account/send/adres_book')"></u-icon>
							</template>
						</InputTitle>
            
					</view>
					<view class="tip">
						注：收益领取交易成功即到账！
					</view>
				</view>
			</view>
			<view class="line">

			</view>

			<view class="content">


				<!-- 输入取消委托数量 -->
				<view class="send-amount">
          <view class="amount">
            <view class="label">
              <text>发送金额</text>
            </view>
            <view class="value">
              <u--input placeholder="请输入金额" v-model="amount"></u--input>
              <view class="right">
                <text class="denom">GHM</text>
                <view class="border"></view>
                <text class="all" @click="testAmount">全部</text>
              </view>
            </view>
          </view>
					<view class="other">
						<div class="title">当前节点委托：</div>
						<div class="num">10.00 GHM</div>
					</view>
					<text v-if="sendAmount>balance" class="waringPrompt">输入金额超过钱包可用余额，请重新输入</text>
				</view>
			</view>
		</view>

		<view class="main-bottom">
			<miners-column @getMinersCost="getMinersCost"></miners-column>

			<view class="btn" @click="transferConfirm">
				确认
			</view>
		</view>

		<u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
			:safeAreaInsetBottom="true">
			<view class="submitPopup">
				<view class="main">
					<view class="popup-title">
						交易确认
						<u-icon :name="require('@/static/img/account/close.png')" size="32rpx"
							@click="submitPopupIsShow=false"></u-icon>
					</view>

					<!-- 发送账户 -->
					<view class="send-address">
						<text>操作账户</text>
						<text>{{userAddress}}</text>
					</view>

					<!-- 接收账户 -->
					<view class="receive_address">
						<text>接收账户</text>
						<text>{{receiveAddress}}</text>
					</view>

					<!-- 取消委托数量 -->
					<view class="transfer_amount">
						<text>取消委托数量</text>
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
					<u-icon :name="require('@/static/img/account/close.png')" size="32rpx"
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
import InputTitle from '@/pages/account/send/components/Input-title.vue'
export default {
  components: {
    InputTitle
  },
  data() {
    return {
      tokenUrl: '@/static/img/placeholder.jpeg',
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
      amount: ''
    }
  },
  onLoad(value) {

  },
  methods: {
    chooseAddress() {
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
    getMinersCost(val) {
      console.log('接收到值', val)
      this.minersMsg = val
    }
  },
}
</script>

<style lang="scss" scoped>
	.sendPage {
		height: 100vh;
		overflow: hidden;
		background: #F4F6F9;
	}

	.main-top {
		background: #FFFFFF;
		width: 100%;

		.content {
			margin: 0 32rpx;
		}

		.line {
			height: 24rpx;
			background: #F4F6F9;
		}

		.content-top {
			.title {
				padding: 32rpx 0;
				font-weight: bold;
				font-size: 28rpx;
				color: #2C365A;
			}

			.tip {
				line-height: 72rpx;
				font-size: 24rpx;
				color: #EC2828;
			}
		}

		.change-token {
			background: #FFFFFF;
			border: 2rpx solid rgba(131, 151, 177, 0.16);
			border-radius: 16rpx;
			height: 112rpx;
			display: flex;
			align-items: center;
			position: relative;
			padding: 52rpx 32rpx;
			// margin-bottom: 24rpx;

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

		.other {
			display: flex;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 24rpx;
			color: #2C365A;
			.title {
				flex: 1;
			}
			.num {
				flex: 1;
				text-align: right;
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
		// position: absolute;
		// bottom: 0;

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

			> view {
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
            margin-top: 24rpx;
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
  
  .amount {
  
    .label {
      margin-bottom: 24rpx;
      padding-top: 32rpx;
      
      text {
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
      }
    }
  
    .value {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 144rpx;
      background-color: #F2F4F8;
      padding: 0 32rpx;
      border-radius: 16rpx;
  
      /deep/ .u-input {
        color: #2C365A;
        .uni-input-input {
          font-size: 40rpx;
          font-weight: 600;
        }
        .input-placeholder {
          font-size: 28rpx;
          color: #8397B1;
          font-weight: 400;
        }
      }
      
      .right {
        display: flex;
        align-items: center;
        text {
          font-size: 28rpx;
          color: #2C365A;
        }
        .border {
          width: 2px;
          height: 24rpx;
          opacity: 0.4;
          background-color: #8397B1;
          margin: 0 23rpx;
        }
        .denom {
          font-weight: 600;
        }
        .all {
          color: #1E5EFF;
        }
      }

    }
  }
  
  .memo {
    .value {
      height: 96rpx;
      /deep/ .u-input {
        color: #2C365A;
        .uni-input-input {
          font-size: 32rpx;
          font-weight: 400;
        }
      }
    }
  }
  
  .btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
    text-align: center;
    line-height: 96rpx;
  }
  
</style>

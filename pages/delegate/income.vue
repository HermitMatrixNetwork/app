<template>
	<view class="sendPage">
    <view class="mask" v-show="loading"></view>
     <view :callWithdraw="callWithdraw" :change:callWithdraw="render.withdraw"></view>
		<custom-header :title="'收益领取'" :style="titleStyle">
<!-- 			<template #right>
				<u-icon :name="require('@/static/img/account/saoma.png')" size="44rpx" @click="scanCode" />
			</template> -->
		</custom-header>
		<view class="main-top">
      <view class="content">
        <view class="content-top">
          <view class="title">
            选择领取收益节点
          </view>
          <view class="change-token" @click="selectNode(`/pages/delegate/selectNode?selectIndex=${selectIndex}&redirectURL=/pages/delegate/income`)">
      
            <view v-if="selData.validator">
              <view class="name">{{selData.validator.description.moniker}}</view>
              <view class="address">{{selData.validator.operatorAddress| sliceAddress(10, -10)}}</view>
            </view>
            <text v-else>点击去选择</text>
            <view class="icon-right">
              <image src="/static/img/ic-arrow1.png"></image>
            </view>
          </view>
        </view>
      </view>
			<view class="line" style="margin: 30rpx 0;"></view>
      <view class="content">
				<view class="content-top">
					<!-- 收款地址 -->
					<view class="collection-adres">
						<InputTitle :title="'收益领取接收地址'" :type="'text'" :placeholder="'输入或粘贴钱包地址'" ref="addressInptval"
							:inputVal.sync="receiveAddress" readonly>
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
              <text>领取金额</text>
            </view>
            <view class="value">
              <u--input placeholder="请输入金额" v-model="amount" disabled></u--input>
              <view class="right">
                <text class="denom">GHM</text>
                <view class="border"></view>
                <text class="all" @click="testAmount">全部</text>
              </view>
            </view>
          </view>
					<view class="other">
						<div class="title">当前节点委托：</div>
						<div class="num">{{ selectIndex == -1 ? 0 : balance }} GHM</div>
					</view>
<!-- 					<text v-if="sendAmount>balance" class="waringPrompt">输入金额超过钱包可用余额，请重新输入</text> -->
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
						<text>{{ userAddress }}</text>
					</view>

					<!-- 接收账户 -->
					<view class="receive_address">
						<text>接收账户</text>
						<text>{{ receiveAddress }}</text>
					</view>

					<!--矿工费-->
					<view class="miners_fee">
						<text>矿工费</text>
						<view>
							<view>21000 GWEI*2100 GasPrice</view>
							<view class="price">0.000287 GHM</view>
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
		      <u-icon :name="require('static/img/account/close.png')" size="32rpx"
		        @click="modalPasswordIsShow=false"></u-icon>
		    </view>
		    <view class="item">
		      <view class="item-input item-input-password">
		        <u-input :password="!passwordEye" v-model="payPassword" placeholder="输入资金密码">
		        </u-input>
		        <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'"
		          @click="passwordEye = !passwordEye">
		        </u-icon>
		      </view>
		    </view>
		    <text :style="{opacity: passwordCheck ? 1 : 0 }" class="waringPrompt">资金密码错误，请确认后重新输入!</text>
		    <u-button @click="passwordButton" class="pass_confirm">确认</u-button>
		  </view>
		</u-modal>
		
		<custom-notify ref="notify"></custom-notify>
	</view>
</template>

<script>
  
// https://secretjs.scrt.network/interfaces/MsgWithdrawDelegatorRewardParams
import InputTitle from '@/pages/account/send/components/Input-title.vue'
import {
  sliceAddress
} from '@/utils/filters.js'
import mainCoin from '@/config/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  components: {
    InputTitle
  },
  data() {
    return {
      tokenUrl: '@/static/img/placeholder.jpeg',
      currentWallet: this.$cache.get('_currentWallet'),
      tokenName: 'GHM',
      inputVal: '',
      balance: 0,
      receiveAddress: '', //接收地址
      sendAmount: 123, //发送金额
      payPassword: '', //资金密码
      passwordCheck: false, //密码校验
      submitPopupIsShow: false,
      passwordEye: false,
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
      formData: {
        delegatorAddress: this.$cache.get('_currentWallet').address,
        validatorAddress: ''
      },
      amount: '',
      selData: '',
      selectIndex: -1,
      loading: false,
      callWithdraw: 0
    }
  },
  onLoad(options) {
    const index = options.selectIndex
    if (index > -1) {
      this.selData = this.$cache.get('_delegateInfo').list[index]
      this.balance = this.selData.balance.amount / mainCoin.decimals
      this.selectIndex = index
    }
  },
  mounted() {
    this.$refs.addressInptval.childValue = this.currentWallet.address
  },
  filters: {
    sliceAddress
  },
  methods: {
    scanCode() { //扫码
      uni.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: (res) => {
          this.receiveAddress = this.$refs.addressInptval.childValue = res.result
        },
      })
    },
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
      let verify = true
      
      if (!this.selData) {
        verify = false
        this.$refs.notify.show('error', '委托节点不能为空')
      }
           
      if (verify) {
        this.submitPopupIsShow = true
      }
    },
    passwordButton() {
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.formData.validatorAddress = this.selData.delegation.validatorAddress
        this.callWithdraw = this.formData // 调用render.sendToken
        this.loading = true
        this.modalPasswordIsShow = false
        uni.showToast({
          title: '执行中...',
          icon: 'loading',
          mask: true,
          duration: 999999999
        })
      }
    },
    testAmount() {
      // this.sendAmount = this.balance 
    },
    handlerWithdraw(res) {
      this.callWithdraw = 0
      this.loading = false
      if (res.code == 0) {
        this.$cache.set('_updateDelegateInfo', true, 0)
        uni.showToast({
          title: '执行成功',
          image: '/static/img/chenggong.png',
          mask: true,
          duration: 3000,
          complete: () => {
            setTimeout(() => {
              uni.redirectTo({
                url: `/pages/account/send/transactionDetails?data=${JSON.stringify(res)}`
              })
            }, 1500)
          }
        })
      } else {
        uni.showToast({
          title: '执行失败',
          image: '/static/img/shibai1.png',
          mask: true,
          duration: 3000,
        })
        console.log(res)
      }
    },
    getMinersCost(val) {
      console.log('接收到值', val)
      this.minersMsg = val
    },
    toAddressBook() {
      uni.navigateTo({
        url: '/pages/account/send/adres_book',
        events: {
          reciveAddress: (address) => {
            this.$refs.addressInptval.childValue = address
          }
        }
      })
    },
    selectNode(url) {
      uni.redirectTo({
        url
      })
    }
  },
}
</script>

<script lang="renderjs" module="render">
  import { withdrawDelegatorReward } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      async withdraw(val) {
        if (val == 0) return
        console.log(val);
        let res = {}
        try {
          res = await withdrawDelegatorReward(val)
        } catch (e) {
          console.log(e)
          res.code = 7
        }
        renderUtils.runMethod(this._$id, 'handlerWithdraw', res, this)
        
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5) !important;
    z-index: 9999;
  }
  
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
		}
	}

	//弹出层
	.submitPopup {
		width: 100%;
		height: 1028rpx;

		.main {
			margin: 0 32rpx;

			.popup-title {
        display: flex;
        justify-content: space-between;
				font-weight: 600;
				font-size: 32rpx;
				color: #2C365A;
				letter-spacing: 0;
				padding: 48rpx 0 16rpx 0;
				line-height: 32rpx;
			}

			> view:not(:first-child) {
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

	.modal_main {
		width: 100%;

		.modal_title {
			font-family: PingFangSC-Medium;
			font-weight: 600;
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
		border-top-left-radius: 16rpx !important;
    border-top-right-radius: 16rpx !important;
    

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
          font-size: 28rpx !important;
          color: #8397B1 !important;
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
  
  .content-top {
    .title {
      padding: 32rpx 0;
      font-weight: bold;
      font-size: 28rpx;
      color: #2C365A;
    }
  
    .tip {
      font-size: 24rpx;
      color: #EC2828;
      line-height: 24rpx;
    }
  }
  
  .change-token {
    background: #FFFFFF;
    border: 2rpx solid rgba(131, 151, 177, 0.16);
    border-radius: 16rpx;
    height: 112rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 52rpx 32rpx;
  
    // margin-bottom: 24rpx;
    .name {
      font-size: 28rpx;
      color: #2C365A;
    }
  
    .address {
      font-size: 24rpx;
      color: #8397B1
    }
  
    &>image {
      width: 56rpx;
      height: 56rpx;
      margin-left: 32rpx;
      margin-right: 12rpx;
    }
  
    &>text {
      font-size: 28rpx;
      color: #8397B1;
    }
  
    .icon-right {
      image {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
  
  .item {
    margin-top: 64rpx;
  
    &-input {
  
      .u-input {
        height: 96rpx;
        background-color: #F2F4F8;
        border-radius: 16rpx 0 0 16rpx;
        padding-left: 0 !important;
  
        /deep/ input {
          color: #2C365A !important;
          font-size: 28rpx !important;
          padding-left: 32rpx;
          line-height: 48rpx !important;
        }
      }
  
      /deep/ .input-placeholder {
        // height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        // color: #8397B1 !important;
        color: #8397B1 !important;
        // line-height: 48rpx !important;
      }
  
      &-password {
        display: flex;
  
        .u-icon {
          height: 96rpx;
          padding-right: 36rpx;
          background-color: #F2F4F8;
          border-radius: 0 16rpx 16rpx 0 !important;
        }
      }
    }
  }
  
  .pass_confirm {
    height: 96rpx;
    background: #002FA7;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #FCFCFD;
    text-align: center;
    margin-top: 56rpx;
  }
</style>

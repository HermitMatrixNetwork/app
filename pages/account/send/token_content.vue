<template>
	<view class="token_content">
		<custom-header :title="tokenName">
			<template #right>
				<text class="customIcon" @click="jumpDetails">详情</text>
			</template>
		</custom-header>

		<view class="main_token">
			<TokenColumn :tokenName="tokenName" :tokenColumnStyle="tokenColumnStyle">
				<template #right>
					<view style="padding-right: 16rpx;" class="token_price">
						<view>0.00000000</view>
						<view>$0.00000</view>
					</view>
				</template>
			</TokenColumn>

			<view class="token_details">
				<view class="available">
					<text>可用</text>
					<view class="quantity">
						<view>0.00000000</view>
						<view>$0.00000</view>
					</view>
				</view>
				<view class="lock">
					<text>锁定</text>
					<view class="quantity">
						<view>0.00000000</view>
						<view>$0.00000</view>
					</view>
				</view>
			</view>

		</view>
		<view style="height: 16rpx;background: #F4F6FA;margin-top: 32rpx;"/>
		<view class="transaction_history">
			<view class="nav">
				<u-tabs :list="list" :is-scroll="false">
				</u-tabs>
			</view>
			<view class="transaction_history_item">
				<TokenColumn :tokenName="tokenName" :address="'fdsafsdafsafdasfasf'"
					:tokenColumnStyle="tokenColumnStyle">
					<template #right>
						<view class="token_price">
							<view>0.00000000</view>
							<view>$0.00000</view>
						</view>
					</template>
				</TokenColumn>
			</view>
		</view>

		<view class="operation_btn">
			<button @click="jumpSend">发送</button>
			<button>接收</button>
			<button>交易</button>
			<button>委托</button>
		</view>

	</view>
</template>

<script>
import TokenColumn from './components/TokenColumn.vue'
export default {
  components: {
    TokenColumn
  },
  data() {
    return {
      tokenName: 'GHM',
      tokenColumnStyle: {
        paddingBottom: '32rpx',
        paddingTop: '32rpx',
      },
      list: [{
        name: '全部'
      }, {
        name: '发送'
      }, {
        name: '收款'
      },
      {
        name: '委托'
      },
      {
        name: '领取'
      },
      {
        name: '失败'
      }
      ],
    }
  },
  onLoad() {

  },
  methods:{
    jumpDetails(){
      uni.navigateTo({
        url:'./tokenInformation'
      })
    },
		jumpSend(){
			uni.navigateTo({
				url:'./index'
			})
		}
  }
}
</script>

<style lang="scss" scoped>
	.token_content {
		width: 100%;
		height: 100vh;
		background: #FFFFFF;
	}

	.customIcon {
		font-weight: 400;
		font-size: 28rpx;
		color: #8397B1;
		letter-spacing: 0;
		line-height: 28rpx;
	}

	.main_token {
		width: 100%;
		height: 378rpx;
		padding: 32rpx;

		.coinbox-item {
			display: flex;
			align-items: flex-start;
			width: 100%;
			height: 120rpx;
			position: relative;

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

		.token_details {
			height: 208rpx;
			background: #F8FAFB;
			background: #8397B110;
			border-radius: 8rpx;
			padding: 0 24rpx;
			
			.available,
			.lock {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 103rpx;

				.quantity {
					text-align: right;
				}
			}

			.available {
				border-bottom: 2rpx solid #80808020;
			}
		}

	}

.token_price{
	text-align: right;
	view:nth-child(2){
		height: 24rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #8397B1;
		letter-spacing: 0;
		line-height: 24rpx;
		padding-top: 12rpx;
	}
}

	.transaction_history {
		/deep/.nav {
			height: 110rpx;
			width: 530rpx;
			padding-left: 32rpx;

			.u-tabs__wrapper__nav__item {
				height: 110rpx !important;
				line-height: 110rpx !important;
			}

			.u-tabs__wrapper__nav__line {
				background-color: #2E3751 !important;
			}
		}

		.transaction_history_item {
			margin: 0 32rpx;
			padding: 32rpx 0;
		}
	}

	.operation_btn {
		width: 100%;
		height: 160rpx;
		position: absolute;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 32rpx;
		button{
			width: 152rpx;
			height: 80rpx;
			line-height: 80rpx;
			font-weight: 400;
			font-size: 28rpx;
			background: rgba(255,255,255,0.00);
			border: 2rpx solid rgba(131,151,177,0.31);
			border-radius: 16rpx;
			&:nth-child(1){
				background: #265EF2;
				color: #FCFCFD;
			}
			&:nth-child(2){
				background: #16C39A;
				color: #FCFCFD;
			}
		}
	}

	/deep/ .u-tabs__wrapper__nav__item__text {
		font-size: 28rpx !important;
	}
</style>

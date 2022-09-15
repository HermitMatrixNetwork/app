<template>
	<view>
		<custom-header :title="tokenName">
			<template #right>
				<text class="customIcon">详情</text>
			</template>
		</custom-header>

		<view class="token_message">
			<TokenColumn :tokenName="tokenName" :tokenAddress="address">
				<template #right>
					<view style="padding-right: 16rpx;" class="token_price">
						<view>0.00000000</view>
						<view>$0.00000</view>
					</view>
				</template>
			</TokenColumn>
		</view>
		<view style="height: 16rpx;background: #F4F6FA;margin-top: 32rpx;" />

		<view class="transaction_history">
			<view class="nav">
				<u-tabs :list="list" :is-scroll="false">
				</u-tabs>
			</view>
			<view class="transaction_history_item" v-if="viewkey&&transactionRecord">
				<TokenColumn :tokenName="tokenName" :address="'fdsafsdafsafdasfasf'">
					<template #right>
						<view class="token_price">
							<view>0.00000000</view>
							<view>$0.00000</view>
						</view>
					</template>
				</TokenColumn>
			</view>
			<view class="noviewkey" v-else-if="viewkey == ''">
				<image src="@/static/img/noviewkey.png"></image>
				<text>当前没有viewkey或本地viewkey与链上不一致，
				无法获取记录，请先设置！</text>
			</view>
			
			<view v-else class="noviewkey">
				<image src="@/static/img/noaddress.png"></image>
				<text>暂无记录</text>
			</view>
		</view>

		<view class="operation_btn">
			<button @click="toGo('/pages/account/send/index')">发送</button>
			<button @click="toGo('/pages/account/receive')">接收</button>
			<button @click="dealBtn">交易</button>
			<button @click="toGo('/pages/account/send/checkViewKey')">查看/设置<br/>viewkey</button>
		</view>

	</view>
</template>

<script>
import TokenColumn from './components/TokenColumn.vue'
import mixin from '../mixins/index.js'
export default {
  mixins:[mixin],
  components: {
    TokenColumn
  },
  data() {
    return {
      tokenName: 'ughm',
      address: 'adf41654adfs65sd4fa61',
      viewkey:'0',
      transactionRecord:'',
      list: [{
        name: '全部'
      }, {
        name: '发送'
      }, {
        name: '收款'
      },
      {
        name: '失败'
      }
      ],
    }
  }
}
</script>

<style lang="scss" scoped>
	.token_message {
		margin: 0 32rpx;
		padding: 19rpx 0 26rpx 0;
	}

.noviewkey{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 230rpx;
	image{
		width: 240rpx;
		height: 240rpx;
	}
	text{
		text-align: center;
		font-weight: 400;
		font-size: 28rpx;
		color: #8397B1;
		letter-spacing: 0;
		line-height: 44rpx;
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
			&:nth-child(4){
				font-size: 22rpx !important;
				line-height: 32rpx;
				padding-top: 12rpx;
			}
		}
	}

	/deep/ .u-tabs__wrapper__nav__item__text {
		font-size: 28rpx !important;
	}
</style>

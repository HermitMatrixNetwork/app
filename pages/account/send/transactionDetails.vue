<template>
	<view class="transacTionDestail">
		<custom-header :title="'交易详情'"></custom-header>
		<view class="transacTionMain">
			<view class="main_status">
				<image :src="statusIcon" />
				<text class="status">{{status}}</text>
				<text class="times">2022年6月27日 11:47:58</text>
			</view>
			<view class="main_message">
				<view v-for="(item,key) in transactionMessage" :key="key" class="main_message_column">
					<view>{{key}}</view>
					<view>{{item}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {
	  queryAccountHash
} from '@/utils/secretjs/SDK.js'
export default {
  data() {
    return {
      transactionMessage: {},
      transactionResult: [],
      transactionType: 'success',
      status: '成功',
      statusIcon: '../../../static/img/chenggong.png',
      success: ['金额', '矿工费', '收款地址', '付款地址', 'Memo', '交易号'],
      fail: ['金额', '矿工费', '收款地址', '付款地址', 'Memo', '交易号'],
      entrust: ['委托金额', '矿工费', '委托人', '被验证委托人', 'Memo', '交易号'],
      receive: ['领取金额', '矿工费', '操作账户', '领取接收地址', 'Memo', '交易号']
    }
  },
  onLoad(value) {
    this.getTranctionHash(value.transactionHash)
  },
  methods: {
    transaction(array) {
      const obj = {}
      // const arr = ['+0.2 GHM', '0.002479 GHM', 'ghmhUAHv3pFYPbXK8ZssdW9XSc6qVjoUmTi2qPBobmniBkJ',
      //   'ghmhUAHv3pFYPbXK8ZssdW9XSc6qVjoUmTi2qPBobmniBkJ', 'transfer',
      //   'ghmhUAHv3pFYPbXK8ZssdW9XSc6qVjoUmTi2qPBobmniBkJ'
      // ]
      for (let i in array) {
        obj[array[i]] = this.transactionResult[i]
      }
      return obj
    },
    async getTranctionHash(hash){
      const res = await queryAccountHash(hash)
      const {jsonLog} = res
      const obj = Object.values(jsonLog[0]['events'][3])
      this.transactionResult[0] = obj[1][2].value
      this.transactionResult[1] = '$10000'
      this.transactionResult[2] = obj[1][0].value
      this.transactionResult[3] = obj[1][1].value
      switch (obj[0]) {
      case 'transfer':
			  this.transactionMessage = this.transaction(this.success)
			  break
        //  case 'fail':
			  // this.status = '失败'
			  // this.statusIcon = '../../../static/img/shibai1.png'
			  // this.transactionMessage = this.transaction(this.success)
			  // break
      case 'entrust':
			  this.transactionMessage = this.transaction(this.entrust)
			  break
      case 'receive':
			  this.transactionMessage = this.transaction(this.receive)
			  break
      default:
			  break
      }
    },
		
  }
}
</script>

<script lang="renderjs" module="render">
	import {
		  queryAccountHash
	} from '@/utils/secretjs/SDK.js'
	export default{
		
	}
</script>
<style lang="scss" scoped>
	.transacTionDestail {
		width: 100%;
		height: 100vh;
		background: #F4F6FA;
	}

	.transacTionMain {
		position: relative;
		padding: 0 32rpx;
		margin: 48rpx 32rpx 0;
		background: #FFFFFF;
		height: 936rpx;
		box-shadow: 0 8rpx 54rpx 0 rgba(4, 6, 15, 0.05);
		border-radius: 16rpx;

		.main_status {
			height: 284rpx;
			border-bottom: 2rpx solid #ddd;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			font-family: PingFangSC-Medium;
			padding: 48rpx 0;

			image {
				width: 72rpx;
				height: 72rpx;
			}

			.status {
				font-weight: 500;
				font-size: 32rpx;
				color: #2C365A;
				letter-spacing: 0;
			}

			.times {
				font-weight: 400;
				font-size: 24rpx;
				color: #8397B1;
				letter-spacing: 0;
				line-height: 24rpx;
			}
		}

		.main_message {

			.main_message_column {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 24rpx;
				font-weight: 400;
				padding-top: 48rpx;
				color: #2C365A;

				view:nth-child(2) {
					width: 418rpx;
					text-align: right;
					word-wrap: break-word;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					font-size: 24rpx;
					color: #2C365A;
					letter-spacing: 0;
					text-align: right;
					line-height: 32rpx;
				}
			}
		}
	}
</style>

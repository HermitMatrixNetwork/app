<template>
	<view class="my">
		<view :address="address" :change:address="init"></view>
		<view class="header-box">
			<view class="header">
				<headerItem :title="language.totalDelegate" />
				<headerItem :title="language.receiveRewards" />
				<headerItem :title="language.rewardsReceived" />
				<headerItem :title="language.unlocking" />
			</view>
		</view>
		<view class="account-box">
			<view class="account-column">
				  <view class="column-item" @click="goTo('/pages/delegate/cancel')">
				    <u-icon
				      :name="require('@/static/img/delegate/quxiaoweituo@2x.png')"
				      size="80rpx"
				    ></u-icon>
				    <text>取消委托</text>
				  </view>
				  <view class="column-item" @click="goTo('/pages/delegate/income')">
				    <u-icon
				      :name="require('@/static/img/delegate/shouyilingqu@2x.png')"
				      size="80rpx"
				    ></u-icon>
				    <text>收益领取</text>
				  </view>
				  <view class="column-item" @click="goTo('/pages/delegate/transaction')">
				    <u-icon
				      :name="require('@/static/img/delegate/jiaoyijilu@2x.png')"
				      size="80rpx"
				    ></u-icon>
				    <text>交易记录</text>
				  </view>
			</view>
		</view>
		<view class="my-delegate">
			<view class="title">
				我的委托
			</view>
			<view class="list">
				<view class="list-title">
					<view class="left">节点</view>
					<view class="center">待领取收益</view>
					<view class="right">委托数量</view>
				</view>
				<view class="list-data">
					<view class="list-item">
						<view class="left">
							<view class="name">节点名称</view>
							<view class="other">gh212AB...C22T5218</view>
						</view>
						<view class="center">
							0.00023 GHM
						</view>
						<view class="right">
							<view class="name">10000.00</view>
							<view class="other">2022.06.28 11:30:30</view>
						</view>
					</view>
				</view>
				<no-data tip="暂无委托，点击" btnTx="参与委托" />
			</view>
		</view>
	</view>
</template>

<script>
import language from '../language'
import headerItem from './header-item'
export default {
  components: {
    headerItem
  },

  data(){
    return {
      language: language[this.$cache.get('_language')],
      address: '',
      currentWallet: this.$cache.get('_currentWallet'),
    }
  },
  mounted(){
    this.address = this.currentWallet.address
  },
  methods: {
    goTo(url){
      uni.navigateTo({
        url
      })
    }
  }
}
	
</script>
<script lang="renderjs" module="render">
import {getDelegationTotalRewards} from '@/utils/secretjs/SDK'
import renderUtils from '@/utils/render.base.js'
export default {
	methods:{
		async init(address){
			// let address = "ghm15fze8tn9gd9nsypw8s4z6yn42f2udj4step2ex"
			console.log('address',address)
			if(address=='') return
			let data = await getDelegationTotalRewards(address)
			console.log('data',data)
			renderUtils.runMethod(this._$id, 'searchData', data, this)
		}
	}
}
</script>

<style  lang="scss" scoped>
	.my {
		.header-box, .account-box {
			padding: 0 32rpx;
		}
		.header {
			width: 686rpx;
			height: 280rpx;
			padding: 24rpx 0;
			display: flex;
			flex-flow: wrap;
			background: url('@/static/img/delegate/theme.png') no-repeat center;
			background-size: 100% 100%;
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
		    color: #2c4364;
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
		.my-delegate {
			padding-top: 12rpx;
			.title {
				padding: 0 32rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-weight: bold;
				font-size: 32rpx;
				color: #2C365A;
			}
			.list {
				.left {
					width: 212rpx;
				}
				.center {
					width: 266rpx;
					text-align: center;
				}
				.right {
					width: 212rpx;
					text-align: right;
				} 
				.list-title {
					display: flex;
					height: 64rpx;
					line-height: 64rpx;
					padding: 0 32rpx;
					font-size: 24rpx;
					background: rgba(30,94,255,0.04);
					color: #8397B1;
				}
				.list-data {
					padding: 0 32rpx;
					.list-item {
						display: flex;
						padding:  32rpx 0 36rpx 0;
						border-bottom: 2rpx solid rgba(151, 151, 151, .1) ;
						.name {
							font-size: 24rpx;
							color: #2C365A;
						}
						.other {
							font-size: 22rpx;
							color: #8397B1;
						}
					}
				}
	
			}
		}
		
	}
</style>
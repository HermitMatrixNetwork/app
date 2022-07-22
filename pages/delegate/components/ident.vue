<template>
	<view class="ident">
		<view :address="address" :change:address="init"></view>
		<!-- <view :state="state" :change:state="changeData"></view> -->
		<view class="header-box">
			<view class="header">
				<headerItem />
				<headerItem />
			</view>
		</view>
		<view class="my-delegate">
			<view class="title">
				<view class="name">
					我的委托
				</view>
				<view class="btnBox">
					<view v-if="isDel==false" class="btn" @click="isDel=true">
						去委托
					</view>
					<view v-else class="btn" @click="confirm">
						确认委托
					</view>
				</view>
			</view>
			<view class="list">
				<view class="list-title">
					<view class="sel-box" v-if="isDel" />
					<view class="left">节点</view>
					<view class="center">活跃度</view>
					<view class="right">当前得票</view>
					<view class="num-box" v-if="isDel" />
				</view>
				<view class="list-data">
					<view class="list-item" v-for="(item,index) in validators" :key="index">
						<u-checkbox-group v-if="isDel" v-model="item.select">
							<u-checkbox class="sel-box" shape="circle"></u-checkbox>
						</u-checkbox-group>
						<view class="left">
							<view class="name">{{item.description.moniker}}</view>
							<view class="other">{{item.operatorAddress|sliceAddress(7,8)}}</view>
						</view>
						<view class="center">
							99
						</view>
						<view class="right">
							<view class="name">{{item.tokens}}</view>
							<view class="other">佣金率:10%</view>
						</view>
						<u-number-box v-if="isDel" :min="0" class="num-box" button-size="20" bgColor="#fff"
							v-model="item.amount"></u-number-box>
					</view>
				</view>
				<no-data tip="暂无委托，点击" btnTx="参与委托" />
			</view>
		</view>
	</view>
</template>

<script>
import headerItem from './header-item'
import {
  sliceAddress
} from '@/utils/filters.js'
export default {
  components: {
    headerItem
  },
  filters: {
    sliceAddress
  },
  data() {
    return {
      // language: language[this.$cache.get('_language')],
      address: '',
      currentWallet: this.$cache.get('_currentWallet'),
      validators: [],
      isDel: true, //在委托
    }
  },
  created() {
    this.address = this.currentWallet.address
  },
  methods: {
    ValidatorsData(data) {
      this.validators = data
      console.log('validators', this.validators)
    },
    confirm() {
      console.log(this.validators)
      let selData = this.validators.filter(item => {
        return item.select.length >= 1
        console.log('   item.select.length>=1', item.select.length >= 1)
      })
      if (selData.length == 0) {
        return uni.showToast({
          icon: 'none',
          title: '请选择节点'
        })
      }
      // let data = encodeURIComponent(JSON.stringify(selData))
      let data= []
      uni.navigateTo({
        url:`/pages/delegate/confirm?data=${data}`
      })
    }
  }
}
</script>


<script lang="renderjs" module="render">
	import {
		getValidators,
		getSigningInfo
	} from '@/utils/secretjs/SDK'
	import renderUtils from '@/utils/render.base.js'
	export default {
		data() {
			return {
				address: '',
				checked: '',
			}
		},
		methods: {
			async init(address) {
				if (address == '') return
				this.address = address
				this.getValidators()
			},
			async getValidators(status) {
				let data = await getValidators(status || '')
				let validators = data.validators
				console.log('validators1011',validators)
				validators.forEach(item => {
					item.select = []
					item.amount = 0
					// this.getSigningInfo(item.operatorAddress)
				})

				renderUtils.runMethod(this._$id, 'ValidatorsData', validators, this)
			},
			async getSigningInfo(address) {
				let signInfo = await getSigningInfo(address)
				console.log('signInfo', signInfo)
				return signInfo
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ident {
		// width: 686rpx;
		height: 280rpx;
	}

	.header-box,
	.account-box {
		padding: 0 32rpx;
	}

	.header {
		width: 686rpx;
		height: 200rpx;
		padding: 42rpx 0;
		display: flex;
		flex-flow: wrap;
		background: url('@/static/img/delegate/identBg.png') no-repeat center;
		background-size: 100% 100%;
	}

	.my-delegate {
		padding-top: 12rpx;

		.title {
			display: flex;
			height: 80rpx;
			line-height: 80rpx;
			margin: 0 32rpx;
			font-weight: bold;
			font-size: 32rpx;
			color: #2C365A;
		}

		.list {
			.sel-box {
				width: 48rpx;
			}

			.num-box {
				width: 138rpx;
			}

			.left {
				width: 212rpx;
				margin-left: 16px
			}

			.center {
				flex: 1;
				text-align: center;
			}

			.right {
				width: 132rpx;
				text-align: right;
				margin-right: 16px
			}

			.list-title {
				display: flex;
				height: 64rpx;
				line-height: 64rpx;
				margin: 0 32rpx;
				font-size: 24rpx;
				background: rgba(30, 94, 255, 0.04);
				color: #8397B1;
			}

			.list-data {
				margin: 0 32rpx;

				.list-item {
					display: flex;
					padding: 32rpx 0 36rpx 0;
					border-bottom: 2rpx solid rgba(151, 151, 151, .1);

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

	/deep/ .u-number-box {
		width: 134rpx;
	}

	/deep/ .u-number-box__plus {
		width: 40rpx;
		border-radius: 0 40rpx 40rpx 0;
		border: 2rpx solid rgba(131, 151, 177, 0.24);
	}

	/deep/ .u-number-box__minus {
		width: 40rpx;
		border-radius: 40rpx 0 0 40rpx;
		border: 2rpx solid rgba(131, 151, 177, 0.24);
	}

	/deep/ .u-number-box__input {
		margin: 0;
		border-top: 0 solid rgba(131, 151, 177, 0.24);
		border-bottom: 0 solid rgba(131, 151, 177, 0.24);
	}
</style>

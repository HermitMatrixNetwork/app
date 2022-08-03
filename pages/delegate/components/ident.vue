<template>
	<view class="ident">
		<view :address="address" :change:address="init"></view>
		<!-- <view :state="state" :change:state="changeData"></view> -->
		<view class="header-box">
			<view class="header">
				<headerItem title="当前可用余额" />
				<headerItem title="当前锁定余额" />
			</view>
		</view>
		<view class="my-delegate">
     <u-tabs
        class="tabs"
        :list="statusList"
        lineColor="#1E5EFF"
        @click="click"
        :inactiveStyle="inactiveStyle"
        :activeStyle="activeStyle"
        lineWidth="20"
        lineHeight="3"
        :itemStyle="itemStyle"
      >
      </u-tabs>
      
      <view class="sort-list">
        <view class="item" @click="sort('总委托数')">
            <text>总委托数</text>
            <view class="icon">
              <image :class="[sortRule]" v-if="sortTarget == '总委托数'" src="/static/img/delegate/sort.png"></image>
              <image v-else src="/static/img/delegate/unsort.png"></image>
            </view>
        </view>
        <view class="item" @click="sort('活跃度')">
          <text>活跃度</text>
          <view class="icon">
            <image :class="[sortRule]" v-if="sortTarget == '活跃度'" src="/static/img/delegate/sort.png"></image>
            <image v-else src="/static/img/delegate/unsort.png"></image>
          </view>
        </view>
        <view class="item" @click="sort('佣金率')">
          <text>佣金率</text>
          <view class="icon">
            <image :class="[sortRule]" v-if="sortTarget == '佣金率'" src="/static/img/delegate/sort.png"></image>
            <image v-else src="/static/img/delegate/unsort.png"></image>
          </view>
        </view>
      </view>
			<view class="list">
				<view class="list-title">
					<view class="left">节点</view>
					<view class="center">活跃度</view>
					<view class="right">当前得票</view>
				</view>
				<custom-loading v-if="loading" class="loading"></custom-loading>
        <view class="list-data" v-else-if="validators.length">
					<view class="list-item" v-for="(item,index) in validators" :key="index" @click="toValidatorDetail(item)">
						<view class="left">
							<view class="name">{{item.description.moniker}}</view>
							<view class="other">{{item.operatorAddress|sliceAddress(7, -8)}}</view>
						</view>
						<view class="center">
							99
						</view>
						<view class="right">
							<view class="name">{{item.tokens}}</view>
							<view class="other">佣金率:10%</view>
						</view>
					</view>
				</view>
				<no-data v-else tip="暂无委托，点击" btnTx="参与委托" />
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
      loading: true,
      isDel: true,
      statusList: [{
        name: '全部'
      },{
        name: '共识中'
      },{
        name: '候选中'
      },{
        name: '待解禁'
      }],
      inactiveStyle: {
        fontSize: '32rpx',
        color: '#8397B1',
        fontWeight: '500',
      },
      activeStyle: {
        fontSize: '32rpx',
        color: '#1E5EFF',
        fontWeight: '600'
      },
      itemStyle: {
        height: '76rpx',
        alignItems: 'flex-start',
        padding: '0',
      },
      sortTarget: '总委托数',
      sortRule: 'des', // asc:升序; des:降序
    }
  },
  created() {
    this.address = this.currentWallet.address
  },
  methods: {
    click() {
    },
    toValidatorDetail(item) {
      uni.navigateTo({
        url : `./validatorDetail?validatorInfo=${JSON.stringify(item)}`
      })
    },
    sort(val) {
      if (val === this.sortTarget) {
        this.sortRule = this.sortRule == 'des' ? 'asc' : 'des'
      } else {
        this.sortTarget = val
        this.sortRule = 'des'
      }
    },
    ValidatorsData(data) {
      this.validators = data
      this.loading = false
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
  .loading {
    margin-top: 10rpx;
  }
  .tabs {
    margin-top: 34rpx;
    width: 600rpx;
  }
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
    .sort-list {
      display: flex;
      margin-left: 32rpx;
      
      .item {
        display: flex;
        font-size: 24rpx;
        padding: 24rpx 0;
        color: #8397B1;
        margin-right: 64rpx;
        .icon {
          image {
            width: 20rpx;
            height: 20rpx;
          }
        }
        .asc {
          transform: rotate(180deg);
        }
      }
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
				font-size: 24rpx;
				background: rgba(30, 94, 255, 0.04);
				color: #8397B1;
			}

			.list-data {

				.list-item {
					display: flex;
					padding: 32rpx 0 36rpx 0;
					border-bottom: 2rpx solid rgba(151, 151, 151, .1);
          align-items: center;

					.name {
						font-size: 26rpx;
						color: #2C365A;
					}

					.other {
						font-size: 24rpx;
						color: #8397B1;
					}
          
          .center {
            font-weight: 600;
            font-size: 24rpx;
            color: #2C365A;
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

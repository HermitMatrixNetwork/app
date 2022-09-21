<template>
	<view class="ident">
		<!-- <view :address="address" :change:address="init"></view> -->
		<!-- <view :state="state" :change:state="changeData"></view> -->
		<view class="header-box">
			<view class="header">
				<headerItem :title="language.text45" :value="currentWallet.coinList[0].balance" />
				<headerItem :title="language.text46" />
			</view>
		</view>
		<view class="my-delegate">
    <u-tabs
        class="tabs"
        :list="statusList"
        lineColor="#1E5EFF"
        @click="changeStatus"
        :inactiveStyle="inactiveStyle"
        :activeStyle="activeStyle"
        lineWidth="20"
        lineHeight="3"
        :itemStyle="itemStyle"
        :current="status"
      >
      </u-tabs>
     <view class="sort-list">
        <view class="item" @click="sort(language.text48)">
            <text>{{ language.text48 }}</text>
           <view class="icon">
              <image :class="sortRule" v-if="sortTarget == language.text48" src="/static/img/delegate/sort.png"></image>
              <image v-else src="/static/img/delegate/unsort.png"></image>
            </view>
        </view>
       <view class="item" @click="sort(language.text49)">
          <text>{{ language.text49 }}</text>
          <view class="icon">
            <image :class="[sortRule]" v-if="sortTarget == language.text49" src="/static/img/delegate/sort.png"></image>
            <image v-else src="/static/img/delegate/unsort.png"></image>
          </view>
        </view>
        <view class="item" @click="sort(language.text50)">
          <text>{{ language.text50 }}</text>
          <view class="icon">
            <image :class="[sortRule]" v-if="sortTarget == language.text50" src="/static/img/delegate/sort.png"></image>
            <image v-else src="/static/img/delegate/unsort.png"></image>
          </view>
        </view>
      </view>
			<view class="list">
				<view class="list-title">
					<view class="left">{{ language.text51 }}</view>
					<view class="center">{{ language.text49 }}</view>
					<view class="right">{{ language.text52 }}</view>
				</view>
				<custom-loading v-if="loading" class="loading"></custom-loading>
        <view class="list-data" v-else-if="showList.length">
					<view class="list-item" v-for="(item,index) in showList" :key="index" @click="toValidatorDetail(item)">
						<view class="left">
							<view class="name">{{item.validator_name }}</view>
							<view class="other">{{item.operator_address|sliceAddress(7, -8)}}</view>
						</view>
						<view class="center">
							{{ item.uptimes }}
						</view>
						<view class="right">
							<view class="name">{{ item.token }}</view>
							<view class="other">{{ language.text50 }}: {{ item.rate }}</view>
						</view>
					</view>
				</view>
				<no-data v-else :tip="language.text101"/>
			</view>
		</view>
	</view>
</template>

<script>
import headerItem from './header-item'
import mainCoin from '@/config/index.js'
import language from '../language/index.js'
import { getValidatorInfo, getNodeList } from '@/api/browers.js'
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
      language: language[this.$cache.get('_language')],
      address: '',
      currentWallet: this.$cache.get('_currentWallet'),
      validators: [],
      loading: true,
      isDel: true,
      statusList: [{
        name: language[this.$cache.get('_language')].text70
      },{
        name: language[this.$cache.get('_language')].text74
      },{
        name: language[this.$cache.get('_language')].text75
      },{
        name: language[this.$cache.get('_language')].text76
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
      sortTarget: language[this.$cache.get('_language')].text48,
      sortRule: 'des', // asc:升序; des:降序
      mainCoin,
      status: 0,
    }
  },
  created() {
    // this.address = this.currentWallet.address
    this.updateData()
  },
  methods: {
    updateData() {
      console.log('indent update data')
      this.currentWallet = this.$cache.get('_currentWallet')
      this.loading = true
      this.ValidatorsData()
      // this.address = this.currentWallet.address
    },
    changeStatus(status) {
      this.status = status.index
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
    async ValidatorsData() {
      try {
        const res = (await getNodeList({
          'chain_id':'ghmdev'
        })).data.data.list        
        // this.validators = res
        this.validators = res.map(item => {
          item.token = item.tokens / mainCoin.decimals
          item.uptimes = (1 - item.uptime) * 100 + '%'
          item.rate = item.commission_rate * 100 + '%'
          return item
        })
        this.$cache.set('_validators', this.validators, 0)
      } catch (e) {
        console.log('request error', e)
      } finally {
        this.loading = false
      }
    },
    confirm() {
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
  },
  computed: {
    showList() {
      let validatorsList = [] 
      let ascList = []
      switch(this.status) {
      case 0: 
        // console.log('全部')
        validatorsList = this.validators
        break
      case 1:
        // console.log('共识中')
        validatorsList = this.validators.filter(item => item.jailed == 'false')
        break
      case 2:
        // console.log('待解禁')
        validatorsList = this.validators.filter(item => item.jailed == 'true')
        break
      case 3: 
        // console.log('候选者')
        validatorsList = this.validators.slice(21)
        break
      }
      
      
      
      switch(this.sortTarget) {
      // 总委托数
      case this.language.text48:
        ascList = validatorsList.sort((a, b) => a.token - b.token)
        break
        // 活跃度
      case this.language.text49:
        ascList = validatorsList.sort((a, b) => a.uptimes.slice(0, -1) - b.uptimes.slice(0, -1))
        break
        // 佣金率
      case this.language.text50:
        ascList = validatorsList.sort((a, b) => a.commission_rate - b.commission_rate)
        break
      }
      
      return this.sortRule == 'asc' ? ascList : ascList.reverse()
    }
  }
}
</script>


// <script lang="renderjs" module="render">
// 	import {
// 		getValidators,
// 		getSigningInfo
// 	} from '@/utils/secretjs/SDK'
// 	import renderUtils from '@/utils/render.base.js'
//   import mainCoin from '@/config/index.js'
// 	export default {
// 		data() {
// 			return {
// 				address: '',
// 				checked: '',
// 			}
// 		},
// 		methods: {
// 			async init(address) {
// 				if (address == '') return
// 				this.address = address
// 				this.getValidators()
// 			},
// 			async getValidators(status) {
// 				let data = await getValidators(status || '')
// 				let validators = data.validators
// 				validators.forEach(item => {
//           item._rate = item.commission.commissionRates.rate
//           item.rate = item._rate / 10 ** 18 * 100 + '%'
// 				})

// 				renderUtils.runMethod(this._$id, 'ValidatorsData', validators, this)
// 			},
// 			async getSigningInfo(address) {
// 				let signInfo = await getSigningInfo(address)
// 				return signInfo
// 			}
// 		}
// 	}
// </script>

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
		// height: 280rpx;
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
				text-align: center;
        width: 260rpx;
			}

			.right {
				text-align: right;
				margin-right: 16px;
        flex: 1;
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
            width: 260rpx;
            color: #2C365A;
            text-align: center;
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

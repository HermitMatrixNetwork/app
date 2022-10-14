<template>
  <view class="my">
    <view :address="address" :change:address="render.init"></view>
    <view :updateRewards="updateRewards" :change:updateRewards="render.getRewards"></view>
    <view :callUnboundingDelegators="callUnboundingDelegators" :change:callUnboundingDelegators="render.getUnbondingDelegationRecord"></view>
    <view class="header-box">
      <view class="header">
        <!-- 已委托总是 -->
        <headerItem :title="language.text02" :value="allData.total" />
        <!-- 累计领取 -->
        <headerItem :title="language.text03" :value="cumulativeReward"/>
        <!-- 待领取 -->
        <headerItem :title="language.text04" :value="totalReward" :needFormat="false" />
        <!-- 解锁中 -->
        <headerItem :title="language.text05" :value="unBoundingBalance" />
      </view>
    </view>
    <view class="account-box">
      <view class="account-column">
        <view class="column-item" @click="goTo('/pages/delegate/cancel')">
          <image src="/static/img/delegate/quxiaoweituo.png" ></image>
          <text>{{ language.text06 }}</text>
        </view>
        <view class="column-item" @click="goTo('/pages/delegate/income')">
          <image src="/static/img/delegate/shouyilingqu.png"></image>
          <text>{{ language.text07 }}</text>
        </view>
        <view class="column-item" @click="goTo('/pages/delegate/transaction')">
          <image src="/static/img/delegate/jiaoyijilu.png"></image>
          <text>{{ language.text08 }}</text>
        </view>
      </view>
    </view>
    <view class="my-delegate">
      <view class="title">
        {{ language.text01 }}
      </view>
      <view class="list">
        <view class="list-title">
          <view class="left">{{ language.text09 }}</view>
          <view class="center">{{ language.text10 }}</view>
          <view class="right">{{ language.text11 }}</view>
        </view>
        <custom-loading v-if="loading" class="loading"></custom-loading>
        <!-- :style="{ height: scrollHeight }" -->
        
        <scroll-view :style="{ height: scrollHeight }" scroll-y class="list-data" v-else-if="list.length" >
        <view class="list-item" v-for="(item,index) in list" :key="index">
            <view class="left">
              <view class="name">{{item.validator.description.moniker}}</view>
              <view class="other">{{item.validator.operatorAddress|sliceAddress(7, -8)}}</view>
            </view>
            <view class="center">
              {{ item.rewards ? (item.rewards.amount / mainCoin.delegateDecimals).toFixed(6) : '0.00' }} {{ mainCoin.alias_name }}
            </view>
            <view class="right">
              <view class="name">{{item.balance.amount / mainCoin.decimals }}</view>
              <view class="other">{{ item.timestamp }}</view>
            </view>
          </view>
        </scroll-view>
        <no-data style="padding-bottom: calc( 120rpx + 56rpx);" v-else :tip="language.text12" :btnTx="language.text64" @btnClick="btnClick" />
      </view>
    </view>
  </view>
</template>

<script>
import language from '../language'
import headerItem from './header-item'
import mainCoin from '@/config/index.js'
import { txsQuery } from '@/api/cosmos.js'
import { getCumulativeRewardCollection } from '@/api/record.js'
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
      language: language['CN'],
      address: '',
      list: [],
      allData: {},
      currentWallet: this.$cache.get('_currentWallet'),
      loading: true,
      mainCoin,
      systemBarHeight: 0,
      headerBoxHeight: 0,
      titleHeight: 0,
      listTitleHeight: 0,
      updateRewards: 0,
      unboundingBlanceLoading: true,
      callUnboundingDelegators: 0,
      unBoundingBalance: 0,
      cumulativeReward: 0
    }
  },
  created() {
    // this.address = this.currentWallet.address
    // setTimeout(()=>{
    //   this.updateData()
    // },500)
  },
  mounted() {
    this.getSystemStatusHeight()
    this.calculateHeight()
  },
  methods: {
    formatTime(time) {
      let date = new Date(time)
      let y = date.getFullYear()
      let m = (date.getMonth() + 1 + '').padStart(2, '0')
      let d = (date.getDate() + '').padStart(2, '0')
      let hh = (date.getHours() + '').padStart(2, '0')
      let mm = (date.getMinutes() + '').padStart(2, '0')
      let ss = (date.getSeconds() + '').padStart(2, '0')
    
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },
    getSystemStatusHeight() {
      uni.getSystemInfo({
        success: res => {
          this.systemBarHeight = res.statusBarHeight
        }
      })
    },
    calculateHeight() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.header-box').boundingClientRect(data => {
        this.headerBoxHeight = data.height + 'px'
      })
      
      query.select('.my-delegate .title').boundingClientRect(data => {
        this.titleHeight = data.height + 'px'
      })
      query.select('.my-delegate .list-title').boundingClientRect(data => {
        this.listTitleHeight = data.height + 'px'
      })
      
      query.exec()
    },
    btnClick() {
      this.$emit('switchToDelegate')
    },
    async updateData() {
      console.log('delegate update data')
      // if (this.$cache.get('_updateDelegateInfo') === null || this.$cache.get('_updateDelegateInfo')) {


      this.list = []
      this.loading = true
      this.allData = {}
      if (this.currentWallet.address !== this.$cache.get('_currentWallet').address) {
        this.currentWallet = this.$cache.get('_currentWallet')
      }
      this.$cache.delete('_delegateInfo')
      
      this.address = this.currentWallet.address
      
      this.unBoundingBalance = 0
      this.cumulativeReward = 0
      this.callUnboundingDelegators++
      const res = await getCumulativeRewardCollection({
        address: this.$cache.get('_currentWallet').address
      })
      console.log('累计领取奖励',res)
      this.cumulativeReward = !isNaN(res.data.data.withdrawAmount)?res.data.data.withdrawAmount / mainCoin.decimals : 0



      // if (this.$cache.get('_delegateInfo')) {
      // this.address = this.currentWallet.address
      // this.allData = this.$cache.get('_delegateInfo')
      // this.list = this.allData.list
      // }

    },
    handlerUnboundingBlance(res) {
      this.unBoundingBalance = 0
      res.result.unbondingResponses.forEach(item => {
        item.entries.forEach(item => {
          this.unBoundingBalance += Number(item.balance)
        })
      })
      this.unBoundingBalance = this.unBoundingBalance / mainCoin.decimals
      this.unboundingBlanceLoading = false
      // this.unBoundingBalance = res.result.unboundingResponses.reduce((pre, cur, 0) => {
      //   return pre + Number(cur.ent)
      // })
    },
    goTo(url) {
      console.log('click fire')
      uni.navigateTo({
        url,
        events: {
          selindexChange: () => {
            this.$emit('switchToDelegate') 
          }
        }
      })
    },
    initData(data) {
      this.$nextTick(async () => {
        this.allData = data
        let { list } = data
        this.list.forEach((item, index) => {
          item = Object.assign(item , list[index])
        })
        for (let i = 0, len = list.length; i < len; i++) {
          const item = list[i]
          const { delegatorAddress, validatorAddress } = item.delegation
          // 获取最新质押时间 
          const res = (await txsQuery([`events=message.sender='${this.address}'`, `events=delegate.validator='${validatorAddress}'`])).data.tx_responses
          if (res.length > 0) {
            item.timestamp = res.pop().timestamp.replace(/T|Z/g, ' ')
            item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item.timestamp).getHours() + 8)))
          }
        }
        list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        this.list = list
        this.loading = false
        this.address = ''
        this.$cache.set('_updateDelegateInfo', false, 36000)
        this.$cache.set('_delegateInfo', this.allData, 0)
        
        this.updateRewards = JSON.parse(JSON.stringify(data.list))
      })
    },
    handerRewards(res) {
      this.$nextTick(() => {
        this.list = res
        let totalRewards = 0
        this.list.forEach(item => {
          totalRewards += item.rewards ? Number(item.rewards.amount) : 0
        })
        totalRewards = totalRewards / mainCoin.delegateDecimals
        this.allData.totalReward = totalRewards
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.updateRewards = JSON.parse(JSON.stringify(this.list))
        }, 2000)
      })
    }
  },
  onUnload() {
    clearTimeout(this.timer)
  },
  computed: {
    totalReward() {
      let reward = this.allData.totalReward ? (Number(this.allData.totalReward)).toFixed(6) + '' : '0.000000'
      if (reward.length > 13) {
        reward = reward.substr(0, 6) + '...' + reward.substr(-6)
      }
      return reward
    },
    scrollHeight() {
      const operation_btn = '180rpx'
      return `calc(100vh - 112rpx - ${operation_btn} - 188rpx - 24rpx - 48rpx - ${this.titleHeight} - ${this.headerBoxHeight} - 56rpx - ${this.listTitleHeight})`
    }
  }
}
</script>
<script lang="renderjs" module="render">
  import {
    getUnbondingDelegationRecord,
    getDelegationTotalRewards,
    getDelegatorDelegations,
    getStakingValidator,
    getRewards
  } from '@/utils/secretjs/SDK'
  import renderUtils from '@/utils/render.base.js'
  import mixin from '../mixins/render.js'
  import mainCoin from '@/config/index.js'
  export default {
    mixins: [mixin],
    methods: {
      async init(address) {
        if (address == '') return
        // let updateDelegateInfo = true
        // // #ifdef APP-PLUS
        // updateDelegateInfo = plus.storage.getItem('_updateDelegateInfo') === null ? true : plus.storage.getItem('_updateDelegateInfo')
        // // #endif
        // // #ifndef APP-PLUS
        // updateDelegateInfo = localStorage.getItem('_updateDelegateInfo') === null ? true : localStorage.getItem('_updateDelegateInfo')
        // // #endif
        
        // if (typeof updateDelegateInfo !== 'boolean') {
        //   updateDelegateInfo = JSON.parse(updateDelegateInfo).data.data          
        // }
        // if (!updateDelegateInfo) return; 
        
        
        // @fixed
        let list = await this.getLists(address)
        let total = 0, totalReward = 0
        try {
        list.forEach(item => {
          total += item.balance ? Number(item.balance.amount) : 0
          totalReward += item.rewards ? Number(item.rewards.amount) : 0
        })  
        } catch(e) {
          console.log('e')
        }
        let data = {}
        data.total = total / mainCoin.decimals
        data.totalReward = totalReward / mainCoin.delegateDecimals
        data.list = list
        renderUtils.runMethod(this._$id, 'initData', data, this)

        // renderUtils.runMethod(this._$id, 'searchData', data, this)
      },
      async getRewards(val) {
        if (val == 0) return
        // console.log('fire');
        // console.log(val);
        const pastVal = JSON.parse(JSON.stringify(val)) 
         for (let i = 0; i < pastVal.length; i++) { 
           let {
             delegatorAddress,
             validatorAddress
           } = pastVal[i].delegation
           const res = await getRewards(delegatorAddress, validatorAddress)
           pastVal[i].rewards = res.rewards[0]
         }
        renderUtils.runMethod(this._$id, 'handerRewards', pastVal, this)
      },
      async getUnbondingDelegationRecord(val) {
        if (val == 0) return
        let wallet;
        //#ifdef APP-PLUS
        wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
        //#endif
        
        //#ifndef APP-PLUS 
        wallet = uni.getStorageSync('_currentWallet').data
        //#endif
        const result = await getUnbondingDelegationRecord(wallet.address)
        renderUtils.runMethod(this._$id, 'handlerUnboundingBlance', {
          result
        }, this)
        // console.log('getUnbondingDelegationRecord', result.unbondingResponses);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .loading {
    margin-top: 10rpx;
  }

  .my {

    .header-box,
    .account-box {
      padding: 0 32rpx;
    }

    .header {
      width: 686rpx;
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
        color: #2c4364;
        font-size: 28rpx;
				text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        text {
          padding-top: 16rpx;
        }
				image{
					height: 80rpx;
					width: 80rpx;
				}
      }
    }

    .my-delegate {
      padding-top: 48rpx;

      .title {
        padding: 0 32rpx;
        line-height: 80rpx;
        font-weight: 600;
        font-size: 32rpx;
        color: #2C365A;
      }

      .list {
        .left {
          width: 212rpx;
        }

        .center {
          flex: 1;
          text-align: center;
        }

        .right {
          width: 220rpx;
          text-align: right;
          flex: 1;
        }

        .list-title {
          display: flex;
          height: 64rpx;
          line-height: 64rpx;
          padding: 0 32rpx;
          font-size: 24rpx;
          background: rgba(30, 94, 255, 0.04);
          color: #8397B1;
        }

        .list-data {
          padding: 0 32rpx;

          .list-item {
            display: flex;
            align-items: center;
            padding: 32rpx 0 36rpx 0;
            border-bottom: 2rpx solid rgba(151, 151, 151, .1);

            .name {
              font-size: 24rpx;
              color: #2C365A;
            }

            .other {
              font-size: 22rpx;
              height: 22rpx;
              color: #8397B1;
            }

            .center {
              font-weight: 600;
              font-size: 24rpx;
              color: #2C365A;
              line-height: 24rpx;
            }
          }
        }

      }
    }

  }
</style>

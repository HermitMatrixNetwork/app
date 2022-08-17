<template>
  <view class="my">
    <view :address="address" :change:address="init"></view>
    <view class="header-box">
      <view class="header">
        <headerItem :title="language.totalDelegate" :value="allData.total" />
        <headerItem :title="language.receiveRewards" />
        <!-- totalReward -->
        <headerItem :title="language.rewardsReceived" :value="totalReward" :needFormat="false" />
        <headerItem :title="language.unlocking" />
      </view>
    </view>
    <view class="account-box">
      <view class="account-column">
        <view class="column-item" @click="goTo('/pages/delegate/cancel')">
          <u-icon :name="require('@/static/img/delegate/quxiaoweituo@2x.png')" size="80rpx"></u-icon>
          <text>取消委托</text>
        </view>
        <view class="column-item" @click="goTo('/pages/delegate/income')">
          <u-icon :name="require('@/static/img/delegate/shouyilingqu@2x.png')" size="80rpx"></u-icon>
          <text>收益领取</text>
        </view>
        <view class="column-item" @click="goTo('/pages/delegate/transaction')">
          <u-icon :name="require('@/static/img/delegate/jiaoyijilu@2x.png')" size="80rpx"></u-icon>
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
        <custom-loading v-if="loading" class="loading"></custom-loading>
        <view class="list-data" v-else-if="list.length">
          <view class="list-item" v-for="(item,index) in list" :key="index">
            <view class="left">
              <view class="name">{{item.validator.description.moniker}}</view>
              <view class="other">{{item.validator.operatorAddress|sliceAddress(7, -8)}}</view>
            </view>
            <view class="center">
              {{ item.rewards.amount / mainCoin.decimals }} {{ mainCoin.alias_name }}
            </view>
            <view class="right">
              <view class="name">{{item.balance.amount / mainCoin.decimals }}</view>
              <view class="other">{{ item.timestamp }}</view>
            </view>
          </view>
        </view>
        <no-data v-else tip="暂无委托，点击" btnTx="参与委托" />
      </view>
    </view>
  </view>
</template>

<script>
import language from '../language'
import headerItem from './header-item'
import mainCoin from '@/config/index.js'
import { txsQuery } from '@/api/cosmos.js'
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
      list: [],
      allData: {},
      currentWallet: this.$cache.get('_currentWallet'),
      loading: true,
      mainCoin
    }
  },
  methods: {
    updateData() {
      console.log('delegate update data')
      if (this.$cache.get('_updateDelegateInfo') === null || this.$cache.get('_updateDelegateInfo')) {
        this.loading = true
        this.address = this.currentWallet.address
      } else {
        this.allData = this.$cache.get('_delegateInfo')
        this.list = this.allData.list
        this.loading = false
      }
    },
    goTo(url) {
      uni.navigateTo({
        url
      })
    },
    async initData(data) {
      this.allData = data
      let { list } = data
      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i]
        const { delegatorAddress, validatorAddress } = item.delegation
        const res = (await txsQuery([`events=message.sender='${this.address}'`, `events=delegate.validator='${validatorAddress}'`])).data.tx_responses
        item.timestamp = res.pop().timestamp.replace(/T|Z/g, ' ')
      }
      this.list = list
      this.loading = false
      this.address = ''
      this.$cache.set('_updateDelegateInfo', false, 36000)
      this.$cache.set('_delegateInfo', this.allData, 0)
      
      console.log('allData', this.allData)
    }
  },
  computed: {
    totalReward() {
      let reward = this.allData.totalReward ? this.allData.totalReward + '' : '0.00'
      if (reward.length > 13) {
        reward = reward.substr(0, 4) + '...' + reward.substr(-4)
      }
      return reward
    }
  }
}
</script>
<script lang="renderjs" module="render">
  import {
    getDelegationTotalRewards,
    getDelegatorDelegations,
    getStakingValidator
  } from '@/utils/secretjs/SDK'
  import renderUtils from '@/utils/render.base.js'
  import mixin from '../mixins/render.js'
  import mainCoin from '@/config/index.js'
  export default {
    mixins: [mixin],
    methods: {
      async init(address) {
        if (address == '') return
        let updateDelegateInfo = true
        // #ifdef APP-PLUS
        updateDelegateInfo = plus.storage.getItem('_updateDelegateInfo') === null ? true : plus.storage.getItem('_updateDelegateInfo')
        // #endif
        // #ifndef APP-PLUS
        updateDelegateInfo = localStorage.getItem('_updateDelegateInfo') === null ? true : localStorage.getItem('_updateDelegateInfo')
        // #endif
        
        if (typeof updateDelegateInfo !== 'boolean') {
          updateDelegateInfo = JSON.parse(updateDelegateInfo).data.data          
        }
        if (!updateDelegateInfo) return; 
        // let totalRewards = await getDelegationTotalRewards(address)
        // console.log('totalRewards',totalRewards)
        let list = await this.getLists(address)
        let total = 0, totalReward = 0
        list.forEach(item => {
          total += Number(item.balance.amount)
          totalReward += Number(item.rewards.amount)
        })
        let data = {}
        data.total = total / mainCoin.decimals
        data.totalReward = totalReward / mainCoin.decimals
        data.list = list
        renderUtils.runMethod(this._$id, 'initData', data, this)

        // renderUtils.runMethod(this._$id, 'searchData', data, this)
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

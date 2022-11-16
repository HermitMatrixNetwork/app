<template>
  <view class="page-wrapper">
    <view :callQuery="callQuery" :change:callQuery="render.queryRecord"></view>
    <custom-header :title="language.text266" :customStyle="{ 'z-index': 98 }"></custom-header>
    <custom-loading v-if="loading" style="margin-top: 60rpx ;"></custom-loading>
    <view class="contain" v-else-if="transationList.length">
      <view class="contain-head">
        <view class="head-address">{{ language.text279 }}</view>
        <view class="head-method">Method</view>
        <view class="head-nums">{{ language.text280 }}</view>
      </view>
      <view class="line"></view>
      <view class="record-list">
        <scroll-view scroll-y :style="{ height: scrollHeight }">
          <view class="record" v-for="(item, index) in transationList" :key="index" @click="toDetail(item)">
            <view class="record-address">
              <view class="address-logo">
                <image src="/static/img/account/contract.png" ></image>
              </view>
              <view class="address-detail">
                <view class="address">{{ format(item) }}</view>
                <view class="date">{{ formatTime(item.block_time * 1000) }}</view>
              </view>
            </view>
            <view class="record-method">
              {{ formatMethod(item) }}
            </view>
            <view class="record-nums">
              1
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view v-else-if="wrongViewkey">
      <no-data class="no-data" :tip="language.text08"></no-data>
    </view>
    <view class="no-data" v-else>
    	<no-data :tip="language.text278" />
    </view>
  </view>
</template>

<script>
import language from './language/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      token: {},
      wrongViewkey: false,
      transationList: [],
      loading: true,
      callQuery: {}
    }
  },
  onLoad(options) {
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.symbol == options.symbol)
    this.callQuery.address = this.$cache.get('_currentWallet').address
    this.callQuery.token = this.token
  },
  mounted() {
    this.getSystemStatusHeight()
  },
  methods: {
    toDetail(item) {
      uni.navigateTo({
        url: `./send/transactionDetails?data=${JSON.stringify(item)}&from=NFTTx`
      })
    },
    getSystemStatusHeight() {
      uni.getSystemInfo({
        success: res => {
          this.systemBarHeight = res.statusBarHeight
        }
      })
    },
    handlerRecord(res) {
      if (res.generic_err) {
        this.wrongViewkey = true
      } else if (res.code == 7) {
      } else {
        this.transationList = res.transaction_history.txs
      }
      this.loading = false
    },
    format(target) {
      const action = target.action
      let val
      if (action.transfer) {
        val = action.transfer.from 
      } else if (action.mint) {
        val = action.mint.recipient
      } else {
        console.log(action) 
        val = ''
      }
      return val.slice(0, 6) + '...' + val.slice(-6)
    },
    formatMethod(target) {
      const action = target.action
      let val
      if (action.transfer) {
        val = 'Transfer'
      } else if (action.mint) {
        val = 'Mint'
      } else {
        console.log(action)
        val = ''
      }
      return val
    },
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
  },
  computed: {
    scrollHeight() {
      return `calc(100vh - 112rpx  - 92rpx - 33rpx - ${this.systemBarHeight + 'rpx'})`
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import { query721record } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      async queryRecord(val) {
        if (!val.token) return
        let res = {}
        try {
            res = await query721record(val)
        } catch (e) {
          res.code = 7
          console.log('e3232', e);
        }
        
        renderUtils.runMethod(this._$id, 'handlerRecord', res, this)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
    overflow: hidden;
  }
  
  .contain-head {
    height: 92rpx;
    padding-left: 44rpx;
    padding-right: 32rpx;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 28rpx;
    color: #8397B1;
    letter-spacing: 0;
  }
  
  
  .head-address {
    flex-basis: 406rpx;
  }
  
  .head-method {
    flex-basis: 212rpx;
    text-align: center;
  }
  
  .head-nums {
    flex: 1;
    text-align: right;
  }
  
  .address-logo {
    image {
      width: 72rpx;
      height: 72rpx;
    }
    margin-right: 20rpx;
  }
  
  .record {
    display: flex;
    margin-left: 44rpx;
    margin-right: 32rpx;
    align-items: center;
    border-bottom: 2rpx solid rgba(151,151,151,.3);;
    padding-bottom: 36rpx;
    padding-top: 32rpx;
  }
  
  .record-address {
    flex-basis: 406rpx;
    display: flex;
    align-items: center;
  }
  .address-detail {
    .address {
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      line-height: 28px;
    }
    
    .date {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 24rpx;
      color: #8397B1;
      letter-spacing: 0;
      line-height: 24px;
    }
  }
  
  .record-method {
    flex-basis: 212rpx;
    font-family: DIN-Medium;
    font-weight: 600;
    font-size: 28rpx;
    color: #2C365A;
    letter-spacing: 0;
    line-height: 28rpx;
    text-align: center;
  }
  
  .record-nums {
    flex: 1;
    font-family: DIN-Medium;
    font-weight: 600;
    font-size: 28rpx;
    color: #17C499;
    letter-spacing: 0;
    text-align: right;
    line-height: 28rpx;
  }
  
  .line {
    height: 2rpx;
    background-color: #8397B1;
    opacity: 0.16;
    margin-top: 31rpx;
  }
  
  /deep/ .no-data {
    .tip {
      text-align: center;
    }
  }
</style>

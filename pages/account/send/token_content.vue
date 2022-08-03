<template>
  <view class="token_content">
    <custom-header :title="token.alia_name">
      <template #right>
        <text class="customIcon" @click="toTokenDetail()">详情</text>
      </template>
    </custom-header>

    <view class="main_token">
      <TokenColumn :tokenIcon="token.logo" :tokenName="token.alia_name" :tokenColumnStyle="tokenColumnStyle"
        :tokenAddress="address | sliceAddress(6, -16) ">
        <template #right>
          <view style="padding-right: 16rpx;" class="token_price">
            <view class="balance" v-if="token.balance">{{ token.balance | formatBalance }}</view>
            <view>
              <text class="symbol">$</text>
              <text>0.00000</text>
            </view>
          </view>
        </template>
      </TokenColumn>

      <view class="token_details">
        <view class="available">
          <text>可用</text>
          <view class="quantity">
            <view class="top" v-if="token.balance">{{ token.balance | formatBalance }}</view>
            <view class="bottom">
              <text class="symbol">$</text>
              <text>0.00000</text>
            </view>
          </view>
        </view>
        <view class="lock">
          <text>锁定</text>
          <custom-loading v-if="lockAmountLoading"></custom-loading>
          <view v-else class="quantity">
            <view class="top">{{ lockAmount }}</view>
            <view class="bottom">
              <text class="symbol">$</text>
              <text>0.00000</text>
            </view>
          </view>
        </view>
      </view>

    </view>
    <view style="height: 16rpx;background: #F4F6FA;margin-top: 32rpx;" />
    <view class="transaction_history">
      <view class="nav">
        <u-tabs :list="list" :is-scroll="false" @click="switchTabs" :current="listCurrentIndex">
        </u-tabs>
      </view>
      <custom-loading v-if="loading" class="loading"></custom-loading>
      <swiper v-else class="transaction_history_item" :current="listCurrentIndex" @change="switchSwiper" style="height: 670rpx">
        <swiper-item v-for="(item,index) in list" :key="item.name" :item-id="index+''">
          <scroll-view scroll-y class="scroll-container" style="height: 670rpx">
            <template v-if="accountTransfer[item.type].length">
              <view class="list-item" v-for="(record, index) in accountTransfer[item.type]" :key="index" @click.native="toRecordDetail(record)">
                <view class="container">
                  <view class="logo">
                    <image :src="record.icon"></image>
                  </view>
                  <view class="content">
                    <view class="content-address">{{ (record.to_address || record.validator_address) | sliceAddress(6, -6) }}</view>
                    <view class="content-time">{{ record.timestamp }}</view>
                  </view>
                  <view class="right">
                    <view class="amount" :class="[record.validator_address ? 'delegate-amount' : (record.to_address == address ? 'recipient-amount' : 'sender-amount')]">{{ record.validator_address ? '' : (record.to_address == address ? '+' : '-') }} {{ record.amount }}</view>
                    <view class="real-money">
                      <text class="rate">$</text>
                      <text class="money">0.00</text>
                    </view>
                  </view>
                </view>
                <view class="border"></view>
              </view>
            </template>
            <no-data v-else tip="暂无记录" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <view :callRenderDelegateRecord="callRenderDelegateRecord" :change:callRenderDelegateRecord="render.getAddress"></view>
    <view class="operation_btn">
      <button @click="toSend('/pages/account/send/index', token)">发送</button>
      <button @click="toGo('/pages/account/receive')">接收</button>
      <button @click="dealBtn">交易</button>
      <button @click="queryHash">委托</button>
    </view>
  </view>
</template>

<script>
import TokenColumn from './components/TokenColumn.vue'
import mixin from '../mixins/index.js'
import {
  queryAccountHash
} from '@/utils/secretjs/SDK.js'
import mainCoin from '@/config/index.js'
import {
  sliceAddress
} from '@/utils/filters.js'
import {
  txsQuery
} from '@/api/cosmos.js'
export default {
  mixins: [mixin],
  components: {
    TokenColumn
  },
  data() {
    return {
      token: {},
      address: this.$cache.get('_currentWallet').address,
      listCurrentIndex: 0,
      tokenColumnStyle: {
        paddingBottom: '32rpx',
        paddingTop: '32rpx',
      },
      list: [{
        name: '全部',
        type: 'all'
      }, {
        name: '发送',
        type: 'sender',
        icon: require('@/static/img/account/fasong2.png')
      }, {
        name: '收款',
        type: 'recipient',
        icon: require('@/static/img/account/shoukuan2.png')
      },
      {
        name: '委托',
        type: 'delegate'
      },
      {
        name: '领取',
        type: 'draw'
      },
      {
        name: '失败',
        type: 'fail'
      }],
      accountTransfer: {
        'sender': [],
        'recipient': [],
        'delegate': [],
        'draw': [],
        'fail': [],
        'all': []
      },
      loading: true,
      lockAmountLoading: true,
      callRenderDelegateRecord: '',
      lockAmount: 0,
    }
  },
  async onLoad(options) {
    this.token = JSON.parse(options.token)
    this.callRenderDelegateRecord = this.address
  },
  onShow() {
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.alia_name == this.token.alia_name)
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      // to del
      await Promise.all([
        txsQuery([`events=message.module='${'bank'}'`,`events=transfer.sender='${this.address}'`, 'order_by=ORDER_BY_DESC']),
        txsQuery([`events=message.module='${'bank'}'`,`events=transfer.recipient='${this.address}'`, 'order_by=ORDER_BY_DESC']),
        txsQuery([`events=message.module='${'staking'}'`,`events=message.sender='${this.address}'`, 'order_by=ORDER_BY_DESC'])
      ]).then(res => {
        this.accountTransfer['sender'] = res[0].data.tx_responses
        this.accountTransfer['recipient'] = res[1].data.tx_responses
        this.accountTransfer['delegate'] = res[2].data.tx_responses
      })
      // this.accountTransfer['sender'] = (await txsQuery([`events=message.module='${'bank'}'`,`events=transfer.sender='${this.address}'`, 'order_by=ORDER_BY_DESC'])).data.tx_responses
      // this.accountTransfer['recipient'] = (await txsQuery([`events=message.module='${'bank'}'`,`events=transfer.recipient='${this.address}'`, 'order_by=ORDER_BY_DESC'])).data.tx_responses
      // this.accountTransfer['delegate'] = (await txsQuery([`events=message.module='${'staking'}'`,`events=message.sender='${this.address}'`, 'order_by=ORDER_BY_DESC'])).data.tx_responses
      const list = ['recipient', 'sender', 'delegate']
      list.forEach(type => {
        for (let i = 0, len = this.accountTransfer[type].length; i < len; i++) {
          const item = this.accountTransfer[type][i]
          item.fee = item.tx.auth_info.fee.amount[0].amount / mainCoin.rate + mainCoin.alia_name
          item.amount = 0
          item.memo = item.tx.body.memo
          item.from_address = item.tx.body.messages[0].from_address
          item.to_address = item.tx.body.messages[0].to_address
          item.delegator_address = item.tx.body.messages[0].delegator_address
          item.validator_address = item.tx.body.messages[0].validator_address
          item.timestamp = item.timestamp.replace(/T|Z/g, ' ')
          item.tx.body.messages.forEach(cur => {
            if (cur.amount) {
              if (Array.isArray(cur.amount)) {
                item.amount += Number(cur.amount[0].amount)
              } else {
                item.amount += Number(cur.amount.amount)
              }
            }
          })
          item.amount = item.amount / mainCoin.rate + mainCoin.alia_name
          switch (type) {
          case 'recipient':
            item.icon = require('@/static/img/account/shoukuan2.png')
            break
          case 'sender':
            item.icon = require(
              '@/static/img/account/fasong2.png')
            break
          case 'delegate':
            item.icon = require(
              '@/static/img/account/weituo2.png')
            break
          }
        }
      })
      // #ifdef H5
      console.log(this.accountTransfer)
      // #endif
      // list.forEach(type => {
      //   this.accountTransfer[type].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      // })
      this.accountTransfer['all'] = [...this.accountTransfer['sender'], ...this.accountTransfer['recipient'], ...this.accountTransfer['delegate']]
      this.accountTransfer['all'].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      this.loading = false
    },
    setLockAmount({ result }) {
      let lock = 0
      result.delegationResponses.forEach(item => {
        lock += Number(item.balance.amount) 
      })
      this.lockAmountLoading = false
      this.lockAmount = lock
    },
    jumpDetails(hash) {
      uni.navigateTo({
        url: `./transactionDetails?transactionHash=${hash}`
      })
    },
    async queryHash() {
      const res = await queryAccountHash('034ADCCBB782E26DB4FCAA5715CFF96E1B4576C6646E61019A25D890440B09FC')
    },
    switchTabs(e) {
      const {
        index
      } = e
      this.listCurrentIndex = index
    },
    switchSwiper(e) {
      const {
        detail: {
          current
        }
      } = e
      this.listCurrentIndex = current

    },
    toSend(url, params) {
      uni.navigateTo({
        url: `${url}?token=${JSON.stringify(params)}`,
        events: {
          addRecordToSendList: (data) => {
            data.from_address = data.tx.body.messages[0].value.fromAddress
            data.to_address = data.tx.body.messages[0].value.toAddress
            data.amount = 0
            data.tx.body.messages.forEach(cur => {
              if (cur.value.amount) {
                if (Array.isArray(cur.value.amount)) {
                  data.amount += Number(cur.value.amount[0].amount)
                } else {
                  data.amount += Number(cur.value.amount.amount)
                }
              }
            })
            
            mainCoin.rate && (data.amount = data.amount / mainCoin.rate)
            data.amount += mainCoin.alia_name
            
            data.icon = require(
              '@/static/img/account/fasong2.png')

            data.timestamp = data.timestamp.replace(/T|Z/g, ' ')
            
            
            this.accountTransfer['all'].unshift(data)
            
            this.accountTransfer['sender'].unshift(data)
            
            this.$forceUpdate()
            
            console.log('添加记录数据', data)
          }
        }
      })
    },
    toTokenDetail() {
      uni.navigateTo({
        url: `/pages/account/send/tokenInformation?token=${JSON.stringify(this.token)}`
      })
    },
    toRecordDetail(record) {
      uni.navigateTo({
        url: `./transactionDetails?data=${JSON.stringify(record)}`
      })
    }
  },
  filters: {
    sliceAddress,
    formatBalance(val) {
      const int = (val + '').split('.')[0]
      let float = (val + '').split('.')[1]
      if (float) {
        float = float.substr(0, 2)
      }
      return int + '.' + float
    }
  },
}
</script>
<script lang="renderjs" module="render">
  import {
    getDelegationRecord,
    getUnbondingDelegationRecord
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      getAddress(address) {
        if (address === '') return
        this.getDelegationRecord(address)
        this.getUnbondingDelegationRecord(address)
      },
      async getDelegationRecord(address) {
        const result = await getDelegationRecord(address)
        renderUtils.runMethod(this._$id, 'setLockAmount', { result }, this)
      },
      async getUnbondingDelegationRecord(address) {
        // const result = await getUnbondingDelegationRecord(address)
        // console.log('getUnbondingDelegationRecord', result.unbondingResponses);
      },
    }
  }
</script>


<style lang="scss" scoped>
  .loading {
    margin-top: 100rpx;
  }

  .token_content {
    height: 100vh;
    overflow: hidden;
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
        font-family: PingFangSC-Regular;
        font-weight: 400;
        font-size: 24rpx;
        color: #8397B1;
        letter-spacing: 0;
        line-height: 24rpx;

      }

      .available {
        border-bottom: 2rpx solid #80808020;
      }
    }

  }

  .token_price {
    text-align: right;

    view:nth-child(2) {
      height: 24rpx;
      font-weight: 400;
      font-size: 24rpx;
      color: #8397B1;
      letter-spacing: 0;
      padding-top: 16rpx;
    }
  }

  .transaction_history {
    /deep/.nav {
      height: 110rpx;
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
    }
  }

  .operation_btn {
    position: fixed;
    height: 180rpx;
    bottom: 0;
    display: flex;
    width: 100vw;
    justify-content: space-between;
    align-items: center;
    padding: 0 32rpx;
    background-color: #fff;
    border-top: 2rpx solid rgba(131,151,177,0.20);

    button {
      width: 152rpx;
      height: 80rpx;
      font-weight: 400;
      font-size: 28rpx;
      background: rgba(255, 255, 255, 0.00);
      border: 2rpx solid rgba(131, 151, 177, 0.31);
      border-radius: 16rpx;

      &:nth-child(1) {
        background: #265EF2;
        color: #FCFCFD;
      }

      &:nth-child(2) {
        background: #16C39A;
        color: #FCFCFD;
      }
    }
  }

  /deep/ .u-tabs__wrapper__nav__item__text {
    font-size: 28rpx !important;
  }

  .quantity {
    text-align: right;
    .top {
      font-weight: 600;
      font-size: 28rpx;
      color: #2C365A;
      line-height: 24rpx;
      margin-bottom: 10rpx;
    }

    .bottom {
      font-size: 22rpx;
      color: #8397B1;
      text-align: right;
    }
  }

  .balance {
    font-weight: 600;
    font-size: 28rpx;
    color: #2C365A;
  }

  .symbol {
    margin-right: 4rpx;
  }
  
  .list-item {
    padding: 32rpx 0 0 0;
    
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 38rpx;
    }
    
    .border{
      height: 2rpx;
      opacity: 0.1;
      background-color: #979797;
    }
    
    .logo {
      image {
        width: 72rpx;
        height: 72rpx;
      }
    }
    
    .content {
      flex: 1;
      margin-left: 20rpx;
      
      &-address {
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
        margin-bottom: 16rpx;
      }
      
      &-time {
        font-size: 24rpx;
        color: #8397B1;
      }
    }
    
    .right {
      text-align: right;
      
      .sender-amount {
        color: #275EF1
      }
      
      .recipient-amount {
        color: #17C499
      }
      
      .amount {
        font-weight: 600;
        font-size: 28rpx;
        margin-bottom: 16rpx;
      }
      
      .real-money {
        font-size: 24rpx;
        color: #8F9BB3;
      }
    }
  }
</style>

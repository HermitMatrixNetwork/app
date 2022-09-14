<template>
  <view class="list">
    <custom-loading style="margin-top: 30rpx;" v-if="loading"></custom-loading>
    <template v-else-if="list[types[currentTab]].length">
      <view class="item" v-for="(item, index) in list[types[currentTab]]" :key="index" @click="toDetail(item)">
        <view class="left">
          <image :src="item.icon" style="width: 72rpx; height: 72rpx;" />
        </view>
        <view class="center">
          <view class="address">
            {{ item.txhash | sliceAddress(6, -6) }}
          </view>
          <view class="name" v-show="item.timestamp">
            {{ item.timestamp }} +UTC
          </view>
        </view>
        <div class="right" >
          <text class="num" :class="[item.type == 'withdraw' ? item.reciver_address == wallet.address ? 'plus' : 'minus' : '']">{{ item.type == "withdraw" ? item.reciver_address == wallet.address ? '+' : '-' : '' }} {{ item.amount }} {{ mainCoin.alias_name }}</text>
        </div>
      </view>
    </template>
		<view v-else class="no-data">
			<no-data :tip="language.text40" />
		</view>
  </view>
</template>

<script>
  import {
    txsQuery
  } from '@/api/cosmos.js'
  import {
    sliceAddress
  } from '@/utils/filters.js'
  import mainCoin from '@/config/index.js'
  import language from '../language/index.js'
  export default {
    props: {
      currentTab: Number
    },
    data() {
      return {
        language: language[this.$cache.get('_language')],
        wallet: this.$cache.get('_currentWallet'),
        list: {
          all: [],
          delegate: [],
          undelegate: [],
          withdraw: []
        },
        types: ['all', 'delegate', 'undelegate', 'withdraw'],
        mainCoin,
        loading: true
      }
    },
    methods: {
      goTo(url) {
        uni.navigateTo({
          url
        })
      },
      toDetail(info) {
        uni.navigateTo({
          url: `/pages/account/send/transactionDetails?data=${JSON.stringify(info)}`
        })
      }
    },
    async created() {
      Promise.all([
        txsQuery([`events=message.sender='${ this.wallet.address }'`, 'events=message.module=\'staking\'',
          'order_by=ORDER_BY_DESC'
        ]),
        // 不能做分页，要区分是设置setWithdrawAddress还是withdraw
        txsQuery([`events=message.sender='${ this.wallet.address }'`, 'events=message.module=\'distribution\'',
          'order_by=ORDER_BY_DESC'
        ])
      ]).then(res => {
        const result = res[0].data.tx_responses
        const withdraw = res[1].data.tx_responses
        result.forEach(item => {
          const type = item.tx.body.messages[0]['@type']

          item.validator_address = item.tx.body.messages[0].validator_address
          item.delegator_address = item.tx.body.messages[0].delegator_address
          item.amount = item.tx.body.messages[0].amount.amount / mainCoin.decimals

          if (type.includes('MsgUndelegate')) {
            item.icon = '/static/img/delegate/fasong2.png'
            this.list['undelegate'].push(item)


          } else if (type.includes('MsgDelegate')) {
            item.icon = '/static/img/delegate/weituo2.png'
            this.list['delegate'].push(item)
          }

          item.timestamp = item.timestamp.replace(/Z|T/g, ' ')

        })



        withdraw.forEach(item => {
          const type = item.tx.body.messages[0]['@type']
          item.validator_address = item.tx.body.messages[0].validator_address
          item.delegator_address = item.tx.body.messages[0].delegator_address
					item.type = 'withdraw'
          item.raw_log.replace(
            /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
            p1) => {
              item.amount = p1 / mainCoin.decimals
            })
					item.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
							item.reciver_address = p1
					})
          if (type.includes('MsgWithdrawDelegatorReward')) {
            item.icon = '/static/img/delegate/shoukuan2.png'
            this.list['withdraw'].push(item)
          }

          item.timestamp = item.timestamp.replace(/Z|T/g, ' ')
        })
        this.list['all'].push(...this.list['delegate'], ...this.list['undelegate'], ...this.list['withdraw'])
        this.loading = false
        this.list['all'].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      })
    },
    filters: {
      sliceAddress
    }
  }
</script>

<style lang="scss" scoped>
  .list {
    height: calc(100vh - 80rpx - 112rpx);
    // #ifdef APP-PLUS
    height: calc(100vh - 80rpx - 112rpx - var(--status-bar-height));
    // #endif
    overflow-y: scroll;

    .item {
      display: flex;
      align-items: center;
      padding: 32rpx 0;
      border-bottom: 2rpx solid rgba(131, 151, 177, 0.20);

      .left {
        margin-right: 20rpx;
        height: 72rpx;
        width: 72rpx;
      }

      .center {
        flex: 2;

        .name {
          font-size: 24rpx;
          color: #8397B1;
        }

        .address {
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
          margin-bottom: 16rpx;
        }
      }

      .right {

        .num {
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
        }
      }
    }
  }
	
	.no-data {
		height: calc(100vh - var(--status-bar-height) - 112rpx);
		display: flex;
		flex-direction: column;
		justify-content: center;
		transform: translateY(-112rpx);
	}
	
	.plus {
		color: #17C499 !important;
	}
	
	.minus {
		color: #275EF1 !important;
	}
</style>

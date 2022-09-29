<template>
  <view class="token_content">
    <custom-header tabUrl="/pages/account/index" :title="token.alias_name">
      <template #right>
        <text class="customIcon" @click="toTokenDetail()">{{ language.text69 }}</text>
      </template>
    </custom-header>

    <view class="main_token">
      <TokenColumn :tokenIcon="token.logo" :tokenName="token.alias_name" :tokenColumnStyle="tokenColumnStyle">
        <template #right>
          <view style="padding-right: 16rpx;" class="token_price">
            <!-- <view class="balance" v-if="token.balance === undefined">0.00</view> -->
            <custom-loading v-if="loadingBalace || lockAmountLoading || unboundingBlanceLoading"></custom-loading>
            <view class="balance" v-else>{{ ( token.balance + lockAmount + unBoundingBalance)  | formatBalance }}</view>
            <view>
              <text class="symbol">$</text>
              <text>0.00000</text>
            </view>
          </view>
        </template>
      </TokenColumn>

      <view class="token_details">
        <view class="available">
          <text>{{ language.text57 }}</text>
          <view class="quantity">
            <custom-loading v-if="loadingBalace"></custom-loading>
            <view class="top" v-else>{{ token.balance | formatBalance }}</view>
            <view class="bottom">
              <text class="symbol">$</text>
              <text>0.00000</text>
            </view>
          </view>
        </view>
        <view class="lock">
          <text>{{ language.text58 }}</text>
          <custom-loading v-if="lockAmountLoading || unboundingBlanceLoading"></custom-loading>
          <view v-else class="quantity">
            <view class="top">{{ (lockAmount + unBoundingBalance) | formatBalance }}</view>
            <view class="bottom">
              <text class="symbol">$</text>
              <text>0.00000</text>
            </view>
          </view>
        </view>
      </view>

    </view>
    <view style="height: 16rpx;background: #F4F6FA; margin-top: 32rpx;" />
    <view class="transaction_history">
      <view class="nav">
        <u-tabs :list="list" :is-scroll="false" @click="switchTabs" :current="listCurrentIndex">
        </u-tabs>
      </view>
      <custom-loading v-if="loading" class="loading"></custom-loading>
      <swiper v-else class="transaction_history_item" :current="listCurrentIndex" @change="switchSwiper"
        :style="{ height: scrollHeight } ">
        <swiper-item v-for="(item,index) in list" :key="item.name" :item-id="index+''">
          <!-- @scrolltolower="loadMore(item.type)" -->
          <scroll-view scroll-y class="scroll-container" :style="{ height: scrollHeight } ">
            <template v-if="accountTransfer[item.type].length">
              <view class="list-item" v-for="(record, index) in accountTransfer[item.type]" :key="index"
                @click="toRecordDetail(record)">
                <view class="container">
                  <view class="logo">
                    <image :src="record.icon"></image>
                  </view>
                  <view class="content">
                    <view class="content-address">
                      {{ record.showAddress | sliceAddress(6, -6) }}
                    </view>
                    <view class="content-time">{{ record.timestamp }}</view>
                  </view>
                  <view class="right">
                    <view class="amount" :class="[`${record.type}-amount`]">
                      {{ ['delegate', 'fail', 'setWithdrawAddress', 'executeContract'].includes(record.type) ? '' : (record.plus ? '+' : '-') }}
                      {{ record.amount }}
                    </view>
                    <view class="real-money">
                      <text class="rate">$</text>
                      <text class="money">0.00</text>
                    </view>
                  </view>
                </view>
                <view class="border"></view>
              </view>
              <view v-if="item.type">
                <view v-if="!pagination[item.type].nodata && !pagination[item.type].loading" class="loading-more"
                  @click="loadMore(item.type)">
                  {{ language.text206 }}
                </view>
                <u-loading-icon v-else-if="pagination[item.type].loading" class="loading-more" mode="circle"
                  :text="language.text207">
                </u-loading-icon>
                <view v-else-if="pagination[item.type].nodata" class="loading-more">{{ language.text227 }}</view>
              </view>
            </template>
            <no-data v-else :tip="language.text113" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <view :callRenderDelegateRecord="callRenderDelegateRecord" :change:callRenderDelegateRecord="render.getAddress">
    </view>
    <view :callMainCoinBalance="callMainCoinBalance" :change:callMainCoinBalance="render.getMainCoinBalance">
    </view>
    <view class="operation_btn">
      <button @click="toSend('/pages/account/send/index', token)">
        <custom-loading v-if="sendbtnLoading"></custom-loading>
        <text v-else>{{ language.text64 }}</text>
      </button>
      <button @click="toGo('/pages/account/receive')">{{ language.text70 }}</button>
      <button @click="dealBtn">{{ language.text61 }}</button>
      <button @click="toDelegate">{{ language.text66 }}</button>
    </view>
    <!--  -->
    <view :check="sendTokenMessage" :change:check="render.sendToken"></view>
    <view :callUnboundingDelegators="callUnboundingDelegators" :change:callUnboundingDelegators="render.getUnbondingDelegationRecord"></view>
  </view>
</template>

<script>
// 究极不可维护代码之无脑复制黏贴☢
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
import {
  getRecordList
} from '@/api/record.js'
import {
  getFailRecord,
  getWithdrawRecord
} from '@/api/browers.js'
import language from '../language/index.js'
export default {
  mixins: [mixin],
  components: {
    TokenColumn
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      token: {},
      address: this.$cache.get('_currentWallet').address,
      listCurrentIndex: 0,
      tokenColumnStyle: {
        paddingBottom: '32rpx',
        paddingTop: '32rpx',
      },
      list: [{
        name: language[this.$cache.get('_language')].text63,
        type: 'all'
      }, {
        name: language[this.$cache.get('_language')].text64,
        type: 'sender',
        icon: require('@/static/img/account/fasong2.png')
      }, {
        name: language[this.$cache.get('_language')].text65,
        type: 'recipient',
        icon: require('@/static/img/account/shoukuan2.png')
      },
      {
        name: language[this.$cache.get('_language')].text66,
        type: 'delegate'
      },

      {
        name: language[this.$cache.get('_language')].text67,
        type: 'withdraw'
      },

      {
        name: language[this.$cache.get('_language')].text68,
        type: 'fail'
      }
      ],
      accountTransfer: {
        'sender': [],
        'recipient': [],
        'delegate': [],
        'withdraw': [],
        'fail': [],
        'all': []
      },
      pagination: {
        sender: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        recipient: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        delegate: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        withdraw: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        fail: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        all: {
          loading: false
        }
      },
      loading: true,
      loadingBalace: true,
      lockAmountLoading: true,
      callRenderDelegateRecord: '',
      lockAmount: 0,
      mainCoin,
      mainTokenHeight: '0rpx',
      navHeight: '0rpx',
      systemBarHeight: '0rpx',
      callMainCoinBalance: 0,
      unboundingBlanceLoading: true,
      callUnboundingDelegators: 0,
      unBoundingBalance: 0,
      sendTokenMessage: false,
      sendbtnLoading: false,
    }
  },
  async onLoad(options) {
    let obj = options.sendToken ? JSON.parse(options.sendToken) : false
    console.log('获取的数据', obj)
    this.sendbtnLoading = !!obj
    this.sendTokenMessage = obj
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
    const wallet = this.$cache.get('_currentWallet')
    this.loadingBalace = true
    // if (this.token.balance === undefined) {
    //   this.timer = setInterval(() => {
    //     if (wallet.coinList[0].balance === undefined) return
    //     this.token.balance = wallet.coinList[0].balance
    //     this.loadingBalace = false
    //     clearInterval(this.timer)
    //   }, 1000)
    // } else {
    //   this.loadingBalace = false
    // }
  },
  onReady() {
    this.callRenderDelegateRecord = this.address
    this.unboundingBlanceLoading = true
    this.unBoundingBalance = 0
    this.callUnboundingDelegators++
    this.callMainCoinBalance++
  },
  onPullDownRefresh() {
    this.unboundingBlanceLoading = true
    this.lockAmountLoading = true
    this.loadingBalace = true
    this.unBoundingBalance = 0
    this.callRenderDelegateRecord = ''
    this.callUnboundingDelegators++
    this.callMainCoinBalance++
    this.init()
    const wallet = this.$cache.get('_currentWallet')
    this.$nextTick(() => {
      this.callRenderDelegateRecord = this.address
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1500)
    })


  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  onShow() {
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == this.token.ID)
  },
  created() {
    this.init()
  },
  mounted() {
    this.calculateHeight()
    this.getSystemStatusHeight()
  },
  methods: {
    getSystemStatusHeight() {
      uni.getSystemInfo({
        success: res => {
          this.systemBarHeight = res.statusBarHeight
        }
      })
    },
    calculateHeight() {
      const query = uni.createSelectorQuery().in(this)
      query.select('.main_token').boundingClientRect(data => {
        this.mainTokenHeight = data.height + 'px'
      })

      query.select('.nav').boundingClientRect(data => {
        this.navHeight = data.height + 'px'
      })
      query.exec()

    },
    async init() {
      this.pagination = {
        sender: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        recipient: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        delegate: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        withdraw: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        fail: {
          page: 0,
          size: 5,
          total: 0,
          loading: false
        },
        all: {
          loading: false,
          size: 30,
          page: 0,
          total: 0,
        }
      }
      await Promise.all([
        txsQuery([`events=message.module='${'bank'}'`, `events=transfer.sender='${this.address}'`,
          'order_by=ORDER_BY_DESC', `pagination.offset=${this.pagination.sender.page}`,
          `pagination.limit=${this.pagination.sender.size}`
        ]),
        txsQuery([`events=message.module='${'bank'}'`, `events=transfer.recipient='${this.address}'`,
          'order_by=ORDER_BY_DESC', `pagination.offset=${this.pagination.recipient.page}`,
          `pagination.limit=${this.pagination.recipient.size}`
        ]),
        txsQuery([`events=message.module='${'staking'}'`, `events=message.sender='${this.address}'`,
          'order_by=ORDER_BY_DESC', `pagination.offset=${this.pagination.delegate.page}`,
          `pagination.limit=${this.pagination.delegate.size}`
        ]),
        // txsQuery([`events=message.sender='${ this.address }'`, 'events=message.action=\'/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward\'',
        //   'order_by=ORDER_BY_DESC', `pagination.offset=${this.pagination.withdraw.page}`,
        //   `pagination.limit=${this.pagination.withdraw.size}`
        // ]),
        txsQuery([`events=message.sender='${ this.address }'`, 'events=message.module=\'distribution\'',
          'order_by=ORDER_BY_DESC', `pagination.offset=${this.pagination.withdraw.page}`,
          `pagination.limit=${this.pagination.withdraw.size}`
        ]),
        getFailRecord({
          'chain_id': 'ghmdev',
          // 'limit': this.pagination.fail.size,
          // 'index': this.pagination.fail.page,
          'address': this.address
        }),
        getRecordList({
          'address': this.address,
          'limit': this.pagination.all.size,
          'index': this.pagination.all.page
        })
      ]).then(res => {
        console.log(res)
        if (this.pagination.sender.total == 0) {
          this.pagination.sender.total = res[0].data.pagination.total
          this.pagination.recipient.total = res[1].data.pagination.total
          this.pagination.delegate.total = res[2].data.pagination.total
          this.pagination.withdraw.total = res[3].data.pagination.total

          // @toFixed 接口分页查找有重复的数据 暂不支持分页
          // this.pagination.fail.total = res[3].data.data.total
          this.pagination.fail.nodata = true
          this.pagination.all.total = res[5].data.data.total

          // #ifndef APP-PLUS          
          // console.log(res[4])
          // #endif
        }
        // 处理 发送、接受、质押交易记录
        res.forEach((result, type) => {
          if (type == 4 || type == 5) return
          const records = result.data.tx_responses
          for (let i = 0, len = records.length; i < len; i++) {
            const item = records[i]
            item.fee = item.tx.auth_info.fee.amount[0].amount / mainCoin.decimals + mainCoin.alias_name
            item.amount = 0
            item.memo = item.tx.body.memo

            item.from_address = item.tx.body.messages[0].from_address
            item.to_address = item.tx.body.messages[0].to_address
            item.withdraw_address = item.tx.body.messages[0].withdraw_address
            item.delegator_address = item.tx.body.messages[0].delegator_address
            item.validator_address = item.tx.body.messages[0].validator_address
            item.timestamp = item.timestamp.replace(/T|Z/g, ' ')
            item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item
              .timestamp).getHours() + 8)))
            item.tx.body.messages.forEach(cur => {
              if (cur.amount) {
                if (Array.isArray(cur.amount)) {
                  item.amount += Number(cur.amount[0].amount)
                } else {
                  item.amount += Number(cur.amount.amount)
                }
              }
            })
            item.amount = item.amount / mainCoin.decimals + mainCoin.alias_name
            switch (type) {
            case 0:
              item.icon = require(
                '@/static/img/account/fasong2.png')
              item.type = 'sender'
              item.plus = item.to_address == this.address ? true : false
              item.showAddress = item.to_address
              break
            case 1:
              item.icon = require('@/static/img/account/shoukuan2.png')
              item.type = 'recipient'
              item.showAddress = item.from_address
              item.plus = true
              break
            case 2:
              if (item.tx.body.messages[0]['@type'].includes('MsgDelegate')) {
                item.icon = require(
                  '@/static/img/account/weituo2.png')
              } else if (item.tx.body.messages[0]['@type'].includes('MsgUndelegate')) {
                item.icon = require('@/static/img/delegate/fasong2.png')

              }
              item.showAddress = item.validator_address
              item.type = 'delegate'
              break
            case 3:
              const originType = item.tx.body.messages[0]['@type']
              item.icon = require(
                '@/static/img/account/lingqu.png')
              if (originType.includes('MsgSetWithdrawAddress')) {
                item.raw_log.replace(/"key":"withdraw_address","value":"([0-9a-z]*)"/, (match, p1) => {
                  item.withdraw_address = p1
                })
                item.type = 'setWithdrawAddress'
              } else if (originType.includes('MsgWithdrawDelegatorReward')) {
                item.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
                  item.withdraw_address = p1
                })
                item.type = 'withdraw'
              }
              item.raw_log.replace(
                /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                  p1) => {
                  item.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })

              item.plus = item.withdraw_address == this.address ? true : false
              item.showAddress = item.withdraw_address
              break
            }
          }
        })
        this.accountTransfer['sender'] = res[0].data.tx_responses
        this.accountTransfer['recipient'] = res[1].data.tx_responses
        this.accountTransfer['delegate'] = res[2].data.tx_responses
        this.accountTransfer['withdraw'] = res[3].data.tx_responses
        // 处理失败交易记录
        if (res[4].data.data.list) {
          this.accountTransfer['fail'] = res[4].data.data.list.map(item => {
            item.icon = require('@/static/img/account/shibai.png')
            // item.amount = (item.tx_amount || '0.00') / this.mainCoin.decimals + this.mainCoin.alias_name
            item.amount = '0.00'
            item.timestamp = item.timestamp.replace(/T|Z/g, ' ')
            item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item
              .timestamp).getHours() + 8)))
            item.type = 'fail'
            item.txhash = item._id
            switch (item.operate) {
            case 'MsgSend': // 发送失败
              item.showAddress = item.message.to_address
              break
            case 'MesUndelegate': // 取消委托失败
              item.showAddress = item.message.validator_address
              break
            case 'MsgInstantiateContract': // 初始化合约失败
              item.showAddress = item.sender
              break
            case 'MsgExecuteContract': // 调用合约失败
              item.showAddress = item.sender
              break
            }
            return item
          })
        }

        // 处理全部数据
        this.accountTransfer['all'] = res[5].data.data.list.map(item => {
          item = item.tx_response
          try {
            const type = item.tx.body.messages[0]['@type']
            item.amount = 0
            item.from_address = item.tx.body.messages[0].from_address
            item.to_address = item.tx.body.messages[0].to_address
            item.withdraw_address = item.tx.body.messages[0].withdraw_address
            item.delegator_address = item.tx.body.messages[0].delegator_address
            item.validator_address = item.tx.body.messages[0].validator_address
            item.timestamp = item.timestamp.replace(/T|Z/g, ' ')
            item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item
              .timestamp).getHours() + 8)))
            item.tx.body.messages.forEach(cur => {
              if (cur.amount) {
                if (Array.isArray(cur.amount)) {
                  item.amount += Number(cur.amount[0].amount)
                } else {
                  item.amount += Number(cur.amount.amount)
                }
              }
            })
            item.amount = item.amount / mainCoin.decimals + mainCoin.alias_name
            if (type.includes('MsgSend')) { // @tofo 区分是接收还是发送
              if (item.to_address === this.address) { // 领取
                item.type = 'recipient'
                item.plus = true
                item.icon = require('@/static/img/account/shoukuan2.png')
                item.showAddress = item.from_address
              } else { // 发送
                item.icon = require(
                  '@/static/img/account/fasong2.png')
                item.plus = item.to_address == this.address ? true : false
                item.type = 'sender'
                item.showAddress = item.to_address
              }
            } else if (type.includes('MsgDelegate')) { // 委托
              item.icon = require(
                '@/static/img/account/weituo2.png')
              item.showAddress = item.validator_address
              item.type = 'delegate'
            } else if (type.includes('MsgUndelegate')) { // 取消委托
              item.icon = require('@/static/img/delegate/fasong2.png')
              item.showAddress = item.validator_address
              item.type = 'delegate'
            } else if (type.includes('MsgWithdrawDelegatorReward')) { // 领取奖励
              item.raw_log.replace(
                /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                  p1) => {
                  item.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })
              item.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
                item.withdraw_address = p1
              })
              item.icon = require(
                '@/static/img/account/lingqu.png')
              item.plus = item.withdraw_address == this.address ? true : false
              item.showAddress = item.withdraw_address
              item.type = 'withdraw'
            } else if (type.includes('MsgSetWithdrawAddress')) { // 设置领取地址
              item.raw_log.replace(
                /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                  p1) => {
                  item.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })
              item.raw_log.replace(/"key":"withdraw_address","value":"([0-9a-z]*)"/, (match, p1) => {
                item.withdraw_address = p1
              })
              item.icon = require(
                '@/static/img/account/lingqu.png')
              item.plus = item.withdraw_address == this.address ? true : false
              item.showAddress = item.withdraw_address
              item.type = 'setWithdrawAddress'
            } else if (type.includes('MsgExecuteContract')) { // 调用合约
              item.type = 'executeContract'
            }


          } catch (e) {
            console.log(item)
          }
          return item
        })

        if (this.accountTransfer['sender'].length == Number(this.pagination.sender.total)) {
          this.pagination.sender.nodata = true
        }

        if (this.accountTransfer['recipient'].length == Number(this.pagination.recipient.total)) {
          this.pagination.recipient.nodata = true
        }

        if (this.accountTransfer['delegate'].length == Number(this.pagination.delegate.total)) {
          this.pagination.delegate.nodata = true
        }

        if (this.accountTransfer['withdraw'].length == Number(this.pagination.withdraw.total)) {
          this.pagination.withdraw.nodata = true
        }

        if (this.accountTransfer['all'].length == Number(this.pagination.all.total)) {
          this.pagination.all.nodata = true
        }

        // if (this.accountTransfer['fail'].length == Number(this.pagination.fail.total)) {
        //   this.pagination.fail.nodata = true
        // }

        this.accountTransfer['fail'].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        // this.accountTransfer['all'].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        // #ifndef APP-PLUS 
        console.log(this.accountTransfer)
        // #endif
        this.loading = false
      })
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
    setLockAmount({
      result
    }) {
      let lock = 0
      result.delegationResponses.forEach(item => {
        lock += Number(item.balance.amount)
      })
      this.lockAmountLoading = false
      this.lockAmount = lock / mainCoin.decimals
    },
    async loadMore(type) {
      if (this.pagination[type].loading || this.pagination[type].nodata) return
      this.pagination[type].loading = true
      this.pagination[type].page += 1
      let result
      try {
        switch (type) {
        case 'sender':
          result = (await txsQuery([`events=message.module='${'bank'}'`,
            `events=transfer.sender='${this.address}'`,
            'order_by=ORDER_BY_DESC',
            `pagination.offset=${this.pagination[type].page * this.pagination[type].size}`,
            `pagination.limit=${this.pagination[type].size}`
          ])).data.tx_responses
          break
        case 'recipient':
          result = (await txsQuery([`events=message.module='${'bank'}'`,
            `events=transfer.recipient='${this.address}'`, 'order_by=ORDER_BY_DESC',
            `pagination.offset=${this.pagination[type].page * this.pagination[type].size}`,
            `pagination.limit=${this.pagination[type].size}`
          ])).data.tx_responses
          break
        case 'delegate':
          result = (await txsQuery([`events=message.module='${'staking'}'`,
            `events=message.sender='${this.address}'`, 'order_by=ORDER_BY_DESC',
            `pagination.offset=${this.pagination[type].page * this.pagination[type].size}`,
            `pagination.limit=${this.pagination[type].size}`
          ])).data.tx_responses
          break
        case 'withdraw':
          result = (await txsQuery([`events=message.sender='${ this.address }'`,
            'events=message.module=\'distribution\'',
            'order_by=ORDER_BY_DESC',
            `pagination.offset=${this.pagination.withdraw.page * this.pagination[type].size}`,
            `pagination.limit=${this.pagination.withdraw.size}`
          ])).data.tx_responses
          break
        case 'fail':
          result = (await getFailRecord({
            'chain_id': 'ghmdev',
            'limit': this.pagination[type].size,
            'index': this.pagination[type].page,
            'address': this.address
          })).data.data.list
          break
        case 'all':
          result = (await getRecordList({
            'address': this.address,
            'limit': this.pagination.all.size,
            'index': this.pagination.all.page
          })).data.data.list
        }
        if (type == 'fail') {
          for (let i = 0, len = result.length; i < len; i++) {
            const item = result[i]
            item.icon = require('@/static/img/account/shibai.png')
            // item.amount = (item.tx_amount || '0.00') / this.mainCoin.decimals + this.mainCoin.alias_name
            item.amount = '0.00'
            item.timestamp = item.timestamp.replace(/T|Z/g, ' ')
            item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item.timestamp)
              .getHours() + 8)))
            item.type = 'fail'
            item.txhash = item._id
          }
        } else if (type == 'all') {
          result = result.map(item => {
            item = item.tx_response
            try {
              const type = item.tx.body.messages[0]['@type']
              item.amount = 0
              item.from_address = item.tx.body.messages[0].from_address
              item.to_address = item.tx.body.messages[0].to_address
              item.withdraw_address = item.tx.body.messages[0].withdraw_address
              item.delegator_address = item.tx.body.messages[0].delegator_address
              item.validator_address = item.tx.body.messages[0].validator_address
              item.timestamp = item.timestamp.replace(/T|Z/g, ' ')
              item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item
                .timestamp).getHours() + 8)))
              item.tx.body.messages.forEach(cur => {
                if (cur.amount) {
                  if (Array.isArray(cur.amount)) {
                    item.amount += Number(cur.amount[0].amount)
                  } else {
                    item.amount += Number(cur.amount.amount)
                  }
                }
              })
              item.amount = item.amount / mainCoin.decimals + mainCoin.alias_name
              if (type.includes('MsgSend')) { // @tofo 区分是接收还是发送
                if (item.to_address === this.address) { // 领取
                  item.type = 'recipient'
                  item.plus = true
                  item.icon = require('@/static/img/account/shoukuan2.png')
                  item.showAddress = item.from_address
                } else { // 发送
                  item.icon = require(
                    '@/static/img/account/fasong2.png')
                  item.plus = item.to_address == this.address ? true : false
                  item.type = 'sender'
                  item.showAddress = item.to_address
                }
              } else if (type.includes('MsgDelegate')) { // 委托
                item.icon = require(
                  '@/static/img/account/weituo2.png')
                item.showAddress = item.validator_address
                item.type = 'delegate'
              } else if (type.includes('MsgUndelegate')) { // 取消委托
                item.icon = require('@/static/img/delegate/fasong2.png')
                item.showAddress = item.validator_address
                item.type = 'delegate'
              } else if (type.includes('MsgWithdrawDelegatorReward')) { // 领取奖励
                item.raw_log.replace(
                  /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                    p1) => {
                    item.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                  })
                item.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
                  item.withdraw_address = p1
                })
                item.icon = require(
                  '@/static/img/account/lingqu.png')
                item.plus = item.withdraw_address == this.address ? true : false
                item.showAddress = item.withdraw_address
                item.type = 'withdraw'
              } else if (type.includes('MsgSetWithdrawAddress')) { // 设置领取地址
                item.raw_log.replace(
                  /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                    p1) => {
                    item.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                  })
                item.raw_log.replace(/"key":"withdraw_address","value":"([0-9a-z]*)"/, (match, p1) => {
                  item.withdraw_address = p1
                })
                item.icon = require(
                  '@/static/img/account/lingqu.png')
                item.plus = item.withdraw_address == this.address ? true : false
                item.showAddress = item.withdraw_address
                item.type = 'setWithdrawAddress'
              } else if (type.includes('MsgExecuteContract')) { // 调用合约
                item.type = 'executeContract'
              }
            
            
            } catch (e) {
              console.log(item)
            }
            return item
          })
        } else {
          for (let i = 0, len = result.length; i < len; i++) {
            const item = result[i]
            item.fee = item.tx.auth_info.fee.amount[0].amount / mainCoin.decimals + mainCoin.alias_name
            item.amount = 0
            item.memo = item.tx.body.memo
            item.from_address = item.tx.body.messages[0].from_address
            item.to_address = item.tx.body.messages[0].to_address
            item.delegator_address = item.tx.body.messages[0].delegator_address
            item.validator_address = item.tx.body.messages[0].validator_address
            item.timestamp = item.timestamp.replace(/T|Z/g, ' ')
            item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item.timestamp)
              .getHours() + 8)))
            item.tx.body.messages.forEach(cur => {
              if (cur.amount) {
                if (Array.isArray(cur.amount)) {
                  item.amount += Number(cur.amount[0].amount)
                } else {
                  item.amount += Number(cur.amount.amount)
                }
              }
            })
            item.amount = item.amount / mainCoin.decimals + mainCoin.alias_name
            switch (type) {
            case 'recipient':
              item.icon = require('@/static/img/account/shoukuan2.png')
              item.type = 'recipient'
              item.showAddress = item.from_address
              item.plus = true
              break
            case 'sender':
              item.icon = require(
                '@/static/img/account/fasong2.png')
              item.type = 'sender'
              item.plus = item.to_address == this.address ? true : false
              item.showAddress = item.to_address
              break
            case 'delegate':
              if (item.tx.body.messages[0]['@type'].includes('MsgDelegate')) {
                item.icon = require(
                  '@/static/img/account/weituo2.png')
              } else if (item.tx.body.messages[0]['@type'].includes('MsgUndelegate')) {
                item.icon = require('@/static/img/delegate/fasong2.png')

              }
              item.type = 'delegate'
              item.showAddress = item.validator_address
              break
            case 'withdraw':
              const originType = item.tx.body.messages[0]['@type']
              item.icon = require(
                '@/static/img/account/lingqu.png')
              item.raw_log.replace(
                /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                  p1) => {
                  item.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })

              if (originType.includes('MsgSetWithdrawAddress')) {
                item.raw_log.replace(/"key":"withdraw_address","value":"([0-9a-z]*)"/, (match, p1) => {
                  item.withdraw_address = p1
                })
                item.type = 'setWithdrawAddress'
              } else if (originType.includes('MsgWithdrawDelegatorReward')) {
                item.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
                  item.withdraw_address = p1
                })
                item.type = 'withdraw'
              }
              item.showAddress = item.withdraw_address
              item.plus = item.withdraw_address == this.address ? true : false
              break
            }
          }
        }

        if (type == 'fail') {
          result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        }

        this.accountTransfer[type].push(...result)
        // this.accountTransfer['all'].push(...result)
        if (Number(this.pagination[type].total) == this.accountTransfer[type].length) this.pagination[type].nodata =
            true
        // this.accountTransfer['all'].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

      } catch {
        this.pagination[type].nodata = true
      }




      this.$nextTick(() => {
        this.pagination[type].loading = false
      })


    },
    jumpDetails(hash) {
      uni.navigateTo({
        url: `./transactionDetails?transactionHash=${hash}`
      })
    },
    toDelegate() {
      uni.switchTab({
        url: '/pages/delegate/index'
      })
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
      if (this.sendbtnLoading) return
      uni.navigateTo({
        url: `${url}?tokenID=${this.token.ID}`,
        events: {
          addRecordToSendList: (data) => {
            const typeUrl = data.tx.body.messages[0].typeUrl
            if (typeUrl.includes('MsgSend')) {
              data.type = 'sender'
            }
            data.from_address = data.tx.body.messages[0].value.fromAddress
            data.to_address = data.tx.body.messages[0].value.toAddress
            data.amount = 0
            data.txhash = data.transactionHash
            data.tx.body.messages.forEach(cur => {
              if (cur.value.amount) {
                if (Array.isArray(cur.value.amount)) {
                  data.amount += Number(cur.value.amount[0].amount)
                } else {
                  data.amount += Number(cur.value.amount.amount)
                }
              }
            })

            mainCoin.decimals && (data.amount = data.amount / mainCoin.decimals)
            data.amount += mainCoin.alias_name

            data.icon = require(
              '@/static/img/account/fasong2.png')

            data.timestamp = data.timestamp.replace(/T|Z/g, ' ')


            this.accountTransfer['all'].unshift(data)

            this.accountTransfer['sender'].unshift(data)

            this.$forceUpdate()
          }
        }
      })
    },
    toTokenDetail() {
      uni.navigateTo({
        url: `/pages/account/send/tokenInformation?tokenID=${this.token.ID}`
      })
    },
    toRecordDetail(record) {
      uni.navigateTo({
        url: `./transactionDetails?data=${JSON.stringify(record)}`
      })
    },
    handlerMainCoinBalance(res) {
      this.token.balance = res.res
      this.loadingBalace = false
    },
    handlerUnboundingBlance(res) {
      console.log('锁定结果', res)
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
    txResult(res) {
      this.init() //刷新列表
      this.loadingBalace = true
      this.callMainCoinBalance++
      this.callUnboundingDelegators++
      this.sendbtnLoading = false
    }
  },
  filters: {
    sliceAddress,
    formatBalance(val) {
      const int = (val + '').split('.')[0]
      let float = (val + '').split('.')[1]
      if (float) {
        float = float.substr(0, 6)
      }
      return int + '.' + (float || '000000')
    }
  },
  computed: {
    scrollHeight() {
      const borderHeight = 16 + 32 + 'rpx'
      const operation_btn = '180rpx'
      return `calc(100vh - 112rpx - ${this.mainTokenHeight} - ${borderHeight} - ${operation_btn} - ${this.navHeight} - ${this.systemBarHeight + 'rpx'})`
    }
  },
  onBackPress(e) {
    if (e.from === 'backbutton') {
      uni.switchTab({
        url: '/pages/account/index'
      })
      return true
    }
  }
}
</script>
<script lang="renderjs" module="render">
  import {
    getDelegationRecord,
    getUnbondingDelegationRecord,
    getMainCoinBalance,
    SendTokentoOtherAddress,
    transferOtherToken,
    getOtherTransationHistory
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'
  export default {
    methods: {
      getAddress(address) {
        if (address === '') return
        this.getDelegationRecord(address)
      },
      async getDelegationRecord(address) {
        const result = await getDelegationRecord(address)
        renderUtils.runMethod(this._$id, 'setLockAmount', {
          result
        }, this)
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
      async getMainCoinBalance(val) {
        if (val == 0) return
        let wallet;
        //#ifdef APP-PLUS
        wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
        //#endif

        //#ifndef APP-PLUS 
        wallet = uni.getStorageSync('_currentWallet').data
        //#endif
        const res = await getMainCoinBalance(wallet.address)
        renderUtils.runMethod(this._$id, 'handlerMainCoinBalance', {
          res
        }, this)
      },
      async sendToken(newValue) {
        // console.log('调用',newValue);
        if (!newValue) return
        // return
        let res = {}
        let otherToken = false
        let {
          receiveAddress,
          userAddress,
          sendAmount,
          memo,
          gas,
          gasPrice,
          decimals
        } = newValue
        // let totalGas = new decimal(gas + '').mul(new decimal(gasPrice)).toString()
        if (newValue.token.alias_name == mainCoin.alias_name) {
          sendAmount = sendAmount * mainCoin.decimals
          try {
            res = await SendTokentoOtherAddress(userAddress, receiveAddress, sendAmount, memo, gas,
              gasPrice)
            // console.log('发送结果',res);
          } catch (e) {
            console.log(e);
            res.code = 7
          }
        } else {
          try {
            otherToken = true
            const result = await transferOtherToken({
              sender: userAddress,
              contractAddress: newValue.token.contract_address,
              codeHash: newValue.token.codeHash,
              msg: {
                transfer: {
                  recipient: receiveAddress,
                  amount: sendAmount * newValue.token.decimals + ''
                }
              }
            }, newValue.memo, gas, gasPrice)
            if (result.code !== 0) throw result
            res = (await getOtherTransationHistory({
              contract: {
                address: newValue.token.contract_address,
                codeHash: newValue.token.codeHash
              },
              address: userAddress,
              auth: {
                key: newValue.token.view_key
              }
            }, {
              page_size: 1,
              page: 1
            }, newValue.token)).transaction_history.txs[0]
            console.log('record', res)
            for (let val of Object.values(res.action)) {
              res.to_address = val.recipient
              res.from_address = val.from
              res.sender = val.sender
            }
            res.type = res.to_address == userAddress ? 'recipient' : 'transfer'

            res.amount = res.coins.amount / newValue.token.decimals + newValue.token.alias_name
            res.timestamp = new Date(res.block_time * 1000).toLocaleString()
            res.code = 0
          } catch (e) {
            console.log(e);
            res.code = 7
          }
        }
        console.log('结果', res);
        // renderUtils.runMethod(this._$id, 'dealSuccessJump', {
        // 	res,
        // 	otherToken
        // }, this)
        renderUtils.runMethod(this._$id, 'txResult', res, this)
      },
    }
  }
</script>


<style lang="scss" scoped>
  .loading {
    margin-top: 100rpx;
  }

  .token_content {
    padding-top: calc(112rpx + var(--status-bar-height));
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
        font-weight: 600;
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
    border-top: 2rpx solid rgba(131, 151, 177, 0.20);

    button {
      width: 152rpx;
      height: 80rpx;
      font-weight: 400;
      font-size: 28rpx;
      background: rgba(255, 255, 255, 0.00);
      border: 2rpx solid rgba(131, 151, 177, 0.31);
      border-radius: 16rpx;
      line-height: 80rpx;

      &:after {
        border: 0 !important;
      }

      &:nth-child(1) {
        background: #265EF2;
        color: #FCFCFD;
        display: flex;
        align-items: center;
        justify-content: center;
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

    .border {
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

  .loading-more {
    height: 120rpx;
    line-height: 90rpx;
    text-align: center;
    font-size: 28rpx;
    color: #2C365A;
  }
</style>

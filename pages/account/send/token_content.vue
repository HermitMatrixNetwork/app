<template>
  <view class="token_content">
    <view :initSecretClient="initSecretClient" :change:initSecretClient="callInitSecretClient"></view>
    <custom-header tabUrl="/pages/account/index" :title="token.alias_name">
      <template #right>
        <text class="customIcon" @click="toTokenDetail()">{{ language.text69 }}</text>
      </template>
    </custom-header>

    <view class="main_token">
      <TokenColumn :tokenIcon="token.logo" :tokenName="token.alias_name" :tokenColumnStyle="tokenColumnStyle">
        <template #right>
          <view style="padding-right: 16rpx;" class="token_price">
            <view class="balance" v-if="token.balance === undefined || lockAmount === null || unBoundingBalance === null">0.00</view>
            <!--            <custom-loading v-if="token.balance == null || lockAmount === null  || unBoundingBalance === null">
            </custom-loading> -->
            <view v-else class="balance">
              {{ (new decimal(token.balance + '').add(new decimal(lockAmount + '')).add(new decimal(unBoundingBalance +
                  '')).toString()) | formatBalance
              }}
            </view>
            <view v-if="token.balance !== null && lockAmount !== null && unBoundingBalance !== null">
              <text class="symbol">$</text>
              <text>{{ (new decimal(token.balance + '').add(new decimal(lockAmount + '')).add(new
                  decimal(unBoundingBalance + '')).toString()) || `0.000000` | formatBalance
              }}</text>
            </view>
          </view>
        </template>
      </TokenColumn>
      <view class="token_details">
        <view class="available">
          <text>{{ language.text57 }}</text>
          <view class="quantity">
            <custom-loading v-if="token.balance == null"></custom-loading>
            <view class="top" v-else>{{ token.balance | formatBalance }}</view>
            <view class="bottom" v-if="token.balance !== null">
              <text class="symbol">$</text>
              <text>{{ (token.balance || `0.000000`) | formatBalance }}</text>
            </view>
          </view>
        </view>
        <view class="lock">
          <text>{{ language.text58 }}</text>
          <custom-loading v-if="lockAmount === null || unBoundingBalance === null"></custom-loading>
          <view v-else class="quantity">
            <view class="top">
              {{ (new decimal(lockAmount + '').add(new decimal(unBoundingBalance + '')).toString()) | formatBalance }}
            </view>
            <view class="bottom">
              <text class="symbol">$</text>
              <text>{{ (new decimal(lockAmount + '').add(new decimal(unBoundingBalance + '')).toString()) || `0.000000`
                  | formatBalance
              }}</text>
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
        :style="{ height: scrollHeight }">
        <swiper-item v-for="(item, index) in list" :key="item.name" :item-id="index + ''">
          <!-- @scrolltolower="loadMore(item.type)" -->
          <scroll-view scroll-y class="scroll-container" :style="{ height: scrollHeight }">
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
                      {{ ['fail', 'setWithdrawAddress', 'executeContract', 'instantiateContract', 'MsgUnjail',
                          'RaAuthenticate', 'MsgStoreCode', 'MsgCreateValidator'].includes(record.type) ? '' : (record.plus
                            ? '+' : '-')
                      }}
                      {{ record.amount }}
                    </view>
                    <view class="real-money">
                      <text class="rate">$</text>
                      <!-- <text class="money">0.00</text> -->
                      <text class="money">{{ record.amount.slice(0, -3) }}</text>
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
    <view :callUnboundingDelegators="callUnboundingDelegators"
      :change:callUnboundingDelegators="render.getUnbondingDelegationRecord">
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
  </view>
</template>

<script>
// 究极不可维护代码之无脑复制黏贴☢
import TokenColumn from './components/TokenColumn.vue'
import mixin from '../mixins/index.js'
import decimal from 'decimal'
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
  getRecordList,
  getSendRecord,
  getReceiveRecord,
  getDelegateRecord,
  getUndelegateRecord,
  getAllRecord,
  getWithdrawRecord
} from '@/api/record.js'
import {
  getFailRecord,
} from '@/api/browers.js'
import language from '../language/index.js'
// import {
//   senderTest,
//   receiverTest,
//   delegateTest,
//   undelegateTest,
//   jiangliTest,
//   allTest
// } from '../../../../交易记录测试数据.js'
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
        icon: '/static/img/account/fasong2.png'
      }, {
        name: language[this.$cache.get('_language')].text65,
        type: 'recipient',
        icon: '/static/img/account/shoukuan2.png'
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
      lockAmount: 7,
      mainCoin,
      mainTokenHeight: '0rpx',
      navHeight: '0rpx',
      systemBarHeight: '0rpx',
      callMainCoinBalance: 0,
      sendTokenMessage: false,
      sendbtnLoading: false,
      unboundingBlanceLoading: true,
      callUnboundingDelegators: 0,
      unBoundingBalance: 0.248889,
      decimal,
      initSecretClient: 0
    }
  },
  async onLoad(options) {
    let obj = options.sendToken ? JSON.parse(options.sendToken) : false
    console.log('获取的数据', obj,this.token)
    this.sendbtnLoading = !!obj
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
    const wallet = this.$cache.get('_currentWallet')
    this.loadingBalace = true
    setTimeout(() => {
      this.sendTokenMessage = obj
    }, 1000)
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
    this.unboundingBlanceLoading = true
    if (this.$cache.get('_tokenContent_unBoundingBalance_data') !== undefined) {
      this.unBoundingBalance = this.$cache.get('_tokenContent_unBoundingBalance_data')
    } else {
      this.unBoundingBalance = null
    }
    if (this.$cache.get('_tokenContent_accountTransfer_data')) {
      console.log('cache')
      this.loading = true
      const temp = this.$cache.get('_tokenContent_accountTransfer_data')
      if (Object.values(temp).filter(item => item.length > 0).length == 0) {
        this.loading = false
        this.accountTransfer = {
          'sender': [],
          'recipient': [],
          'delegate': [],
          'withdraw': [],
          'fail': [],
          'all': []
        }
      } else {
        setTimeout(() => {
          this.accountTransfer = this.$cache.get('_tokenContent_accountTransfer_data')
          this.loading = false
        }, 1000)
      }

    } else {
      console.log('no cache')
      this.loading = true
      this.accountTransfer = {
        'sender': [],
        'recipient': [],
        'delegate': [],
        'withdraw': [],
        'fail': [],
        'all': []
      }
    }
    setTimeout(async () => {
      this.callRenderDelegateRecord = this.address
      this.callUnboundingDelegators++
      this.callMainCoinBalance++
      await this.init()
    }, 1000)
  },
  onPullDownRefresh() {
    this.unboundingBlanceLoading = true
    this.lockAmountLoading = true
    this.loadingBalace = true
    if (this.$cache.get('_tokenContent_unBoundingBalance_data') !== undefined) {
      this.unBoundingBalance = this.$cache.get('_tokenContent_unBoundingBalance_data')
    } else {
      this.unBoundingBalance = null
    }
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
  onHide() {
    uni.stopPullDownRefresh()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  onShow() {
    // if (getApp().globalData.secretClient == null) {
    //   this.initSecretClient = 1
    // } else {
    //   this.initSecretClient = getApp().globalData.secretClient
    //   this.$nextTick(() => {
    //     this.initSecretClient = 0
    //   })
    // }
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == this.token.ID)
	// console.log(this.token,111111111)
    if (this.$cache.get('_tokenContent_locakAmount_data') !== undefined) {
      this.lockAmount = this.$cache.get('_tokenContent_locakAmount_data')
    } else {
      this.lockAmount = null
    }
    if (this.$cache.get('_tokenContent_unBoundingBalance_data') !== undefined) {
      this.unBoundingBalance = this.$cache.get('_tokenContent_unBoundingBalance_data')
    } else {
      this.unBoundingBalance = null
    }
    if (this.$cache.get('_tokenContent_balance_data') !== undefined) {
      this.token.balance = this.$cache.get('_tokenContent_balance_data')
    } else {
      this.token.balance = null
    }
  },
  created() {

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
        //发送
        getSendRecord({
          'address': this.address,
          'index': this.pagination.sender.page,
          'limit': this.pagination.sender.size,
        }),
        //收款
        getReceiveRecord({
          'address': this.address,
          'index': this.pagination.sender.page,
          'limit': this.pagination.sender.size,
        }),
        //委托
        getDelegateRecord({
          'address': this.address,
          'index': this.pagination.sender.page,
          'limit': this.pagination.sender.size,
        }),
        //取消委托
        getUndelegateRecord({
          'address': this.address,
          'index': this.pagination.sender.page,
          'limit': this.pagination.sender.size,
        }),
        //奖励
        getWithdrawRecord({
          'address': this.address,
          'index': this.pagination.sender.page,
          'limit': this.pagination.sender.size,
        }),
        getFailRecord({
          'chain_id': 'Hermit',
          'limit': this.pagination.fail.size,
          'index': this.pagination.fail.page,
          'address': this.address
        }),
        getRecordList({
          'address': this.address,
          'limit': this.pagination.all.size,
          'index': this.pagination.all.page
        })
      ]).then(res => {
        // console.log(res);
        if (this.pagination.sender.total == 0) {
          this.pagination.sender.total = res[0].data.data['total']
          this.pagination.recipient.total = res[1].data.data['total']
          this.pagination.delegate.total = res[2].data.data['total']+res[3].data.data['total']
          this.pagination.withdraw.total = res[4].data.data['total']

          // @toFixed 接口分页查找有重复的数据 暂不支持分页
          // this.pagination.fail.total = res[3].data.data.total
          // this.pagination.fail.nodata = true
          // this.pagination.all.total = res[5].data.data.total

          // #ifndef APP-PLUS          
          // console.log(res[4])
          // #endif
        }
        //测试数据代替请求
        // let newTestArray = [{ 'data': { 'data': { 'list': senderTest } } }, { 'data': { 'data': { 'list': receiverTest } } }, { 'data': { 'data': { 'list': [...delegateTest, ...undelegateTest] } } }, { 'data': { 'data': { 'list': [] } } }, { 'data': { 'data': { 'list': jiangliTest } } }]
        let accountTransfer_Copy = {
          'sender': [],
          'recipient': [],
          'delegate': [],
          'withdraw': []
        }
        // newTestArray.forEach((result, index) => {
        // if (index == 5 || index == 6) return
        res.forEach((result, index) => {
          // console.log(type);
          if (index == 5 || index == 6) return
          //模拟交易数据
          // let RecordList = test
          let RecordList = result.data.data.list
          if (RecordList) {
            RecordList.forEach((item) => {
              item.fee = item.tx.auth_info.fee.amount[0].amount / mainCoin.decimals + mainCoin.alias_name
              item.amount = 0
              item.memo = item.tx.body.memo

              item.txhash = item.tx_response['txhash']
              item.from_address = item.tx.body.messages[0].from_address
              item.to_address = item.tx.body.messages[0].to_address
              item.withdraw_address = item.tx.body.messages[0].withdraw_address
              item.delegator_address = item.tx.body.messages[0].delegator_address
              item.validator_address = item.tx.body.messages[0].validator_address
              item.timestamp = item.tx_response.timestamp.replace(/T|Z/g, ' ')
              item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item
                .timestamp).getHours() + 8)))
              item.tx.body.messages.forEach(cur => {
                if (cur.amount) {
                  if (Array.isArray(cur.amount)) {
                    item.amount += Number(cur.amount[0].amount)
                  } else {
                    item.amount += Number(cur.amount.amount)
                  }
                } else if (cur.outputs) {
                  item.amount = Number(cur.outputs[0]['coins'][0].amount)
                  // console.log(item.amount);
                }
              })
              item.amount = item.amount / mainCoin.decimals + mainCoin.alias_name
              switch (index) {
                case 0:
                  item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAh1BMVEWFmbgAAACDmLp3ksCKm7YeXv+dp6rp1nOTmblwjMeRmcSMnLwhYv28tZnIwoyOmrseXv+Ml7kfYP5jhs4vaPQ5be47b+smY/r/8kggX/4gYP00a/FFducfX/8hYfwlYvpMeeEgX/4jY/skY/spZPkqZPlfhNg1a/AjYfwyafQfX/8oZfkdXv/Z8ExCAAAALHRSTlMZABocFvgUDQYgCRK+EQ8L+w7mJGhNSJUJ2tBYO+PFoTLXr6yKfihVsWHsiwfiGJoAAANXSURBVFjDtZjplqowDIBz21gKCIgs4u64zszt+z/fDYzjBVMEDsccf7D1M83WtPDnhWgv9hERABH92NOvvoVWSOQjCCHgLuUl+pEeCPL8OqQO870BoBj/QzgM456giGEYKuoB0sgpnIW6CxRzbexaxQw0VB2uFAdpIE5vEug2kAcDxbODIjEUJCIbyCPOYJLHQGxeQ2cHQ+3MLd4E+YzTk4RNUPyCw7NX1K/jOki3MaQERIXiPh7v0iDrGqgloCU6IbjXQ6IqjhLujyQK2eSgNYKEBCdZ/51uJ7PvLJDE2ezmlXybhRL1aHqA0OoPx718mFJmZkEgWezp6kcmSX0OWIFaFJIK0uXvsG1WgsJ0UlHp9+3ic4CD3UIyTD6rQctFus4OQfWFyr9uX/MSPW+C8AfkWTjBZmUmZnLKZVA4zq9FgiI+mhkDVZkCtliU4WZOnF0WBCBJxK8T3SlRtjMG8kuQ5nZWyYr+eC8dKRtmk1PCH7+YRgCaQJElbo804OygBM6ZhjcOInMDn5l0UhqwD4WV4xZMo2puYPGZS+Gzk2DlSAxysp5gqQsamEIXcnzm2DlKCpXuN+qJRBiPwcnS5hS2ceguLBhHeBCLZ4XWpFAeylZOGRHM0TH4z6DwTPHcro9dhA88YaemTNL6ZN0ax64RIAOhuzUmLeqgYNHgiMAJOIjX4Cvl+LrhMzyaOkdli4xZ25IeB0rWvA6iiva5cB/zUoelmScohoPomQpQPrya0QcHrpJ9aoVsriNSNMJjcmUadRibiyxSqiQuG9bpfl7zFmR67rXOgOQkKuXnULKA7EgRXjxzqrU35xkUdyUtB52MWTHvC6+jjPCXGSl04S/1y8LGOSB3xny4PGhel1rGEeGeXqVMIeF3FH/WU5zLZQSADYkGLEeSbmn1J0tb0kP3WiArgSDIdvRwvuEOFX6/JZukCGR+ogdmtbEEvfD6NRF5vk4Xy+r2MwktHOzb1kzuF8sUlLT17d2N1sw8ZPZxcR1rE409Wr9b2fqRbKd/b4kD0vph1LsZPVxdCB9hxSzUvz1WiCBJG7voAQ07f2tv2ElwxBbiDZuaMdusd2z8xm9Fx2+O371dJ5IvenN8/e4jjfGHLOOPfcYfRI0/Gnv/Yd3448N/ZrdPadzj92UAAAAASUVORK5CYII='
                  item.type = 'sender'
                  item.plus = item.to_address == this.address ? true : false
                  item.showAddress = item.to_address
                  break;
                case 1:
                  item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAflBMVEWJnbEAAACBoLCOnLPAjbyQn7EXxJmqk7qRpLfje8P/bdCKlLoXxJmLoLVspq11o68axJphrao1u6FQsqYYxJofwpwZxJowvZ8fwpscw5s3uqEYxJkbw5oiwpwZxJocw5ofwZslwZ0mwJwqvpxKtacdxJwqv51FuqQfwpwWxJlh+xLYAAAAKXRSTlMaABwXEgz5FAkPDAX8EiIe0CdPMOSe2ligwEn1xovVsJOAeWszrWg7mOn8+fMAAAM8SURBVFjDtZiJkqIwEECznQQI54CMiseo65n//8HtwJYgHQIOZVtlzaA8H52mScL+OCKSMuGcM4ZviZSR67tsEIIMBvhqov4TadF7oChIzKkk8FASRNNBkrcQCuNyIkhyNhJcTgAFxMZqFYyBJJsY0gmKiI5DKhoGBZy9ETwYAgXszQgIiKTn/UQx4vNLJzaLg6Q+KOK/A/GoB+LwOxDwV5B0cADARZJdUOBgcO67dYMOiA95h4ql+SX3X+D9NLUgabdhYbraV+XWKwsBLVxwWzWxISFgKj39xBoj1scnCPy0SH2gSmxACHx+XuomOkYgFl+6AosSswuByA9GRS+Pt1Wx8DscBC+okgEFYOHcv7SnvesGRBiqDucHDz96HAZBDUooR91LPGFXCMEgA2g5Bv9NyyExoMiSn9ycsM5UgwDo+qyFpawiBEnLM+eAJ+wVh/9cH3o+JCSCEiAXdjY/rNhT5CKg9bE+7xIE0TFLcdx32ZNTlDj8GfHpjRuLCD084cAX6pnhh8Zx8rs+NBDTH3zgKZbKtVPK31qvQ+LTLwAmidAKhTavoEfu9mGISUiq91jPGWNd0GFX+wxzEENzXWlzk3ZBsRfH+ht9hjsdJyCellrfwuwFhC/0YQ0ehBIURHtZvtV6FcIrSG+raletDAn84lH4MNrM/YuntxsF7RHMT4yXhrivlAP4i6Uucw7vgkDURtqADiY/qsC2cKFK45eW/z39reOMfagpjy01ciW7fQKETRiNLLxpXWbktNHhR1Ib9aUeta7oqI0VJI1sqbHFkNY2dovQJryJ2xy2IcduWgq6alMGpGuPtRFy4QUKnYgQi5yNjXJYtsMMpjTX7lZLOWqNH52JLSTu5k/ShyPq1fVNm//446gtJ5UZn6/ccntEEx+Q+MaEKEx7K++KcpKJj2y8RQRsrp7xuQvL14Npk4jNZnU7Lut/D7mtwPjUaY2nm1ieubV9yIkTrSbin1OqmI3DJ0/9vG1Z7VdpaI7ZhCZPRi95ylQ41F359Omxz7ljth28MWF3fSo/sISYt6j5wDJrDin43FJ0/uJ4/nJ9/gbCp7c05m+yzN/2mb8RNX9r7PObdfO3D/8Bd5pJv5d1m3sAAAAASUVORK5CYII='
                  item.type = 'recipient'
                  item.showAddress = item.from_address ? item.from_address : item.tx.body.messages[0].inputs[0].address
                  item.plus = true
                  break;
                case 2:
                case 3:
                  item.type = 'delegate'
                  if (item.tx.body.messages[0]['@type'].includes('MsgDelegate')) {
                    // item.icon = '/static/img/account/delegate2.png'
                    item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAbFBMVEWFmbgAAACjr6EtYu17lL+Hm7iSmb+bpqvPx4onXvKOmb1yjcaMnLyOmbYnXvIsYu4tY+4wZO0oX/ArYfArYfAsYe746mksX+8nXvErYO4uY+4wZO01Z+pAbONFcuE7auUyZusvZO3//yQnXvELw1z4AAAAI3RSTlMZABKeGxYLFQ78Bx8SDvmhmoLfvbanC7vvuZWKb0lBV4CPB4lby2AAAAKBSURBVFjD3djZepswEAXgKdZIQojV4MR7knn/dyxO4+IBBJMqvum5ROb/tFhogV8LcTr3iAiAiD7Xbum3YUh7hFHQawnEFQiEWWtQjrAQzIWQRlgJagHkEARBtwblIEy+DCGIgwuQg2/FhSAN34weQYMTIQFzIiQI9I/qwx+s9BPMOgrsziYs1qiAxCHPnMScT8dDtRlS1tm8hBzKmWMv+4J4UtoGpPwRcty5vlI6hlJ6CUjuAULWrsvNadqu3NxTNQt1wgHiI2/2lBZ1hia5x+yq3gnWSf+FkDXsXBDVH6yxZtO3LVgnvEOavbQ7ETUZsCQboq6lIlAn/QUhg+yRqMUpVMGWivk64R9Ij146EHVmCpU224bqpD8hP3qpIiqTKbQxJnsJ1Ml/QjDz0iyUmWwbGLsbpKWQNcZCO18n3UN+HVL2nai5zbiq+/o/AY/vIZRAV0rT+1xJC6qtGo8bOAhA/OE7m8DluLxntJJAkFzfq2HeTcqVhhxEEFg7zLtpec94IaTUMO9myj3gGiQrx5+DIAoa8j9DS53Nl1f176NmLF9rFyEfhkz2Vj6stW+ZCUN+YYooW1P6OFVrq4JQDlpFQcOkdT/TNDd82KI6G4dPbdzwe9nHf71cD8tRHBRcIJegkqgalfuZJVvxJXsa0xEdEsVbJttE8GBLdLQMQuG2hidriE47BmnZRovnoyYqzqxGKNn68RjM6iKlveE9JNiM8pRd2/RFrxfW1yjdHvP0zpV3tZNu2HmK/YU7OT9CYOAIwVIdjqezSZiD0kMNT/8YmANOeMxae+qed/CLP4pGSPo5x3UWL2f806804i9Z4q994i+i4q/Gnn9ZF399+BuQ3UgMU32hbQAAAABJRU5ErkJggg=='
                    // item.type = 'delegate'
                    item.plus = false
                  } else if (item.tx.body.messages[0]['@type'].includes('MsgUndelegate')) {
                    // item.icon = '/static/img/account/undelegate.png'
                    item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAbFBMVEWJnrEAAAAfwpu0jL94oK6RnrGLnLLdgMCQnq+nlLeIn7sXxZkewZyVo7WLoLUbwpsjwJyqkb4gwpv/b9Ecwpsfw5siwpwYxJkcw5oYxJoaw5oovZ00vaE9uaFsqKkhwZwwvJ8kv5tmqKgWxJmAAELNAAAAI3RSTlMaAJ4THRYYDw0VB/qgChK9gxOWDLanjOG579ZwSUIig1iAIwaP6y4AAAKtSURBVFjDtdjpdqowEADgqWSysRRwr2ub93/HO1xbZQgh8aDzS4N8nEwcssDHRNhSVyglgJRY6dJO/TYMkQGDIO1ZqKwkjIasyicgjTARqBMhLSESUidAFiEh0MYgDYmhJyGLkBxow5CV8ERIG4JKeDLKPsScGRLMcUjyIQssBAVvGJfsELKS36WWKmuyXigUgYxzCJmTmeNh0y56UdRnMyohhzRz1GmXu2F8inFJ9yHLneveY/I8KNkehKxfp73L3Xa1Lop7z76cC0r4gHiBmR3dVQtp7sk2akFOUNJ3SLKOHSk/9ZK1mcJNSPIP4pleHpzbCl512cK59Soo6V8Ieao3zq0keFArP0MS3qBycFNLTzc+VCgRlMr/UMUbm+6mzIcWiEGp6iDrdSMAGRGUpCVIw8hNY5AyqCCQcU1QFYT4AGy7imvXOUm7Mw77RhCmQFd3j066KDEcN7AQh6hx4/pUMbxOTJkEQXNtH3XnXydGp0Gg1KPu/OvEVImQEI+6868Tg1GIjPiDEGQUQqUwCsk4hD+Xyw/GIYhAQtXO1UrEchiFICtY7YWgcNf495k5Er/DXZju0zSEExCqvz+gMt1cOzn8VRjC83dxK4mvrvK/zxiGqmCJ3MYr75cqjV0IIqZ8CUSMfUnXiPnAVyQb2at2xvBXBOlX/CF1fDryS6TwIWlDE2QTLtqmg5phz/wpW/Ap23+NmLVzbSb44McXEf6LTa6c2ygGYeKyRoi+I7bOHZYM0qkLrb6zpJTlR8XshKUfj8ZIUdNjdoaPfcJilEVRrFdburQ/sVxj+vKYx/7KU21TF+w88t2JOzptC8Gj3RyOJmMOJm1qeFADNQNzpE3cZsVa7fs2fvO3ojOk8r3b9fkHCPOPNOYfssw/9nn1QdT8o7H3H9bNPz78B9tTUDnoPZNdAAAAAElFTkSuQmCC'
                    // item.type = 'undelegate'
                    item.plus = true
                  }
                  item.showAddress = item.validator_address
                  break;
                case 4:
                  const originType = item.tx.body.messages[0]['@type']
                  // item.icon = '/static/img/account/lingqu.png'
                  item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAq1BMVEWFma0AAAB/krF0i7f89l/R1n8BMv+HmrGSmbCLmailsJsBMv+3wY+Mn7KPnbr//0ciTOwDM/6OmbaUpqQDM/8UQfVCY9oEM/4NPPkPPfb//ysIOPwLOfoyV+MCMv8KOPoTP/QCMv8HNvwsUeU2W+BRb88FNP0QPvf//w0DNP4GNf0UQfUlTusOPPgdR+8fSe46Xt4MOvkVQvIbR/AJOPsbRe8IN/wINvwBMv9VNs8jAAAAOHRSTlMZABocDRD7FQsIFP0SEQULUO4OFupzL+aNhAqynjzypXb1wkE4KNKACd3KcUqIWVQ1lWxcq1+4twEf5eQAAAP2SURBVFjDtZhpc6MwDIa9NsYcBpqQhiNXczVJ0/Tatqv//8tW5ChgA6Flqg+ZIWYeXsuSLJv8aTDb6ntCEDQhvL5lN71bC/ItTxBKcsMH4Vn+90C+7ZGcUmQRz/bbg/qC5hSVRUW/JchStei6rBYgW5AWJuxroD5paf1GkC9IaxN+Pcgm3zJbA+WcH5B0kEW/C6JWGZRzOpBIPq8fma2CfPJD8xWQqBPPGEXLfqvHRRnUr6FQHqQcLQgkYbQpMkm9gyh1Ujl5fotf4/j2eRKmDm1wE6mdGON8lSwGcDJ3sNi8yOoQz0FWVYYbk/EcSmZuOD0NlouV9QWqksPiKbioZHo/mr2P7ucumHDPQppxJGMOKdgFZFVwJg9guhDNPtYsdJyQrZ9mOzOWGYcZN7vdUtKyJFLlIWY8DlDAIBlueZh5nZCQb4dLEp44PRdiXgCJE8immp4jZzQMnEv4IIw5nNATB1zzbxFE7SPIU/3MJwNw3UQiphwOF44Je14a8jKQr60XW+Crd6leur/03BrKmI8gS3s3Rk6SsjqOCchRBi0EeVSd2NSFkaTf0EOo94f4QvXQGGAwdJr16AWc2ArHWWHsJQFr1KMZYpTCyNIEYIeCmvXopZL0lYyXC4DZln3VkTLnrIepghHj6TEEH5fkdLaSVuihnCuqECPK+oNngOk6pEeOHL6tONP0EGe5dFRvq6D0DTDJL5H5CdGNwY6cQUHPX/OSIjlIS48YYBSeJ7beAfSQVNZD5RhgLJXJaaBX9LVDzw/7rAbcGLmeJpCu6P2y+NS4M03oPT7meo5KZwCvqrsbpoZPSEIpUZQlcSF+PgESNSy1Vbs9OTsnmS6aWeTQB4C9EvuiavnnuPxFTa5b1INrMAV4UkFqQMqsqD1xWtC0n8/3OSdbfReileJsT0uRMEuRlBX+4cslR04uegywUMtMX0vaYKMkrZIQGO4RwCFlStLqZeQlKyMGK8KZ8iV3qpUH+3ph0z40ABhzqha2qlLbAxg5ig9y34/A7S0VEPWqin9wLP5bRis4LEjArCigVsV2RM7bUUCprmebZd8D0/u26g1yhTnhJlzdIJnDD6aZx1BuXr5la9VZ37KlMRzh39NHQ1VE7eYmItoUm4hguEH8qdIpJurbGgPbmmwW4481zdoaim1NBC7650XnEKux0TocGy2Y3v87N1r4OIhxgGh2pfVbjqdQsvlsUtlZWFeb0ZfDIjpD3OhhM5SyKrhEq/Z49fR2eI2Tu+dVGNREu92qYZdpakhuBIGkLRp2NEGvHCHqxsWvHGq6H7O6H/x+7yja/XDc/bje/QLht680ul+ydL/26X4R1f1q7Pcv67pfH/4H7tBmclAtyEsAAAAASUVORK5CYII='
                  item.type = 'withdraw'
                  if (originType.includes('MsgSetWithdrawAddress')) {
                    item.tx_response.raw_log.replace(/"key":"withdraw_address","value":"([0-9a-z]*)"/, (match, p1) => {
                      item.withdraw_address = p1
                    })
                    // item.type = 'setWithdrawAddress'
                  } else if (originType.includes('MsgWithdrawDelegatorReward')) {
                    item.tx_response.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
                      item.withdraw_address = p1
                    })
                    // item.type = 'withdraw'
                  }
                  item.tx_response.raw_log.replace(
                    /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                      p1) => {
                    item.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                  })
                  item.withdraw_address = item.withdraw_address?item.withdraw_address:this.address
                  item.plus = item.withdraw_address == this.address ? true : false
                  item.showAddress = item.withdraw_address
                  break;
              }
              //将处理好的数据添加到对应的数组里面
              accountTransfer_Copy[item.type].push(item)
            })
          } else {
            // console.log('没有数据');
          }
        })

        // console.log(accountTransfer_Copy);
        this.accountTransfer['sender'] = accountTransfer_Copy['sender']
        this.accountTransfer['recipient'] = accountTransfer_Copy['recipient']
        this.accountTransfer['delegate'] = accountTransfer_Copy['delegate'].sort((a,b)=> Date.parse(b.timestamp)*1 - Date.parse(a.timestamp)*1)
        // console.log(this.accountTransfer['delegate']);
        this.accountTransfer['withdraw'] = accountTransfer_Copy['withdraw']
        // 处理失败交易记录
        if (res[5].data.data.list) {
          this.accountTransfer['fail'] = res[5].data.data.list.map(item => {
            // item.icon = '/static/img/account/shibai.png'
            item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAh1BMVEWFma0AAACNj6KYhZZ2qb+PmbKSmbDsKCiHmrFdwdgt9/8Z///mLzGLnrPsKCjkMjPfNzlJ2/oP+fnrKipRwNPoLS3lMDPgNjnAX2andIDsKSnsKSrrKirsKirqKyvqKyvoKizoLjHjMzTiNTbdPEDRRkrURknGV1yzaHTmMDLdOj3YQEbtJydaCjELAAAALHRSTlMZABsdFgwI+xUSDgyjEf2ScxAJ3hG2mXgxIvfs5+HWzsyujYNjTU03KZxtW9x2g5gAAALaSURBVFjDtZjrmqIwDIa76QEoIkfxMI7jWWcm9399G8BHdyK6umbzQ7G0r18+ArRVv+6EszYJQ0URhom17l5fdRNCDAXqEvSDaO5JkEuagSzapsQ9AbIhqJsBoX0QZLmWa132AZAL1QMRur+BEvVgJBz0pBwuqh/k1FPhGIhxnidxkFVPh+WgE+cVkmJ5/XN26jUOkRjo1nUHrTW0H7dumAvojkFaR76IvY8LH2l91yZ1OzEAE8eT/Xa82Yy3+0kcG4DbyambienKH7NRGWAbQTnKjr7qUxVeQLZPTjxJ3/BHvKWTuE+UPYN65BgznuMQcViO6vW6HpXNMc7HxlyL6hi9gqCarnA4HC7SnTZRnkdG79IFNeBqWkGvJNXnkM4PSwzwPdNFZBRQKBMVOnunxuUh130uEcgB15MfmiH1NDYaLgVl4mnd4A/51QDXghLebKZLHM4yf8acUT6bDXE5NZyUNCCnrkArDGbfBcD1pSy+ZwGurkDKEchyg+IxJZAVurfUi4xOjmN+0hIo+YmHaDJHrH3X+se5U4OvEeeTiA1KCBQy+T5FLE82wIVEhycDS8TUA79uynGDjlTPme+0V7o6jW8Pm9A+oxo/cpucssAcon4fuu0H+dciNQYavEkXX3nbaPQHYsZcAqssc9OPSHnrNKhmyMCoph4HDV5B6zflPvKaua0SbnWJwa7zEvIUAxxESkUDOkhz6LrsAiyZ3YQJmaA99dKmo5KQhlRV7Zc5OW80/deeSQo5qNiSbnN2viN1nLO/hrLfFhx0XY1Yn2VDl1SXIJzTr7GnJnkVbRDXZMaF9IlBgJ8XDlm3Rtx4+E8gsdTEzBa7/GIFKXaLiN20Yo8RqQeb2KNW7OEv9jqSekGKvbKlJhFi0xqpiZbY1E9qMio4PZafsFNy8MISQnhR8xrJiS385Jei8ovj50lOagNBaEtDapNFaNtHbCNKfmtMfrNObPvwN0cXWk/Lz2TtAAAAAElFTkSuQmCC'
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
        if (res[6].data.data.list) {
          this.accountTransfer['all'] = res[6].data.data.list.map(item => {
            // item = item
            // try {
              let Obj = {}
              const type = item.tx.body.messages[0]['@type']
              // console.log(11111111,type);
              Obj.amount = 0
              Obj.txhash = item.tx_response.txhash
              Obj.from_address = item.tx.body.messages[0].from_address
              Obj.to_address = item.tx.body.messages[0].to_address
              // console.log(Obj.to_address);
              Obj.withdraw_address = item.tx.body.messages[0].withdraw_address
              Obj.delegator_address = item.tx.body.messages[0].delegator_address
              Obj.validator_address = item.tx.body.messages[0].validator_address
              Obj.timestamp = item.tx_response.timestamp.replace(/T|Z/g, ' ')
              Obj.timestamp = this.formatTime(new Date(new Date(Obj.timestamp).setHours(new Date(Obj.timestamp
                ).getHours() + 8)))
              item.tx.body.messages.forEach(cur => {
                if (cur.amount) {
                  if (Array.isArray(cur.amount)) {
                    Obj.amount += Number(cur.amount[0].amount)
                  } else {
                    Obj.amount += Number(cur.amount.amount)
                  }
                } else if (cur.outputs) {
                  Obj.amount = Number(cur.outputs[0]['coins'][0].amount)
                }
              })
              Obj.amount = Obj.amount / mainCoin.decimals + mainCoin.alias_name
              if (type.includes('MsgSend')) { // @tofo 区分是接收还是发送
                if (Obj.to_address == this.address) { // 领取
                  Obj.type = 'recipient'
                  Obj.plus = true
                  // item.icon = '/static/img/account/shoukuan2.png'
                  Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAflBMVEWJnbEAAACBoLCOnLPAjbyQn7EXxJmqk7qRpLfje8P/bdCKlLoXxJmLoLVspq11o68axJphrao1u6FQsqYYxJofwpwZxJowvZ8fwpscw5s3uqEYxJkbw5oiwpwZxJocw5ofwZslwZ0mwJwqvpxKtacdxJwqv51FuqQfwpwWxJlh+xLYAAAAKXRSTlMaABwXEgz5FAkPDAX8EiIe0CdPMOSe2ligwEn1xovVsJOAeWszrWg7mOn8+fMAAAM8SURBVFjDtZiJkqIwEECznQQI54CMiseo65n//8HtwJYgHQIOZVtlzaA8H52mScL+OCKSMuGcM4ZviZSR67tsEIIMBvhqov4TadF7oChIzKkk8FASRNNBkrcQCuNyIkhyNhJcTgAFxMZqFYyBJJsY0gmKiI5DKhoGBZy9ETwYAgXszQgIiKTn/UQx4vNLJzaLg6Q+KOK/A/GoB+LwOxDwV5B0cADARZJdUOBgcO67dYMOiA95h4ql+SX3X+D9NLUgabdhYbraV+XWKwsBLVxwWzWxISFgKj39xBoj1scnCPy0SH2gSmxACHx+XuomOkYgFl+6AosSswuByA9GRS+Pt1Wx8DscBC+okgEFYOHcv7SnvesGRBiqDucHDz96HAZBDUooR91LPGFXCMEgA2g5Bv9NyyExoMiSn9ycsM5UgwDo+qyFpawiBEnLM+eAJ+wVh/9cH3o+JCSCEiAXdjY/rNhT5CKg9bE+7xIE0TFLcdx32ZNTlDj8GfHpjRuLCD084cAX6pnhh8Zx8rs+NBDTH3zgKZbKtVPK31qvQ+LTLwAmidAKhTavoEfu9mGISUiq91jPGWNd0GFX+wxzEENzXWlzk3ZBsRfH+ht9hjsdJyCellrfwuwFhC/0YQ0ehBIURHtZvtV6FcIrSG+raletDAn84lH4MNrM/YuntxsF7RHMT4yXhrivlAP4i6Uucw7vgkDURtqADiY/qsC2cKFK45eW/z39reOMfagpjy01ciW7fQKETRiNLLxpXWbktNHhR1Ib9aUeta7oqI0VJI1sqbHFkNY2dovQJryJ2xy2IcduWgq6alMGpGuPtRFy4QUKnYgQi5yNjXJYtsMMpjTX7lZLOWqNH52JLSTu5k/ShyPq1fVNm//446gtJ5UZn6/ccntEEx+Q+MaEKEx7K++KcpKJj2y8RQRsrp7xuQvL14Npk4jNZnU7Lut/D7mtwPjUaY2nm1ieubV9yIkTrSbin1OqmI3DJ0/9vG1Z7VdpaI7ZhCZPRi95ylQ41F359Omxz7ljth28MWF3fSo/sISYt6j5wDJrDin43FJ0/uJ4/nJ9/gbCp7c05m+yzN/2mb8RNX9r7PObdfO3D/8Bd5pJv5d1m3sAAAAASUVORK5CYII='
                  Obj.showAddress = Obj.from_address
                } else { // 发送
                  // item.icon = '/static/img/account/fasong2.png'
                  Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAh1BMVEWFmbgAAACDmLp3ksCKm7YeXv+dp6rp1nOTmblwjMeRmcSMnLwhYv28tZnIwoyOmrseXv+Ml7kfYP5jhs4vaPQ5be47b+smY/r/8kggX/4gYP00a/FFducfX/8hYfwlYvpMeeEgX/4jY/skY/spZPkqZPlfhNg1a/AjYfwyafQfX/8oZfkdXv/Z8ExCAAAALHRSTlMZABocFvgUDQYgCRK+EQ8L+w7mJGhNSJUJ2tBYO+PFoTLXr6yKfihVsWHsiwfiGJoAAANXSURBVFjDtZjplqowDIBz21gKCIgs4u64zszt+z/fDYzjBVMEDsccf7D1M83WtPDnhWgv9hERABH92NOvvoVWSOQjCCHgLuUl+pEeCPL8OqQO870BoBj/QzgM456giGEYKuoB0sgpnIW6CxRzbexaxQw0VB2uFAdpIE5vEug2kAcDxbODIjEUJCIbyCPOYJLHQGxeQ2cHQ+3MLd4E+YzTk4RNUPyCw7NX1K/jOki3MaQERIXiPh7v0iDrGqgloCU6IbjXQ6IqjhLujyQK2eSgNYKEBCdZ/51uJ7PvLJDE2ezmlXybhRL1aHqA0OoPx718mFJmZkEgWezp6kcmSX0OWIFaFJIK0uXvsG1WgsJ0UlHp9+3ic4CD3UIyTD6rQctFus4OQfWFyr9uX/MSPW+C8AfkWTjBZmUmZnLKZVA4zq9FgiI+mhkDVZkCtliU4WZOnF0WBCBJxK8T3SlRtjMG8kuQ5nZWyYr+eC8dKRtmk1PCH7+YRgCaQJElbo804OygBM6ZhjcOInMDn5l0UhqwD4WV4xZMo2puYPGZS+Gzk2DlSAxysp5gqQsamEIXcnzm2DlKCpXuN+qJRBiPwcnS5hS2ceguLBhHeBCLZ4XWpFAeylZOGRHM0TH4z6DwTPHcro9dhA88YaemTNL6ZN0ax64RIAOhuzUmLeqgYNHgiMAJOIjX4Cvl+LrhMzyaOkdli4xZ25IeB0rWvA6iiva5cB/zUoelmScohoPomQpQPrya0QcHrpJ9aoVsriNSNMJjcmUadRibiyxSqiQuG9bpfl7zFmR67rXOgOQkKuXnULKA7EgRXjxzqrU35xkUdyUtB52MWTHvC6+jjPCXGSl04S/1y8LGOSB3xny4PGhel1rGEeGeXqVMIeF3FH/WU5zLZQSADYkGLEeSbmn1J0tb0kP3WiArgSDIdvRwvuEOFX6/JZukCGR+ogdmtbEEvfD6NRF5vk4Xy+r2MwktHOzb1kzuF8sUlLT17d2N1sw8ZPZxcR1rE409Wr9b2fqRbKd/b4kD0vph1LsZPVxdCB9hxSzUvz1WiCBJG7voAQ07f2tv2ElwxBbiDZuaMdusd2z8xm9Fx2+O371dJ5IvenN8/e4jjfGHLOOPfcYfRI0/Gnv/Yd3448N/ZrdPadzj92UAAAAASUVORK5CYII='
                  Obj.plus = Obj.to_address == this.address ? true : false
                  Obj.type = 'sender'
                  Obj.showAddress = Obj.to_address
                }
              } else if (type.includes('MsgDelegate')) { // 委托
                // item.icon = '/static/img/account/delegate2.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAbFBMVEWFmbgAAACjr6EtYu17lL+Hm7iSmb+bpqvPx4onXvKOmb1yjcaMnLyOmbYnXvIsYu4tY+4wZO0oX/ArYfArYfAsYe746mksX+8nXvErYO4uY+4wZO01Z+pAbONFcuE7auUyZusvZO3//yQnXvELw1z4AAAAI3RSTlMZABKeGxYLFQ78Bx8SDvmhmoLfvbanC7vvuZWKb0lBV4CPB4lby2AAAAKBSURBVFjD3djZepswEAXgKdZIQojV4MR7knn/dyxO4+IBBJMqvum5ROb/tFhogV8LcTr3iAiAiD7Xbum3YUh7hFHQawnEFQiEWWtQjrAQzIWQRlgJagHkEARBtwblIEy+DCGIgwuQg2/FhSAN34weQYMTIQFzIiQI9I/qwx+s9BPMOgrsziYs1qiAxCHPnMScT8dDtRlS1tm8hBzKmWMv+4J4UtoGpPwRcty5vlI6hlJ6CUjuAULWrsvNadqu3NxTNQt1wgHiI2/2lBZ1hia5x+yq3gnWSf+FkDXsXBDVH6yxZtO3LVgnvEOavbQ7ETUZsCQboq6lIlAn/QUhg+yRqMUpVMGWivk64R9Ij146EHVmCpU224bqpD8hP3qpIiqTKbQxJnsJ1Ml/QjDz0iyUmWwbGLsbpKWQNcZCO18n3UN+HVL2nai5zbiq+/o/AY/vIZRAV0rT+1xJC6qtGo8bOAhA/OE7m8DluLxntJJAkFzfq2HeTcqVhhxEEFg7zLtpec94IaTUMO9myj3gGiQrx5+DIAoa8j9DS53Nl1f176NmLF9rFyEfhkz2Vj6stW+ZCUN+YYooW1P6OFVrq4JQDlpFQcOkdT/TNDd82KI6G4dPbdzwe9nHf71cD8tRHBRcIJegkqgalfuZJVvxJXsa0xEdEsVbJttE8GBLdLQMQuG2hidriE47BmnZRovnoyYqzqxGKNn68RjM6iKlveE9JNiM8pRd2/RFrxfW1yjdHvP0zpV3tZNu2HmK/YU7OT9CYOAIwVIdjqezSZiD0kMNT/8YmANOeMxae+qed/CLP4pGSPo5x3UWL2f806804i9Z4q994i+i4q/Gnn9ZF399+BuQ3UgMU32hbQAAAABJRU5ErkJggg=='
                Obj.showAddress = Obj.validator_address
                Obj.type = 'delegate'
                Obj.plus = false
              } else if (type.includes('MsgUndelegate')) { // 取消委托
                // item.icon = '/static/img/account/undelegate.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAbFBMVEWJnrEAAAAfwpu0jL94oK6RnrGLnLLdgMCQnq+nlLeIn7sXxZkewZyVo7WLoLUbwpsjwJyqkb4gwpv/b9Ecwpsfw5siwpwYxJkcw5oYxJoaw5oovZ00vaE9uaFsqKkhwZwwvJ8kv5tmqKgWxJmAAELNAAAAI3RSTlMaAJ4THRYYDw0VB/qgChK9gxOWDLanjOG579ZwSUIig1iAIwaP6y4AAAKtSURBVFjDtdjpdqowEADgqWSysRRwr2ub93/HO1xbZQgh8aDzS4N8nEwcssDHRNhSVyglgJRY6dJO/TYMkQGDIO1ZqKwkjIasyicgjTARqBMhLSESUidAFiEh0MYgDYmhJyGLkBxow5CV8ERIG4JKeDLKPsScGRLMcUjyIQssBAVvGJfsELKS36WWKmuyXigUgYxzCJmTmeNh0y56UdRnMyohhzRz1GmXu2F8inFJ9yHLneveY/I8KNkehKxfp73L3Xa1Lop7z76cC0r4gHiBmR3dVQtp7sk2akFOUNJ3SLKOHSk/9ZK1mcJNSPIP4pleHpzbCl512cK59Soo6V8Ieao3zq0keFArP0MS3qBycFNLTzc+VCgRlMr/UMUbm+6mzIcWiEGp6iDrdSMAGRGUpCVIw8hNY5AyqCCQcU1QFYT4AGy7imvXOUm7Mw77RhCmQFd3j066KDEcN7AQh6hx4/pUMbxOTJkEQXNtH3XnXydGp0Gg1KPu/OvEVImQEI+6868Tg1GIjPiDEGQUQqUwCsk4hD+Xyw/GIYhAQtXO1UrEchiFICtY7YWgcNf495k5Er/DXZju0zSEExCqvz+gMt1cOzn8VRjC83dxK4mvrvK/zxiGqmCJ3MYr75cqjV0IIqZ8CUSMfUnXiPnAVyQb2at2xvBXBOlX/CF1fDryS6TwIWlDE2QTLtqmg5phz/wpW/Ap23+NmLVzbSb44McXEf6LTa6c2ygGYeKyRoi+I7bOHZYM0qkLrb6zpJTlR8XshKUfj8ZIUdNjdoaPfcJilEVRrFdburQ/sVxj+vKYx/7KU21TF+w88t2JOzptC8Gj3RyOJmMOJm1qeFADNQNzpE3cZsVa7fs2fvO3ojOk8r3b9fkHCPOPNOYfssw/9nn1QdT8o7H3H9bNPz78B9tTUDnoPZNdAAAAAElFTkSuQmCC'
                Obj.showAddress = Obj.validator_address
                Obj.type = 'undelegate'
                Obj.plus = true
              } else if (type.includes('MsgWithdrawDelegatorReward')) { // 领取奖励
                item.tx_response.raw_log.replace(
                  /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                    p1) => {
                  Obj.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })
                item.tx_response.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
                  Obj.withdraw_address = p1
                })
                // item.icon = '/static/img/account/lingqu.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAq1BMVEWFma0AAAB/krF0i7f89l/R1n8BMv+HmrGSmbCLmailsJsBMv+3wY+Mn7KPnbr//0ciTOwDM/6OmbaUpqQDM/8UQfVCY9oEM/4NPPkPPfb//ysIOPwLOfoyV+MCMv8KOPoTP/QCMv8HNvwsUeU2W+BRb88FNP0QPvf//w0DNP4GNf0UQfUlTusOPPgdR+8fSe46Xt4MOvkVQvIbR/AJOPsbRe8IN/wINvwBMv9VNs8jAAAAOHRSTlMZABocDRD7FQsIFP0SEQULUO4OFupzL+aNhAqynjzypXb1wkE4KNKACd3KcUqIWVQ1lWxcq1+4twEf5eQAAAP2SURBVFjDtZhpc6MwDIa9NsYcBpqQhiNXczVJ0/Tatqv//8tW5ChgA6Flqg+ZIWYeXsuSLJv8aTDb6ntCEDQhvL5lN71bC/ItTxBKcsMH4Vn+90C+7ZGcUmQRz/bbg/qC5hSVRUW/JchStei6rBYgW5AWJuxroD5paf1GkC9IaxN+Pcgm3zJbA+WcH5B0kEW/C6JWGZRzOpBIPq8fma2CfPJD8xWQqBPPGEXLfqvHRRnUr6FQHqQcLQgkYbQpMkm9gyh1Ujl5fotf4/j2eRKmDm1wE6mdGON8lSwGcDJ3sNi8yOoQz0FWVYYbk/EcSmZuOD0NlouV9QWqksPiKbioZHo/mr2P7ucumHDPQppxJGMOKdgFZFVwJg9guhDNPtYsdJyQrZ9mOzOWGYcZN7vdUtKyJFLlIWY8DlDAIBlueZh5nZCQb4dLEp44PRdiXgCJE8immp4jZzQMnEv4IIw5nNATB1zzbxFE7SPIU/3MJwNw3UQiphwOF44Je14a8jKQr60XW+Crd6leur/03BrKmI8gS3s3Rk6SsjqOCchRBi0EeVSd2NSFkaTf0EOo94f4QvXQGGAwdJr16AWc2ArHWWHsJQFr1KMZYpTCyNIEYIeCmvXopZL0lYyXC4DZln3VkTLnrIepghHj6TEEH5fkdLaSVuihnCuqECPK+oNngOk6pEeOHL6tONP0EGe5dFRvq6D0DTDJL5H5CdGNwY6cQUHPX/OSIjlIS48YYBSeJ7beAfSQVNZD5RhgLJXJaaBX9LVDzw/7rAbcGLmeJpCu6P2y+NS4M03oPT7meo5KZwCvqrsbpoZPSEIpUZQlcSF+PgESNSy1Vbs9OTsnmS6aWeTQB4C9EvuiavnnuPxFTa5b1INrMAV4UkFqQMqsqD1xWtC0n8/3OSdbfReileJsT0uRMEuRlBX+4cslR04uegywUMtMX0vaYKMkrZIQGO4RwCFlStLqZeQlKyMGK8KZ8iV3qpUH+3ph0z40ABhzqha2qlLbAxg5ig9y34/A7S0VEPWqin9wLP5bRis4LEjArCigVsV2RM7bUUCprmebZd8D0/u26g1yhTnhJlzdIJnDD6aZx1BuXr5la9VZ37KlMRzh39NHQ1VE7eYmItoUm4hguEH8qdIpJurbGgPbmmwW4481zdoaim1NBC7650XnEKux0TocGy2Y3v87N1r4OIhxgGh2pfVbjqdQsvlsUtlZWFeb0ZfDIjpD3OhhM5SyKrhEq/Z49fR2eI2Tu+dVGNREu92qYZdpakhuBIGkLRp2NEGvHCHqxsWvHGq6H7O6H/x+7yja/XDc/bje/QLht680ul+ydL/26X4R1f1q7Pcv67pfH/4H7tBmclAtyEsAAAAASUVORK5CYII='
                Obj.withdraw_address = Obj.withdraw_address?Obj.withdraw_address:this.address
                Obj.plus = Obj.withdraw_address == this.address ? true : false
                Obj.showAddress = Obj.withdraw_address
                Obj.type = 'withdraw'
              } else if (type.includes('MsgSetWithdrawAddress')) { // 设置领取地址
                item.tx_response.raw_log.replace(
                  /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                    p1) => {
                  Obj.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })
                item.tx_response.raw_log.replace(/"key":"withdraw_address","value":"([0-9a-z]*)"/, (match, p1) => {
                  Obj.withdraw_address = p1
                })
                // item.icon = '/static/img/account/lingqu.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAq1BMVEWFma0AAAB/krF0i7f89l/R1n8BMv+HmrGSmbCLmailsJsBMv+3wY+Mn7KPnbr//0ciTOwDM/6OmbaUpqQDM/8UQfVCY9oEM/4NPPkPPfb//ysIOPwLOfoyV+MCMv8KOPoTP/QCMv8HNvwsUeU2W+BRb88FNP0QPvf//w0DNP4GNf0UQfUlTusOPPgdR+8fSe46Xt4MOvkVQvIbR/AJOPsbRe8IN/wINvwBMv9VNs8jAAAAOHRSTlMZABocDRD7FQsIFP0SEQULUO4OFupzL+aNhAqynjzypXb1wkE4KNKACd3KcUqIWVQ1lWxcq1+4twEf5eQAAAP2SURBVFjDtZhpc6MwDIa9NsYcBpqQhiNXczVJ0/Tatqv//8tW5ChgA6Flqg+ZIWYeXsuSLJv8aTDb6ntCEDQhvL5lN71bC/ItTxBKcsMH4Vn+90C+7ZGcUmQRz/bbg/qC5hSVRUW/JchStei6rBYgW5AWJuxroD5paf1GkC9IaxN+Pcgm3zJbA+WcH5B0kEW/C6JWGZRzOpBIPq8fma2CfPJD8xWQqBPPGEXLfqvHRRnUr6FQHqQcLQgkYbQpMkm9gyh1Ujl5fotf4/j2eRKmDm1wE6mdGON8lSwGcDJ3sNi8yOoQz0FWVYYbk/EcSmZuOD0NlouV9QWqksPiKbioZHo/mr2P7ucumHDPQppxJGMOKdgFZFVwJg9guhDNPtYsdJyQrZ9mOzOWGYcZN7vdUtKyJFLlIWY8DlDAIBlueZh5nZCQb4dLEp44PRdiXgCJE8immp4jZzQMnEv4IIw5nNATB1zzbxFE7SPIU/3MJwNw3UQiphwOF44Je14a8jKQr60XW+Crd6leur/03BrKmI8gS3s3Rk6SsjqOCchRBi0EeVSd2NSFkaTf0EOo94f4QvXQGGAwdJr16AWc2ArHWWHsJQFr1KMZYpTCyNIEYIeCmvXopZL0lYyXC4DZln3VkTLnrIepghHj6TEEH5fkdLaSVuihnCuqECPK+oNngOk6pEeOHL6tONP0EGe5dFRvq6D0DTDJL5H5CdGNwY6cQUHPX/OSIjlIS48YYBSeJ7beAfSQVNZD5RhgLJXJaaBX9LVDzw/7rAbcGLmeJpCu6P2y+NS4M03oPT7meo5KZwCvqrsbpoZPSEIpUZQlcSF+PgESNSy1Vbs9OTsnmS6aWeTQB4C9EvuiavnnuPxFTa5b1INrMAV4UkFqQMqsqD1xWtC0n8/3OSdbfReileJsT0uRMEuRlBX+4cslR04uegywUMtMX0vaYKMkrZIQGO4RwCFlStLqZeQlKyMGK8KZ8iV3qpUH+3ph0z40ABhzqha2qlLbAxg5ig9y34/A7S0VEPWqin9wLP5bRis4LEjArCigVsV2RM7bUUCprmebZd8D0/u26g1yhTnhJlzdIJnDD6aZx1BuXr5la9VZ37KlMRzh39NHQ1VE7eYmItoUm4hguEH8qdIpJurbGgPbmmwW4481zdoaim1NBC7650XnEKux0TocGy2Y3v87N1r4OIhxgGh2pfVbjqdQsvlsUtlZWFeb0ZfDIjpD3OhhM5SyKrhEq/Z49fR2eI2Tu+dVGNREu92qYZdpakhuBIGkLRp2NEGvHCHqxsWvHGq6H7O6H/x+7yja/XDc/bje/QLht680ul+ydL/26X4R1f1q7Pcv67pfH/4H7tBmclAtyEsAAAAASUVORK5CYII='
                Obj.plus = Obj.withdraw_address == this.address ? true : false
                Obj.showAddress = Obj.withdraw_address
                Obj.type = 'setWithdrawAddress'
              } else if (type.includes('MsgExecuteContract')) { // 调用合约
                // item.icon = '/static/img/account/contract.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAdVBMVEWFmbgAAACBlrqirqEtYu2Xo691kMGImrrNyIuRmcEnXvGQmrqMnbsnXvIsYu4xZey0tJwrYPAtY+4wZOxph8srYfAsYe746mkoX/ArYO4uY+4wZO01Z+pAbONFcuE7auUnXfEoX/EvZO3//yQpX/BuicQnXvGiy8A5AAAAJnRSTlMZABoTnhQdFQ4K/QYO+aGBEbyahCK2pwvhuZWKb0lBV/DtjwfWIAfTBY4AAALOSURBVFjDvZiJcuIwDIa1CvKBDUnTch+9tn7/R1xRlmptYuqM6f7DDDMYf5EsK7YEv27IWU9aA0tr8tbd+i/cgGhAABGCZthIkCUQiggByI4AeY0IGSFqXwiykKGIXbYA5DQUSLvvQB4K5VPQaHPEqDzIwSi5HMjCSNlhkMWxILQxSDgVJBj2C5XCWApveweD64xoVqbrmn9kaJjkElAUd9XRYb/b9hPRvP0gNeScjkE+GjTHzSzEmoYHNWyTF1DimDLPL2GacGazE0nlnYMrx7A7voZZWC+W88lF/W9G5WzSArKRY7ThWa3S1FxEq55NzNpkv0CxY4fZNLTvTBTRhNl5my4gH4FW+xDWChBE2ExCWC6yNvkTKA09drsQFvxTCurhIWRs0meQxRi05acTXoHmRj1kbEL7CSKIQT1Paq5BEyKVs4lOIAdwPWkI1Kg8yTHIloJMQwYWwyTLII8ZEKpL1mP3xpE8ZVy/nPKO2nwkJPQM0hmLkMwl6zlpwvScNPzN+6k1mMYNHAyDkJ7a+Snrnwg/TZpK4qXBYDmwmAGZR57Bn8fPpzfPb/1X3vF4OsuChyIQGiN5dw1iDJW4xlKSd0MgAg3fLvbweCwtoHz4y0BwC5RIYQYkyruWnCQjQbLYor8LPw4k4Redt0IepCtBErU61wRE91lsAn+f8HuwWAWSpHX3cc3Ji61qsbW8aqvCj15e/lUgsHIc1bnmBg7I5nxA5hd7HkKfgCh/ZOfDT8sQtl08x5ZcIlLpRQg7E4F0wbUmFYJah7BfqWhbl160RADvLd+5DiYClV79RKRVy4/ZEEaxL7yMiubLxZqHXo/RWuvS63G6K1+eY8fcmAu7aLY5xiHzSQmB2RJC1G93+wN1KiohyosaUdfxz0kl70aVWSKlYo79ucKvvhStL47ry/WfbyDUtzTqmyz1bZ/6RlR9a+z/NOvq24d/AG+GXA7OqF3dAAAAAElFTkSuQmCC'

                Obj.showAddress = item.tx.body.messages[0].contract
                Obj.type = 'executeContract'
              } else if (type.includes('MsgInstantiateContract')) {
                // item.icon = '/static/img/account/instantiateContract.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAARVBMVEWFmbgAAACgqKokYvqRmb52j8IeXv/f0HciYP0iYfwoZPclY/onZPkgX/4jYfomY/otZ/Y7bO4/cugzavEfXf8fX/4dXv9mSxxZAAAAFnRSTlMZABKeCBz7DLy2gpqK36eVb0lAV/DtGX3ifgAAAkVJREFUWMO92NuCoyAMBuBMmkDxUHuY4f0fddHdNgtIkGXb/7LKZxCsCHwpIcIQCMEQIu1c0BBIomFQYARJMVIghdEpHSKohjRIqqmHkWoQwsGgCpE4dYnKEEFTKINyp12CyOmQIHI6JCg4zOmIVyQo1GOtxSgWNUkgjOcb3q7TMp7+ysDI2nwCcST27oyPY/yZERQJ8o6xfXz7DNokLncO8oLw/hOc2V2kX+Os1IQCUXzAhesPHN3pMTjFmugFxR27hW4NNrZPwS7X9IQohq7ezwwp5C+uWBOtUD5kk/cOc2iEc6Emxt8QJY2WcPUd6GT5XKqJNihtNIZGexAil2rCFSJIG5UgLkvUAllEC06kFEIVkgGYt5l5MbsSViB5aNZ5tMWE+MHmEIECyY+Tl5j8ONBBCPCxjPLc7UF4DAJr5bnbu9BhiOV4HwQfg6AXaj+RuReScfsfEPI0sQbhIWh78P1kuXfUVsf0Q68/on+dR/jn/j4d1CAqQ8jDwBg5RYg0yA5+bf5yWIW+UIMCAPIayqH6P6TcGicvRh2ifUgkqacMURkSSepRoPILUqTVSV/faZvqK5uRh2TRhxfvlwSi2iJCJqUE3frQxT9py5piePb+ahkkTPpCK89zlppbBEF96ZeHB2PS5RNVF6NZLm4Oh37u8fkty2OJ8d+PuGPUtGAXyN2zIat/QiQZl+l6Q+TIafmokVibDic1fGZpv9MbPvx6JHrrx3G7RG/fQOjf0mgvCukD2z79G1FtFNJnNuv6tw9/AUmcLnjrdYMbAAAAAElFTkSuQmCC'
                Obj.type = 'instantiateContract'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('MsgUnjail')) { // 节点激活
                // @todo icon input
                // item.icon = '/static/img/account/active.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAdVBMVEWEmbkAAABzj8OJm7fw32aRm76Lnr/BupIpZfiNnbujqqUmY/oqZvZCc+YfX/4gYP4lYvowaPRSfNwfX/4gX/4sZvYfXv82be7//wUhYPwjYPwpZPkjYvw7bu1Id+MeXv8fXv4iYP4nY/gyavFhg9IgX/4dXv/O5aNUAAAAJnRSTlMZAB0WCwoFEHoPE5R0O+PQn2Qs6Ntu81AGyLN+p0c1+O27hVsj0piwDVMAAALWSURBVFjDvZjrdqowEIXnzORiAlhFLd5tazvv/4gn6loNEjopxXb/UBaRz5mETHYC/wQZ7RwRAYQP57SRfgsChKAjEmCQpcgsGaQJBJEWQAJGQIkgEzESyuRADr4pJ4CEcMSgUpCBQTIpSO5luc9TkIbB0gkox8mTQOifQf0EkTOOBPK450X3IAc/lougJDEMgqjMfdMC0d3PvVLKxydyDRRBGtpS9bycH1UKUsfQUKv+dwC6AaFdTZn5ZeKhIz95CQ3TlcW+kKATEKoV3/SmgFoC9cY3rRT2hAT3AaGvl8yb3Svzc0XYElXPzK+7DfOy9piGBN2A5oGDym9DEk9XfXzcvkPCW68wkOZpSFeQuwOVzDv7fk0w0Uq92x1zmYDcBWSgG9HW2vUs5DZdLBbT59bFbG3tti8iMAGk70C2WoQHzsWJ+XysqqoumIs6XBzPzKfiHP5gUVlM3wDozA78HJyZ8tb6dRlSWV+u1OxzOLFnnkAyXangi/ZIGGQnzBOLQYT7a0NBvQUcTHLPHop90Xi6BXgB3UIg34SGg+0DBYxO47RqrSxAFxQbUqEGJ83yCIr3++UiKFUK8p7wKxB9G4Re1dW76kfRAJA97pfT5ay2+GOQxSB/WPBFy8pjHwjyoPKfVUrRU5gsy1MoAcJDMmhbTiaTcsY8PfgmFLdG9SaXBUXt1qiKa2VLMX8AGpYagXtMZztw44Y/gjQ+4oVEDeYxU8SAoUdMWjIgGJEBZcTF4t9SujxlC5uOy1FUsjwVNltqzXWBFEEN88ZDpvi7uGQnanuBUmWWIx1NhNjbp6I5SAskRVsjyG856GUhLNk6Gi1BhMVJNhHUsn4iyTbF62bzta3RbTMqCa0lwWhRxx5LJATB+pmsYZfNaGrYpeTy9pgGbGpEw24Gb7P6Z7/5hY3fGJL+jc3x+O36+AOEPzjSGHPIMv7YZ/xB1PijsT85rBt/fPgfM5xLo+CzTa0AAAAASUVORK5CYII='
                Obj.type = 'MsgUnjail'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('RaAuthenticate')) { // 节点注册
                // @todo icon input
                // item.icon = '/static/img/account/register.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAdVBMVEWFmbgAAAB1kcGZpazw3maRmb+Nm7opZfjNwIm1sZkfX/4qZvVGdeU3be5SfdsfXv4mY/ooZPgfXv8hX/wjYPwlYvorZvb//wkfXv4fX/4iYf4jYvsmY/ovZ/Uya/E6be1Ab+hhg9EgYP0kYvoyafInY/kdXv/m70SVAAAAJnRSTlMZABwUCwkQew8R23Q4TyzhkYD0yLKdbgft57uolmdZRkIk0aFhiFc5o+gAAAIxSURBVFjDtJXrjqowFIW33bulXAUV8TrqnDnr/R/xAJM5P6BSmnQ+E2MkfFkL2l3aLKC1MUwjbIzWmwXovaV3TGCjQ0Xa0BuMDhAZWsSsFGnyoleINNMKWPtEhlZilkVMq+EFkaYg9Ezk9/hN5PaEm8jtCTeR2xNuIrcn3ERB710p9W4VUMA6VCwirNwrkwKKSXHPvypxl6P1xTg5AdgeU2c5WhNobCMNvjmKckSi8cuDtURc7IBLsweyalrgR6R9nrK+7Pdb4MCietOXKxL5A6ka/0u9bAPkU9Eo8QbiA3pO5x3QdtYegPtMpEeRWYwjCYBb+Sw+gN3t4w9wLlLHlCNPM64yIO9sytI7Rv6KoimDSC8H6oPsmdTwuWLg5t5x5Gt2B+rvKszl7Vo/LDkwvYiXRTnQ/NybSifpmwFOmrzPOhE12f1ztEukmFlNRJMLDpGZx5RXUQnPRSxV8RImF2YuSqs222bXIp2K0uLaX2ir1C3iaZ4iw8D5warHDiKrevhxxkBWuDI5/rsAyHbAJ4mI3eRAvrEiQp/ALgNwoRUoKYFTyc8t0OZJkuQH4DD+aIHtk8sTUIpaIToCtaiugYOmU1IDx4iiX6wW7WFHe/3RFmS0LRJt00YbI7EGW7RRG234xzqOoh2QwUf2v1bskwAAAIBhGJ5/w3NQFBU9C2QLiWBao0SLqZ+SUabHSthVQrCoUZmlwk+lqIpjletoIKiloSYL2j5sRPk15mcd24cHprtHUn/pMv0AAAAASUVORK5CYII='
                Obj.type = 'RaAuthenticate'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('MsgStoreCode')) { // 节点激活
                // @todo icon input
                // item.icon = '/static/img/account/upload.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAASFBMVEWFmbkAAACqraQkYvp3kMGRm7/WyIOPmLoiYP0lYvooZPciYfxriMr78EEkYfooZPkfX/4fXv8tZ/U7bO4/cugzavEhX/4dXv+CWpmlAAAAF3RSTlMYABGeHAcODbyZg7YgCaeL4e9vSUFX1grnJKMAAAJaSURBVFjDtdiLlqMgDADQbJpA8dnn+v9/uuLWSSPyqExz5syMWK5QDQLwJxHMFuEVaJlTn4U4ghAEMn8IiRJaH0AWkmHzkDA5Kg8xFAXnIAuFYZMQwwfBGto4hyXQznEJlFMhgXIqJIg4NIcuWH4FP7yFeFPL9AZVGKBEmwTSDuL9Njp3eoumw31JQ1Y55nGegjgT7Er2HWLtPK+KyEj8BikHH965tIP0y/1NSQJtEqydKzUEgD/Ru1Sb7A+kO3b3Tq8beUr2boX0N93f5n5tPu6hoY1K9gWBbtE4TS2EkINzVPoP8aaSm6++A50MRSVeIAyhE+5AAFEJPcTB1SMQUlziGbKlkEEw0C4SbiU7Q5iE5AZclidzmLzUBX2bISiBnpOKxtD2vgGnICkcFRScBy6EAJ/OSd7tQbYMAmMk78LzM4OFENHrb6TFAHmIqOBCeYjAGKB6iLBr/HhdC/m0kKw4Bokj0hFIHJGOQOKIdBQiFEdyPgIlH8jOO+2wjtddKoUSKUKm8dXBreN1YygKWeA0dCazjtcCfZz9/lEE8Mfr/wkoObAZsybpkigJKDPUEskxUQLC3OCfP5bBn38D4vwLkkyz3i+B3LbOziub1Ctb7p3E4CHSDSqbRBiznT6NRkOF0xrSR5dpuvWqyOYnWmH0Pm/uukWlUz8JAPJOCyps6WRUYmgv86nrQ3/X5dNjHden7hgXT9h1nB/ascVLCAnnxtsdUTlQuqjRMReDdrhwmZUr5e8t/OqXohUSf2e5fljib29p1G+y1G/71G9E1W+NfX+zrn778B8tNza+YuEqtwAAAABJRU5ErkJggg=='
                Obj.type = 'MsgStoreCode'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('MsgCreateValidator')) {
                // @todo icon input
                // item.icon = '/static/img/account/createvalidate.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAYFBMVEWFmbgAAABzjcOOnbb25F6bp6uRm78fX/9Tf9spZfgfX/7RxIePmLopZPcrZvYhYPwtZ/UpZPgeXv8mYfpKeOEgX/4iYP0mY/o0bPBkhs0fXv8jYvpCdOYhYPwuZ/IdXv9u+kw2AAAAH3RSTlMZAB0UCxUH5yp72g8NgnO2boX5mjLSvZJVI/GoPcljTaZxNgAAAuZJREFUWMO9mOtyqyAQgFdXUALx0ph7W97/Lc8G4kHZBHWc9PtRO0Pmm+WyLABZAikNIgJBHyNllgDeS0gRgSjlSpFEeAPKFSKDkADNQpGBWcyMiHdqeQchEc6qoGB1ODwoLpKwCslE3LPeBBPPBhOMPVtMMPJsMsE2D5kiEYamfGCRCAcRW4eiGBBrVibEHRNVqzx1tcwkRyIceY524LjMhEFkwvgUrf3yGvrWRb64c+D+jETK2qZ+dKyxdu9EIgKYfRCZSFRnutCZ8iIhqggskIXkRRiJlKa5150Tiet9N+X4c74KPkoQpiyIipz+2TtRcbGcYx+ZpBMhJCLC672ccqPJOPGJAxdQaowwj7iU1l50FBKJDBM1ar/v1Mnazs0aToGsG1oChkQ4FdW0fgZerqNc19aeoxYcRGtWtm6tPXCRBIhM9d7R+VzDJ2kRSCYCHGe/EPkTIWZEBhhhPxJ9Uz5pepESGUiX+cb+p8GUCF+LfDyAeWm/do4vW+boW4ph1mZFuXAj5EW774r43nkRtWhBYSouekHR/9aqrYQXVRpRV15EU6oeK/VGAzaPUKUlDk9RTzmC/VN08MtVaZhHK7c9vhMRpVoUT3+j7Faqft21VtW/fQEONko8a4V+O9iEyF9ouOjskjUx/UGTFtEwtDqxID1cZBIiliLvi7kBmRDFSRuqOYtOpkUEPvE7TLd30JQyUYYJUXLP4zsknzWdc49LVl7Ng8hEP39s7RnglKHlpKhzimetGcpRQF8oBy55BApfMpWrVDUTyVAgAycK/VZOuV/RiTpXO1UsQlayCdEfLedSDEU8lPWoZLOQxPX8c9xNuV9FIiJkxxoPFlhFiOQYGX7Q8uQgIvyshTPYVMSOfow31Zy+7Uhk2GE0sGZlIzsez5tq5WnJw4/Hs51Ln+UNu0IkSNwu8AOXmk0m+YGL3xaT/OjleL1Jfv4BYfuTxvZHlu3PPtsforY/jf3NY93258N/ghlG2yH6OEkAAAAASUVORK5CYII='
                Obj.type = 'MsgCreateValidator'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('MsgMultiSend')) {
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAflBMVEWJnbEAAACBoLCOnLPAjbyQn7EXxJmqk7qRpLfje8P/bdCKlLoXxJmLoLVspq11o68axJphrao1u6FQsqYYxJofwpwZxJowvZ8fwpscw5s3uqEYxJkbw5oiwpwZxJocw5ofwZslwZ0mwJwqvpxKtacdxJwqv51FuqQfwpwWxJlh+xLYAAAAKXRSTlMaABwXEgz5FAkPDAX8EiIe0CdPMOSe2ligwEn1xovVsJOAeWszrWg7mOn8+fMAAAM8SURBVFjDtZiJkqIwEECznQQI54CMiseo65n//8HtwJYgHQIOZVtlzaA8H52mScL+OCKSMuGcM4ZviZSR67tsEIIMBvhqov4TadF7oChIzKkk8FASRNNBkrcQCuNyIkhyNhJcTgAFxMZqFYyBJJsY0gmKiI5DKhoGBZy9ETwYAgXszQgIiKTn/UQx4vNLJzaLg6Q+KOK/A/GoB+LwOxDwV5B0cADARZJdUOBgcO67dYMOiA95h4ql+SX3X+D9NLUgabdhYbraV+XWKwsBLVxwWzWxISFgKj39xBoj1scnCPy0SH2gSmxACHx+XuomOkYgFl+6AosSswuByA9GRS+Pt1Wx8DscBC+okgEFYOHcv7SnvesGRBiqDucHDz96HAZBDUooR91LPGFXCMEgA2g5Bv9NyyExoMiSn9ycsM5UgwDo+qyFpawiBEnLM+eAJ+wVh/9cH3o+JCSCEiAXdjY/rNhT5CKg9bE+7xIE0TFLcdx32ZNTlDj8GfHpjRuLCD084cAX6pnhh8Zx8rs+NBDTH3zgKZbKtVPK31qvQ+LTLwAmidAKhTavoEfu9mGISUiq91jPGWNd0GFX+wxzEENzXWlzk3ZBsRfH+ht9hjsdJyCellrfwuwFhC/0YQ0ehBIURHtZvtV6FcIrSG+raletDAn84lH4MNrM/YuntxsF7RHMT4yXhrivlAP4i6Uucw7vgkDURtqADiY/qsC2cKFK45eW/z39reOMfagpjy01ciW7fQKETRiNLLxpXWbktNHhR1Ib9aUeta7oqI0VJI1sqbHFkNY2dovQJryJ2xy2IcduWgq6alMGpGuPtRFy4QUKnYgQi5yNjXJYtsMMpjTX7lZLOWqNH52JLSTu5k/ShyPq1fVNm//446gtJ5UZn6/ccntEEx+Q+MaEKEx7K++KcpKJj2y8RQRsrp7xuQvL14Npk4jNZnU7Lut/D7mtwPjUaY2nm1ieubV9yIkTrSbin1OqmI3DJ0/9vG1Z7VdpaI7ZhCZPRi95ylQ41F359Omxz7ljth28MWF3fSo/sISYt6j5wDJrDin43FJ0/uJ4/nJ9/gbCp7c05m+yzN/2mb8RNX9r7PObdfO3D/8Bd5pJv5d1m3sAAAAASUVORK5CYII='
                Obj.type = 'recipient'
                Obj.showAddress = item.tx.body.messages[0].inputs[0]['address']
                Obj.plus = true
              }


            // } catch (e) {
            //   console.log(item)
            // }
            return Obj
          })
        }


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
        this.$cache.set('_tokenContent_accountTransfer_data', this.accountTransfer, 0)
        this.loading = false
        // this.callRenderDelegateRecord = this.address
        // this.callUnboundingDelegators++
        // this.callMainCoinBalance++
        // console.log(this.pagination, 'this.pagination');
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
      this.$cache.set('_tokenContent_locakAmount_data', this.lockAmount, 0)
    },
    async loadMore(type) {
      if (this.pagination[type].loading || this.pagination[type].nodata) return
      this.pagination[type].loading = true
      this.pagination[type].page += 1
      let result
      // try {
        switch (type) {
          case 'sender':
            // result = (await txsQuery([`events=message.module='${'bank'}'`,
            // `events=transfer.sender='${this.address}'`,
            //   'order_by=ORDER_BY_DESC',
            // `pagination.offset=${this.pagination[type].page * this.pagination[type].size}`,
            // `pagination.limit=${this.pagination[type].size}`
            // ])).data.tx_responses
            result = await getSendRecord({
              'address': this.address,
              'index': this.pagination.sender.page,
              'limit': this.pagination.sender.size,
            })
            // console.log(result.data.data.list,'aaaaaaaaaaa');
            result = result.data.data.list
            break
          case 'recipient':
            // result = (await txsQuery([`events=message.module='${'bank'}'`,
            // `events=transfer.recipient='${this.address}'`, 'order_by=ORDER_BY_DESC',
            // `pagination.offset=${this.pagination[type].page * this.pagination[type].size}`,
            // `pagination.limit=${this.pagination[type].size}`
            // ])).data.tx_responses
            result = await getReceiveRecord({
              'address': this.address,
              'index': this.pagination.recipient.page,
              'limit': this.pagination.recipient.size,
            })
            result = result.data.data.list
            break
          case 'delegate':
            this.pagination.delegate.nodata = true
            this.pagination.delegate.loading = false
            return
            // result = (await txsQuery([`events=message.module='${'staking'}'`,
            // `events=message.sender='${this.address}'`, 'order_by=ORDER_BY_DESC',
            // `pagination.offset=${this.pagination[type].page * this.pagination[type].size}`,
            // `pagination.limit=${this.pagination[type].size}`
            // ])).data.tx_responses
            let delegateNewArr = await getDelegateRecord({
              'address': this.address,
              'index': this.pagination.delegate.page,
              'limit': this.pagination.delegate.size,
            })
            let undelegateNewArr = result = await getUndelegateRecord({
              'address': this.address,
              'index': this.pagination.delegate.page,
              'limit': this.pagination.delegate.size,
            })
            result = [...delegateNewArr.data.data.list, ...undelegateNewArr.data.data.list]
            break
          case 'withdraw':
            // result = (await txsQuery([`events=message.sender='${this.address}'`,
            //   'events=message.module=\'distribution\'',
            //   'order_by=ORDER_BY_DESC',
            // `pagination.offset=${this.pagination.withdraw.page * this.pagination[type].size}`,
            // `pagination.limit=${this.pagination.withdraw.size}`
            // ])).data.tx_responses
            result = await getWithdrawRecord({
              'address': this.address,
              'index': this.pagination.withdraw.page,
              'limit': this.pagination.withdraw.size,
            })
            result = result.data.data.list
            break
          case 'fail':
            result = (await getFailRecord({
              'chain_id': 'Hermit',
              'limit': this.pagination[type].size,
              'index': this.pagination[type].page,
              'address': this.address
            }))
            result = result.data.data.list
            break
          case 'all':
            result = (await getRecordList({
              'address': this.address,
              'limit': this.pagination.all.size,
              'index': this.pagination.all.page
            }))
            result = result.data.data.list
        }
        // return
        if (type == 'fail') {
          for (let i = 0, len = result.length; i < len; i++) {
            const item = result[i]
            // item.icon = '/static/img/account/shibai.png'
            item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAh1BMVEWFma0AAACNj6KYhZZ2qb+PmbKSmbDsKCiHmrFdwdgt9/8Z///mLzGLnrPsKCjkMjPfNzlJ2/oP+fnrKipRwNPoLS3lMDPgNjnAX2andIDsKSnsKSrrKirsKirqKyvqKyvoKizoLjHjMzTiNTbdPEDRRkrURknGV1yzaHTmMDLdOj3YQEbtJydaCjELAAAALHRSTlMZABsdFgwI+xUSDgyjEf2ScxAJ3hG2mXgxIvfs5+HWzsyujYNjTU03KZxtW9x2g5gAAALaSURBVFjDtZjrmqIwDIa76QEoIkfxMI7jWWcm9399G8BHdyK6umbzQ7G0r18+ArRVv+6EszYJQ0URhom17l5fdRNCDAXqEvSDaO5JkEuagSzapsQ9AbIhqJsBoX0QZLmWa132AZAL1QMRur+BEvVgJBz0pBwuqh/k1FPhGIhxnidxkFVPh+WgE+cVkmJ5/XN26jUOkRjo1nUHrTW0H7dumAvojkFaR76IvY8LH2l91yZ1OzEAE8eT/Xa82Yy3+0kcG4DbyambienKH7NRGWAbQTnKjr7qUxVeQLZPTjxJ3/BHvKWTuE+UPYN65BgznuMQcViO6vW6HpXNMc7HxlyL6hi9gqCarnA4HC7SnTZRnkdG79IFNeBqWkGvJNXnkM4PSwzwPdNFZBRQKBMVOnunxuUh130uEcgB15MfmiH1NDYaLgVl4mnd4A/51QDXghLebKZLHM4yf8acUT6bDXE5NZyUNCCnrkArDGbfBcD1pSy+ZwGurkDKEchyg+IxJZAVurfUi4xOjmN+0hIo+YmHaDJHrH3X+se5U4OvEeeTiA1KCBQy+T5FLE82wIVEhycDS8TUA79uynGDjlTPme+0V7o6jW8Pm9A+oxo/cpucssAcon4fuu0H+dciNQYavEkXX3nbaPQHYsZcAqssc9OPSHnrNKhmyMCoph4HDV5B6zflPvKaua0SbnWJwa7zEvIUAxxESkUDOkhz6LrsAiyZ3YQJmaA99dKmo5KQhlRV7Zc5OW80/deeSQo5qNiSbnN2viN1nLO/hrLfFhx0XY1Yn2VDl1SXIJzTr7GnJnkVbRDXZMaF9IlBgJ8XDlm3Rtx4+E8gsdTEzBa7/GIFKXaLiN20Yo8RqQeb2KNW7OEv9jqSekGKvbKlJhFi0xqpiZbY1E9qMio4PZafsFNy8MISQnhR8xrJiS385Jei8ovj50lOagNBaEtDapNFaNtHbCNKfmtMfrNObPvwN0cXWk/Lz2TtAAAAAElFTkSuQmCC'
            // item.amount = (item.tx_amount || '0.00') / this.mainCoin.decimals + this.mainCoin.alias_name
            item.amount = '0.00'
            item.timestamp = item.timestamp.replace(/T|Z/g, ' ')
            item.timestamp = this.formatTime(new Date(new Date(item.timestamp).setHours(new Date(item.timestamp)
              .getHours() + 8)))
            item.type = 'fail'
            item.txhash = item._id
          }
        } else if (type == 'all') {
          if(!result){
            this.pagination.all.nodata = true
            this.pagination.all.loading = false
            return 
          }
          result = result.map(item => {

              let Obj = {}
              const type = item.tx.body.messages[0]['@type']
              // console.log(11111111,type);
              Obj.amount = 0
              Obj.from_address = item.tx.body.messages[0].from_address
              Obj.to_address = item.tx.body.messages[0].to_address
              // console.log(Obj.to_address);
              Obj.txhash = item.tx_response.txhash
              Obj.withdraw_address = item.tx.body.messages[0].withdraw_address
              Obj.delegator_address = item.tx.body.messages[0].delegator_address
              Obj.validator_address = item.tx.body.messages[0].validator_address
              Obj.timestamp = item.tx_response.timestamp.replace(/T|Z/g, ' ')
              Obj.timestamp = this.formatTime(new Date(new Date(Obj.timestamp).setHours(new Date(Obj.timestamp
                ).getHours() + 8)))
              item.tx.body.messages.forEach(cur => {
                if (cur.amount) {
                  if (Array.isArray(cur.amount)) {
                    Obj.amount += Number(cur.amount[0].amount)
                  } else {
                    Obj.amount += Number(cur.amount.amount)
                  }
                } else if (cur.outputs) {
                  Obj.amount = Number(cur.outputs[0]['coins'][0].amount)
                }
              })
              Obj.amount = Obj.amount / mainCoin.decimals + mainCoin.alias_name
              if (type.includes('MsgSend')) { // @tofo 区分是接收还是发送
                if (Obj.to_address == this.address) { // 领取
                  Obj.type = 'recipient'
                  Obj.plus = true
                  // item.icon = '/static/img/account/shoukuan2.png'
                  Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAflBMVEWJnbEAAACBoLCOnLPAjbyQn7EXxJmqk7qRpLfje8P/bdCKlLoXxJmLoLVspq11o68axJphrao1u6FQsqYYxJofwpwZxJowvZ8fwpscw5s3uqEYxJkbw5oiwpwZxJocw5ofwZslwZ0mwJwqvpxKtacdxJwqv51FuqQfwpwWxJlh+xLYAAAAKXRSTlMaABwXEgz5FAkPDAX8EiIe0CdPMOSe2ligwEn1xovVsJOAeWszrWg7mOn8+fMAAAM8SURBVFjDtZiJkqIwEECznQQI54CMiseo65n//8HtwJYgHQIOZVtlzaA8H52mScL+OCKSMuGcM4ZviZSR67tsEIIMBvhqov4TadF7oChIzKkk8FASRNNBkrcQCuNyIkhyNhJcTgAFxMZqFYyBJJsY0gmKiI5DKhoGBZy9ETwYAgXszQgIiKTn/UQx4vNLJzaLg6Q+KOK/A/GoB+LwOxDwV5B0cADARZJdUOBgcO67dYMOiA95h4ql+SX3X+D9NLUgabdhYbraV+XWKwsBLVxwWzWxISFgKj39xBoj1scnCPy0SH2gSmxACHx+XuomOkYgFl+6AosSswuByA9GRS+Pt1Wx8DscBC+okgEFYOHcv7SnvesGRBiqDucHDz96HAZBDUooR91LPGFXCMEgA2g5Bv9NyyExoMiSn9ycsM5UgwDo+qyFpawiBEnLM+eAJ+wVh/9cH3o+JCSCEiAXdjY/rNhT5CKg9bE+7xIE0TFLcdx32ZNTlDj8GfHpjRuLCD084cAX6pnhh8Zx8rs+NBDTH3zgKZbKtVPK31qvQ+LTLwAmidAKhTavoEfu9mGISUiq91jPGWNd0GFX+wxzEENzXWlzk3ZBsRfH+ht9hjsdJyCellrfwuwFhC/0YQ0ehBIURHtZvtV6FcIrSG+raletDAn84lH4MNrM/YuntxsF7RHMT4yXhrivlAP4i6Uucw7vgkDURtqADiY/qsC2cKFK45eW/z39reOMfagpjy01ciW7fQKETRiNLLxpXWbktNHhR1Ib9aUeta7oqI0VJI1sqbHFkNY2dovQJryJ2xy2IcduWgq6alMGpGuPtRFy4QUKnYgQi5yNjXJYtsMMpjTX7lZLOWqNH52JLSTu5k/ShyPq1fVNm//446gtJ5UZn6/ccntEEx+Q+MaEKEx7K++KcpKJj2y8RQRsrp7xuQvL14Npk4jNZnU7Lut/D7mtwPjUaY2nm1ieubV9yIkTrSbin1OqmI3DJ0/9vG1Z7VdpaI7ZhCZPRi95ylQ41F359Omxz7ljth28MWF3fSo/sISYt6j5wDJrDin43FJ0/uJ4/nJ9/gbCp7c05m+yzN/2mb8RNX9r7PObdfO3D/8Bd5pJv5d1m3sAAAAASUVORK5CYII='
                  Obj.showAddress = Obj.from_address
                } else { // 发送
                  // item.icon = '/static/img/account/fasong2.png'
                  Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAh1BMVEWFmbgAAACDmLp3ksCKm7YeXv+dp6rp1nOTmblwjMeRmcSMnLwhYv28tZnIwoyOmrseXv+Ml7kfYP5jhs4vaPQ5be47b+smY/r/8kggX/4gYP00a/FFducfX/8hYfwlYvpMeeEgX/4jY/skY/spZPkqZPlfhNg1a/AjYfwyafQfX/8oZfkdXv/Z8ExCAAAALHRSTlMZABocFvgUDQYgCRK+EQ8L+w7mJGhNSJUJ2tBYO+PFoTLXr6yKfihVsWHsiwfiGJoAAANXSURBVFjDtZjplqowDIBz21gKCIgs4u64zszt+z/fDYzjBVMEDsccf7D1M83WtPDnhWgv9hERABH92NOvvoVWSOQjCCHgLuUl+pEeCPL8OqQO870BoBj/QzgM456giGEYKuoB0sgpnIW6CxRzbexaxQw0VB2uFAdpIE5vEug2kAcDxbODIjEUJCIbyCPOYJLHQGxeQ2cHQ+3MLd4E+YzTk4RNUPyCw7NX1K/jOki3MaQERIXiPh7v0iDrGqgloCU6IbjXQ6IqjhLujyQK2eSgNYKEBCdZ/51uJ7PvLJDE2ezmlXybhRL1aHqA0OoPx718mFJmZkEgWezp6kcmSX0OWIFaFJIK0uXvsG1WgsJ0UlHp9+3ic4CD3UIyTD6rQctFus4OQfWFyr9uX/MSPW+C8AfkWTjBZmUmZnLKZVA4zq9FgiI+mhkDVZkCtliU4WZOnF0WBCBJxK8T3SlRtjMG8kuQ5nZWyYr+eC8dKRtmk1PCH7+YRgCaQJElbo804OygBM6ZhjcOInMDn5l0UhqwD4WV4xZMo2puYPGZS+Gzk2DlSAxysp5gqQsamEIXcnzm2DlKCpXuN+qJRBiPwcnS5hS2ceguLBhHeBCLZ4XWpFAeylZOGRHM0TH4z6DwTPHcro9dhA88YaemTNL6ZN0ax64RIAOhuzUmLeqgYNHgiMAJOIjX4Cvl+LrhMzyaOkdli4xZ25IeB0rWvA6iiva5cB/zUoelmScohoPomQpQPrya0QcHrpJ9aoVsriNSNMJjcmUadRibiyxSqiQuG9bpfl7zFmR67rXOgOQkKuXnULKA7EgRXjxzqrU35xkUdyUtB52MWTHvC6+jjPCXGSl04S/1y8LGOSB3xny4PGhel1rGEeGeXqVMIeF3FH/WU5zLZQSADYkGLEeSbmn1J0tb0kP3WiArgSDIdvRwvuEOFX6/JZukCGR+ogdmtbEEvfD6NRF5vk4Xy+r2MwktHOzb1kzuF8sUlLT17d2N1sw8ZPZxcR1rE409Wr9b2fqRbKd/b4kD0vph1LsZPVxdCB9hxSzUvz1WiCBJG7voAQ07f2tv2ElwxBbiDZuaMdusd2z8xm9Fx2+O371dJ5IvenN8/e4jjfGHLOOPfcYfRI0/Gnv/Yd3448N/ZrdPadzj92UAAAAASUVORK5CYII='
                  Obj.plus = Obj.to_address == this.address ? true : false
                  Obj.type = 'sender'
                  Obj.showAddress = Obj.to_address
                }
              } else if (type.includes('MsgDelegate')) { // 委托
                // item.icon = '/static/img/account/delegate2.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAbFBMVEWFmbgAAACjr6EtYu17lL+Hm7iSmb+bpqvPx4onXvKOmb1yjcaMnLyOmbYnXvIsYu4tY+4wZO0oX/ArYfArYfAsYe746mksX+8nXvErYO4uY+4wZO01Z+pAbONFcuE7auUyZusvZO3//yQnXvELw1z4AAAAI3RSTlMZABKeGxYLFQ78Bx8SDvmhmoLfvbanC7vvuZWKb0lBV4CPB4lby2AAAAKBSURBVFjD3djZepswEAXgKdZIQojV4MR7knn/dyxO4+IBBJMqvum5ROb/tFhogV8LcTr3iAiAiD7Xbum3YUh7hFHQawnEFQiEWWtQjrAQzIWQRlgJagHkEARBtwblIEy+DCGIgwuQg2/FhSAN34weQYMTIQFzIiQI9I/qwx+s9BPMOgrsziYs1qiAxCHPnMScT8dDtRlS1tm8hBzKmWMv+4J4UtoGpPwRcty5vlI6hlJ6CUjuAULWrsvNadqu3NxTNQt1wgHiI2/2lBZ1hia5x+yq3gnWSf+FkDXsXBDVH6yxZtO3LVgnvEOavbQ7ETUZsCQboq6lIlAn/QUhg+yRqMUpVMGWivk64R9Ij146EHVmCpU224bqpD8hP3qpIiqTKbQxJnsJ1Ml/QjDz0iyUmWwbGLsbpKWQNcZCO18n3UN+HVL2nai5zbiq+/o/AY/vIZRAV0rT+1xJC6qtGo8bOAhA/OE7m8DluLxntJJAkFzfq2HeTcqVhhxEEFg7zLtpec94IaTUMO9myj3gGiQrx5+DIAoa8j9DS53Nl1f176NmLF9rFyEfhkz2Vj6stW+ZCUN+YYooW1P6OFVrq4JQDlpFQcOkdT/TNDd82KI6G4dPbdzwe9nHf71cD8tRHBRcIJegkqgalfuZJVvxJXsa0xEdEsVbJttE8GBLdLQMQuG2hidriE47BmnZRovnoyYqzqxGKNn68RjM6iKlveE9JNiM8pRd2/RFrxfW1yjdHvP0zpV3tZNu2HmK/YU7OT9CYOAIwVIdjqezSZiD0kMNT/8YmANOeMxae+qed/CLP4pGSPo5x3UWL2f806804i9Z4q994i+i4q/Gnn9ZF399+BuQ3UgMU32hbQAAAABJRU5ErkJggg=='
                Obj.showAddress = Obj.validator_address
                Obj.type = 'delegate'
                Obj.plus = false
              } else if (type.includes('MsgUndelegate')) { // 取消委托
                // item.icon = '/static/img/account/undelegate.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAbFBMVEWJnrEAAAAfwpu0jL94oK6RnrGLnLLdgMCQnq+nlLeIn7sXxZkewZyVo7WLoLUbwpsjwJyqkb4gwpv/b9Ecwpsfw5siwpwYxJkcw5oYxJoaw5oovZ00vaE9uaFsqKkhwZwwvJ8kv5tmqKgWxJmAAELNAAAAI3RSTlMaAJ4THRYYDw0VB/qgChK9gxOWDLanjOG579ZwSUIig1iAIwaP6y4AAAKtSURBVFjDtdjpdqowEADgqWSysRRwr2ub93/HO1xbZQgh8aDzS4N8nEwcssDHRNhSVyglgJRY6dJO/TYMkQGDIO1ZqKwkjIasyicgjTARqBMhLSESUidAFiEh0MYgDYmhJyGLkBxow5CV8ERIG4JKeDLKPsScGRLMcUjyIQssBAVvGJfsELKS36WWKmuyXigUgYxzCJmTmeNh0y56UdRnMyohhzRz1GmXu2F8inFJ9yHLneveY/I8KNkehKxfp73L3Xa1Lop7z76cC0r4gHiBmR3dVQtp7sk2akFOUNJ3SLKOHSk/9ZK1mcJNSPIP4pleHpzbCl512cK59Soo6V8Ieao3zq0keFArP0MS3qBycFNLTzc+VCgRlMr/UMUbm+6mzIcWiEGp6iDrdSMAGRGUpCVIw8hNY5AyqCCQcU1QFYT4AGy7imvXOUm7Mw77RhCmQFd3j066KDEcN7AQh6hx4/pUMbxOTJkEQXNtH3XnXydGp0Gg1KPu/OvEVImQEI+6868Tg1GIjPiDEGQUQqUwCsk4hD+Xyw/GIYhAQtXO1UrEchiFICtY7YWgcNf495k5Er/DXZju0zSEExCqvz+gMt1cOzn8VRjC83dxK4mvrvK/zxiGqmCJ3MYr75cqjV0IIqZ8CUSMfUnXiPnAVyQb2at2xvBXBOlX/CF1fDryS6TwIWlDE2QTLtqmg5phz/wpW/Ap23+NmLVzbSb44McXEf6LTa6c2ygGYeKyRoi+I7bOHZYM0qkLrb6zpJTlR8XshKUfj8ZIUdNjdoaPfcJilEVRrFdburQ/sVxj+vKYx/7KU21TF+w88t2JOzptC8Gj3RyOJmMOJm1qeFADNQNzpE3cZsVa7fs2fvO3ojOk8r3b9fkHCPOPNOYfssw/9nn1QdT8o7H3H9bNPz78B9tTUDnoPZNdAAAAAElFTkSuQmCC'
                Obj.showAddress = Obj.validator_address
                Obj.type = 'undelegate'
                Obj.plus = true
              } else if (type.includes('MsgWithdrawDelegatorReward')) { // 领取奖励
                item.raw_log.replace(
                  /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                    p1) => {
                  Obj.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })
                item.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
                  Obj.withdraw_address = p1
                })
                // item.icon = '/static/img/account/lingqu.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAq1BMVEWFma0AAAB/krF0i7f89l/R1n8BMv+HmrGSmbCLmailsJsBMv+3wY+Mn7KPnbr//0ciTOwDM/6OmbaUpqQDM/8UQfVCY9oEM/4NPPkPPfb//ysIOPwLOfoyV+MCMv8KOPoTP/QCMv8HNvwsUeU2W+BRb88FNP0QPvf//w0DNP4GNf0UQfUlTusOPPgdR+8fSe46Xt4MOvkVQvIbR/AJOPsbRe8IN/wINvwBMv9VNs8jAAAAOHRSTlMZABocDRD7FQsIFP0SEQULUO4OFupzL+aNhAqynjzypXb1wkE4KNKACd3KcUqIWVQ1lWxcq1+4twEf5eQAAAP2SURBVFjDtZhpc6MwDIa9NsYcBpqQhiNXczVJ0/Tatqv//8tW5ChgA6Flqg+ZIWYeXsuSLJv8aTDb6ntCEDQhvL5lN71bC/ItTxBKcsMH4Vn+90C+7ZGcUmQRz/bbg/qC5hSVRUW/JchStei6rBYgW5AWJuxroD5paf1GkC9IaxN+Pcgm3zJbA+WcH5B0kEW/C6JWGZRzOpBIPq8fma2CfPJD8xWQqBPPGEXLfqvHRRnUr6FQHqQcLQgkYbQpMkm9gyh1Ujl5fotf4/j2eRKmDm1wE6mdGON8lSwGcDJ3sNi8yOoQz0FWVYYbk/EcSmZuOD0NlouV9QWqksPiKbioZHo/mr2P7ucumHDPQppxJGMOKdgFZFVwJg9guhDNPtYsdJyQrZ9mOzOWGYcZN7vdUtKyJFLlIWY8DlDAIBlueZh5nZCQb4dLEp44PRdiXgCJE8immp4jZzQMnEv4IIw5nNATB1zzbxFE7SPIU/3MJwNw3UQiphwOF44Je14a8jKQr60XW+Crd6leur/03BrKmI8gS3s3Rk6SsjqOCchRBi0EeVSd2NSFkaTf0EOo94f4QvXQGGAwdJr16AWc2ArHWWHsJQFr1KMZYpTCyNIEYIeCmvXopZL0lYyXC4DZln3VkTLnrIepghHj6TEEH5fkdLaSVuihnCuqECPK+oNngOk6pEeOHL6tONP0EGe5dFRvq6D0DTDJL5H5CdGNwY6cQUHPX/OSIjlIS48YYBSeJ7beAfSQVNZD5RhgLJXJaaBX9LVDzw/7rAbcGLmeJpCu6P2y+NS4M03oPT7meo5KZwCvqrsbpoZPSEIpUZQlcSF+PgESNSy1Vbs9OTsnmS6aWeTQB4C9EvuiavnnuPxFTa5b1INrMAV4UkFqQMqsqD1xWtC0n8/3OSdbfReileJsT0uRMEuRlBX+4cslR04uegywUMtMX0vaYKMkrZIQGO4RwCFlStLqZeQlKyMGK8KZ8iV3qpUH+3ph0z40ABhzqha2qlLbAxg5ig9y34/A7S0VEPWqin9wLP5bRis4LEjArCigVsV2RM7bUUCprmebZd8D0/u26g1yhTnhJlzdIJnDD6aZx1BuXr5la9VZ37KlMRzh39NHQ1VE7eYmItoUm4hguEH8qdIpJurbGgPbmmwW4481zdoaim1NBC7650XnEKux0TocGy2Y3v87N1r4OIhxgGh2pfVbjqdQsvlsUtlZWFeb0ZfDIjpD3OhhM5SyKrhEq/Z49fR2eI2Tu+dVGNREu92qYZdpakhuBIGkLRp2NEGvHCHqxsWvHGq6H7O6H/x+7yja/XDc/bje/QLht680ul+ydL/26X4R1f1q7Pcv67pfH/4H7tBmclAtyEsAAAAASUVORK5CYII='
                Obj.plus = Obj.withdraw_address == this.address ? true : false
                Obj.showAddress = Obj.withdraw_address
                Obj.type = 'withdraw'
              } else if (type.includes('MsgSetWithdrawAddress')) { // 设置领取地址
                item.raw_log.replace(
                  /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                    p1) => {
                  Obj.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })
                item.raw_log.replace(/"key":"withdraw_address","value":"([0-9a-z]*)"/, (match, p1) => {
                  Obj.withdraw_address = p1
                })
                // item.icon = '/static/img/account/lingqu.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAq1BMVEWFma0AAAB/krF0i7f89l/R1n8BMv+HmrGSmbCLmailsJsBMv+3wY+Mn7KPnbr//0ciTOwDM/6OmbaUpqQDM/8UQfVCY9oEM/4NPPkPPfb//ysIOPwLOfoyV+MCMv8KOPoTP/QCMv8HNvwsUeU2W+BRb88FNP0QPvf//w0DNP4GNf0UQfUlTusOPPgdR+8fSe46Xt4MOvkVQvIbR/AJOPsbRe8IN/wINvwBMv9VNs8jAAAAOHRSTlMZABocDRD7FQsIFP0SEQULUO4OFupzL+aNhAqynjzypXb1wkE4KNKACd3KcUqIWVQ1lWxcq1+4twEf5eQAAAP2SURBVFjDtZhpc6MwDIa9NsYcBpqQhiNXczVJ0/Tatqv//8tW5ChgA6Flqg+ZIWYeXsuSLJv8aTDb6ntCEDQhvL5lN71bC/ItTxBKcsMH4Vn+90C+7ZGcUmQRz/bbg/qC5hSVRUW/JchStei6rBYgW5AWJuxroD5paf1GkC9IaxN+Pcgm3zJbA+WcH5B0kEW/C6JWGZRzOpBIPq8fma2CfPJD8xWQqBPPGEXLfqvHRRnUr6FQHqQcLQgkYbQpMkm9gyh1Ujl5fotf4/j2eRKmDm1wE6mdGON8lSwGcDJ3sNi8yOoQz0FWVYYbk/EcSmZuOD0NlouV9QWqksPiKbioZHo/mr2P7ucumHDPQppxJGMOKdgFZFVwJg9guhDNPtYsdJyQrZ9mOzOWGYcZN7vdUtKyJFLlIWY8DlDAIBlueZh5nZCQb4dLEp44PRdiXgCJE8immp4jZzQMnEv4IIw5nNATB1zzbxFE7SPIU/3MJwNw3UQiphwOF44Je14a8jKQr60XW+Crd6leur/03BrKmI8gS3s3Rk6SsjqOCchRBi0EeVSd2NSFkaTf0EOo94f4QvXQGGAwdJr16AWc2ArHWWHsJQFr1KMZYpTCyNIEYIeCmvXopZL0lYyXC4DZln3VkTLnrIepghHj6TEEH5fkdLaSVuihnCuqECPK+oNngOk6pEeOHL6tONP0EGe5dFRvq6D0DTDJL5H5CdGNwY6cQUHPX/OSIjlIS48YYBSeJ7beAfSQVNZD5RhgLJXJaaBX9LVDzw/7rAbcGLmeJpCu6P2y+NS4M03oPT7meo5KZwCvqrsbpoZPSEIpUZQlcSF+PgESNSy1Vbs9OTsnmS6aWeTQB4C9EvuiavnnuPxFTa5b1INrMAV4UkFqQMqsqD1xWtC0n8/3OSdbfReileJsT0uRMEuRlBX+4cslR04uegywUMtMX0vaYKMkrZIQGO4RwCFlStLqZeQlKyMGK8KZ8iV3qpUH+3ph0z40ABhzqha2qlLbAxg5ig9y34/A7S0VEPWqin9wLP5bRis4LEjArCigVsV2RM7bUUCprmebZd8D0/u26g1yhTnhJlzdIJnDD6aZx1BuXr5la9VZ37KlMRzh39NHQ1VE7eYmItoUm4hguEH8qdIpJurbGgPbmmwW4481zdoaim1NBC7650XnEKux0TocGy2Y3v87N1r4OIhxgGh2pfVbjqdQsvlsUtlZWFeb0ZfDIjpD3OhhM5SyKrhEq/Z49fR2eI2Tu+dVGNREu92qYZdpakhuBIGkLRp2NEGvHCHqxsWvHGq6H7O6H/x+7yja/XDc/bje/QLht680ul+ydL/26X4R1f1q7Pcv67pfH/4H7tBmclAtyEsAAAAASUVORK5CYII='
                Obj.plus = Obj.withdraw_address == this.address ? true : false
                Obj.showAddress = Obj.withdraw_address
                Obj.type = 'setWithdrawAddress'
              } else if (type.includes('MsgExecuteContract')) { // 调用合约
                // item.icon = '/static/img/account/contract.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAdVBMVEWFmbgAAACBlrqirqEtYu2Xo691kMGImrrNyIuRmcEnXvGQmrqMnbsnXvIsYu4xZey0tJwrYPAtY+4wZOxph8srYfAsYe746mkoX/ArYO4uY+4wZO01Z+pAbONFcuE7auUnXfEoX/EvZO3//yQpX/BuicQnXvGiy8A5AAAAJnRSTlMZABoTnhQdFQ4K/QYO+aGBEbyahCK2pwvhuZWKb0lBV/DtjwfWIAfTBY4AAALOSURBVFjDvZiJcuIwDIa1CvKBDUnTch+9tn7/R1xRlmptYuqM6f7DDDMYf5EsK7YEv27IWU9aA0tr8tbd+i/cgGhAABGCZthIkCUQiggByI4AeY0IGSFqXwiykKGIXbYA5DQUSLvvQB4K5VPQaHPEqDzIwSi5HMjCSNlhkMWxILQxSDgVJBj2C5XCWApveweD64xoVqbrmn9kaJjkElAUd9XRYb/b9hPRvP0gNeScjkE+GjTHzSzEmoYHNWyTF1DimDLPL2GacGazE0nlnYMrx7A7voZZWC+W88lF/W9G5WzSArKRY7ThWa3S1FxEq55NzNpkv0CxY4fZNLTvTBTRhNl5my4gH4FW+xDWChBE2ExCWC6yNvkTKA09drsQFvxTCurhIWRs0meQxRi05acTXoHmRj1kbEL7CSKIQT1Paq5BEyKVs4lOIAdwPWkI1Kg8yTHIloJMQwYWwyTLII8ZEKpL1mP3xpE8ZVy/nPKO2nwkJPQM0hmLkMwl6zlpwvScNPzN+6k1mMYNHAyDkJ7a+Snrnwg/TZpK4qXBYDmwmAGZR57Bn8fPpzfPb/1X3vF4OsuChyIQGiN5dw1iDJW4xlKSd0MgAg3fLvbweCwtoHz4y0BwC5RIYQYkyruWnCQjQbLYor8LPw4k4Redt0IepCtBErU61wRE91lsAn+f8HuwWAWSpHX3cc3Ji61qsbW8aqvCj15e/lUgsHIc1bnmBg7I5nxA5hd7HkKfgCh/ZOfDT8sQtl08x5ZcIlLpRQg7E4F0wbUmFYJah7BfqWhbl160RADvLd+5DiYClV79RKRVy4/ZEEaxL7yMiubLxZqHXo/RWuvS63G6K1+eY8fcmAu7aLY5xiHzSQmB2RJC1G93+wN1KiohyosaUdfxz0kl70aVWSKlYo79ucKvvhStL47ry/WfbyDUtzTqmyz1bZ/6RlR9a+z/NOvq24d/AG+GXA7OqF3dAAAAAElFTkSuQmCC'

                Obj.showAddress = item.tx.body.messages[0].contract
                Obj.type = 'executeContract'
              } else if (type.includes('MsgInstantiateContract')) {
                // item.icon = '/static/img/account/instantiateContract.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAARVBMVEWFmbgAAACgqKokYvqRmb52j8IeXv/f0HciYP0iYfwoZPclY/onZPkgX/4jYfomY/otZ/Y7bO4/cugzavEfXf8fX/4dXv9mSxxZAAAAFnRSTlMZABKeCBz7DLy2gpqK36eVb0lAV/DtGX3ifgAAAkVJREFUWMO92NuCoyAMBuBMmkDxUHuY4f0fddHdNgtIkGXb/7LKZxCsCHwpIcIQCMEQIu1c0BBIomFQYARJMVIghdEpHSKohjRIqqmHkWoQwsGgCpE4dYnKEEFTKINyp12CyOmQIHI6JCg4zOmIVyQo1GOtxSgWNUkgjOcb3q7TMp7+ysDI2nwCcST27oyPY/yZERQJ8o6xfXz7DNokLncO8oLw/hOc2V2kX+Os1IQCUXzAhesPHN3pMTjFmugFxR27hW4NNrZPwS7X9IQohq7ezwwp5C+uWBOtUD5kk/cOc2iEc6Emxt8QJY2WcPUd6GT5XKqJNihtNIZGexAil2rCFSJIG5UgLkvUAllEC06kFEIVkgGYt5l5MbsSViB5aNZ5tMWE+MHmEIECyY+Tl5j8ONBBCPCxjPLc7UF4DAJr5bnbu9BhiOV4HwQfg6AXaj+RuReScfsfEPI0sQbhIWh78P1kuXfUVsf0Q68/on+dR/jn/j4d1CAqQ8jDwBg5RYg0yA5+bf5yWIW+UIMCAPIayqH6P6TcGicvRh2ifUgkqacMURkSSepRoPILUqTVSV/faZvqK5uRh2TRhxfvlwSi2iJCJqUE3frQxT9py5piePb+ahkkTPpCK89zlppbBEF96ZeHB2PS5RNVF6NZLm4Oh37u8fkty2OJ8d+PuGPUtGAXyN2zIat/QiQZl+l6Q+TIafmokVibDic1fGZpv9MbPvx6JHrrx3G7RG/fQOjf0mgvCukD2z79G1FtFNJnNuv6tw9/AUmcLnjrdYMbAAAAAElFTkSuQmCC'
                Obj.type = 'instantiateContract'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('MsgUnjail')) { // 节点激活
                // @todo icon input
                // item.icon = '/static/img/account/active.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAdVBMVEWEmbkAAABzj8OJm7fw32aRm76Lnr/BupIpZfiNnbujqqUmY/oqZvZCc+YfX/4gYP4lYvowaPRSfNwfX/4gX/4sZvYfXv82be7//wUhYPwjYPwpZPkjYvw7bu1Id+MeXv8fXv4iYP4nY/gyavFhg9IgX/4dXv/O5aNUAAAAJnRSTlMZAB0WCwoFEHoPE5R0O+PQn2Qs6Ntu81AGyLN+p0c1+O27hVsj0piwDVMAAALWSURBVFjDvZjrdqowEIXnzORiAlhFLd5tazvv/4gn6loNEjopxXb/UBaRz5mETHYC/wQZ7RwRAYQP57SRfgsChKAjEmCQpcgsGaQJBJEWQAJGQIkgEzESyuRADr4pJ4CEcMSgUpCBQTIpSO5luc9TkIbB0gkox8mTQOifQf0EkTOOBPK450X3IAc/lougJDEMgqjMfdMC0d3PvVLKxydyDRRBGtpS9bycH1UKUsfQUKv+dwC6AaFdTZn5ZeKhIz95CQ3TlcW+kKATEKoV3/SmgFoC9cY3rRT2hAT3AaGvl8yb3Svzc0XYElXPzK+7DfOy9piGBN2A5oGDym9DEk9XfXzcvkPCW68wkOZpSFeQuwOVzDv7fk0w0Uq92x1zmYDcBWSgG9HW2vUs5DZdLBbT59bFbG3tti8iMAGk70C2WoQHzsWJ+XysqqoumIs6XBzPzKfiHP5gUVlM3wDozA78HJyZ8tb6dRlSWV+u1OxzOLFnnkAyXangi/ZIGGQnzBOLQYT7a0NBvQUcTHLPHop90Xi6BXgB3UIg34SGg+0DBYxO47RqrSxAFxQbUqEGJ83yCIr3++UiKFUK8p7wKxB9G4Re1dW76kfRAJA97pfT5ay2+GOQxSB/WPBFy8pjHwjyoPKfVUrRU5gsy1MoAcJDMmhbTiaTcsY8PfgmFLdG9SaXBUXt1qiKa2VLMX8AGpYagXtMZztw44Y/gjQ+4oVEDeYxU8SAoUdMWjIgGJEBZcTF4t9SujxlC5uOy1FUsjwVNltqzXWBFEEN88ZDpvi7uGQnanuBUmWWIx1NhNjbp6I5SAskRVsjyG856GUhLNk6Gi1BhMVJNhHUsn4iyTbF62bzta3RbTMqCa0lwWhRxx5LJATB+pmsYZfNaGrYpeTy9pgGbGpEw24Gb7P6Z7/5hY3fGJL+jc3x+O36+AOEPzjSGHPIMv7YZ/xB1PijsT85rBt/fPgfM5xLo+CzTa0AAAAASUVORK5CYII='
                Obj.type = 'MsgUnjail'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('RaAuthenticate')) { // 节点注册
                // @todo icon input
                // item.icon = '/static/img/account/register.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAdVBMVEWFmbgAAAB1kcGZpazw3maRmb+Nm7opZfjNwIm1sZkfX/4qZvVGdeU3be5SfdsfXv4mY/ooZPgfXv8hX/wjYPwlYvorZvb//wkfXv4fX/4iYf4jYvsmY/ovZ/Uya/E6be1Ab+hhg9EgYP0kYvoyafInY/kdXv/m70SVAAAAJnRSTlMZABwUCwkQew8R23Q4TyzhkYD0yLKdbgft57uolmdZRkIk0aFhiFc5o+gAAAIxSURBVFjDtJXrjqowFIW33bulXAUV8TrqnDnr/R/xAJM5P6BSmnQ+E2MkfFkL2l3aLKC1MUwjbIzWmwXovaV3TGCjQ0Xa0BuMDhAZWsSsFGnyoleINNMKWPtEhlZilkVMq+EFkaYg9Ezk9/hN5PaEm8jtCTeR2xNuIrcn3ERB710p9W4VUMA6VCwirNwrkwKKSXHPvypxl6P1xTg5AdgeU2c5WhNobCMNvjmKckSi8cuDtURc7IBLsweyalrgR6R9nrK+7Pdb4MCietOXKxL5A6ka/0u9bAPkU9Eo8QbiA3pO5x3QdtYegPtMpEeRWYwjCYBb+Sw+gN3t4w9wLlLHlCNPM64yIO9sytI7Rv6KoimDSC8H6oPsmdTwuWLg5t5x5Gt2B+rvKszl7Vo/LDkwvYiXRTnQ/NybSifpmwFOmrzPOhE12f1ztEukmFlNRJMLDpGZx5RXUQnPRSxV8RImF2YuSqs222bXIp2K0uLaX2ir1C3iaZ4iw8D5warHDiKrevhxxkBWuDI5/rsAyHbAJ4mI3eRAvrEiQp/ALgNwoRUoKYFTyc8t0OZJkuQH4DD+aIHtk8sTUIpaIToCtaiugYOmU1IDx4iiX6wW7WFHe/3RFmS0LRJt00YbI7EGW7RRG234xzqOoh2QwUf2v1bskwAAAIBhGJ5/w3NQFBU9C2QLiWBao0SLqZ+SUabHSthVQrCoUZmlwk+lqIpjletoIKiloSYL2j5sRPk15mcd24cHprtHUn/pMv0AAAAASUVORK5CYII='
                Obj.type = 'RaAuthenticate'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('MsgStoreCode')) { // 节点激活
                // @todo icon input
                // item.icon = '/static/img/account/upload.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAASFBMVEWFmbkAAACqraQkYvp3kMGRm7/WyIOPmLoiYP0lYvooZPciYfxriMr78EEkYfooZPkfX/4fXv8tZ/U7bO4/cugzavEhX/4dXv+CWpmlAAAAF3RSTlMYABGeHAcODbyZg7YgCaeL4e9vSUFX1grnJKMAAAJaSURBVFjDtdiLlqMgDADQbJpA8dnn+v9/uuLWSSPyqExz5syMWK5QDQLwJxHMFuEVaJlTn4U4ghAEMn8IiRJaH0AWkmHzkDA5Kg8xFAXnIAuFYZMQwwfBGto4hyXQznEJlFMhgXIqJIg4NIcuWH4FP7yFeFPL9AZVGKBEmwTSDuL9Njp3eoumw31JQ1Y55nGegjgT7Er2HWLtPK+KyEj8BikHH965tIP0y/1NSQJtEqydKzUEgD/Ru1Sb7A+kO3b3Tq8beUr2boX0N93f5n5tPu6hoY1K9gWBbtE4TS2EkINzVPoP8aaSm6++A50MRSVeIAyhE+5AAFEJPcTB1SMQUlziGbKlkEEw0C4SbiU7Q5iE5AZclidzmLzUBX2bISiBnpOKxtD2vgGnICkcFRScBy6EAJ/OSd7tQbYMAmMk78LzM4OFENHrb6TFAHmIqOBCeYjAGKB6iLBr/HhdC/m0kKw4Bokj0hFIHJGOQOKIdBQiFEdyPgIlH8jOO+2wjtddKoUSKUKm8dXBreN1YygKWeA0dCazjtcCfZz9/lEE8Mfr/wkoObAZsybpkigJKDPUEskxUQLC3OCfP5bBn38D4vwLkkyz3i+B3LbOziub1Ctb7p3E4CHSDSqbRBiznT6NRkOF0xrSR5dpuvWqyOYnWmH0Pm/uukWlUz8JAPJOCyps6WRUYmgv86nrQ3/X5dNjHden7hgXT9h1nB/ascVLCAnnxtsdUTlQuqjRMReDdrhwmZUr5e8t/OqXohUSf2e5fljib29p1G+y1G/71G9E1W+NfX+zrn778B8tNza+YuEqtwAAAABJRU5ErkJggg=='
                Obj.type = 'MsgStoreCode'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('MsgCreateValidator')) {
                // @todo icon input
                // item.icon = '/static/img/account/createvalidate.png'
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAYFBMVEWFmbgAAABzjcOOnbb25F6bp6uRm78fX/9Tf9spZfgfX/7RxIePmLopZPcrZvYhYPwtZ/UpZPgeXv8mYfpKeOEgX/4iYP0mY/o0bPBkhs0fXv8jYvpCdOYhYPwuZ/IdXv9u+kw2AAAAH3RSTlMZAB0UCxUH5yp72g8NgnO2boX5mjLSvZJVI/GoPcljTaZxNgAAAuZJREFUWMO9mOtyqyAQgFdXUALx0ph7W97/Lc8G4kHZBHWc9PtRO0Pmm+WyLABZAikNIgJBHyNllgDeS0gRgSjlSpFEeAPKFSKDkADNQpGBWcyMiHdqeQchEc6qoGB1ODwoLpKwCslE3LPeBBPPBhOMPVtMMPJsMsE2D5kiEYamfGCRCAcRW4eiGBBrVibEHRNVqzx1tcwkRyIceY524LjMhEFkwvgUrf3yGvrWRb64c+D+jETK2qZ+dKyxdu9EIgKYfRCZSFRnutCZ8iIhqggskIXkRRiJlKa5150Tiet9N+X4c74KPkoQpiyIipz+2TtRcbGcYx+ZpBMhJCLC672ccqPJOPGJAxdQaowwj7iU1l50FBKJDBM1ar/v1Mnazs0aToGsG1oChkQ4FdW0fgZerqNc19aeoxYcRGtWtm6tPXCRBIhM9d7R+VzDJ2kRSCYCHGe/EPkTIWZEBhhhPxJ9Uz5pepESGUiX+cb+p8GUCF+LfDyAeWm/do4vW+boW4ph1mZFuXAj5EW774r43nkRtWhBYSouekHR/9aqrYQXVRpRV15EU6oeK/VGAzaPUKUlDk9RTzmC/VN08MtVaZhHK7c9vhMRpVoUT3+j7Faqft21VtW/fQEONko8a4V+O9iEyF9ouOjskjUx/UGTFtEwtDqxID1cZBIiliLvi7kBmRDFSRuqOYtOpkUEPvE7TLd30JQyUYYJUXLP4zsknzWdc49LVl7Ng8hEP39s7RnglKHlpKhzimetGcpRQF8oBy55BApfMpWrVDUTyVAgAycK/VZOuV/RiTpXO1UsQlayCdEfLedSDEU8lPWoZLOQxPX8c9xNuV9FIiJkxxoPFlhFiOQYGX7Q8uQgIvyshTPYVMSOfow31Zy+7Uhk2GE0sGZlIzsez5tq5WnJw4/Hs51Ln+UNu0IkSNwu8AOXmk0m+YGL3xaT/OjleL1Jfv4BYfuTxvZHlu3PPtsforY/jf3NY93258N/ghlG2yH6OEkAAAAASUVORK5CYII='
                Obj.type = 'MsgCreateValidator'
                Obj.showAddress = this.$cache.get('_currentWallet').address
              } else if (type.includes('MsgMultiSend')) {
                Obj.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAflBMVEWJnbEAAACBoLCOnLPAjbyQn7EXxJmqk7qRpLfje8P/bdCKlLoXxJmLoLVspq11o68axJphrao1u6FQsqYYxJofwpwZxJowvZ8fwpscw5s3uqEYxJkbw5oiwpwZxJocw5ofwZslwZ0mwJwqvpxKtacdxJwqv51FuqQfwpwWxJlh+xLYAAAAKXRSTlMaABwXEgz5FAkPDAX8EiIe0CdPMOSe2ligwEn1xovVsJOAeWszrWg7mOn8+fMAAAM8SURBVFjDtZiJkqIwEECznQQI54CMiseo65n//8HtwJYgHQIOZVtlzaA8H52mScL+OCKSMuGcM4ZviZSR67tsEIIMBvhqov4TadF7oChIzKkk8FASRNNBkrcQCuNyIkhyNhJcTgAFxMZqFYyBJJsY0gmKiI5DKhoGBZy9ETwYAgXszQgIiKTn/UQx4vNLJzaLg6Q+KOK/A/GoB+LwOxDwV5B0cADARZJdUOBgcO67dYMOiA95h4ql+SX3X+D9NLUgabdhYbraV+XWKwsBLVxwWzWxISFgKj39xBoj1scnCPy0SH2gSmxACHx+XuomOkYgFl+6AosSswuByA9GRS+Pt1Wx8DscBC+okgEFYOHcv7SnvesGRBiqDucHDz96HAZBDUooR91LPGFXCMEgA2g5Bv9NyyExoMiSn9ycsM5UgwDo+qyFpawiBEnLM+eAJ+wVh/9cH3o+JCSCEiAXdjY/rNhT5CKg9bE+7xIE0TFLcdx32ZNTlDj8GfHpjRuLCD084cAX6pnhh8Zx8rs+NBDTH3zgKZbKtVPK31qvQ+LTLwAmidAKhTavoEfu9mGISUiq91jPGWNd0GFX+wxzEENzXWlzk3ZBsRfH+ht9hjsdJyCellrfwuwFhC/0YQ0ehBIURHtZvtV6FcIrSG+raletDAn84lH4MNrM/YuntxsF7RHMT4yXhrivlAP4i6Uucw7vgkDURtqADiY/qsC2cKFK45eW/z39reOMfagpjy01ciW7fQKETRiNLLxpXWbktNHhR1Ib9aUeta7oqI0VJI1sqbHFkNY2dovQJryJ2xy2IcduWgq6alMGpGuPtRFy4QUKnYgQi5yNjXJYtsMMpjTX7lZLOWqNH52JLSTu5k/ShyPq1fVNm//446gtJ5UZn6/ccntEEx+Q+MaEKEx7K++KcpKJj2y8RQRsrp7xuQvL14Npk4jNZnU7Lut/D7mtwPjUaY2nm1ieubV9yIkTrSbin1OqmI3DJ0/9vG1Z7VdpaI7ZhCZPRi95ylQ41F359Omxz7ljth28MWF3fSo/sISYt6j5wDJrDin43FJ0/uJ4/nJ9/gbCp7c05m+yzN/2mb8RNX9r7PObdfO3D/8Bd5pJv5d1m3sAAAAASUVORK5CYII='
                Obj.type = 'recipient'
                Obj.showAddress = item.tx.body.messages[0].inputs[0]['address']
                Obj.plus = true
              }
            return Obj
          })
        } else {
          for (let i = 0, len = result.length; i < len; i++) {
            const item = result[i]
            item.fee = item.tx.auth_info.fee.amount[0].amount / mainCoin.decimals + mainCoin.alias_name
            item.amount = 0
            item.memo = item.tx.body.memo
            item.txhash = item.tx_response['txhash']
            item.from_address = item.tx.body.messages[0].from_address
            item.to_address = item.tx.body.messages[0].to_address
            item.delegator_address = item.tx.body.messages[0].delegator_address
            item.validator_address = item.tx.body.messages[0].validator_address
            item.timestamp = item.tx_response.timestamp.replace(/T|Z/g, ' ')
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
                // item.icon = '/static/img/account/shoukuan2.png'
                item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAflBMVEWJnbEAAACBoLCOnLPAjbyQn7EXxJmqk7qRpLfje8P/bdCKlLoXxJmLoLVspq11o68axJphrao1u6FQsqYYxJofwpwZxJowvZ8fwpscw5s3uqEYxJkbw5oiwpwZxJocw5ofwZslwZ0mwJwqvpxKtacdxJwqv51FuqQfwpwWxJlh+xLYAAAAKXRSTlMaABwXEgz5FAkPDAX8EiIe0CdPMOSe2ligwEn1xovVsJOAeWszrWg7mOn8+fMAAAM8SURBVFjDtZiJkqIwEECznQQI54CMiseo65n//8HtwJYgHQIOZVtlzaA8H52mScL+OCKSMuGcM4ZviZSR67tsEIIMBvhqov4TadF7oChIzKkk8FASRNNBkrcQCuNyIkhyNhJcTgAFxMZqFYyBJJsY0gmKiI5DKhoGBZy9ETwYAgXszQgIiKTn/UQx4vNLJzaLg6Q+KOK/A/GoB+LwOxDwV5B0cADARZJdUOBgcO67dYMOiA95h4ql+SX3X+D9NLUgabdhYbraV+XWKwsBLVxwWzWxISFgKj39xBoj1scnCPy0SH2gSmxACHx+XuomOkYgFl+6AosSswuByA9GRS+Pt1Wx8DscBC+okgEFYOHcv7SnvesGRBiqDucHDz96HAZBDUooR91LPGFXCMEgA2g5Bv9NyyExoMiSn9ycsM5UgwDo+qyFpawiBEnLM+eAJ+wVh/9cH3o+JCSCEiAXdjY/rNhT5CKg9bE+7xIE0TFLcdx32ZNTlDj8GfHpjRuLCD084cAX6pnhh8Zx8rs+NBDTH3zgKZbKtVPK31qvQ+LTLwAmidAKhTavoEfu9mGISUiq91jPGWNd0GFX+wxzEENzXWlzk3ZBsRfH+ht9hjsdJyCellrfwuwFhC/0YQ0ehBIURHtZvtV6FcIrSG+raletDAn84lH4MNrM/YuntxsF7RHMT4yXhrivlAP4i6Uucw7vgkDURtqADiY/qsC2cKFK45eW/z39reOMfagpjy01ciW7fQKETRiNLLxpXWbktNHhR1Ib9aUeta7oqI0VJI1sqbHFkNY2dovQJryJ2xy2IcduWgq6alMGpGuPtRFy4QUKnYgQi5yNjXJYtsMMpjTX7lZLOWqNH52JLSTu5k/ShyPq1fVNm//446gtJ5UZn6/ccntEEx+Q+MaEKEx7K++KcpKJj2y8RQRsrp7xuQvL14Npk4jNZnU7Lut/D7mtwPjUaY2nm1ieubV9yIkTrSbin1OqmI3DJ0/9vG1Z7VdpaI7ZhCZPRi95ylQ41F359Omxz7ljth28MWF3fSo/sISYt6j5wDJrDin43FJ0/uJ4/nJ9/gbCp7c05m+yzN/2mb8RNX9r7PObdfO3D/8Bd5pJv5d1m3sAAAAASUVORK5CYII='
                item.type = 'recipient'
                item.showAddress = item.from_address
                item.plus = true
                break
              case 'sender':
                // item.icon = '/static/img/account/fasong2.png'
                item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAh1BMVEWFmbgAAACDmLp3ksCKm7YeXv+dp6rp1nOTmblwjMeRmcSMnLwhYv28tZnIwoyOmrseXv+Ml7kfYP5jhs4vaPQ5be47b+smY/r/8kggX/4gYP00a/FFducfX/8hYfwlYvpMeeEgX/4jY/skY/spZPkqZPlfhNg1a/AjYfwyafQfX/8oZfkdXv/Z8ExCAAAALHRSTlMZABocFvgUDQYgCRK+EQ8L+w7mJGhNSJUJ2tBYO+PFoTLXr6yKfihVsWHsiwfiGJoAAANXSURBVFjDtZjplqowDIBz21gKCIgs4u64zszt+z/fDYzjBVMEDsccf7D1M83WtPDnhWgv9hERABH92NOvvoVWSOQjCCHgLuUl+pEeCPL8OqQO870BoBj/QzgM456giGEYKuoB0sgpnIW6CxRzbexaxQw0VB2uFAdpIE5vEug2kAcDxbODIjEUJCIbyCPOYJLHQGxeQ2cHQ+3MLd4E+YzTk4RNUPyCw7NX1K/jOki3MaQERIXiPh7v0iDrGqgloCU6IbjXQ6IqjhLujyQK2eSgNYKEBCdZ/51uJ7PvLJDE2ezmlXybhRL1aHqA0OoPx718mFJmZkEgWezp6kcmSX0OWIFaFJIK0uXvsG1WgsJ0UlHp9+3ic4CD3UIyTD6rQctFus4OQfWFyr9uX/MSPW+C8AfkWTjBZmUmZnLKZVA4zq9FgiI+mhkDVZkCtliU4WZOnF0WBCBJxK8T3SlRtjMG8kuQ5nZWyYr+eC8dKRtmk1PCH7+YRgCaQJElbo804OygBM6ZhjcOInMDn5l0UhqwD4WV4xZMo2puYPGZS+Gzk2DlSAxysp5gqQsamEIXcnzm2DlKCpXuN+qJRBiPwcnS5hS2ceguLBhHeBCLZ4XWpFAeylZOGRHM0TH4z6DwTPHcro9dhA88YaemTNL6ZN0ax64RIAOhuzUmLeqgYNHgiMAJOIjX4Cvl+LrhMzyaOkdli4xZ25IeB0rWvA6iiva5cB/zUoelmScohoPomQpQPrya0QcHrpJ9aoVsriNSNMJjcmUadRibiyxSqiQuG9bpfl7zFmR67rXOgOQkKuXnULKA7EgRXjxzqrU35xkUdyUtB52MWTHvC6+jjPCXGSl04S/1y8LGOSB3xny4PGhel1rGEeGeXqVMIeF3FH/WU5zLZQSADYkGLEeSbmn1J0tb0kP3WiArgSDIdvRwvuEOFX6/JZukCGR+ogdmtbEEvfD6NRF5vk4Xy+r2MwktHOzb1kzuF8sUlLT17d2N1sw8ZPZxcR1rE409Wr9b2fqRbKd/b4kD0vph1LsZPVxdCB9hxSzUvz1WiCBJG7voAQ07f2tv2ElwxBbiDZuaMdusd2z8xm9Fx2+O371dJ5IvenN8/e4jjfGHLOOPfcYfRI0/Gnv/Yd3448N/ZrdPadzj92UAAAAASUVORK5CYII='
                item.type = 'sender'
                item.plus = item.to_address == this.address ? true : false
                item.showAddress = item.to_address
                break
              case 'delegate':
                item.type = 'delegate'
                if (item.tx.body.messages[0]['@type'].includes('MsgDelegate')) {
                  // item.icon = '/static/img/account/delegate2.png'
                  item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAbFBMVEWFmbgAAACjr6EtYu17lL+Hm7iSmb+bpqvPx4onXvKOmb1yjcaMnLyOmbYnXvIsYu4tY+4wZO0oX/ArYfArYfAsYe746mksX+8nXvErYO4uY+4wZO01Z+pAbONFcuE7auUyZusvZO3//yQnXvELw1z4AAAAI3RSTlMZABKeGxYLFQ78Bx8SDvmhmoLfvbanC7vvuZWKb0lBV4CPB4lby2AAAAKBSURBVFjD3djZepswEAXgKdZIQojV4MR7knn/dyxO4+IBBJMqvum5ROb/tFhogV8LcTr3iAiAiD7Xbum3YUh7hFHQawnEFQiEWWtQjrAQzIWQRlgJagHkEARBtwblIEy+DCGIgwuQg2/FhSAN34weQYMTIQFzIiQI9I/qwx+s9BPMOgrsziYs1qiAxCHPnMScT8dDtRlS1tm8hBzKmWMv+4J4UtoGpPwRcty5vlI6hlJ6CUjuAULWrsvNadqu3NxTNQt1wgHiI2/2lBZ1hia5x+yq3gnWSf+FkDXsXBDVH6yxZtO3LVgnvEOavbQ7ETUZsCQboq6lIlAn/QUhg+yRqMUpVMGWivk64R9Ij146EHVmCpU224bqpD8hP3qpIiqTKbQxJnsJ1Ml/QjDz0iyUmWwbGLsbpKWQNcZCO18n3UN+HVL2nai5zbiq+/o/AY/vIZRAV0rT+1xJC6qtGo8bOAhA/OE7m8DluLxntJJAkFzfq2HeTcqVhhxEEFg7zLtpec94IaTUMO9myj3gGiQrx5+DIAoa8j9DS53Nl1f176NmLF9rFyEfhkz2Vj6stW+ZCUN+YYooW1P6OFVrq4JQDlpFQcOkdT/TNDd82KI6G4dPbdzwe9nHf71cD8tRHBRcIJegkqgalfuZJVvxJXsa0xEdEsVbJttE8GBLdLQMQuG2hidriE47BmnZRovnoyYqzqxGKNn68RjM6iKlveE9JNiM8pRd2/RFrxfW1yjdHvP0zpV3tZNu2HmK/YU7OT9CYOAIwVIdjqezSZiD0kMNT/8YmANOeMxae+qed/CLP4pGSPo5x3UWL2f806804i9Z4q994i+i4q/Gnn9ZF399+BuQ3UgMU32hbQAAAABJRU5ErkJggg=='
                  item.plus = false
                } else if (item.tx.body.messages[0]['@type'].includes('MsgUndelegate')) {
                  // item.icon = '/static/img/account/undelegate.png'
                  item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAbFBMVEWJnrEAAAAfwpu0jL94oK6RnrGLnLLdgMCQnq+nlLeIn7sXxZkewZyVo7WLoLUbwpsjwJyqkb4gwpv/b9Ecwpsfw5siwpwYxJkcw5oYxJoaw5oovZ00vaE9uaFsqKkhwZwwvJ8kv5tmqKgWxJmAAELNAAAAI3RSTlMaAJ4THRYYDw0VB/qgChK9gxOWDLanjOG579ZwSUIig1iAIwaP6y4AAAKtSURBVFjDtdjpdqowEADgqWSysRRwr2ub93/HO1xbZQgh8aDzS4N8nEwcssDHRNhSVyglgJRY6dJO/TYMkQGDIO1ZqKwkjIasyicgjTARqBMhLSESUidAFiEh0MYgDYmhJyGLkBxow5CV8ERIG4JKeDLKPsScGRLMcUjyIQssBAVvGJfsELKS36WWKmuyXigUgYxzCJmTmeNh0y56UdRnMyohhzRz1GmXu2F8inFJ9yHLneveY/I8KNkehKxfp73L3Xa1Lop7z76cC0r4gHiBmR3dVQtp7sk2akFOUNJ3SLKOHSk/9ZK1mcJNSPIP4pleHpzbCl512cK59Soo6V8Ieao3zq0keFArP0MS3qBycFNLTzc+VCgRlMr/UMUbm+6mzIcWiEGp6iDrdSMAGRGUpCVIw8hNY5AyqCCQcU1QFYT4AGy7imvXOUm7Mw77RhCmQFd3j066KDEcN7AQh6hx4/pUMbxOTJkEQXNtH3XnXydGp0Gg1KPu/OvEVImQEI+6868Tg1GIjPiDEGQUQqUwCsk4hD+Xyw/GIYhAQtXO1UrEchiFICtY7YWgcNf495k5Er/DXZju0zSEExCqvz+gMt1cOzn8VRjC83dxK4mvrvK/zxiGqmCJ3MYr75cqjV0IIqZ8CUSMfUnXiPnAVyQb2at2xvBXBOlX/CF1fDryS6TwIWlDE2QTLtqmg5phz/wpW/Ap23+NmLVzbSb44McXEf6LTa6c2ygGYeKyRoi+I7bOHZYM0qkLrb6zpJTlR8XshKUfj8ZIUdNjdoaPfcJilEVRrFdburQ/sVxj+vKYx/7KU21TF+w88t2JOzptC8Gj3RyOJmMOJm1qeFADNQNzpE3cZsVa7fs2fvO3ojOk8r3b9fkHCPOPNOYfssw/9nn1QdT8o7H3H9bNPz78B9tTUDnoPZNdAAAAAElFTkSuQmCC'
                  item.plus = true

                }

                item.showAddress = item.validator_address
                break
              case 'withdraw':
                const originType = item.tx.body.messages[0]['@type']
                item.type = 'withdraw'
                // item.icon = '/static/img/account/lingqu.png'
                item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAq1BMVEWFma0AAAB/krF0i7f89l/R1n8BMv+HmrGSmbCLmailsJsBMv+3wY+Mn7KPnbr//0ciTOwDM/6OmbaUpqQDM/8UQfVCY9oEM/4NPPkPPfb//ysIOPwLOfoyV+MCMv8KOPoTP/QCMv8HNvwsUeU2W+BRb88FNP0QPvf//w0DNP4GNf0UQfUlTusOPPgdR+8fSe46Xt4MOvkVQvIbR/AJOPsbRe8IN/wINvwBMv9VNs8jAAAAOHRSTlMZABocDRD7FQsIFP0SEQULUO4OFupzL+aNhAqynjzypXb1wkE4KNKACd3KcUqIWVQ1lWxcq1+4twEf5eQAAAP2SURBVFjDtZhpc6MwDIa9NsYcBpqQhiNXczVJ0/Tatqv//8tW5ChgA6Flqg+ZIWYeXsuSLJv8aTDb6ntCEDQhvL5lN71bC/ItTxBKcsMH4Vn+90C+7ZGcUmQRz/bbg/qC5hSVRUW/JchStei6rBYgW5AWJuxroD5paf1GkC9IaxN+Pcgm3zJbA+WcH5B0kEW/C6JWGZRzOpBIPq8fma2CfPJD8xWQqBPPGEXLfqvHRRnUr6FQHqQcLQgkYbQpMkm9gyh1Ujl5fotf4/j2eRKmDm1wE6mdGON8lSwGcDJ3sNi8yOoQz0FWVYYbk/EcSmZuOD0NlouV9QWqksPiKbioZHo/mr2P7ucumHDPQppxJGMOKdgFZFVwJg9guhDNPtYsdJyQrZ9mOzOWGYcZN7vdUtKyJFLlIWY8DlDAIBlueZh5nZCQb4dLEp44PRdiXgCJE8immp4jZzQMnEv4IIw5nNATB1zzbxFE7SPIU/3MJwNw3UQiphwOF44Je14a8jKQr60XW+Crd6leur/03BrKmI8gS3s3Rk6SsjqOCchRBi0EeVSd2NSFkaTf0EOo94f4QvXQGGAwdJr16AWc2ArHWWHsJQFr1KMZYpTCyNIEYIeCmvXopZL0lYyXC4DZln3VkTLnrIepghHj6TEEH5fkdLaSVuihnCuqECPK+oNngOk6pEeOHL6tONP0EGe5dFRvq6D0DTDJL5H5CdGNwY6cQUHPX/OSIjlIS48YYBSeJ7beAfSQVNZD5RhgLJXJaaBX9LVDzw/7rAbcGLmeJpCu6P2y+NS4M03oPT7meo5KZwCvqrsbpoZPSEIpUZQlcSF+PgESNSy1Vbs9OTsnmS6aWeTQB4C9EvuiavnnuPxFTa5b1INrMAV4UkFqQMqsqD1xWtC0n8/3OSdbfReileJsT0uRMEuRlBX+4cslR04uegywUMtMX0vaYKMkrZIQGO4RwCFlStLqZeQlKyMGK8KZ8iV3qpUH+3ph0z40ABhzqha2qlLbAxg5ig9y34/A7S0VEPWqin9wLP5bRis4LEjArCigVsV2RM7bUUCprmebZd8D0/u26g1yhTnhJlzdIJnDD6aZx1BuXr5la9VZ37KlMRzh39NHQ1VE7eYmItoUm4hguEH8qdIpJurbGgPbmmwW4481zdoaim1NBC7650XnEKux0TocGy2Y3v87N1r4OIhxgGh2pfVbjqdQsvlsUtlZWFeb0ZfDIjpD3OhhM5SyKrhEq/Z49fR2eI2Tu+dVGNREu92qYZdpakhuBIGkLRp2NEGvHCHqxsWvHGq6H7O6H/x+7yja/XDc/bje/QLht680ul+ydL/26X4R1f1q7Pcv67pfH/4H7tBmclAtyEsAAAAASUVORK5CYII='
                item.raw_log.replace(
                  /\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match,
                    p1) => {
                  item.amount = p1 / mainCoin.decimals + mainCoin.alias_name
                })

                if (originType.includes('MsgSetWithdrawAddress')) {
                  item.raw_log.replace(/"key":"withdraw_address","value":"([0-9a-z]*)"/, (match, p1) => {
                    item.withdraw_address = p1
                  })
                  // item.type = 'setWithdrawAddress'
                } else if (originType.includes('MsgWithdrawDelegatorReward')) {
                  item.raw_log.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
                    item.withdraw_address = p1
                  })
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
        // console.log(this.accountTransfer[type]);
        // this.accountTransfer['all'].push(...result)
        if (Number(this.pagination[type].total) == this.accountTransfer[type].length) this.pagination[type].nodata =
          true
        // this.accountTransfer['all'].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        this.$cache.set('_tokenContent_accountTransfer_data', this.accountTransfer, 0)
      // } catch {
      //   this.pagination[type].nodata = true
      // }




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

            data.icon = '/static/img/account/fasong2.png'

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
    //查看该笔交易的详细情况
    toRecordDetail(record) {
      uni.navigateTo({
        url: `./transactionDetails?data=${JSON.stringify(record)}`
      })
    },
    handlerMainCoinBalance(res) {
      this.token.balance = res.res
      this.$cache.set('_tokenContent_balance_data', this.token.balance, 0)
      this.loadingBalace = false
    },
    handlerUnboundingBlance(res) {
      // this.unBoundingBalance = 0
      let tempUnBoundingBalance = 0
      res.result.unbondingResponses.forEach(item => {
        item.entries.forEach(item => {
          tempUnBoundingBalance += Number(item.balance)
        })
      })

      this.unBoundingBalance = tempUnBoundingBalance / mainCoin.decimals
      this.$cache.set('_tokenContent_unBoundingBalance_data', this.unBoundingBalance, 0)
      this.unboundingBlanceLoading = false
    },
    txResult(res) {
      this.init() //刷新列表
      this.sendbtnLoading = false
      this.loadingBalace = true
      this.callMainCoinBalance++
      this.callUnboundingDelegators++
    },
    handlerSecretClient(client) {
      getApp().globalData.secretClient = client
    }
  },
  filters: {
    sliceAddress,
    formatBalance(val) {
      if (val == '0.000000') return '0.000000'
      let int = (val + '').split('.')[0]
      let float = (val + '').split('.')[1]
      if (float) {
        float = float.substr(0, 6)
      }
      if (int == '00') int = '0'
      // new decimal(this.sendFormData.gas + '').mul(new decimal(this.sendFormData.gasPrice)).div(
      //   new decimal(this.mainCoin.decimals)).toString()

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
    console.log(e)
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
    getOtherTransationHistory,
    getSecret
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'
  export default {
    data() {
      return {
        secretClient: null
      }
    },
    methods: {
      getAddress(address) {
        if (address === '') return
        this.getDelegationRecord(address)
      },
      async getDelegationRecord(address) {
        const result = await getDelegationRecord(address, this.secretClient)
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
        const result = await getUnbondingDelegationRecord(wallet.address, this.secretClient)
        renderUtils.runMethod(this._$id, 'handlerUnboundingBlance', {
          result
        }, this)
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
        const res = await getMainCoinBalance(wallet.address, this.secretClient)
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
              gasPrice, this.secretClient)
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
            }, newValue.memo, gas, gasPrice, this.secretClient)
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
            }, newValue.token, this.secretClient)).transaction_history.txs[0]
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
      async callInitSecretClient(val) {
        if (val == 0) {
          return
        } else if (val == 1) {
          // console.log('initSecretClient');
          // const secretClient = await getSecret()
          // this.secretClient = secretClient
          // renderUtils.runMethod(this._$id, 'handlerSecretClient', {
          //   secretClient
          // }, this)
        } else {
          // console.log('set secretClient', val);
          // this.secretClient = val.secretClient ? val.secretClient : val
          // renderUtils.runMethod(this._$id, 'handlerSecretClient', {
          //   secretClient
          // }, this)
        }
      }
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

    .sender-amount,
    .delegate-amount {
      color: #275EF1
    }

    .recipient-amount,
    .undelegate-amount {
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

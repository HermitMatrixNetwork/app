<template>
  <view class="token_content">
    <custom-header :delay="300" :delayHandler="delayHandler" :title="token.alias_name">
      <template #right>
        <text class="customIcon" @click="toTokenDetail()">{{ language.text99 }}</text>
      </template>
    </custom-header>

    <view class="main_token">
      <view class="TokenVolumn" :style="tokenColumnStyle">
        <view class="item">
          <view class="left">
            <image :src="token.logo" style="width: 72rpx; height: 72rpx"></image>
          </view>
          <view class="center">
            <view class="title">{{token.alias_name}}</view>
            <view class="address" :style="{display:address?'block':'none'}">
              {{ token.contract_address | sliceAddress(6, -16) }}
            </view>
          </view>
          <view class="right">
            <custom-loading v-if="token.view_key && (token.loadingBalance || loadingBalance)"></custom-loading>
            <view v-else style="padding-right: 16rpx;" class="token_price">
              <view class="balance">{{ token.balance | formatBalance }}</view>
              <view>
                <text class="symbol">$</text>
                <text>0.00000</text>
              </view>
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
      <view v-else-if="token.showWarn || !token.view_key" class="no-data" :style="{ height: scrollHeight }">
        <image class="no-img" src="@/static/img/noviewkey.png" />
        <view class="tip" style="text-align: center;">
          <text>{{ language.text114 }}</text>
        </view>
      </view>

     <swiper v-else class="transaction_history_item" :current="listCurrentIndex" @change="switchSwiper"
        :style="{ height: scrollHeight }">
        <swiper-item v-for="(item,index) in list" :key="item.name" :item-id="index+''">
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
                    <view class="amount"
                      :class="[record.validator_address ? 'delegate-amount' : (record.to_address == address ? 'recipient-amount' : 'sender-amount')]">
                      {{ record.validator_address ? '' : (record.to_address == address ? '+' : '-') }}
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
              <!-- todo -->
              <view v-if="item.type == 'all'">
                <view v-if="!pagination.nodata && !pagination.loading" class="loading-more" @click="nextPage">
                  {{ language.text206 }}
                </view>
                <u-loading-icon v-else-if="pagination.loading" class="loading-more" mode="circle" :text="language.text207">
                </u-loading-icon>
                <view v-else-if="pagination.nodata" class="loading-more">{{ language.text208 }}</view>
              </view>
            </template>
						  <no-data v-else :tip="language.text113" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <view class="operation_btn">
      <u-button @click="toSend('/pages/account/send/index', token)">
			<custom-loading v-if="sendbtnLoading"></custom-loading>
			<text v-else>{{ language.text03 }}</text>
			</u-button>
      <u-button @click="toGo('/pages/account/receive')">{{ language.text04 }}</u-button>
      <u-button @click="dealBtn">{{ language.text06 }}</u-button>
      <u-button class="view-key" @click="toViewKey">
        <view class="view-key-text">
          <view>{{ language.text98 }}</view>
          <view>viewkey</view>
        </view>
      </u-button>
    </view>
    <view :callRenderTransationHistory="callRenderTransationHistory"
      :change:callRenderTransationHistory="render.getAddress">
    </view>
    <view :callRenderLoadMore="callRenderLoadMore" :change:callRenderLoadMore="render.more"></view>
    <view :callBalanceLoading="callBalanceLoading" :change:callBalanceLoading="render.setBalanceLoading"></view>
		<view :check="sendTokenMessage" :change:check="render.sendToken"></view>
    <view :callGetBlance="callGetBlance" :change:callGetBlance="render.getBalance"></view>
	</view>
</template>

<script>
// 究极不可维护代码之无脑复制黏贴☢
import TokenColumn from './components/TokenColumn.vue'
import mixin from '../mixins/index.js'
import mainCoin from '@/config/index.js'
import language from '../language/index.js'
import {
  sliceAddress
} from '@/utils/filters.js'
export default {
  mixins: [mixin],
  components: {
    TokenColumn
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      callBalanceLoading: 0,
      token: {},
      address: this.$cache.get('_currentWallet').address,
      listCurrentIndex: 0,
      tokenColumnStyle: {
        paddingTop: '32rpx',
      },
      list: [{
        name: language[this.$cache.get('_language')].text63,
        type: 'all'
      }, {
        name: language[this.$cache.get('_language')].text64,
        type: 'transfer',
        icon: require('@/static/img/account/fasong2.png')
      }, {
        name: language[this.$cache.get('_language')].text65,
        type: 'recipient',
        icon: require('@/static/img/account/shoukuan2.png')
      },
      {
        name: language[this.$cache.get('_language')].text68,
        type: 'fail'
      }
      ],
      accountTransfer: {
        'transfer': [],
        'recipient': [],
        'fail': [],
        'all': []
      },
      pagination: {
        page: 1,
        size: 5,
        total: 0,
        loading: false
      },
      loading: true,
      lockAmountLoading: true,
      callRenderTransationHistory: {},
      lockAmount: 0,
      callRenderLoadMore: 1,
      mainTokenHeight: '0rpx',
      navHeight: '0rpx',
      systemBarHeight: '0rpx',
      sendTokenMessage:false,
      sendbtnLoading:false,
      callGetBlance: '',
      loadingBalance: true
    }
  },
  async onLoad(options) {
    this.loadingBalance = true
  
    let obj = options.sendToken?JSON.parse(options.sendToken):false
    // console.log('获取的数据',obj)
    this.sendbtnLoading = !!obj
    setTimeout(()=>{
      this.sendTokenMessage = obj
    },500)
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
    if (this.token.loadingBalance) {
      this.timer = setInterval(() => {
        const token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
        if (token.loadingBalance == false) {
          this.token = token
          clearInterval(this.timer)
        }
      }, 1500)
    }
		
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
    if (this.token.view_key) {
      this.callRenderTransationHistory = this.token
      this.loading = true
    } else {
      this.loading = false
    }
    this.getSystemStatusHeight()
    this.calculateHeight()
    this.callGetBlance = JSON.parse(JSON.stringify(this.token))
  },
  onPullDownRefresh() {
    if (!this.token.view_key) {
      uni.stopPullDownRefresh()
      return
    }
    this.loadingBalance = true
    this.callGetBlance = ''
    this.$nextTick(() => {
      this.callGetBlance = JSON.parse(JSON.stringify(this.token))
    })
    this.callRenderTransationHistory = {...this.callRenderTransationHistory,random:Math.floor(Math.random() * 10000)}
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1500)
  },
  onHide() {
    uni.stopPullDownRefresh()
  },
  methods: {
    txResult(res){
      // this.init({res:res,token:this.token}) //刷新列表
      this.sendbtnLoading = false
      this.loadingBalance = true
      this.callGetBlance = ''
      this.$nextTick(() => {
        this.callGetBlance = JSON.parse(JSON.stringify(this.token))
      })
      this.callRenderTransationHistory = {...this.callRenderTransationHistory,random:Math.floor(Math.random() * 10000)}
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
      query.select('.main_token').boundingClientRect(data => {
        this.mainTokenHeight = data.height + 'px'
      })
      
      query.select('.nav').boundingClientRect(data => {
        this.navHeight = data.height + 'px'
      })
      query.exec()
    },
    delayHandler() {
      this.callBalanceLoading++
    },
    async init({
      res,
      token
    }) {
      this.accountTransfer = {
			  'transfer': [],
			  'recipient': [],
			  'fail': [],
			  'all': []
      },
      this.pagination = {
        page: 1,
        size: 5,
        total: 0,
        loading: false
      }
      // console.log('初始化获取的列表',res)
      // console.log(1111111111111111, res.transaction_history)
      if (res.viewing_key_error || res.parse_err) {
        console.log('出现了预期之外的错误', res.viewing_key_error)
        this.token.view_key = ''
        this.updateCoinList(this.token)
        this.loading = false
      } else {
        let wallet = this.$cache.get('_currentWallet')
        let result = res.transaction_history
        let list = ['all', 'sender', 'recipient', 'fail']
        this.pagination.total = result.total
        if (result.total <= result.txs.length) {
          this.pagination.nodata = true
        }

        this.accountTransfer['all'].push(...result.txs)
        this.accountTransfer['all'].forEach(item => {
          for (let val of Object.values(item.action)) {
            item.to_address = val.recipient
            item.from_address = val.from
            item.sender = val.sender
          }
          item.type = item.to_address == wallet.address ? 'recipient' : 'transfer'

          item.amount = item.coins.amount / token.decimals + token.alias_name
          
          function format(time) {
            let date = new Date(time)
            let y = date.getFullYear()
            let m = (date.getMonth() + 1 + '').padStart(2, '0')
            let d = (date.getDate() + '').padStart(2, '0')
            let hh = (date.getHours() + '').padStart(2, '0')
            let mm = (date.getMinutes() + '').padStart(2, '0')
            let ss = (date.getSeconds() + '').padStart(2, '0')

            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
          }
          
          item.timestamp = format(item.block_time * 1000)
          switch (item.type) {
          case 'recipient':
            item.icon = require('@/static/img/account/shoukuan2.png')
            this.accountTransfer['recipient'].push(item)
            item.showAddress = item.from_address
            break
          case 'transfer':
            item.icon = require('@/static/img/account/fasong2.png')
            this.accountTransfer['transfer'].push(item)
            item.showAddress = item.to_address
            break
          }
        })
        this.loading = false
      }
    },
    setLockAmount({
      result
    }) {
      let lock = 0
      result.delegationResponses.forEach(item => {
        lock += Number(item.balance.amount)
      })
      this.lockAmountLoading = false
      this.lockAmount = lock
    },
    nextPage() {
      this.pagination.page += 1
      this.pagination.loading = true
      this.callRenderLoadMore++
    },
    async loadMore({
      res,
      token
    }) {
      if (res.viewing_key_error || res.parse_err) {
        console.log('出现了预期之外的错误', res.viewing_key_error)
      } else {
        let wallet = this.$cache.get('_currentWallet')
        let result = res.transaction_history.txs.map(item => {
          for (let val of Object.values(item.action)) {
            item.to_address = val.recipient
            item.from_address = val.from
            item.sender = val.sender
          }
          item.type = item.to_address == wallet.address ? 'recipient' : 'transfer'

          item.amount = item.coins.amount / token.decimals + token.alias_name
          function format(time) {
            let date = new Date(time)
            let y = date.getFullYear()
            let m = (date.getMonth() + 1 + '').padStart(2, '0')
            let d = (date.getDate() + '').padStart(2, '0')
            let hh = (date.getHours() + '').padStart(2, '0')
            let mm = (date.getMinutes() + '').padStart(2, '0')
            let ss = (date.getSeconds() + '').padStart(2, '0')
          
            return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
          }
          
          item.timestamp = format(item.block_time * 1000)
          switch (item.type) {
          case 'recipient':
            item.icon = require('@/static/img/account/shoukuan2.png')
            this.accountTransfer['recipient'].push(item)
            item.showAddress = item.from_address
            break
          case 'transfer':
            item.icon = require('@/static/img/account/fasong2.png')
            this.accountTransfer['transfer'].push(item)
            item.showAddress = item.to_address
            break
          }

          return item
        })

        this.accountTransfer['all'].push(...result)
        this.pagination.loading = false
        if (this.accountTransfer['all'].length >= this.pagination.total) {
          this.pagination.nodata = true
        }
      }
    },
    jumpDetails(hash) {
      uni.navigateTo({
        url: `./transactionDetails?transactionHash=${hash}`
      })
    },
    updateCoinList(coin) {
      this.token = coin/*  */
      this.loadingBalance = false
      const wallet = this.$cache.get('_currentWallet')
      let coinList = wallet.coinList
      let coinIndex = wallet.coinList.findIndex(item => item.ID == coin.ID)
      coinList.splice(coinIndex, 1, coin)
      wallet.coinList = coinList
      this.$cache.set('_currentWallet', wallet, 0)
      this.updateWalletList(wallet)
    },
    updateWalletList(wallet) {
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1, wallet)
      } else {
        walletList.unshift(wallet)
      }
      this.$cache.set('_walletList', walletList, 0)
      return true
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
      if(this.sendbtnLoading) return
      uni.navigateTo({
        url: `${url}?tokenID=${this.token.ID}`,
        events: {
          addRecordToSendList: (data) => {

            switch (data.type) {
            case 'recipient':
              data.icon = require('@/static/img/account/shoukuan2.png')
              this.accountTransfer['recipient'].unshift(data)
              break
            case 'transfer':
              data.icon = require('@/static/img/account/fasong2.png')
              this.accountTransfer['transfer'].unshift(data)
              break
            }

            this.accountTransfer['all'].unshift(data)

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
    toViewKey() {
      if (this.token.view_key == '') {
        uni.navigateTo({
          url: `./settingViewKey?tokenID=${this.token.ID}`
        })
      } else {
        uni.navigateTo({
          url: `./checkViewKey?tokenID=${this.token.ID}`
        })
      }
    }
  },
  filters: {
    sliceAddress,
    formatBalance(val) {
      // const int = (val + '').split('.')[0]
      // let float = (val + '').split('.')[1]
      // if (float) {
      //   float = float.substr(0, 6)
      // }
      return (val && Number(val).toFixed(6)) || '0.000000'
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
	   uni.switchTab({
	     url: '/pages/account/index'
	   })
	   return true
  },
}
</script>
<script lang="renderjs" module="render">
  import {
    getOtherTransationHistory,
    getTokenDecimals,
    getCodeHash,
    getOtherBalance,
		SendTokentoOtherAddress,
		transferOtherToken
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
	import mainCoin from '@/config/index.js'
  export default {
    data() {
      return {
        pagination: {
          page: 1,
          page_size: 10
        },
        balanceLoading: true,
        token: {},
        wallet: {},
      }
    },
    methods: {
      async getAddress(token) {
        if (!token || !token.view_key) {
        } else {
          token = JSON.parse(JSON.stringify(token))
          let wallet;
          let tokenInfo
          //#ifdef APP-PLUS
          wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
          //#endif

          //#ifndef APP-PLUS 
          wallet = uni.getStorageSync('_currentWallet').data
          //#endif
          this.token = token
          this.wallet = wallet
          if (!token.decimals) {
            tokenInfo = await getTokenDecimals({
              contract: {
                address: token.contract_address,
                codeHash: token.codeHash
              }
            })
            token.decimals = Math.pow(10, tokenInfo.token_info.decimals) || 1
          }
          this.getTransationHistory(token, wallet)
          if (token.loadingBalance) {
            this.getTokenBalance(wallet, token)
          }
        }
      },
      async getTokenBalance(wallet, token) {
        let balance = 0
        if (!token.codeHash) {
          try {
            let codeHash = await getCodeHash(token.contract_address)
            token.codeHash = codeHash
            balance = await this.getOtherTokenBalance(token, wallet)
          } catch (e) {
            let msg = '获取codeHash失败，请检查合约地址是否正确'
            console.log('获取codeHash失败，请检查合约地址是否正确');
            // renderUtils.runMethod(this._$id, 'showError', msg, this)
          }
        } else {
          balance = await this.getOtherTokenBalance(token, wallet)
        }
        if (!token.decimals) {
          tokenInfo = await getTokenDecimals({
            contract: {
              address: token.contract_address,
              codeHash: token.codeHash
            }
          })
          token.decimals = Math.pow(10, tokenInfo.token_info.decimals) || 1
        }
        if (token.decimals) balance = balance / token.decimals
        token.balance = balance
        token.loadingBalance = false
        this.balanceLoading && renderUtils.runMethod(this._$id, 'updateCoinList', token, this)
      },
      setBalanceLoading(newVal) {
        if (newVal == 0) return
        this.balanceLoading = false
      },
      async getOtherTokenBalance(token, wallet) {
        let balance = 0
        let res = await getOtherBalance({
          address: wallet.address,
          contract: {
            address: token.contract_address,
            codeHash: token.codeHash
          },
          auth: {
            key: token.view_key
          }
        })
        if (res.viewing_key_error) {
          token.showWarn = true
        } else {
          balance = res.balance.amount
          token.showWarn = false
        }
        return balance
      },
      async getTransationHistory(token, wallet, isLoadMore) {
        const res = await getOtherTransationHistory({
          contract: {
            address: token.contract_address,
            codeHash: token.codeHash
          },
          address: wallet.address,
          auth: {
            key: token.view_key
          }
        }, this.pagination, token)
        if (isLoadMore) {
          renderUtils.runMethod(this._$id, 'loadMore', {
            res,
            token
          }, this)
        } else {
          renderUtils.runMethod(this._$id, 'init', {
            res,
            token
          }, this)
        }
      },
      more(newVal) {
        if (newVal == 1) return;
        this.pagination.page = newVal
        this.getTransationHistory(this.token, this.wallet, true)
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
				// renderUtils.runMethod(this._$id, 'dealSuccessJump', {
				// 	res,
				// 	otherToken
				// }, this)
				renderUtils.runMethod(this._$id,'txResult',res,this)
			},
      getBalance(val) {
        if (val == 0) return;
        let wallet;
        //#ifdef APP-PLUS
        wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
        //#endif

        //#ifndef APP-PLUS 
        wallet = uni.getStorageSync('_currentWallet').data
        //#endif
        this.getTokenBalance(wallet, val)
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
    padding: 32rpx 32rpx 0;

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

  .view-key {
    font-size: 24rpx !important;
    color: #2C365A;
    line-height: 32rpx !important;
    padding: 0 !important;
  }

  .view-key-text {
    width: 100%;
  }














  .TokenVolumn {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      position: relative;

      .left {
        padding-right: 24rpx;
      }

      .center {
        flex: 1;

        .title {
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
          letter-spacing: 0;
          line-height: 28rpx;
        }

        .address {
          height: 24rpx;
          font-weight: 400;
          font-size: 24rpx;
          color: #8397B1;
          letter-spacing: 0;
          line-height: 24rpx;
          margin-top: 16rpx;
        }
      }

      .right {
        height: 72rpx;
        font-size: 28rpx;
        font-family: DIN-Medium;
        font-weight: 600;
        color: #2C365A;
        letter-spacing: 0;
        line-height: 28rpx;
        text-align: right;
      }
    }
  }

  .no-data {
    display: flex;
    flex-direction: column;
		justify-content: center;
    align-items: center;
    font-size: 28rpx;
    color: #8397B1;
		// height: 740rpx;
		padding: 0 64rpx;
		

    .no-img {
      width: 240rpx;
      height: 240rpx;
      margin-bottom: 32rpx;
    }

    .btn {
      color: rgba(30, 94, 255, 1);
    }

  }
</style>

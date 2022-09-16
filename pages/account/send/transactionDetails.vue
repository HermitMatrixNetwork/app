<template>
  <view class="transacTionDestail">
    <custom-header :tabUrl="redirectUrl" :title="language.text82"></custom-header>
    <view class="transacTionMain">
      <view class="main_status">
        <image :src="statusIcon" />
        <text class="status"> {{ status }} </text>
        <text class="times" v-show="result.timestamp">{{ result.timestamp }} +UTC</text>
      </view>
      <custom-loading v-if="loading" style="margin-top: 50rpx"></custom-loading>
      <view class="main_message" v-else>
        <template v-for="(item,key) in transactionMessage" >
          <view v-if="item" class="main_message_column" :key="key">
              <view>{{key}}</view>
              <view @click="copy(item, key)">{{item}}</view>
          </view>
        </template>
      </view>
    </view>
    <view :transactionHash="transactionHash"  :change:transactionHash="render.getTransationInfo"></view>
		<custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import mainCoin from '@/config/index.js'
import language from '../language/index.js'
export default {
  data() {
    return {
      transactionMessage: {},
      transactionResult: [],
      transactionHash: '',
      status: '',
      statusIcon: '',
      result: {
        timestamp: ''
      },
      loading: true,
      language: language[this.$cache.get('_language')],
      redirectUrl: '',
    }
  },
  onLoad(options) {
    let data = JSON.parse(options.data)
    if (data.txhash) {
      this.transactionHash = data.txhash
    } else if(data.transactionHash) {
      this.transactionHash = data.transactionHash
    } else if(data.type == 'fail'){
      this.formatFailData(data)
    } else {
      this.formOtherToken(data)
    }
    
    if (options.redirectUrl) {
      this.redirectUrl = options.redirectUrl
    }
    console.log(this.redirectUrl)
  },
  methods: {
    init(res) {
      console.log(res)
      this.result = res
      const typeUrl = res.tx.body.messages[0].typeUrl
      res.amount = 0
      res.tx.body.messages.forEach(cur => {
        if (cur.value.amount) {
          if (Array.isArray(cur.value.amount)) {
            res.amount += Number(cur.value.amount[0].amount)
          } else {
            res.amount += Number(cur.value.amount.amount)
          }
        }
      })
      res.to_address = res.tx.body.messages[0].value.toAddress
      res.from_address = res.tx.body.messages[0].value.fromAddress
      mainCoin.decimals && (res.amount = res.amount / mainCoin.decimals)
      res.fee = res.tx.authInfo.fee.amount[0].amount / mainCoin.decimals + mainCoin.alias_name
      res.amount += mainCoin.alias_name
      this.formData(res, typeUrl)
    },
    formData(res, typeUrl) {
      
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
      
      // this.result.timestamp = format(item.block_time * 1000)
      this.result.timestamp = res.timestamp.trim().replace(/\-/g, (match, p1, p2) => {
        if (p1 == 4) {
          return '-'
        } else {
          return '-'
        }
      }).split('T').join(' ').replace(/Z/, '')
      if (res.code == 0) {
        this.status = this.language.text181
        this.statusIcon = '/static/img/chenggong.png'
      } else { // 失败
        this.status = this.language.text182 // 失败
        this.statusIcon = '/static/img/shibai1.png'
      }
      if (typeUrl.includes('MsgSend')) {
        this.transactionMessage = {
          [this.language.text84]: this.status == this.language.text182 ? '0.00GHM' : res.to_address === this.$cache.get('_currentWallet').address ? '+' + res.amount : '-' + res.amount,
          [this.language.text111]: res.fee,
          [this.language.text16]: res.to_address,
          [this.language.text87]: res.from_address,
          'Memo': res.tx.body.memo,
          [this.language.text88]: res.transactionHash
        }
      } else if (typeUrl.includes('MsgDelegate')) {
        this.transactionMessage = {
          [this.language.text84]: this.status == this.language.text182 ? '0.00GHM' : res.amount,
          [this.language.text111]: res.fee,
          [this.language.text90]: res.tx.body.messages[0].value.delegatorAddress,
          [this.language.text91]: res.tx.body.messages[0].value.validatorAddress,
          'Memo': res.tx.body.memo,
          [this.language.text88]: res.transactionHash
        }
      } else if (typeUrl.includes('MsgExecuteContract')) {
        this.transactionMessage = {
          [this.language.text84]: this.status == this.language.text182 ? '0.00GHM' : res.amount,
          [this.language.text111]: res.fee,
          [this.language.text90]: res.tx.body.messages[0].value.delegatorAddress,
          [this.language.text91]: res.tx.body.messages[0].value.validatorAddress,
          'Memo': res.tx.body.memo,
          [this.language.text88]: res.transactionHash
        }
      } else if (typeUrl.includes('MsgUndelegate')) {
        this.transactionMessage = {
          [this.language.text216]: this.status == this.language.text182 ? '0.00GHM' : res.amount,
          [this.language.text111]: res.fee,
          [this.language.text90]: res.tx.body.messages[0].value.delegatorAddress,
          [this.language.text217]: res.tx.body.messages[0].value.validatorAddress,
          'Memo': res.tx.body.memo,
          [this.language.text88]: res.transactionHash
        }
      } else if (typeUrl.includes('MsgWithdrawDelegatorReward')) {
        res.rawLog.replace(/\{"type":"withdraw_rewards","attributes":\[\{"key":"amount","value":"([0-9]*)/, (match, p1) => {
          res.amount = p1 / mainCoin.decimals + mainCoin.alias_name
        })
        
        res.rawLog.replace(/"receiver","value":"([0-9a-z]*)"/, (match, p1) => {
          res.withdrawAddress = p1
        })
        this.transactionMessage = {
          [this.language.text92]: this.status == this.language.text182 ? '0.00GHM' : res.amount,
          [this.language.text111]: res.fee,
          [this.language.text93]: res.tx.body.messages[0].value.delegatorAddress,
          [this.language.text94]: res.withdrawAddress,
          'Memo': res.tx.body.memo,
          [this.language.text88]: res.transactionHash
        }
      }
      
      this.loading = false
    },
    formOtherToken(res) {
      console.log(res)
      this.status = this.language.text181
      this.statusIcon = '/static/img/chenggong.png'
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
      
      this.result.timestamp = format(res.block_time * 1000)
      this.transactionMessage = {
        [this.language.text84]: res.amount,
        [this.language.text16]: res.to_address,
        [this.language.text87]: res.from_address,
        [this.language.text88]: res.sender,
        'Memo': res.memo
      }
      this.loading = false
    },
    formatFailData(res) {
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
      // const failType = ['MsgSend', 'MsgUndelegate', 'MsgInstantiateContract', 'MsgExecuteContract']
      this.statusIcon = '/static/img/shibai1.png'
      this.result.timestamp = format(res.timestamp)
      switch (res.operate) {
      case 'MsgSend': 
        this.status = '发送失败'
        this.transactionMessage = {
          [this.language.text84]: '0.00', //res.amount,
          [this.language.text111]: res.fee / mainCoin.decimals + mainCoin.alias_name,
          [this.language.text16]: res.message.to_address,
          [this.language.text87]: res.message.from_address,
          [this.language.text88]: res.sender,
        }
        break
      case 'MsgUndelegate':
        this.status = '取消委托失败',
        this.transactionMessage = {
          [this.language.text84]: '0.00', //res.amount
          [this.language.text111]: res.fee / mainCoin.decimals + mainCoin.alias_name,
          [this.language.text90]: res.message.delegator_address,
          [this.language.text87]: res.message.validator_address,
          [this.language.text88]: res.sender,
        }
        break
      case 'MsgInstantiateContract':
        this.status = '初始化合约失败',
        this.transactionMessage = {
          [this.language.text111]: res.fee / mainCoin.decimals + mainCoin.alias_name,
          '合约Code_id': res.message.code_id,
          [this.language.text88]: res.sender,
        }
        break
      case 'MsgExecuteContract':
        this.status = '调用合约失败',
        this.transactionMessage = {
          [this.language.text111]: res.fee / mainCoin.decimals + mainCoin.alias_name,
          '合约地址': res.message.contract,
          [this.language.text88]: res.sender,
        }
        break
      }
      this.loading = false
    },
    copy(item ,key) {
      const copyList = ['Memo', this.language.text84, this.language.text111] // Memo, Amount, Fee
      if (copyList.includes(key)) return
      uni.setClipboardData({
        data: item,
        showToast: false,
        success: () => {
          this.$refs.notify.show('error', this.language.text103, {
            bgColor: '#275EF1'
          })
        },
        fail: () => {
          this.$refs.notify.show('error', '复制失败')
        }
      })
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    queryAccountHash
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      async getTransationInfo(hash) {
        if (hash == '') return;
        const result = await queryAccountHash(hash)
        renderUtils.runMethod(this._$id, 'init', result, this)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .transacTionDestail {
    width: 100%;
    height: 100vh;
    background: #F4F6FA;
  }

  .transacTionMain {
    position: relative;
    padding: 0 32rpx;
    margin: 48rpx 32rpx 0;
    background: #FFFFFF;
    height: 936rpx;
    box-shadow: 0 8rpx 54rpx 0 rgba(4, 6, 15, 0.05);
    border-radius: 16rpx;

    .main_status {
      height: 284rpx;
      border-bottom: 2rpx solid #ddd;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      font-family: PingFangSC-Medium;
      padding: 48rpx 0;

      image {
        width: 72rpx;
        height: 72rpx;
      }

      .status {
        font-weight: 600;
        font-size: 32rpx;
        color: #2C365A;
        letter-spacing: 0;
      }

      .times {
        font-weight: 400;
        font-size: 24rpx;
        color: #8397B1;
        letter-spacing: 0;
        line-height: 24rpx;
      }
    }

    .main_message {

      .main_message_column {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 24rpx;
        font-weight: 400;
        padding-top: 48rpx;
        color: #2C365A;

        view:nth-child(2) {
          width: 418rpx;
          text-align: right;
          word-wrap: break-word;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 24rpx;
          color: #2C365A;
          letter-spacing: 0;
          text-align: right;
          line-height: 32rpx;
        }
      }
    }
  }
</style>

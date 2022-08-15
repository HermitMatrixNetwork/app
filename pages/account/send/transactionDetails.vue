<template>
  <view class="transacTionDestail">
    <custom-header :title="'交易详情'"></custom-header>
    <view class="transacTionMain">
      <view class="main_status">
        <image :src="statusIcon" />
        <text class="status"> {{ status }} </text>
        <text class="times">{{ result.timestamp }}</text>
      </view>
      <custom-loading v-if="loading" style="margin-top: 50rpx"></custom-loading>
      <view class="main_message" v-else>
        <template v-for="(item,key) in transactionMessage" >
          <view v-if="item" class="main_message_column" :key="key">
              <view>{{key}}</view>
              <view>{{item}}</view>
          </view>
        </template>
      </view>
    </view>
    <view :transactionHash="transactionHash"  :change:transactionHash="render.getTransationInfo"></view>
  </view>
</template>

<script>
import mainCoin from '@/config/index.js'
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
    }
  },
  onLoad(options) {
    let data = JSON.parse(options.data)
    if (data.txhash) {
      this.transactionHash = data.txhash
    } else if(data.transactionHash) {
      this.transactionHash = data.transactionHash
    } else {
      this.formOtherToken(data)
    }
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
      
        return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`
      }
      
      // this.result.timestamp = format(item.block_time * 1000)
      this.result.timestamp = res.timestamp.trim().replace(/\-/g, (match, p1, p2) => {
        if (p1 == 4) {
          return '年'
        } else {
          return '月'
        }
      }).split('T').join('日 ').replace(/Z/, '')
      if (res.code == 0) {
        this.status = '成功'
        this.statusIcon = '/static/img/chenggong.png'
      } else { // 失败
        this.status = '失败'
        this.statusIcon = '/static/img/shibai1.png'
      }
      if (typeUrl.includes('MsgSend')) {
        this.transactionMessage = {
          '金额': res.to_address === this.$cache.get('_currentWallet').address ? '+' + res.amount : '-' + res.amount,
          '矿工费': res.fee,
          '收款地址': res.to_address,
          '付款地址': res.from_address,
          'Memo': res.tx.body.memo,
          '交易号': res.transactionHash
        }
      } else if (typeUrl.includes('MsgDelegate')) {
        this.transactionMessage = {
          '金额': res.amount,
          '矿工费': res.fee,
          '委托人': res.tx.body.messages[0].value.delegatorAddress,
          '被委托验证人': res.tx.body.messages[0].value.validatorAddress,
          'Memo': res.tx.body.memo,
          '交易号': res.transactionHash
        }
      } else if (typeUrl.includes('MsgExecuteContract')) {
        this.transactionMessage = {
          '金额': res.amount,
          '矿工费': res.fee,
          '委托人': res.tx.body.messages[0].value.delegatorAddress,
          '被委托验证人': res.tx.body.messages[0].value.validatorAddress,
          'Memo': res.tx.body.memo,
          '交易号': res.transactionHash
        }
      }
      
      this.loading = false
    },
    formOtherToken(res) {
      this.status = '成功'
      this.statusIcon = '/static/img/chenggong.png'
      function format(time) {
        let date = new Date(time)
        let y = date.getFullYear()
        let m = (date.getMonth() + 1 + '').padStart(2, '0')
        let d = (date.getDate() + '').padStart(2, '0')
        let hh = (date.getHours() + '').padStart(2, '0')
        let mm = (date.getMinutes() + '').padStart(2, '0')
        let ss = (date.getSeconds() + '').padStart(2, '0')
      
        return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`
      }
      
      this.result.timestamp = format(res.block_time * 1000)
      this.transactionMessage = {
        '金额': res.amount,
        '收款地址': res.to_address,
        '付款地址': res.from_address,
        '执行者': res.sender,
        'Memo': res.memo
      }
      this.loading = false
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
        font-weight: 500;
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

<template>
  <view class="transacTionDestail">
    <custom-header :title="'交易详情'"></custom-header>
    <view class="transacTionMain">
      <view class="main_status">
        <image :src="statusIcon" />
        <text class="status"> {{ status }} </text>
        <text class="times">{{ result.timestamp.replace(/T|Z/g, ' ') }}</text>
      </view>
      <view class="main_message">
        <view v-for="(item,key) in transactionMessage" :key="key" class="main_message_column">
          <view>{{key}}</view>
          <view>{{item}}</view>
        </view>
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
      transation: ['金额', '矿工费', '收款地址', '付款地址', 'Memo', '交易号'],
      fail: ['金额', '矿工费', '收款地址', '付款地址', 'Memo', '交易号'],
      delegate: ['委托金额', '矿工费', '委托人', '被验证委托人', 'Memo', '交易号'],
      receive: ['领取金额', '矿工费', '操作账户', '领取接收地址', 'Memo', '交易号'],
      result: {
        timestamp: ''
      },
    }
  },
  onLoad(value) {
    if (value.transactionHash) {
      this.transactionHash = value.transactionHash
    } else {
      let result = JSON.parse(value.data)
      this.formData(result, result.tx.body.messages[0]['@type'])
    }
  },
  methods: {
    init(res) {
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
      mainCoin.rate && (res.amount = res.amount / mainCoin.rate)
      res.fee = res.tx.authInfo.fee.amount[0].amount / mainCoin.rate + mainCoin.alia_name
      res.amount += mainCoin.alia_name
      this.formData(res, typeUrl)
    },
    formData(res, typeUrl) {
      // console.log(res) // code = 0 不一定成功噢，特殊情况自己猜 
      if (res.code == 0) {
        this.status = '成功'
        this.statusIcon = '/static/img/chenggong.png'
      } else { // 失败
        this.status = '失败'
        this.statusIcon = '/static/img/shibai1.png'
      }
      
      if (typeUrl.includes('MsgSend')) {
        this.transactionMessage = {
          '金额': res.amount,
          '矿工费': res.fee,
          '收款地址': res.to_address,
          '付款地址': res.from_address,
          'Memo': res.tx.body.memo,
          '交易号': res.from_address
        }
      }
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
        renderUtils.runMethod(this.$_id, 'init', result, this)
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

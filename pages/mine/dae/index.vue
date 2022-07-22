<template>
  <view class="dae">
    <custom-header title="添加地址" :customStyle="{ 'background-color': '#fff' }">
      <template slot="right">
        <view class="header-right">
          <text @click="showModal = true">修改</text>
        </view>
      </template>
    </custom-header>
    <view class="border"></view>
    <view class="content">
      <view class="input">
        <view class="input-label">
          <text>{{ wallet.quota[0].denom }}交易提醒额度设置</text>
        </view>
        <view class="input-item">
          <u--input class="left" placeholder="当前设置额度" disabled></u--input>
          <view class="right">
            <text class="quota-amount">{{ wallet.quota[0].amount | amountFormat }}</text>
            <text class="quota-denom">{{ wallet.quota[0].denom }}</text>
          </view>
        </view>
      </view>
    </view>
    <EditModal title="设置交易提醒额度" :showModal="showModal" placeholder="请设置额度" :value="wallet.quota[0].amount" @cancel="cancel"
      @confirm="confirm" />
  </view>
</template>

<script>
import mixin from '../mixins/index.js'
import EditModal from '../components/edit-modal.vue'
export default {
  mixins: [mixin],
  components: {
    EditModal
  },
  data() {
    return {
      wallet: this.$cache.get('_currentWallet'),
      showModal: false
    }
  },
  created() {
    if (!this.wallet.quota) {
      this.wallet.quota = [{
        amount: 0,
        denom: 'GHM'
      }]
      this.updateCurrentWallet(this.wallet)
      this.updateWalletList(this.wallet)
    }
  },
  filters: {
    amountFormat(val) {
      return val.toFixed(2)
    }
  },
  methods: {
    cancel() {
      this.showModal = false
    },
    confirm(val) {
      this.wallet.quota[0].amount = val * 1
      this.updateCurrentWallet(this.wallet)
      this.updateWalletList(this.wallet)
      this.showModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .dae {
    height: 100vh;
    background-color: #F4F6F9;
  }

  .header-right {
    font-weight: 400;
    font-size: 28rpx;
    color: #1E5EFF;
    line-height: 28rpx;
  }

  .border {
    border: 1px solid #F4F6F9;
  }

  .content {
    padding: 32rpx;
    background-color: #fff;
  }

  .input {
    &-label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-family: PingFangSC-Medium;
      font-size: 28rpx;
      color: #2C365A;
      line-height: 28rpx;
    }

    &-item {
      display: flex;
      align-items: center;
      background: #F2F4F8;
      border-radius: 16rpx;

      .right {
        font-weight: 500;
        font-size: 28rpx;
        color: #2C365A;
        padding-right: 32rpx;

        .quota-amount {
          padding-right: 10rpx;
        }
      }

      /deep/ .u-input {
        height: 96rpx;
        background: #F2F4F8;
        border-radius: 16rpx;

        .input-placeholder {
          height: 48rpx !important;
          font-weight: 400 !important;
          font-size: 28rpx !important;
          color: #8397B1 !important;
          line-height: 48rpx !important;
        }
      }
    }
  }
</style>

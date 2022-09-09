<template>
  <view class="dae">
    <custom-header :title="language.text22" :customStyle="{ 'background-color': '#fff' }">
      <template slot="right">
        <view class="header-right">
          <text @click="showModal = true">{{ language.text25 }}</text>
        </view>
      </template>
    </custom-header>
    <view class="border"></view>
    <view class="content">
      <view class="input">
        <view class="input-label">
          <text>{{ language.text23 }}</text>
        </view>
        <view class="input-item">
          <u--input class="left" :placeholder="language.text24" disabled></u--input>
          <view class="right">
            <text class="quota-amount">{{ wallet.quota[0].amount | amountFormat }}</text>
            <text class="quota-denom">{{ wallet.quota[0].denom }}</text>
          </view>
        </view>
      </view>
    </view>
    <EditModal :title="language.text26" :showModal="showModal" :placeholder="language.text27" :value="wallet.quota[0].amount" @cancel="cancel"
      @confirm="confirm" :errorTip="language.text119" />
      
      <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import mixin from '../mixins/index.js'
import EditModal from '../components/edit-modal.vue'
import language from '../language/index.js'
export default {
  mixins: [mixin],
  components: {
    EditModal
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
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
      if (val < 0) return
      this.wallet.quota[0].amount = val * 1
      this.updateCurrentWallet(this.wallet)
      this.updateWalletList(this.wallet)
      this.showModal = false
      this.$refs.notify.show('', this.language.text30, { bgColor: ' #275EF1' })
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
      font-weight: 600;
    }

    &-item {
      display: flex;
      align-items: center;
      background: #F2F4F8;
      border-radius: 16rpx;

      .right {
        font-weight: 600;
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

<template>
  <view class="choose_token">
    <custom-header :title="language.text192" :customStyle="{ 'z-index': 99 }"/>
    <view class="border"></view>
    <view class="token-list">
      <TokenColumn :tokenName="item.alias_name" v-for="item in tokenList" :key="item.full_name" :tokenIcon="item.logo"
        @click.native="tokenChoose(item)" :tokenColumnStyle="tokenColumnStyle">
        <template #right>
          <view class="right">
            <view>{{ item.balance || '0.00' }}</view>
            <view>$ 0.00</view>
          </view>
        </template>
      </TokenColumn>
    </view>
  </view>
</template>

<script>
import TokenColumn from './components/TokenColumn.vue'
import language from '../language/index.js'
export default {
  components: {
    TokenColumn
  },
  data() {
    return {
      tokenList: this.$cache.get('_currentWallet').coinList,
      tokenColumnStyle: {
        paddingBottom: '32rpx',
        paddingTop: '32rpx',
      },
      language: language[this.$cache.get('_language')]
    }
  },
  methods: {
    tokenChoose(item) {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('changeToken', item)
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
  .choose_token {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
  }
  
  .token-list {
    margin: 32rpx 32rpx 0;
  }

  .border {
    height: 2rpx;
    opacity: 0.16;
    background-color: #8397B1;
  }

  .right {
    view:first-child {
      font-weight: 600;
      font-size: 36rpx;
      line-height: 36rpx;;
      color: #2C365A;
      margin-bottom: 8rpx;
    }

    view:last-child {
      font-size: 28rpx;
      line-height: 28rpx;
      color: #8397B1;
    }
  }
</style>

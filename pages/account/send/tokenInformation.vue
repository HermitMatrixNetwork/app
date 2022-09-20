<template>
  <view class="token-information">
    <custom-header class="header" :title="describe.alias_name"></custom-header>

    <view class="basic">
      <view class="title">{{ language.text76 }}</view>
      <view class="content">
        <view v-for="(item, key) in showLabelList" :key="key" class="content-item">
          <text class="label">{{language[item.label]}} :</text>
          <view class="value">
            <text :class="{ isLink : item.label == 'text79' }">{{ describe[item.value] || language.text113 }}</text>
            <image v-if="['text79', 'text78'].includes(item.label) &&  describe[item.value]" src="/static/img/account/copy2.png" @click="copy(describe[item.value])"></image>
          </view>
        </view>
      </view>
    </view>
    <view style="height: 16rpx;background: #F4F6FA;" />
    <view class="release">
      <view class="title">{{ language.text81 }}</view>
      <text v-text="describe.desc || language.text113">
      </text>
    </view>
    
    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import mainCoin from '@/config/index.js'
import language from '../language/index.js'
export default {
  data() {
    return {
      describe: mainCoin,
      language: language[this.$cache.get('_language')],
      showLabelList: [{
        label: 'text77',
        value: 'alias_name'
      }, {
        label: 'text78',
        value: 'full_name'
      }, {
        label: 'text79',
        value: 'official'
      }, {
        label: 'text80',
        value: 'contract_address'
      }]
    }
  },
  onLoad(options) {
    if (options.tokenID)
      this.describe = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
  },
  methods: {
    copy(val) {
      uni.setClipboardData({
        data: val,
        showToast: false,
        success: () => {
          this.$refs.notify.show('error', this.language.text56, { bgColor: '#275EF1' })
        },
        fail: () => {
          // this.$refs.notify.show('error', '复制失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .token-information {
    padding-top: calc(112rpx + var(--status-bar-height));
    background-color: #F4F6F9;
  }
  
  .header {
    background-color: #fff;
    margin-bottom: 2rpx;
  }
  
  .basic {
    width: 750rpx;
    background: #FFFFFF;
    border-radius: 2rpx;
    padding: 32rpx;
  }

  .release {
    width: 750rpx;
    background: #FFFFFF;
    border-radius: 2rpx;
    padding: 32rpx;

    text {
      font-weight: 400;
      font-size: 24rpx;
      color: #8397B1;
      letter-spacing: 0;
    }
  }

  .title {
    font-family: PingFangSC-Medium;
    font-weight: 600;
    font-size: 28rpx;
    color: #2C365A;
    letter-spacing: 0;
    margin-bottom: 16rpx;
  }

  .content-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    font-size: 24rpx;
    letter-spacing: 0;
    color: #2C365A;
    
    &:not(:last-child) {
      padding-bottom: 36rpx;
    }

    &:nth-child(1) {
      margin-top: 32rpx;
    }
    
    .label {
      color: #8397B1;
      flex: 1 0 auto;
      margin-right: 20rpx;
    }
  }

  .value {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #2C365A;
    word-break: break-word;

    text {
      margin-right: 12rpx;
      text-align: right;
    }
    
    image {
      width: 28rpx !important;
      height: 28rpx !important;
    }
  }
	
	.isLink {
		color: #1E5EFF;
	}
</style>

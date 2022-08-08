<template>
  <view class="token-information">
    <custom-header class="header" :title="'GHM'"></custom-header>

    <view class="basic">
      <view class="title">基本信息</view>
      <view class="content">
        <view v-for="(item, key) in showLabelList" :key="key" class="content-item">
          <text class="label">{{language[item]}} :</text>
          <view class="value">
            <text>{{ describe[item] || '暂无'}}</text>
            <image v-if="['official_website', 'full_name'].includes(item)" src="/static/img/account/copy2.png"></image>
          </view>
        </view>
      </view>
    </view>
    <view style="height: 16rpx;background: #F4F6FA;" />
    <view class="release">
      <view class="title">发行信息</view>
      <text>
        发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行......
      </text>
    </view>

  </view>
</template>

<script>
import mainCoin from '@/config/index.js'
import language from './language/index.js'
export default {
  data() {
    return {
      describe: mainCoin.describe,
      language: language[this.$cache.get('_language')],
      showLabelList: ['alias_name', 'full_name', 'official_website', 'contract_address']
    }
  },
  onLoad(options) {
    if (options.token)
      this.describe = JSON.parse(options.token)
  }
}
</script>

<style lang="scss" scoped>
  .token-information {
    height: 100vh;
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
    }
  }

  .value {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #2C365A;

    text {
      margin-right: 12rpx;
    }
    
    image {
      width: 28rpx !important;
      height: 28rpx !important;
    }
  }
</style>

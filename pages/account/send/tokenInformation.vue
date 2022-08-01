<template>
  <view>
    <custom-header :title="'GHM'"></custom-header>

    <view class="basic">
      <view class="title">基本信息</view>
      <view class="content">
        <view v-for="(item, key) in describe" :key="key" class="content-item">
          <text>{{language[key]}} :</text>
          <text class="value">
            <text>{{ item }}</text>
            <image v-if="['official_website', 'full_name'].includes(key)" src="/static/img/account/copy2.png"></image>
          </text>
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
      language: language[this.$cache.get('_language')]
    }
  }
}
</script>

<style lang="scss" scoped>
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
    font-weight: 500;
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
    padding-bottom: 36rpx;

    text:nth-child(1) {
      color: #8397B1;
    }

    &:nth-child(1) {
      margin-top: 32rpx;
    }
  }

  .value {
    display: flex;

    /deep/ .copy,
    /deep/ image,
    span {
      width: 28rpx !important;
      height: 28rpx !important;
    }
  }
</style>

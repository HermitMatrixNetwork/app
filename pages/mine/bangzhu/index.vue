<template>
  <view class="container">
    <custom-header class="header" title="帮助中心" :customStyle="{ 'background-color': '#fff' }"></custom-header>

    <view class="list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="label">
          <text>{{ item.label }}</text>
        </view>
        <view class="arrow">
          <image src="/static/img/ic-arrow1.png"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [{
        label: '如何进行转账?',
        page: ''
      }, {
        label: '如何添加代币?',
        page: ''
      }, {
        label: '忘记钱包密码怎么办?',
        page: ''
      }, {
        label: '钱包常见问题?',
        page: ''
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    background-color: #F4F6F9;
  }
  
  .header {
    border-bottom: 2rpx solid #F4F6F9;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 38rpx 34rpx 38rpx 32rpx;
    background-color: #fff;

    &:not(:last-child) {
      margin-bottom: 17rpx;
    }

    .label {
      font-size: 28rpx;
      color: #0F172A;
      line-height: 32rpx;
    }

    .arrow {
      image {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
</style>

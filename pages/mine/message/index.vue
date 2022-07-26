<template>
  <view class="container">
    <custom-header class="header" title="消息中心" :customStyle="{ 'background-color': '#fff' }"></custom-header>

    <view class="message">
      <view class="message-item" v-for="(item, index) in 5" :key="index" @click="toDetail">
        <view class="title">这是标题内容</view>
        <view class="content">这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容这是正文内容…...</view>
        <view class="time">07-11 17:45</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    toDetail() {
      uni.navigateTo({
        url: './detail'
      })
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
    margin-bottom: 2rpx;
  }

  .message {
    
    
    &-item {
      padding: 32rpx 30rpx 34rpx 42rpx;
      background-color: #fff;
      &:not(:last-child) {
        margin-bottom: 16rpx;
      }
    }
    


    .title {
      font-weight: 400;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
    }

    .content {
      font-weight: 400;
      font-size: 24rpx;
      color: #8397B1;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin: 16rpx 0 24rpx;
    }

    .time {
      font-weight: 400;
      font-size: 24rpx;
      color: #8397B1;
    }
  }
</style>

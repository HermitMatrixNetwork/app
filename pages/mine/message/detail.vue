<template>
  <view class="container">
    <custom-header class="header" title="消息详情"></custom-header>
    
    <view class="message">
      <view class="title">这是标题内容</view>
      <view class="meta">
        <view class="create-time">2022-04-27  22:55:56</view>
        <view class="create-author">
          <text>发布者：</text>
          <text>Hermit Wallet 官方</text>
        </view>
      </view>
      <view class="content">
        内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容。
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
        
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  border-bottom: 2rpx solid #F4F6F9;
}

.message {
  padding: 50rpx 32rpx 0;
  .title {
    font-weight: 600;
    font-size: 36rpx;
    color: #32475F;
    margin-bottom: 24rpx;
  }
  .meta {
    display: flex;
    height: 24px;
    font-size: 24rpx;
    color: #8397B1;
    line-height: 24rpx;
    margin-bottom: 32rpx;
    .create-time {
      margin-right: 18rpx;
    }
  }
  
  .content {
    font-size: 28rpx;
    color: #8397B1;
  }
}
</style>

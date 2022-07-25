<template>
  <view class="container">
    <custom-header title="节点设置">
      <template slot="right">
        <view class="title-right" @click="addNode">
          <image src="/static/img/mine/add3.png"></image>
        </view>
      </template>
    </custom-header>
    
      <view class="node" v-for="item in 10" @click="toEditNode">
        <view class="node-content">
          <view class="node-name">网络名称</view>
          <view class="node-link">
            <text>RPC链接：</text>
            <text>https://ghm-mainnet.improd.works</text>
          </view>
        </view>
        <view class="arrow">
          <image src="/static/img/ic-arrow1.png"></image>
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
    addNode() {
      uni.navigateTo({
        url: './addNode'
      })
    },
    toEditNode() {
      uni.navigateTo({
        url: './editNode'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title-right {
  image {
    width: 44rpx;
    height: 44rpx;
  }
}

.node {
  display: flex;
  padding: 32rpx 30rpx 34rpx 32rpx;
  align-items: center;
  justify-content: space-between;
  
  &:not(:last-child) {
    border-top: 2rpx solid #F4F6F9;
  }
  
  &-name {
    font-size: 28rpx;
    color: #2C365A;
    margin-bottom: 24rpx;
  }
  &-link {
    font-size: 28rpx;
    color: #8397B1;
  }
  
  .arrow {
    image {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
</style>

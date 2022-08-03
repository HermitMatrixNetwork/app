<template>
  <view class="list">
    <view class="item" @click="goTo('/pages/delegate/transactionDetails')">
      <view class="left">
        <image :src="'/static/img/placeholder.jpeg'" style="width: 72rpx; height: 72rpx;" />
      </view>
      <view class="center">
        <view class="address">
          {{ 'ghm63212AB...15DdC2' | sliceAddress(6, -6) }}
        </view>
        <view class="name">
          22/06/2022 14:55:03
        </view>
      </view>
      <div class="right">
        <text class="num">0.2 GHM</text>
      </div>
    </view>
  </view>
</template>

<script>
  import {
    sliceAddress
  } from '@/utils/filters.js'
  export default {
    methods: {
      goTo(url) {
        uni.navigateTo({
          url
        })
      }
    },
    filters: {
      sliceAddress
    }
  }
</script>

<style lang="scss" scoped>
  .list {
    .item {
      display: flex;
      align-items: center;
      padding: 32rpx 0;
      border-bottom: 2rpx solid rgba(131, 151, 177, 0.20);

      .left {
        margin-right: 20rpx;
        height: 72rpx;
        width: 72rpx;
      }

      .center {
        flex: 2;

        .name {
          font-size: 24rpx;
          color: #8397B1;
        }

        .address {
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
          margin-bottom: 16rpx;
        }
      }

      .right {

        .num {
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
        }
      }
    }
  }
</style>

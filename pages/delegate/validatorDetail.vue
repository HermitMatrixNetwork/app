<template>
  <view class="container">
    <custom-header title="详情"></custom-header>

    <view class="name">
      <image src="/static/img/delegate/theme2.png"></image>
      <view class="name-info">
        <view class="title">
          验证人名称
        </view>
        <view class="address">
          <text>ghm63212ABCBA108DDB2Ea21545Ff1515DdC22318</text>
          <image src="/static/img/account/copy.png"></image>
        </view>
      </view>
    </view>

    <!-- 验证人详细信息 -->
    <view class="detail">
      <view class="item">
        <view class="label">
          <text>受托总数</text>
        </view>
        <view class="value">
          <text>10000.00</text>
        </view>
      </view>
      <view class="item">
        <view class="label">
          <text>自委托数</text>
        </view>
        <view class="value">
          <text>1000.00</text>
        </view>
      </view>
      <view class="item">
        <view class="label">
          <text>佣金率</text>
        </view>
        <view class="value">
          <text>20%</text>
        </view>
      </view>
      <view class="item">
        <view class="label">
          <text>活跃度</text>
        </view>
        <view class="value">
          <text>100%</text>
        </view>
      </view>
    </view>

    <!-- 说明 -->
    <view class="explain">
      <view class="item">
        <view class="label">
          <view class="dot"></view>
          <text>委托说明</text>
        </view>
        <view class="info">
          <text>委托的GHM需要XXX区块高度（约xx天）赎回。</text>
        </view>
      </view>
      <view class="item">
        <view class="label">
          <view class="dot"></view>
          <text>收益说明</text>
        </view>
        <view class="info">
          <text>
            当您委托交易成功后，被委托的验证人参与了出块或者确认区块可获得收益，这意味着您需要斟酌对于验证节点的投票委托，委托收益根据个人委托量占节点总委托数的比例进行计算，委托收益领取后立即到账。
          </text>
        </view>
      </view>
    </view>
    
    <u-button class="btn" @click="toDelegate">去委托</u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      validatorInfo: {}
    }
  },
  onLoad(options) {
    this.validatorInfo = JSON.parse(options.validatorInfo)
    console.log(this.validatorInfo)
  },
  methods: {
    toDelegate() {
      uni.navigateTo({
        url: './delegate'
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

  .name {
    position: relative;
    margin: 32rpx;
    height: 200rpx;

    >image {
      position: absolute;
      width: 100%;
      height: 200rpx;
    }

    .name-info {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      margin: auto;
      text-align: center;


      .title {
        font-weight: 600;
        font-size: 32rpx;
        color: #FFFFFF;
        line-height: 32rpx;
        margin-bottom: 32rpx;
      }

      .address {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        color: #FFFFFF;

        image {
          width: 32rpx;
          height: 32rpx;
        }

        text {
          font-size: 24rpx;
          margin-right: 6rpx;
        }
      }
    }
  }

  .detail {
    margin: 32rpx;
    background-color: #fff;
    padding: 14rpx 32rpx;
    border-radius: 16rpx;

    .item {
      display: flex;
      justify-content: space-between;
      padding: 36rpx 0;

      &:not(:last-child) {
        border-bottom: 2rpx solid rgba(131, 151, 177, 0.12)
      }

      .label {
        font-size: 28rpx;
        color: #8397B1;
        line-height: 28rpx;
      }

      .value {
        font-weight: 600;
        font-size: 28rpx;
        color: #212121;
        line-height: 28rpx;
      }
    }
  }

  .explain {
    margin: 0 32rpx;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 0 40rpx 58rpx 32rpx;

    .item {
      .label {
        display: flex;
        align-items: center;
        padding-top: 48rpx;
        margin-bottom: 24rpx;
        .dot {
          width: 16rpx;
          height: 16rpx;
          margin-right: 12rpx;
          background: #1E5EFF;
          border-radius: 50%;
        }
        text {
          font-weight: 600;
          font-size: 28rpx;
          color: #0F172A;
          line-height: 28rpx;
        }
      }
      .info {
        text {
          font-size: 24rpx;
          color: #8397B1;
          line-height: 24rpx;
        }
      }
    }
  }

  .btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
  }
</style>

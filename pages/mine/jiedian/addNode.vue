<template>
  <view class="container">
    <custom-header class="header" title="添加节点" :customStyle="{ 'background-color': '#fff' }">
      <template slot="right">
        <view class="save">
          保存
        </view>
      </template>
    </custom-header>

    <view class="wallet-name item">
      <view class="wallet-name-label">
        钱包名称
      </view>
      <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
      <u-input class="wallet-name-input" v-model="name" placeholder="请输入网络名称"></u-input>
      <!-- :style="{ opacity: confirmPasswordError ? 1 : 0 }" -->
      <view class="error-tip">
        {{ language.nameErrorTip }}
      </view>
    </view>
    
    <view class="wallet-name item">
      <view class="wallet-name-label">
        RPC地址
      </view>
      <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
      <u-input class="wallet-name-input" v-model="name" placeholder="请输入RPC地址"></u-input>
      <!-- :style="{ opacity: confirmPasswordError ? 1 : 0 }" -->
      <view class="error-tip">
        {{ language.nameErrorTip }}
      </view>
    </view>
    
    <view class="wallet-name item">
      <view class="wallet-name-label">
        Chain ID
      </view>
      <!-- :class="{error: invalidFields.fieldName == 'name'}" -->
      <u-input class="wallet-name-input" v-model="name" placeholder="请输入Chain ID"></u-input>
      <!-- :style="{ opacity: confirmPasswordError ? 1 : 0 }" -->
      <view class="error-tip">
        {{ language.nameErrorTip }}
      </view>
    </view>
  </view>
</template>

<script>
import language from './language/index.js'
export default {
  data() {
    return {
      name: '',
      language: language[this.$cache.get('_language')]
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

  .save {
    font-size: 28rpx;
    color: #1E5EFF;
  }
  
  .item {
    background-color: #fff;
    padding: 32rpx;
  }
  
  .wallet-name {
    &-label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-weight: 500;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      line-height: 28rpx;
    }

    .u-input {
      height: 96rpx;
      background-color: #F2F4F8;

      /deep/ input {
        color: #2C365A !important;
        font-size: 28rpx !important;
      }

      /deep/ .input-placeholder {
        height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        color: #8397B1 !important;
        line-height: 48rpx !important;
      }
    }
  }

  .wallet-name {

    /deep/ .u-input {
      border-radius: 16rpx !important;
    }
  }

  .error-tip {
    height: 24rpx;
    margin-top: 16rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #EC2828;
    line-height: 24rpx;
  }

  .error {
    background-color: rgba(230, 55, 51, 0.12) !important;

    /deep/ .uni-input-input {
      color: #E63733 !important;
    }

    /deep/ .uni-input-wrapper .input-placeholder {
      color: #E63733 !important;
    }
  }
</style>

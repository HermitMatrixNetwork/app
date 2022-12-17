<template>
  <view>
    <view class="page-header">
      <view class="status_bar">
        <!-- APP下会占用系统原生消息因此需要该占位符 -->
      </view>
      <view class="header">
        <u-search :showAction="false" :placeholder="language.text02" shape="round" :clearabled="true"
          v-model="searchVal" @search="search" searchIcon="/static/img/delegate/search2.png"></u-search>
      </view>
    </view>
  </view>
</template>

<script>
  import language from './language/index.js'
  export default {
    onLoad(options) {
      this.searchVal = options.searchVal
    },
    data() {
      return {
        language: language[this.$cache.get('_language')],
        searchVal: ''
      };
    },
    methods: {
      search() {
        
      }
    }
  }
</script>

<style lang="scss" scoped>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
    background-color: #F4F6F9;
  }
  
  .header {
    height: 112rpx;
    padding: 20rpx 32rpx;
    background-color: #fff;
  
    /deep/ .u-input {
      background-color: #F4F6F9;
      border-radius: 36rpx;
  
      input {
        color: #2C365A !important;
      }
    }
  }
</style>

<template>
  <view class="container">
    <custom-header class="header" title="联系我们" :customStyle="{ 'background-color': '#fff' }"></custom-header>

    <view class="list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="label">
          <view class="label-icon">
            <image :src="item.icon"></image>
          </view>
          <view>{{ item.label }}</view>
        </view>
        <view class="arrow" @click="copy(item.value)">
          <text>{{ item.value }}</text>
          <image src="/static/img/mine/contact/copy.png"></image>
        </view>
      </view>
    </view>
    
    <Notify ref="notify" />
  </view>
</template>

<script>
import Notify from '@/pages/index/components/notify.vue'
import language from './language/index.js'
export default {
  components: { Notify },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      list: [{
        label: '官网',
        page: '',
        icon: '/static/img/mine/contact/wallet.png',
        value: 'https://xxxxxx.com'
      }, {
        label: '推特',
        page: '',
        icon: '/static/img/mine/contact/twitter.png',
        value: 'https://xxxxxx.com'
      }, {
        label: '电报群',
        page: '',
        icon: '/static/img/mine/contact/telegram.png',
        value: 'https://xxxxxx.com'
      }, {
        label: 'GitHup',
        page: '',
        icon: '/static/img/mine/contact/github.png',
        value: 'https://xxxxxx.com'
      },{
        label: 'Medium',
        page: '',
        icon: '/static/img/mine/contact/medium.png',
        value: 'https://xxxxxx.com'
      },{
        label: 'Email',
        page: '',
        icon: '/static/img/mine/contact/email.png',
        value: 'https://xxxxxx.com'
      },{
        label: '微信号',
        page: '',
        icon: '/static/img/mine/contact/wechat.png',
        value: 'https://xxxxxx.com'
      }]
    }
  },
  methods: {
    copy(val) {
      uni.setClipboardData({
        data: val,
        showToast: false,
        success: () => {
          this.$refs.notify.show('success', this.language.copySuccess)
        },
        fail: () => {
          this.$refs.notify.show('error', this.language.copyfailure)
        }
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

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 38rpx 34rpx 38rpx 32rpx;
    background-color: #fff;

    &:not(:last-child) {
      border-top: 2rpx solid #F4F6F9;
    }

    .label {
      display: flex;
      align-items: center;
      
      font-size: 28rpx;
      color: #0F172A;
      line-height: 32rpx;
      
      &-icon {
        margin-right: 24rpx;
        image {
          width: 44rpx;
          height: 44rpx;
        }
      }
    }

    .arrow {
      display: flex;
      align-items: center;
      text {
        font-weight: 400;
        font-size: 28rpx;
        color: #8397B1;
        line-height: 32rpx;
        margin-right: 16rpx;
      }
      image {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
</style>

<template>
  <view class="container">
    <custom-header class="header" :title="language.text64" :customStyle="{ 'background-color': '#fff' }"></custom-header>

    <view class="list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="label">
          <view class="label-icon">
            <image :src="item.icon"></image>
          </view>
          <view>{{ item.label }}</view>
        </view>
        <view class="arrow" @click="copy(item.value)">
          <custom-loading v-if="loading" class="loading"></custom-loading>
          <text v-else>{{ item.value }}</text>
          <image src="/static/img/mine/contact/copy.png"></image>
        </view>
      </view>
    </view>
    
    <custom-notify ref="notify" />
  </view>
</template>

<script>
import language from '../language/index.js'
import { getLinkList } from '@/api/token.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      list: [{
        label: language[this.$cache.get('_language')].text65,
        flag: 'official_website',
        icon: '/static/img/mine/contact/wallet.png',
        value: ''
      }, {
        label: language[this.$cache.get('_language')].text66,
        flag: 'twitter',
        icon: '/static/img/mine/contact/twitter.png',
        value: ''
      }, {
        label: language[this.$cache.get('_language')].text67,
        flag: 'telegram',
        icon: '/static/img/mine/contact/telegram.png',
        value: ''
      }, {
        label: 'GitHup',
        flag: 'github',
        icon: '/static/img/mine/contact/github.png',
        value: ''
      },{
        label: 'Medium',
        flag: 'medium',
        icon: '/static/img/mine/contact/medium.png',
        value: ''
      },{
        label: 'Email',
        flag: 'email',
        icon: '/static/img/mine/contact/email.png',
        value: ''
      },{
        label: language[this.$cache.get('_language')].text68,
        flag: 'wechat',
        icon: '/static/img/mine/contact/wechat.png',
        value: ''
      }],
      loading: true
    }
  },
  async created() {
    const res = (await getLinkList()).data.data.contract_info
    this.list.forEach(item => {
      item.value = res[item.flag]
    })
    this.loading = false
  },
  methods: {
    copy(val) {
      uni.setClipboardData({
        data: val,
        showToast: false,
        success: () => {
          this.$refs.notify.show('success', this.language.text14, { bgColor: '#275EF1' })
        },
        fail: () => {
          // this.$refs.notify.show('error', this.language.copyfailure)
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
  
  .loading {
    margin-right: 20rpx;
  }
</style>

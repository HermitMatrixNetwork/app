<template>
  <view class="container">
    <custom-header class="header" :title="language.text61" :customStyle="{ 'background-color': '#fff' }"></custom-header>
    <custom-loading v-if="loading" style="margin-top: 20rpx"></custom-loading>
    <view v-else class="list">
      <view class="item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
        <view class="label">
          <text>{{ item[`${currentLanguage.toLowerCase()}_title`]}}</text>
        </view>
        <view class="arrow">
          <image src="/static/img/ic-arrow1.png"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getHelp } from '@/api/token.js'
import language from '../language/index.js'
export default {
  data() {
    return {
      list: [],
      currentLanguage: this.$cache.get('_language'),
      language: language[this.$cache.get('_language')],
      loading: true
    }
  },
  async created() {
    this.loading = true
    let res = (await getHelp()).data.data.help_info
    this.list = res
    this.$nextTick(() => {
      this.loading = false
    })
  },
  methods: {
    toDetail(item) {
      uni.navigateTo({
        url: './detail',
        success(res) {
          res.eventChannel.emit('acceptDataFromOpenerPage', item)
        } 
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    min-height: 100vh;
    padding-top: calc(112rpx + var(--status-bar-height));
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

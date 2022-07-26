<template>
  <view class="mine">
    <custom-header :showGoBack="false" title="我的" :customStyle="{ 'background-color': '#fff' }">
      <template slot="right">
        <view class="header-icon" @click="toMessage">
          <image src="@/static/img/mine/message.png"></image>
          <view class="message-badge"><text>{{ messageNum }}</text></view>
        </view>
      </template>
    </custom-header>
    <view class="import-container">
      <view class="top">
        <view class="import-type" v-for="(item, index) in top" :key="item.name" @click="toPage('top', index)">
          <view class="content">
            <view class="content-icon">
              <image :src='`/static/img/mine/${ item.icon }`'></image>
            </view>
            <view class="content-content">
              <view class="content-content-name">{{ item.name }}</view>
            </view>
            <view class="content-arrow-right">
              <u-icon name="arrow-right" color="#8397B1" size="32rpx"></u-icon>
            </view>
          </view>
          <view class="border">
          </view>
        </view>
      </view>
      <view class="center">
        <view class="import-type" v-for="(item, index) in center" :key="item.name" @click="toPage('center', index)">
          <view class="content">
            <view class="content-icon">
              <image :src='`/static/img/mine/${ item.icon }`'></image>
            </view>
            <view class="content-content">
              <view class="content-content-name">{{ item.name }}</view>
            </view>
            <view class="content-arrow-right">
              <u-icon name="arrow-right" color="#8397B1" size="32rpx"></u-icon>
            </view>
          </view>
          <view class="border">
          </view>
        </view>
      </view>
      <view class="bottom">
        <view class="import-type" v-for="(item, index) in bottom" :key="item.name" @click="toPage('bottom', index)">
          <view class="content">
            <view class="content-icon">
              <image :src='`/static/img/mine/${ item.icon }`'></image>
            </view>
            <view class="content-content">
              <view class="content-content-name">{{ item.name }}</view>
            </view>
            <view class="content-arrow-right">
              <u-icon name="arrow-right" color="#8397B1" size="32rpx"></u-icon>
            </view>
          </view>
          <view class="border">
          </view>
        </view>
      </view>
    </view>

    <tab-bar :current-page="4" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      top: [{
        name: '地址薄',
        icon: 'dizhipu.png',
        page: '/pages/account/send/adres_book'
      }, {
        name: '大额提醒',
        icon: 'dae.png',
        page: './dae/index'
      }],
      center: [{
        name: '安全设置',
        icon: 'anquan.png',
        page: './anquan/index'
      }, {
        name: '节点设置',
        icon: 'jiedian.png',
        page: './jiedian/index'
      }, {
        name: '语言设置',
        icon: 'yuyan.png',
        page: './yuyan/index'
      }],
      bottom: [{
        name: '帮助中心',
        icon: 'bangzhu.png',
        page: './bangzhu/index'
      }, {
        name: '联系我们',
        icon: 'lianxi.png',
        page: './lianxi/index'
      }, {
        name: '问题反馈',
        icon: 'wentifankui.png',
        page: './wenti/index'
      }, {
        name: '关于我们',
        icon: 'guanyu.png',
        page: './guanyu/index'
      }],
      messageNum: 10,
    }
  },
  methods: {
    toPage(position, index) {
      uni.navigateTo({
        url: this[position][index].page
      })
    },
    toMessage() {
      uni.navigateTo({
        url: './message/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mine {
    height: 100vh;
    background-color: #F4F6F9;
  }

  .header-icon {
    position: relative;
    display: flex;
    align-items: center;
    height: 46rpx;
    width: 46rpx;

    image {
      width: 46rpx;
      height: 46rpx;
    }

    .message-badge {
      position: absolute;
      right: -8rpx;
      top: -12rpx;
      width: 34rpx;
      height: 34rpx;
      border-radius: 50%;
      background-color: #EE2933;
      font-size: 22rpx;
      color: #fff;
      text-align: center;
      line-height: 34rpx;
    }
  }

  image {
    width: 44rpx;
    height: 44rpx;
  }

  .import-container {
    margin: 32rpx 0;
  }

  .import-type {
    padding: 40rpx 0 0rpx 0;

    .content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32rpx 33rpx 48rpx;

      &-icon {
        width: 44rpx;
        height: 44rpx;
      }

      &-content {
        flex: 1;
        margin-left: 32rpx;

        &-name {
          font-weight: 500;
          font-size: 32rpx;
          color: #0F172A;
          line-height: 32rpx;
        }
      }
    }

    .border {
      border-bottom: 2rpx solid #F2F4F8;
      margin-left: 48rpx;
    }

    &:last-child {
      .border {
        border-bottom: 0;
      }
    }
  }

  .top,
  .center,
  .bottom {
    margin-top: 25rpx;
    background: #FFFFFF;
  }
</style>

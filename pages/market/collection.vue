<template>
  <view class="page-wrapper">
    <custom-notify style="z-index: 99" ref="notify"></custom-notify>
    <custom-header :title="language.text18" :customStyle="{ 'z-index': 98 }">
      <template #right>
        <text class="right-text" @click="changeAction" :class="{ 'disable' : collection.length == 0 }">{{ action == 'view' ? language.text19 : language.text20 }}</text>
      </template>
    </custom-header>
    <view class="border"></view>

    <view class="list" v-if="collection.length">
      <view class="content" v-for="(item, index) in collection" :key="index" @click="toWebView(item)">
        <view class="item">
          <view class="logo">
            <image src="/static/img/account/uGHM.png"></image>
          </view>
          <view class="article">
            <view class="title">
              {{ item.name }}
            </view>
            <view class="describe">
              {{ item.des }}
            </view>
            <view class="article-border">
            </view>
          </view>
          <view class="radio" v-if="action == 'edit'">
            <u-checkbox-group @change="radioChange(item, index)">
              <u-checkbox shape="circle"></u-checkbox>
            </u-checkbox-group>
          </view>
        </view>
        <view class="border"></view>
      </view>
    </view>
    <no-data v-else class="no-data" :tip="language.text11"></no-data>
  </view>
</template>

<script>
import language from './language/index.js'
export default {
  data() {
    return {
      collection: [],
      selectedIndex: [],
      tempCollection: [],
      action: 'view',
      language: language[this.$cache.get('_language')]
    }
  },
  created() {
    this.collection = this.$cache.get('_collectionList') || []
    this.tempCollection = this.$cache.get('_collectionList') || []
  },
  methods: {
    toWebView(item) { // Tools
      console.log('fire', item)
      uni.navigateTo({
        url: `./webview?jumpUrl=${item.url}`
      })
    },
    changeAction() {
      if (this.collection.length == 0) return
      if (this.action == 'view') {
        this.action = 'edit'
      } else {
        this.action = 'view'
        if (this.selectedIndex.length > 0) {
          // 更新收藏列表
          this.collection = this.collection.filter((item ,index) => !this.selectedIndex.includes(index))
          this.$cache.set('_collectionList', this.collection, 0)
          this.$refs.notify.show('error', this.language.text21, {
            bgColor: '#275EF1'
          })
          this.selectedIndex = []
        } else {
          this.$refs.notify.show('error', this.language.text22, {
            bgColor: '#275EF1'
          })
        }
      }
    },
    clickItem() {
      
    },
    radioChange(val, index) {
      const findIndex = this.selectedIndex.findIndex(item => item == index)
      if (findIndex > -1) { // 存在
        this.selectedIndex.splice(findIndex, 1)
      } else { // 不存在
        this.selectedIndex.push(index)
      }
      console.log(this.selectedIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
  .no-data {
    // height: 100vh;
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .page-wrapper {
    height: 100vh;
    padding-top: calc(112rpx + var(--status-bar-height));
  }
  .border {
    height: 2rpx;
    opacity: 0.16;
    background-color: #8397B1;
  }

  .list {
    .border {
      margin-left: 129rpx;
      margin-right: 32rpx;
    }
    .item {
      padding: 32rpx 32rpx 36rpx 32rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .logo {
        margin-right: 25rpx;

        image {
          width: 72rpx;
          height: 72rpx;
        }
      }

      .article {
        flex: 1;
        .title {
          text-align: left;
          font-weight: 400;
          font-size: 28rpx;
          color: #2C365A;
          // line-height: 28rpx;
          word-break: break-all;
          // text-overflow: ellipsis;
          // white-space: nowrap;
          // overflow: hidden;
          margin-bottom: 16rpx;
        }

        .describe {
          font-weight: 400;
          font-size: 24rpx;
          color: #8397B1;
          line-height: 24rpx;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

      }
    }
  }
  
  .right-text {
    font-family: PingFangSC-Regular;
    font-size: 28rpx;
    color: #1E5EFF;
  }
  
  .disable {
    color: #ccc;
  }
</style>

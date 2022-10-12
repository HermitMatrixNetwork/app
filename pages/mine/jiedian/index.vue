<template>
  <view class="container">
    <custom-header tabUrl="/pages/mine/index" :title="language.text37" class="header">
      <template slot="right">
        <view class="title-right">
          <text class="save" @click="changeRpc"
            v-show="currentRpc !== nodeList[selectIndex].link">{{ language.text43 }}</text>
          <image src="/static/img/mine/add3.png" @click="addNode"></image>
        </view>
      </template>
    </custom-header>

    <view class="node" v-for="(item, index) in nodeList" :key="item.link">
      <view class="radio" @click="selectIndex = index">
        <radio class="radio" shape="circle" :checked="index == selectIndex"></radio>
      </view>
      <view class="node-content" @click="toEditNode(item)">
        <view class="node-name">{{ item.name }}</view>
        <view class="node-link">
          <text>RPC {{ language.text90 }}：</text>
          <text>{{ item.link }}</text>
        </view>
      </view>
      <view class="arrow" @click="toEditNode(item)">
        <image src="/static/img/ic-arrow1.png"></image>
      </view>
    </view>

    <custom-notify ref="notify"></custom-notify>
  </view>
</template>

<script>
import {
  DEFAULT_RPC
} from '@/config/index.js'
import {
  getCurrentRpc
} from '@/config/index.js'
import language from '../language/index.js'

export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      nodeList: [],
      selectIndex: 0,
      currentRpc: this.$cache.get('_currentRpc')
    }
  },
  onLoad() {
    this.nodeList = this.$cache.get('_nodeList') || [DEFAULT_RPC]
    this.$cache.set('_nodeList', this.nodeList, 0)
    this.currentRpc = this.$cache.get('_currentRpc')
    this.selectIndex = this.$cache.get('_nodeList').findIndex(item => item.link == this.$cache.get('_currentRpc'))
  },
  methods: {
    addNode() {
      uni.navigateTo({
        url: './addNode'
      })
    },
    changeRpc() {
      this.$cache.set('_currentRpc', this.nodeList[this.selectIndex].link, 0)
      this.currentRpc = this.nodeList[this.selectIndex].link
      this.$refs.notify.show('', '切换节点成功', {
        bgColor: '#275EF1'
      })
    },
    toEditNode(item) {
      uni.navigateTo({
        url: `./editNode?node=${JSON.stringify(item)}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding-top: calc(112rpx + var(--status-bar-height));
  }

  .title-right {
    display: flex;
    align-items: center;

    image {
      width: 44rpx;
      height: 44rpx;
      margin-left: 10rpx;
    }
  }

  .header {
    border-bottom: 2rpx solid #8397b133;
  }

  .node-content {
    flex: 1;
    margin-left: 40rpx;
  }

  .node {
    display: flex;
    padding: 32rpx 0 34rpx 0;
    margin: 0 32rpx;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2rpx solid #8397b133;

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

  .save {
    color: #1E5EFF;
    font-size: 28rpx;
  }
</style>

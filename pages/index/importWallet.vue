<template>
  <view class="content">
    <custom-header class="header" title="选择导入类型"></custom-header>
    <view class="import-container">
      <view class="import-type" v-for="(item, index) in importTypes" :key="index" @click="toPage(index)">
        <view class="import-type-icon">
          <image :src='`/static/img/index/${ item.icon }`'></image>
        </view>
        <view class="import-type-content">
          <view class="import-type-content-name">{{ item.name }}</view>
          <view class="import-type-content-describe">
            {{item.describe}}
          </view>
        </view>
        <view class="import-type-arrow-right">
          <u-icon name="arrow-right" color="#8397B1" size="32rpx"></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      importTypes: [{
        name: '助记词',
        icon: '助记词.png',
        describe: '助记词由单词组成，以空格隔开',
        page: './importFromMnemonic'
      }, {
        name: '私钥',
        icon: '私钥.png',
        describe: '明文私钥字符',
        page: './importFromPrivatekey'
      }, {
        name: 'Keystore',
        icon: 'keystore.png',
        describe: '加密的私钥JSON 文件',
        page: './importFromKeystore'
      }]
    }
  },
  methods: {
    toPage(index) {
      uni.navigateTo({
        url: this.importTypes[index].page
      })
    }
  }
}
</script>

<script lang="renderjs" module="render">
  export default {}
</script>


<style lang="scss">
  .content {
    background-color: #F2F4F8;
    width: 100vw;
    height: 100vh;

    .header {
      background-color: #fff;
    }

    .import-container {
      width: 686rpx;
      margin: 32rpx;
      background: #FFFFFF;
      border-radius: 16rpx;
    }

    .import-type {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40rpx 20rpx 40rpx 40rpx;

      &:not(:last-child) {
        border-bottom: 2rpx solid #F2F4F8;
      }

      &-icon {
        width: 44rpx;
        height: 44rpx;

        uni-image {
          width: 44rpx;
          height: 44rpx;
        }
      }

      &-content {
        flex: 1;
        margin-left: 32rpx;

        &-name {
          margin-bottom: 14rpx;
          font-weight: 600;
          font-size: 32rpx;
          color: #0F172A;
          line-height: 32rpx;
        }

        &-describe {
          font-weight: 400;
          font-size: 24rpx;
          color: #8397B1;
          line-height: 24rpx;
        }
      }
    }
  }
</style>

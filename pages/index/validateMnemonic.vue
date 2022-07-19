<template>
  <view>
    <custom-header></custom-header>

    <view class="mnemonic">
      <view class="mnemonic-title">验证助记词</view>
      <view class="mnemonic-hint">
        请根据已备份好的助记词按顺序选择
      </view>
      <view class="mnemonic-input">
        <view class="mnemonic-input-item" v-for="(item, index) in pickedMnemonicList" :key="index"
          @click="resetItem(item, index)">
          <view class="item">{{ item }}</view>
          <view class="error-icon" v-show="errorIndex > -1 && index >= errorIndex">
            <u-icon name="close-circle-fill" color="#F53F3F" size="36rpx"></u-icon>
          </view>
        </view>
      </view>
      <view class="mnemonic-content">
        <view class="mnemonic-content-item" :class="{ disable: pickedMnemonicIndex.includes(index) }"
          v-for="(item, index) in randomMnemonicList" :key="index" @click="pickItem(item, index)">
          {{ item }}
        </view>
      </view>
      <u-button class="mnemonic-confirm" :class="{complete: checkComplete()}" @click="confirm">确认</u-button>
    </view>

    <!-- 错误提示 -->
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import Notify from './components/notify.vue'
import WalletCrypto from '@/utils/walletCrypto.js'
export default {
  components: { Notify },
  data() {
    return {
      mnemonicList: [], // 正确顺序的助记词
      randomMnemonicList: [], // 随机排序助记词 
      pickedMnemonicList: [], // 用户选择的助记词
      pickedMnemonicIndex: [], // 用户选择助记词的索引 (基于随机助记词数组)
      errorIndex: -1, // 选择错误助记词的索引
    }
  },
  created() {
    this.wallet = this.$cache.get('_currentWallet')
    this.mnemonicList = WalletCrypto.decode(this.wallet.mnemonic).split(' ')
    this.randomMnemonicList = WalletCrypto.decode(this.wallet.mnemonic).split(' ').sort(() => Math.random() - 0.5)
  },
  methods: {
    // 删除选择的助记词
    resetItem(item, index) {
      this.pickedMnemonicList.splice(index, 1)
      this.pickedMnemonicIndex.splice(index, 1)
      this.validatePickedMnemonicList()
    },
    // 添加选中的助记词
    pickItem(item, index) {
      if (this.pickedMnemonicIndex.includes(index)) return
      this.pickedMnemonicIndex.push(index)
      this.pickedMnemonicList.push(item)
      this.validatePickedMnemonicList()
    },
    // 验证器：校验已选择的助记词顺序是否错误
    validatePickedMnemonicList() {
      const mnemonicList = this.mnemonicList
      this.errorIndex = this.pickedMnemonicList.findIndex((item, index) => {
        // console.log(mnemonicList[index], index, item)
        return mnemonicList[index] !== item
      })
      if (this.errorIndex > -1) {
        // 助记词填写顺序错误
        this.$refs.notify.show('error', '助记词错误，请重新选择！')
      } else {
        this.$refs.notify.close()
      }
    },
    checkComplete() {
      return this.errorIndex == -1 && this.pickedMnemonicList.length == 12
    },
    confirm() {
      if (this.checkComplete()) {
        uni.reLaunch({
          url: '/pages/account/index'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .mnemonic {
    margin-top: 64rpx;
    padding: 0 42rpx 0 40rpx;

    &-title {
      font-weight: 600;
      font-size: 32rpx;
      color: #2C365A;
      line-height: 32rpx;
    }

    &-hint {
      font-weight: 400;
      font-size: 28rpx;
      color: #8397B1;
      line-height: 28rpx;
      margin-top: 16rpx;
      margin-bottom: 48rpx;
    }

    &-input {
      width: 670rpx;
      height: 420rpx;
      padding: 24rpx;
      margin-bottom: 48rpx;
      background: #FBFCFE;
      border: 1px solid rgba(176, 193, 208, 0.40);
      border-radius: 16rpx;

      &-item {
        position: relative;
        display: inline-block;
        padding: 20rpx 24rpx;
        margin-bottom: 24rpx;
        margin-right: 20rpx;
        text-align: center;
        background: #FFFFFF;
        border: 1px solid rgba(176, 193, 208, 0.60);
        border-radius: 16rpx;
        font-weight: 500;
        font-size: 32rpx;
        line-height: 32rpx;
        color: #2C365A;

        .error-icon {
          position: absolute;
          right: -18rpx;
          top: -14rpx;
          width: 36rpx;
          height: 36rpx;
          border-radius: 50%;
          text-align: center;
          line-height: 36rpx;
          color: #fff;
        }
      }
    }

    &-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 670rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #2C365A;

      &-item {
        width: 200rpx;
        padding: 30rpx 0;
        margin-bottom: 24rpx;
        text-align: center;
        background: #FFFFFF;
        border: 1px solid rgba(176, 193, 208, 0.60);
        border-radius: 16rpx;
      }
    }

    &-confirm {
      position: absolute;
      bottom: 64rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 622rpx;
      height: 96rpx;
      border-radius: 16rpx;
      background-color: #002FA7;
      font-weight: 400;
      font-size: 32rpx;
      color: #FCFCFD;
      line-height: 32rpx;
      opacity: .2;
    }
  }

  .complete {
    opacity: 1;
  }

  .disable {
    opacity: .2
  }
</style>

<template>
  <view class="page-wrapper">
    <custom-header></custom-header>

    <view class="mnemonic">
      <view class="mnemonic-title">{{ language.text20 }}</view>
      <view class="mnemonic-hint">
        {{ language.text21 }}
      </view>
      <view class="mnemonic-input">
        <view class="mnemonic-input-item" v-for="(item, index) in pickedMnemonicList" :key="index"
          @click="resetItem(item, index)">
          <view class="item">{{ item }}</view>
          <view class="error-icon" v-show="errorIndex > -1 && index >= errorIndex">
            <image src="/static/img/close.png" style="width: 36rpx; height: 36rpx;"></u-icon>
          </view>
        </view>
      </view>
      <view class="mnemonic-content">
        <view class="mnemonic-content-item" :class="{ disable: pickedMnemonicIndex.includes(index) }"
          v-for="(item, index) in randomMnemonicList" :key="index" @click="pickItem(item, index)">
          {{ item }}
        </view>
      </view>
      <u-button class="mnemonic-confirm" :class="{complete: checkComplete()}" @click="confirm">{{ language.text22 }}</u-button>
    </view>

    <!-- 错误提示 -->
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import Notify from './components/notify.vue'
import WalletCrypto from '@/utils/walletCrypto.js'
import mixin from './mixins/index.js'
import language from './language/index.js'
export default {
  components: { Notify },
  mixins: [mixin],
  data() {
    return {
      mnemonicList: [], // 正确顺序的助记词
      randomMnemonicList: [], // 随机排序助记词 
      pickedMnemonicList: [], // 用户选择的助记词
      pickedMnemonicIndex: [], // 用户选择助记词的索引 (基于随机助记词数组)
      errorIndex: -1, // 选择错误助记词的索引
      language: language[this.$cache.get('_language')]
    }
  },
  onLoad(options) {
    this.from = options.from
  },
  created() {
    this.wallet = this.$cache.get('_temporaryWallet')
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
        this.$refs.notify.show('error', this.language.text23)
      } else {
        this.$refs.notify.close()
      }
    },
    checkComplete() {
      return this.errorIndex == -1 && this.pickedMnemonicList.length == this.mnemonicList.length
    },
    confirm() {
      if (this.checkComplete()) {
        this.synchronizingLocalData(this.wallet)
        this.$cache.delete('_temporaryWallet')
        // uni.reLaunch({
        //   url: '/pages/account/index'
        // })
        if (this.from !== 'undefined') {
          this.$cache.set('_closeSwitchPopup', true, 0)
          this.$cache.delete('_tokenContent_accountTransfer_data')
          this.$cache.delete('_tokenContent_unBoundingBalance_data')
          this.$cache.delete('_tokenContent_locakAmount_data')
          this.$cache.delete('_my_list_data')
          this.$cache.delete('_my_totalReward_data')
          this.$cache.delete('_my_cumulativeReward_data')
          this.$cache.delete('_my_unBoundingBalance_data')
          this.$cache.delete('_ident_delegationsBlance_data')
          this.$cache.delete('_delegateInfo')
          this.$cache.delete('_tokenContent_locakAmount_data')
          this.$cache.delete('_tokenContent_unBoundingBalance_data')
          this.$cache.delete('_tokenContent_balance_data')
          this.$cache.delete('_account_locakAmount_data')
        }
        uni.switchTab({
          url: `/pages/account/index?from=${this.from}`
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-wrapper {
    height: 100vh;
    padding-top: calc(112rpx + var(--status-bar-height))
  }
  .mnemonic {
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
      min-height: 420rpx;
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
        font-weight: 600;
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
      font-weight: 600;
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
      margin-top: 32rpx;
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

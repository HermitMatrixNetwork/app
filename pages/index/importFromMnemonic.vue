<template>
  <view>
    <uniHeader class="header" title="助记词导入"></uniHeader>

    <view class="container">
      <view class="item">
        <view class="item-label">助记词</view>
        <view class="item-input">
          <u--textarea v-model="mnemonic" height="180rpx" @input="mnemonicChange" placeholder="输入助记词单词，使用空格隔开"
            maxlength="120">
          </u--textarea>
        </view>
      </view>
      <view class="item">
        <view class="item-label">资金密码</view>
        <view class="item-input item-input-password">
          <u-input :password="!passwordEye" v-model="password" placeholder="输入资金密码">
          </u-input>
          <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'" @click="passwordEye = !passwordEye">
          </u-icon>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          钱包名称
        </view>
        <view class="item-input">
          <u-input v-model="name" placeholder="设置钱包名称"></u-input>
        </view>
      </view>
    </view>
    <u-button class="btn" @click="importWallet">导入</u-button>

    <view :callRenderMnemonic="callRenderMnemonic" :change:callRenderMnemonic="render.getMnemonic"></view>
    <!-- 错误提示 -->
    <u-notify class="notify" ref="uNotify"></u-notify>

  </view>
</template>

<script>
  import uniHeader from './components/uniHeader.vue'
  import * as cosmosjs from '@cosmjs/crypto'
  import * as bip39 from 'bip39'
  import mixin from './mixins/index.js'
  export default {
    components: {
      uniHeader
    },
    mixins: [mixin],
    data() {
      return {
        mnemonic: '', // 助记词
        password: '', // 资金密码
        name: '', // 钱包名称
        passwordEye: false, // 是否明文显示资金密码
        callRenderMnemonic: '', // 调用render.getMnemonic获取助记词
        rules: {
          'password': {
            rule: 'min',
            len: 8,
            errMessage: '资金密码不能少于8位'
          }
        }
      }
    },
    methods: {
      importWallet() {
        // this.$cache.delete('_walletList') // @test
        const isValidate = this.verifyForm()
        // const isValidate = true // @test
        if (!isValidate) return; // 没有通过校验
        // 还原钱包
        const wallet = this.findWallet('mnemonic', this.mnemonic)
        if (wallet) { // walletList 有钱包数据，直接拿来使用
          wallet.name = this.name
          this.$cache.set('_currentWallet', wallet, 0)
          this.updateWalletList(wallet)
          this.toAccount()
        } else { // 没有钱包数据，通过助记词还原钱包
          this.callRenderMnemonic = this.mnemonic.trim()
        }
      },
      cbInitWallet() {
        this.toAccount()
      },
      toAccount() {
        uni.navigateTo({
          url: '/pages/account/index'
        })
      },
      mnemonicChange() {
        const mnemonic = this.mnemonic.trim().split(' ')
        const totalMnemonicList = cosmosjs.EnglishMnemonic.wordlist
        this.verifySingleMnemonic(mnemonic, totalMnemonicList)
      },
      // 校验单个助记词
      verifySingleMnemonic(target, source) {
        let errorMnemonic
        // #ifdef H5
        errorMnemonic = target.findLast(mnemonic => !source.find(item => target.slice(-1)[0] == mnemonic ? item
          .startsWith(mnemonic) : item == mnemonic
        ))
        // #endif
        // #ifdef APP
        for (let i = target.length; i >= 0; i--) {
          let mnemonic = target[i]
          // 就是不写注释 气死你
          source.find(item => target.slice(-1)[0] == mnemonic ? item.startsWith(mnemonic) : item == mnemonic) ?
            '' : errorMnemonic = mnemonic
          if (errorMnemonic) break
        }
        // #endif

        if (errorMnemonic) {
          this.showNotify('error', `${errorMnemonic} 为无效助记词，请检查。`)
        } else {
          this.$refs.uNotify.open = false // 关闭错误警告
        }
      },
      // 校验一个完整的助记词
      verifyTotalMnemonic() {
        const mnemonic = this.mnemonic.trim()
        return bip39.validateMnemonic(mnemonic)
      },
      verifyForm() {
        const isEffectiveMnemonic = this.verifyTotalMnemonic()
        const isEffectivePassword = this.verifyPassword('mnemonic', this.mnemonic.trim())
        // const isEffectiveMnemonic = false // @test
        // const isEffectivePassword = true // @test
        if (!isEffectiveMnemonic) {
          this.showNotify('error', '助记词校验位不正确')
        } else if (!isEffectivePassword) {
          this.showNotify('error', '资金密码错误')
        } else if (!this.name) {
          this.showNotify('error', '钱包名称不能为空')
        } else {
          // 通过校验
          return true
        }
      }
    }
  }
</script>

<script lang="renderjs" module="render">
  import {
    createWallet
  } from './utils/index.js'
  export default {
    data() {
      return {
        mnemonic: ''
      }
    },
    methods: {
      createWallet(newVal, oldVal, newVm) {
        createWallet('initWallet', this, this.mnemonic, 'cbInitWallet')
      },
      getMnemonic(newVal) {
        if (newVal == '') return
        this.mnemonic = newVal
        this.createWallet()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    border-bottom: 2rpx solid #F2F4F8;
  }

  .container {
    padding: 0 32rpx;
    margin-top: 48rpx;

    .item {
      margin-bottom: 48rpx;

      &-label {
        margin-bottom: 24rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #2C365A;
        line-height: 28rpx;
      }

      &-input {
        background-color: #F2F4F8;
        border-radius: 4rpx !important;

        .u-textarea {
          background-color: #F2F4F8;
          border-radius: 4rpx !important;
          padding-left: 0 !important;

          /deep/ textarea {
            color: #2C365A !important;
            font-size: 28rpx !important;
            padding-left: 32rpx;
            line-height: 48rpx !important;

          }
        }

        .u-input {
          height: 96rpx;
          background-color: #F2F4F8;
          border-radius: 4rpx 0 0 4rpx;
          padding-left: 0 !important;

          /deep/ input {
            color: #2C365A !important;
            font-size: 28rpx !important;
            padding-left: 32rpx;
            line-height: 48rpx !important;
          }
        }

        /deep/ .input-placeholder {
          height: 48rpx !important;
          font-weight: 400 !important;
          font-size: 28rpx !important;
          // color: #8397B1 !important;
          color: #8397B1 !important;
          line-height: 48rpx !important;
        }

        &-password {
          display: flex;

          .u-icon {
            height: 96rpx;
            padding-right: 36rpx;
            background-color: #F2F4F8;
            border-radius: 0 4rpx 4rpx 0 !important;
          }
        }
      }
    }
  }

  .btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 622rpx;
    height: 96rpx;
    border-radius: 16rpx;
    background-color: #002FA7 !important;
    font-weight: 400;
    font-size: 32rpx;
    color: #FCFCFD;
  }

  /deep/ .u-notify {
    border-radius: 0 0 16rpx 16rpx;

    .u-notify__warpper {
      align-items: flex-end !important;
      justify-content: flex-start;
      height: 200rpx;

      .u-notify__warpper__text {
        margin-bottom: 40rpx;
      }
    }
  }
</style>

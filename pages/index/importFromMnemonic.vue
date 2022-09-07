<template>
  <view>
    <custom-header class="header" :title="language.text31"></custom-header>
    <view class="container">
      <view class="item">
        <view class="item-label">{{ language.text25 }}</view>
        <view class="item-input">
          <u--textarea v-model="mnemonic" height="180rpx" @input="mnemonicChange" :placeholder="language.text33"
            maxlength="120">
          </u--textarea>
        </view>
      </view>
      <view class="item">
        <view class="item-label">{{ language.text34 }}</view>
        <view class="item-input item-input-password">
          <u-input :password="!passwordEye" v-model="password" :placeholder="language.text35">
          </u-input>
          <image  :src="passwordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'" @click="passwordEye = !passwordEye" style="width: 32rpx; height: 32rpx; margin-right: 32rpx;"></image>
        </view>
        <view class="item-input item-input-password password-check">
          <u-input :password="!checkPasswordEye" v-model="checkPassword" :placeholder="language.text36">
          </u-input>
          <image  :src="checkPasswordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'" @click="checkPasswordEye = !checkPasswordEye" style="width: 32rpx; height: 32rpx; margin-right: 32rpx;"></image>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          {{ language.text37 }}
        </view>
        <view class="item-input item-input-name">
          <u-input v-model="name" :placeholder="language.text38" :adjust-position="false"></u-input>
        </view>
      </view>
    </view>
    <u-button class="btn" @click="importWallet" :disabled="!mnemonic || !password || !checkPassword || !name">{{ language.text82 }}</u-button>

    <view :callRenderMnemonic="callRenderMnemonic" :change:callRenderMnemonic="render.getMnemonic"></view>
    <!-- 错误提示 -->
    <Notify ref="notify"></Notify>

  </view>
</template>

<script>
import * as cosmosjs from '@cosmjs/crypto'
import * as bip39 from 'bip39'
import mixin from './mixins/index.js'
import Notify from './components/notify.vue'
import {
  validateAll
} from '@/utils/validator.js'
import language from './language/index.js'
export default {
  mixins: [mixin],
  components: {
    Notify
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      mnemonic: '', // 助记词
      password: '', // 资金密码
      checkPassword: '',
      name: '', // 钱包名称
      passwordEye: false, // 是否明文显示资金密码
      checkPasswordEye: false,
      callRenderMnemonic: '', // 调用render.getMnemonic获取助记词
      rules: {
        password: [{
          rule: 'required',
          errMessage: language[this.$cache.get('_language')].text64
        }, {
          rule: 'min',
          len: 8,
          errMessage: '密码长度不能少于8位'
        }, {
          rule: 'max',
          len: 48,
          errMessage: '密码长度不能大于48位'
        }],
        checkPassword: [{
          validator(value) {
            if (value !== this.password) return false
            return true
          },
          errMessage: language[this.$cache.get('_language')].text42
        }, {
          rule: 'required',
          errMessage: language[this.$cache.get('_language')].text64
        }]
      }
    }
  },
  methods: {
    importWallet() {
      // this.$cache.delete('_walletList') // @test
      const isValidate = this.verifyForm()
      // const isValidate = true // @test
      if (!isValidate) return // 没有通过校验
      this.callRenderMnemonic = this.mnemonic.trim()
    },
    cbInitWallet() {
      this.toAccount()
    },
    toAccount() {
      uni.reLaunch({
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
      
      // `${errorMnemonic} 为无效助记词，请检查。`
      if (errorMnemonic) {
        this.$refs.notify.show('error', this.language.text40)
      } else {
        this.$refs.notify.close() // 关闭错误警告
      }
    },
    // 校验一个完整的助记词
    verifyTotalMnemonic() {
      const mnemonic = this.mnemonic.trim()
      return bip39.validateMnemonic(mnemonic)
    },
    verifyForm() {
      const isEffectiveMnemonic = this.verifyTotalMnemonic()
      const result = validateAll.call(this, this.rules)
      const invalidateField = result.find(item => !item.result)
      // '助记词校验位不正确'
      if (!isEffectiveMnemonic) {
        this.$refs.notify.show('error', this.language.text41)
      } else if (invalidateField) {
        this.$refs.notify.show('error', invalidateField.errMessage)
      } else if (!this.name) {
        this.$refs.notify.show('error', this.language.text65)
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
        font-weight: 600;
        font-size: 28rpx;
        color: #2C365A;
        line-height: 28rpx;
      }

      &-input {

        .u-textarea {
          background-color: #F2F4F8;
          border-radius: 16rpx !important;
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
          border-radius: 16rpx 0 0 16rpx;
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
          align-items: center;
          background-color: #F2F4F8;
          height: 96rpx;
          border-radius: 16rpx;
          
          .u-icon {
            padding-right: 36rpx;
            background-color: #F2F4F8;
            border-radius: 0 16rpx 16rpx 0 !important;
          }
        }
      }
      
      
      &-input-name {
        .u-input {
          border-radius: 16rpx;
        }
      }
      
      .password-check {
        margin-top: 32rpx;
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
</style>

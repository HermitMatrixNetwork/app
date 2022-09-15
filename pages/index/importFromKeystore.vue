<template>
  <view>
    <custom-header class="header" :title="language.text53"></custom-header>

    <view class="container">
      <view class="item">
        <view class="item-label">{{ language.text53 }}</view>
        <view class="item-input">
          <u--textarea v-model="keystore" :placeholder="language.text54" :maxlength="-1"></u--textarea>
        </view>
      </view>
      <view class="item">
        <view class="item-label">{{ language.text55 }}</view>
        <view class="item-input item-input-password">
          <u-input :password="!passwordEye" v-model="password" :placeholder="language.text83">
          </u-input>
          <image  :src="passwordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'" @click="passwordEye = !passwordEye" style="width: 32rpx; height: 32rpx; margin-right: 36rpx; border-radius: 0 16rpx 16rpx 0;"></image>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          {{ language.text48 }}
        </view>
        <view class="item-input item-input-name">
          <u-input v-model="name" :placeholder="language.text38" :adjust-position="false"></u-input>
        </view>
      </view>
    </view>
    <u-button class="btn" @click="importWallet">{{ language.text58 }}</u-button>
    <view :callRenderCreate="callRenderCreate" :change:callRenderCreate="render.createWallet"></view>
    <!-- 错误提示 -->
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import mixin from './mixins/index.js'
import Notify from './components/notify.vue'
import {
  validateAll
} from '@/utils/validator.js'
import WalletCrypto from '@/utils/walletCrypto'
import language from './language/index.js'
export default {
  mixins: [mixin],
  components: {
    Notify
  },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      // '{"version":"1.2","coinTypeForChain":{},"crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"94f598f39aff49221010d4b41a6ef351"},"ciphertext":"6a28fd9c52d34417b4566b35a20756a622fb5bab118428feb51b2f41b9e43e34fa1f661930e8359fa2e872f3b97f927568b908a84cc93d1e61f9facdbc3f1079","kdf":"pbkdf2","kdfparams":{"salt":"27bdb1b8ff27bdd20309a93a6b8451ea2dc0d5f47e3710ff7f3d47154d011f1d","dklen":32,"n":131072,"r":8,"p":1},"mac":"94a59f7ac4fa0469f1d7a3ab796d7f9c30ba2c1ae0c92e3129a84036d9120c69"}}'
      keystore: '{"version":"1.2","coinTypeForChain":{},"crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"94f598f39aff49221010d4b41a6ef351"},"ciphertext":"6a28fd9c52d34417b4566b35a20756a622fb5bab118428feb51b2f41b9e43e34fa1f661930e8359fa2e872f3b97f927568b908a84cc93d1e61f9facdbc3f1079","kdf":"pbkdf2","kdfparams":{"salt":"27bdb1b8ff27bdd20309a93a6b8451ea2dc0d5f47e3710ff7f3d47154d011f1d","dklen":32,"n":131072,"r":8,"p":1},"mac":"94a59f7ac4fa0469f1d7a3ab796d7f9c30ba2c1ae0c92e3129a84036d9120c69"}}', // keystore
      privateKey64: '', // 私钥
      // 11111111
      password: '11111111', // 资金密码
      name: '2', // 钱包名称
      passwordEye: false, // 是否明文显示资金密码
      callRenderCreate: 0,
      rules: {
        keystore: [{
          rule: 'required',
          errMessage: language[this.$cache.get('_language')].text63
        }],
        password: [{
          rule: 'required',
          errMessage: language[this.$cache.get('_language')].text64
        }, {
          rule: 'min',
          len: 8,
          errMessage: language[this.$cache.get('_language')].text80
        }, {
          rule: 'max',
          len: 48,
          errMessage: '密码长度不能大于48位'
        }]
      }
    }
  },
  methods: {
    importWallet() {
      const result = this.verifyForm()
      if (!result) return
      this.callRenderCreate++ // 还原钱包，调用render.createWallet
    },
    verifyForm() {
      const result = validateAll.call(this, this.rules)
      const invalidateField = result.find(item => !item.result)
      if (invalidateField) {
        this.$refs.notify.show('error', invalidateField.errMessage)
        return false
      } else if (!this.name) {
        this.$refs.notify.show('error', this.language.text65)
        return false
      } else {
        // 通过校验
        return true
      }
    },
    async getPrivateKeyFromKeystore(wallet) {
      try {
        const keystore = JSON.parse(this.keystore)
        this.privateKey64 = await WalletCrypto.generateKeystore.decrypt(keystore, this.password)
        wallet.privateKey64 = this.privateKey64
      } catch(e) {
        console.log(e)
        this.$refs.notify.show('error', this.language.text59)
      }
      
    },
    cbInitWallet() {
      uni.reLaunch({
        url: '/pages/account/index'
      })
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    createWallet
  } from './utils/index.js'
  export default {
    methods: {
      createWallet(newVal, oldVal, oldVm, newVm) {
        if (newVal == 0) return; // 第一次进入页面会默认调用一次
        createWallet('initWallet', this, '', 'cbInitWallet')
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
          height: 256rpx;
          border-radius: 16rpx !important;
          padding: 24rpx !important;
          
          /deep/ textarea {
            color: #2C365A !important;
            font-size: 28rpx !important;
            line-height: 48rpx !important;
            height: 208rpx !important;
          }
        }

        .u-input {
          height: 96rpx;
          background-color: #F2F4F8;
          // border-radius: 16rpx 0 0 16rpx;
          border-radius: 16rpx;
          padding-left: 0 !important;

          /deep/ input {
            color: #2C365A !important;
            font-size: 28rpx !important;
            padding-left: 32rpx;
            line-height: 48rpx !important;
          }
        }

        /deep/ .input-placeholder {
          // height: 48rpx !important;
          font-weight: 400 !important;
          font-size: 28rpx !important;
          // color: #8397B1 !important;
          color: #8397B1 !important;
          // line-height: 48rpx !important;
        }

        &-password {
          display: flex;
          align-items: center;
          background-color: #F2F4F8;
          border-radius: 16rpx;

          .u-icon {
            height: 96rpx;
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

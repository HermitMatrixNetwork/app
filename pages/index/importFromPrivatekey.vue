<template>
  <view>
    <custom-header class="header" title="私钥导入"></custom-header>
    <view class="container">
      <view class="item">
        <view class="item-label">私钥</view>
        <view class="item-input">
          <u--textarea v-model.trim="privateKey64" placeholder="输入明文私钥"></u--textarea>
        </view>
      </view>
      <view class="item">
        <view class="item-label">资金密码</view>
        <view class="item-input item-input-password">
          <u-input :password="!passwordEye" v-model="password" placeholder="设置钱包密码（不少于8位）">
          </u-input>
          <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'" @click="passwordEye = !passwordEye">
          </u-icon>
        </view>
        <view class="item-input item-input-password password-check">
          <u-input :password="!checkPasswordEye" v-model="checkPassword" placeholder="重复输入确认钱包密码">
          </u-input>
          <u-icon color="#8F9BB3" size="20" :name="checkPasswordEye ? 'eye' : 'eye-off'"
            @click="checkPasswordEye = !checkPasswordEye">
          </u-icon>
        </view>
      </view>
      <view class="item">
        <view class="item-label">
          钱包名称
        </view>
        <view class="item-input item-input-name">
          <u-input v-model="name" placeholder="设置钱包名称"></u-input>
        </view>
      </view>
    </view>
    <u-button class="btn" @click="importWallet">导入</u-button>
    
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
export default {
  mixins: [mixin],
  components: {
    Notify
  },
  data() {
    return {
      privateKey64: '', // 私钥
      password: '', // 资金密码
      name: '', // 钱包名称
      passwordEye: false, // 是否明文显示资金密码
      checkPassword: '',
      checkPasswordEye: false,
      callRenderCreate: 0,
      rules: {
        privateKey64: [{
          rule: 'required',
          errMessage: '私钥明文不能为空'
        },{
          validator(value) {
            // 校验私钥合法性
            const reg = /^[A-Fa-f0-9]{64}$/
            return reg.test(value) 
          },
          errMessage: '请输入有效的私钥格式'
        }],
        password: [{
          rule: 'required',
          errMessage: '钱包密码不能为空'
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
          errMessage: '密码输入不一致，请重新输入。'
        }, {
          rule: 'required',
          errMessage: '钱包密码不能为空'
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
        this.$refs.notify.show('error', '钱包名称不能为空')
        return false
      } else {
        // 通过校验
        return true
      }
    },
    initWallet({ wallet }) {
      console.log('initWallet', wallet)
      
      // 删除隐私信息
      delete wallet.privateKey
      delete wallet.publicKey
      delete wallet.mnemonic
      
      // 加密隐私信息
      wallet.password = WalletCrypto.encode(this.password)
      wallet.privateKey64 = WalletCrypto.encode(this.privateKey64)
      wallet.name = this.name
      
      console.log('创建钱包数据:', {
        wallet
      })
      this.$cache.set('_currentWallet', wallet, 0)
      this.updateWalletList(wallet)
    },
    cbInitWallet() {
      console.log('cbInitWallet')
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
        font-weight: 500;
        font-size: 28rpx;
        color: #2C365A;
        line-height: 28rpx;
      }

      &-input {

        .u-textarea {
          background-color: #F2F4F8;
          height: 180rpx;
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
          color: #8397B1 !important;
          line-height: 48rpx !important;
        }

        &-password {
          display: flex;

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

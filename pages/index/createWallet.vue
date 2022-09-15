<template>
  <view class="create-wallet">

    <custom-header></custom-header>

    <view class="title">
      {{ language.text06 }}
    </view>

    <view class="wallet-name">
      <view class="wallet-name-label">
        {{ language.text07 }}
      </view>
      <u-input class="wallet-name-input" :class="{error: invalidFields.fieldName == 'name'}" v-model="name"
        :placeholder="language.text76"></u-input>
    </view>

    <view class="wallet-password">
      <view class="wallet-password-label">
        {{ language.text09 }}
      </view>
      <view class="wallet-password-item" >
        <u-input :password="!passwordEye" class="wallet-password-input"
           v-model="password" :placeholder="language.text10" :class="{error: invalidFields.fieldName == 'password'}">
        </u-input>
        <view :class="{error: invalidFields.fieldName == 'password'}" style="height: 100%; display: flex; align-items: center; border-radius: 0 16rpx 16rpx 0; overflow: hidden;">
          <image  :src="passwordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'" @click="passwordEye = !passwordEye" style="width: 32rpx; height: 32rpx;"></image>
        </view>
      </view>
      <view class="wallet-password-item" :class="{error: invalidFields.fieldName == 'checkPassword'}">
        <u-input :password="!checkPasswordEye" :class="{error: invalidFields.fieldName == 'checkPassword'}"
          class="wallet-password-input" v-model="checkPassword" :placeholder="language.text11">
        </u-input>
        <view :class="{error: invalidFields.fieldName == 'checkPassword'}" style="height: 100%; display: flex; align-items: center; border-radius: 0 16rpx 16rpx 0; overflow: hidden;">
          <image  :src="checkPasswordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'" @click="checkPasswordEye = !checkPasswordEye" style="width: 32rpx; height: 32rpx;"></image>
        </view>
      </view>
    </view>

    <view :callRenderCreate="callRenderCreate" :change:callRenderCreate="render.createWallet"></view>

    <u-button type="primary" class="create-btn" @click="confrim">{{ language.text22 }}</u-button>

    <!-- 错误提示 -->
    <Notify ref="notify"></Notify>
  </view>
</template>

<script>
import mixin from './mixins/index.js'
import { validateAll } from '@/utils/validator.js'
import Notify from './components/notify.vue'
import language from './language/index.js'
export default {
  mixins: [mixin],
  components: { Notify },
  data() {
    return {
      language: language[this.$cache.get('_language')],
      name: '',
      password: '', // 不能大于48位
      checkPassword: '',
      checkPasswordEye: false,
      passwordEye: false, // 是否明文显示密码
      isValidate: false, // 表单校验状态 @test: true
      invalidFields: {}, // 校验失败的字段
      callRenderCreate: 0,
      rules: {
        name: [{
          rule: 'required',
          errMessage: language[this.$cache.get('_language')].text65
        },{
          rule: 'max',
          len: 10,
          errMessage: language[this.$cache.get('_language')].text85
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
        }],
        checkPassword: [{
          validator(value) {
            if (value !== this.password) return false
            return true
          },
          errMessage: language[this.$cache.get('_language')].text84
        }, {
          rule: 'required',
          errMessage: language[this.$cache.get('_language')].text64
        }]
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    confrim() {
      this.invalidFields = validateAll.call(this, this.rules).find(item => !item.result) || {}
      this.isValidate = this.invalidFields.fieldName == undefined
      // this.isValidate = true // @test
      if (this.isValidate) {
        this.callRenderCreate++ // 调用render.createWallet创建钱包
      } else {
        // 表单校验失败
        this.$refs.notify.show('error', this.invalidFields.errMessage)
      }
    },
    cbInitWallet() {
      this.toBackupReminder()
    },
    toBackupReminder(wallet, privateKey) {
      uni.navigateTo({
        url: './backupReminder'
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
  .create-wallet {
    // padding: 0 32rpx;
  }

  .title {
    height: 48rpx;
    margin-bottom: 64rpx;
    margin-top: 64rpx;
    margin-left: 32rpx;
    font-weight: 600;
    font-size: 48rpx;
    color: #2C365A;
    letter-spacing: 0;
    line-height: 48rpx;
  }

  .wallet-name,
  .wallet-password {
    margin-left: 32rpx;
    margin-right: 32rpx;

    &-label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-weight: 600;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      line-height: 28rpx;
    }

    .u-input {
      height: 96rpx;
      background-color: #F2F4F8;

      /deep/ input {
        color: #2C365A !important;
        font-size: 28rpx !important;
      }

      /deep/ .input-placeholder {
        height: 48rpx !important;
        font-weight: 400 !important;
        font-size: 28rpx !important;
        color: #8397B1 !important;
        line-height: 48rpx !important;
      }
    }
  }

  .wallet-name {
    &-input {
      margin-bottom: 48rpx;
    }

    /deep/ .u-input {
      border-radius: 16rpx !important;
    }
  }

  .wallet-password {
    &-item {
      display: flex;
      height: 96rpx;
      margin-bottom: 32rpx;
      background-color: #F2F4F8;
      border-radius: 16rpx;
      align-items: center;
      
      image {
        margin-right: 36rpx;
      }
      .u-icon {
        height: 96rpx;
        padding-right: 36rpx;
        background-color: #F2F4F8;
        border-radius: 0 16rpx 16rpx 0 !important;
      }
    }

    /deep/ .u-input {
      border-radius: 16rpx 0 0 16rpx !important;
    }
  }

  .create-btn {
    position: absolute;
    bottom: 64rpx;
    left: 50%;
    transform: translate(-50%, 0);
    width: 622rpx;
    height: 96rpx;
    background-color: #002FA7;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #FCFCFD;
  }

  .error {
    background-color: rgba(230, 55, 51, 0.12) !important;

    /deep/ .uni-input-input {
      color: #E63733 !important;
    }

    /deep/ .uni-input-wrapper .input-placeholder {
      color: #E63733 !important;
    }
  }
</style>

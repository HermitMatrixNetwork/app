<template>
  <view class="create-wallet">

    <!-- 状态栏 -->
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>

    <view class="goBack">
      <u-icon name="arrow-left" color="#8397B1" @click="goBack"></u-icon>
    </view>

    <view class="title">
      创建钱包
    </view>

    <view class="wallet-name">
      <view class="wallet-name-label">
        钱包名称
      </view>
      <u-input class="wallet-name-input" :class="{error: invalidFields.fieldName == 'name'}" v-model="name"
        placeholder="设置钱包名称" @blur="validate('name')"></u-input>
    </view>

    <view class="wallet-password">
      <view class="wallet-password-label">
        钱包密码
      </view>
      <view class="wallet-password-item">
        <u-input :password="!passwordEye" class="wallet-password-input"
          :class="{error: invalidFields.fieldName == 'password'}" v-model="password" placeholder="设置钱包密码（不少于8位）"
          @blur="validate('password')">
        </u-input>
        <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'"
          :class="{error: invalidFields.fieldName == 'password'}" @click="passwordEye = !passwordEye">
        </u-icon>
      </view>
      <view class="wallet-password-item" :class="{error: invalidFields.fieldName == 'checkPassword'}">
        <u-input :password="!checkPasswordEye" :class="{error: invalidFields.fieldName == 'checkPassword'}"
          class="wallet-password-input" v-model="checkPassword" placeholder="重复输入确认钱包密码"
          @blur="validate('checkPassword')">
        </u-input>
        <u-icon color="#8F9BB3" size="20" :name="checkPasswordEye ? 'eye' : 'eye-off'"
          :class="{error: invalidFields.fieldName == 'checkPassword'}" @click="checkPasswordEye = !checkPasswordEye">
        </u-icon>
      </view>
    </view>

    <!-- #ifdef APP -->
    <view :callRenderCreate="callRenderCreate" :change:callRenderCreate="render.createWallet"></view>
    <!-- #endif -->
    <u-button type="primary" class="create-btn" @click="createWallet">确认</u-button>

    <!-- 错误提示 -->
    <u-notify class="notify" ref="uNotify"></u-notify>
  </view>
</template>

<script>
  import {
    validate,
    validateAll
  } from '@/utils/validator.js'

  export default {
    data() {
      return {
        name: '',
        password: '',
        checkPassword: '',
        checkPasswordEye: false,
        passwordEye: false, // 是否明文显示密码
        isValidate: false, // 表单校验状态 @test: true
        invalidFields: {}, // 校验失败的字段
        callRenderCreate: 0,
        uNotify: false,
        rules: {
          name: {
            rule: 'isEmpty',
            errMessage: '钱包名称不能为空'
          },
          password: [{
            rule: 'isEmpty',
            errMessage: '钱包密码不能为空'
          }, {
            rule: 'min',
            len: 8,
            errMessage: '密码长度不能少于8位'
          }, {
            rule: 'max',
            len: 19,
            errMessage: '密码长度不能大于19位'
          }],
          checkPassword: [{
            validator(value) {
              if (value !== this.password) return false
              return true
            },
            errMessage: '密码输入不一致，请重新输入。'
          }]
        }
      }
    },
    methods: {
      goBack() {
        uni.navigateBack()
      },
      validate(target) {
        this.isValidate = validate.call(this, target).result
        console.log(`${target}校验失败`)
      },

      createWallet() {
        this.invalidFields = validateAll.call(this, this.rules).find(item => !item.result) || {}
        this.isValidate = true
        // this.isValidate = this.invalidFields.field == undefined
        if (this.isValidate) {
          this.callRenderCreate++ // 调用render.createWallet创建钱包
        } else {
          this.$refs.uNotify.show({
            top: .1, // 0在H5下无效
            type: 'error',
            color: '#FFFFFF',
            bgColor: '#EC6665',
            message: this.invalidFields.errMessage,
            duration: 1000 * 3,
            fontSize: '28rpx', // 单位rpx
            safeAreaInsetTop: false
          })
        }
        // if (!this.isValidate) {
        // return uni.showToast({
        //   title: '请正确填写相关信息',
        //   icon: 'none'
        // })
        // } else {
        // const wallet = new this.$secretjs.Wallet('', {
        //   bech32Prefix: 'ghm'
        // })

        // 生成私钥
        // this.privateKey = WalletCrypto.encode(wallet.privateKey)
        // 加密密码
        // const password = WalletCrypto.encode(this.password, 'hhaic')

        // console.log(password)

        // const dePassword = WalletCrypto.decode(password)

        // console.log(dePassword)
        // }
      }
    }
  }
</script>

<script lang="renderjs" module="render">
  import WalletCrypto from '@/utils/walletCrypto.js'
  import secretjs from '@/utils/secretjs/index.js'
  import {
    runMethod
  } from '@/utils/render.base.js'
  export default {
    methods: {
      createWallet(newVal, oldVal, oldVm, newVm) {
        if (newVal == 0) return; // 第一次进入页面会默认调用一次
        console.log('render call createWallet')
        const wallet = new secretjs.Wallet('', {
          bech32Prefix: 'ghm'
        })
        console.log(this._$id);
        // console.log(wallet);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .create-wallet {
    padding: 0 32rpx;
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .goBack {
    height: 48rpx;
    margin: 32rpx 0 64rpx 0;

    /deep/ .u-icon__icon {
      font-size: 48rpx !important;
    }
  }

  .title {
    height: 48rpx;
    margin-bottom: 64rpx;
    font-weight: 500;
    font-size: 48rpx;
    color: #2C365A;
    letter-spacing: 0;
    line-height: 48rpx;
  }

  .wallet-name,
  .wallet-password {
    &-label {
      height: 28rpx;
      margin-bottom: 24rpx;
      font-weight: 500;
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
      border-radius: 4rpx !important;
    }
  }

  .wallet-password {
    &-item {
      display: flex;
      height: 96rpx;
      margin-bottom: 32rpx;
      background-color: #F2F4F8;
      border-radius: 5rpx;

      .u-icon {
        height: 96rpx;
        padding-right: 36rpx;
        background-color: #F2F4F8;
        border-radius: 0 4rpx 4rpx 0 !important;
      }
    }

    /deep/ .u-input {
      border-radius: 4rpx 0 0 4rpx !important;
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

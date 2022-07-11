<template>
  <view class="create-wallet">

    <uniHeader></uniHeader>

    <view class="title">
      创建钱包
    </view>

    <view class="wallet-name">
      <view class="wallet-name-label">
        钱包名称
      </view>
      <u-input class="wallet-name-input" :class="{error: invalidFields.fieldName == 'name'}" v-model="name"
        placeholder="设置钱包名称"></u-input>
    </view>

    <view class="wallet-password">
      <view class="wallet-password-label">
        钱包密码
      </view>
      <view class="wallet-password-item">
        <u-input :password="!passwordEye" class="wallet-password-input"
          :class="{error: invalidFields.fieldName == 'password'}" v-model="password" placeholder="设置钱包密码（不少于8位）">
        </u-input>
        <u-icon color="#8F9BB3" size="20" :name="passwordEye ? 'eye' : 'eye-off'"
          :class="{error: invalidFields.fieldName == 'password'}" @click="passwordEye = !passwordEye">
        </u-icon>
      </view>
      <view class="wallet-password-item" :class="{error: invalidFields.fieldName == 'checkPassword'}">
        <u-input :password="!checkPasswordEye" :class="{error: invalidFields.fieldName == 'checkPassword'}"
          class="wallet-password-input" v-model="checkPassword" placeholder="重复输入确认钱包密码">
        </u-input>
        <u-icon color="#8F9BB3" size="20" :name="checkPasswordEye ? 'eye' : 'eye-off'"
          :class="{error: invalidFields.fieldName == 'checkPassword'}" @click="checkPasswordEye = !checkPasswordEye">
        </u-icon>
      </view>
    </view>

    <view :callRenderCreate="callRenderCreate" :change:callRenderCreate="render.createWallet"></view>

    <u-button type="primary" class="create-btn" @click="confrim">确认</u-button>

    <!-- 错误提示 -->
    <u-notify class="notify" ref="uNotify"></u-notify>
  </view>
</template>

<script>
  import {
    validate,
    validateAll
  } from '@/utils/validator.js'
  import uniHeader from './components/uniHeader.vue'
  import WalletCrypto from '@/utils/walletCrypto.js'
  export default {
    components: {
      uniHeader
    },
    data() {
      return {
        name: '',
        password: '', // 不能大于48位
        checkPassword: '',
        checkPasswordEye: false,
        passwordEye: false, // 是否明文显示密码
        isValidate: false, // 表单校验状态 @test: true
        invalidFields: {}, // 校验失败的字段
        callRenderCreate: 0,
        uNotify: false,
        rules: {
          name: {
            rule: 'required',
            errMessage: '钱包名称不能为空'
          },
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
      goBack() {
        uni.navigateBack()
      },
      // validate(target) {
      //   const {
      //     result,
      //     errMessage
      //   } = validate.call(this, target)
      //   if (result) {
      //     this.$refs.uNotify.open = false
      //   } else {
      //     // 校验失败
      //     this.$refs.uNotify.show({
      //       top: .1, // 0在H5下无效
      //       type: 'error',
      //       color: '#FFFFFF',
      //       bgColor: '#EC6665',
      //       message: errMessage,
      //       duration: 1000 * 3,
      //       fontSize: '28rpx', // 单位rpx
      //       safeAreaInsetTop: false
      //     })
      //     console.log(`${target}校验失败`)
      //   }
      // },

      confrim() {
        this.invalidFields = validateAll.call(this, this.rules).find(item => !item.result) || {}
        this.isValidate = this.invalidFields.fieldName == undefined
        // this.isValidate = true // @test
        if (this.isValidate) {
          this.callRenderCreate++ // 调用render.createWallet创建钱包
        } else {
          // 表单校验失败
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
      },
      initWallet({
        wallet,
        privateKey
      }) {
        // 加密密码
        // const password = WalletCrypto.encode(this.password, 'hhaic')

        // console.log(password)

        wallet.password = this.password
        wallet.privateKey64 = privateKey

        console.log('创建钱包数据:', {
          wallet
        })
        this.$cache.set('_currentWallet', wallet, 0)
        // 解密密码
        // const dePassword = WalletCrypto.decode(password)
        // console.log(dePassword.join(''))

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
  import WalletCrypto from '@/utils/walletCrypto.js'
  import secretjs from '@/utils/secretjs/index.js'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      createWallet(newVal, oldVal, oldVm, newVm) {
        if (newVal == 0) return; // 第一次进入页面会默认调用一次
        const wallet = new secretjs.Wallet('', {
          bech32Prefix: 'ghm'
        })

        // 生成私钥
        const privateKey = WalletCrypto.encode(wallet.privateKey)

        renderUtils.runMethod(this._$id, 'initWallet', {
          wallet,
          privateKey
        }, this)

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
    font-weight: 500;
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

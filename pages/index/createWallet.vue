<template>
  <view>
    <view class="wallet-name">
      钱包名称
    </view>
    <u-input v-model="name" placeholder="1~10 个字符" @blur="validate('name')"></u-input>

    <view class="wallet-password">
      钱包密码
    </view>
    <u-input v-model="password" placeholder="设置钱包密码(不少于8位)" @blur="validate('password')">
    </u-input>
    <u-input v-model="checkPassword" placeholder="重复输入确认钱包密码" @blur="validate('checkPassword')">
    </u-input>
    <!-- #ifdef APP -->
    <view :isValidate="isValidate" :change:isValidate="render.createWallet"></view>
    <!-- #endif -->
    <u-button type="primary" @click="createWallet">创建</u-button>
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
        isValidate: true, // 表单校验状态 @test: true
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
              console.log('validator', value, this.password)
              return true
            },
            errMessage: ''
          }]
        }
      }
    },
    methods: {
      validate(target) {
        this.isValidate = validate.call(this, target).result
        console.log(`${target}校验失败`)
      },

      createWallet() {
        console.log('init')
        validateAll.call(this, this.rules)
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
  export default {
    methods: {
      createWallet() {
        console.log('in render');
        console.log(this.isValidate);
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .u-input {
    border: 1px solid red;
  }
</style>

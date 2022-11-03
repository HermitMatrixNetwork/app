<template>
  <view class="page-wrapper">
    <view :callGetContractInfo="callGetContractInfo" :change:callGetContractInfo="render.getContractInfo"></view>
    <custom-notify ref="notify" style="z-index: 99;"></custom-notify>
    <custom-header :title="language.text242" :customStyle="{ 'z-index': 98 }">
      <template #right>
        <view class="save" @click="save">
          {{ language.text249 }}
        </view>
      </template>
    </custom-header>
    <view class="main">
      <view class="label-title">{{ language.text244 }}</view>
      <u--textarea v-model="contract" :placeholder="language.text245" :formatter='formatter' maxlength="60"
        class="textarea" :autoHeight="true"></u--textarea>

      <view class="label-title">{{ language.text246 }}</view>
      <u--textarea @focus="symbolFocus" v-model="tokenSymbol" :placeholder="language.text247" :formatter='formatter'
        maxlength="60" class="textarea" :autoHeight="true"></u--textarea>

      <view class="label-title">{{ language.text248 }}</view>
      <u--textarea :disabled="true" v-model="decimals" placeholder="" :formatter='formatter' maxlength="60"
        class="textarea" :autoHeight="true"></u--textarea>
    </view>
  </view>
</template>

<script>
import languages from '@/pages/account/language/index.js'
import {
  searchCoin
} from '@/api/token.js'
import { searchContract } from '@/api/cosmos.js'
export default {
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      contract: '',
      tokenSymbol: '',
      decimals: '',
      callGetContractInfo: '',
      tokenAddressList: [],
      loading: false
    }
  },
  onShow() {
    if (this.$cache.get('_custom_tokens_list')) {
      this.tokenAddressList = this.$cache.get('_custom_tokens_list').map(item => item.contract_address)
    }
  },
  methods: {
    formatter(val) {
      let string = val.replace(/[\>\<\&\'\"]/g, '')
      // console.log(string);
      return string
    },
    async save() {
      if (this.loading) return
      this.loading = true
      const tokenAddressList = this.$cache.get('_custom_tokens_list') ? this.$cache.get('_custom_tokens_list').map(item => item.contract_address) : []
      const coinList = this.$cache.get('_currentWallet').coinList
      
      coinList && coinList.forEach(item => item.contract_address && (tokenAddressList.push(item.contract_address)))
      
      if (this.contract == '' || this.tokenSymbol == '') {
        this.$refs.notify.show('', this.language.text252)
        this.loading = false
      } else if (this.decimals == '') {
        this.$refs.notify.show('error', this.language.text256)
        this.loading = false
      } else if (tokenAddressList.includes(this.contract)) {
        this.$refs.notify.show('error', this.language.text253)
        this.loading = false
      } else {
        let data = await searchCoin(this.contract)
        const eventChannel = this.getOpenerEventChannel()
        if (data.data.code !== 7) {
          let res = data.data.data.result || null
          // console.log('res', res)
          let result = {
            contract_address: res.contract_address,
            alias_name: this.tokenSymbol,
            apply_type: 'SNIP20',
            full_name: res.full_name,
            desc: res.desc || '',
            logo: res.logo,
            decimals: this.decimals,
            hot: 1,
            ID: res.ID,
            view_key: '',
            loadingBalance: true
          }
          this.$refs.notify.show('error', this.language.text254, { bgColor: '#275EF1' })
          eventChannel.emit('addToken', result)
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          try {
            const res = (await searchContract(this.contract)).data
            if (res.error) {
            } else {
              let ID = null
              if (!this.tokenAddressList.includes(res.result.address)) {
                if (this.$cache.get('_token_single_id')) {
                  ID = Number(this.$cache.get('_token_single_id').split('_').slice(-1)[0]) + 1
                  this.$cache.set('_token_single_id', `_token_single_id_${ID}`, 0)
                } else {
                  this.$cache.set('_token_single_id', '_token_single_id_1', 0)
                }
              }
              let result = {
                contract_address: res.result.address,
                alias_name: this.tokenSymbol,
                apply_type: 'SNIP20',
                full_name: res.result.label,
                logo: '/static/img/account/nologo.jpg',
                decimals: this.decimals,
                hot: 1,
                ID: this.$cache.get('_token_single_id'),
                view_key: '',
                loadingBalance: true
              }
              this.$refs.notify.show('error', this.language.text254, { bgColor: '#275EF1' })
              eventChannel.emit('addToken', result)
              setTimeout(() => {
                uni.navigateBack()
              }, 1500)
              // console.log('result', result)
            }
          } catch (e) {
            console.log('e', e)
            this.loading = false
          }
        }
      }
    },
    handlerContractInfo(res) {
      // console.log(res)
      if (res.code == 7) {
        this.tokenSymbol = ''
        this.decimals = ''
      } else {
        this.tokenSymbol = res.token_info.symbol
        this.decimals = res.token_info.decimals
      }
      this.callGetContractInfo = ''
      uni.hideLoading()
    },
    symbolFocus() {
      if (this.contract.trim() !== '' && this.contract.trim() !== this.oldContractInfo) {
        this.callGetContractInfo = this.contract
        this.oldContractInfo = this.callGetContractInfo
        uni.showLoading({
          title: '',
          mask: true
        })
      }
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    queryContract
  } from '@/utils/secretjs/SDK'
  import renderUtils from '@/utils/render.base.js'
  export default {
    methods: {
      async getContractInfo(contract) {
        if (contract == '') return
        let res = {}
        try {
          res = await queryContract(contract)
        } catch (e) {
          res.code = 7
          console.log('e', e);
        }
        renderUtils.runMethod(this._$id, 'handlerContractInfo', res, this)
      }
    }
  }
</script>

<style scoped lang="scss">
  .page-wrapper {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
  }

  .main {
    padding: 32rpx 32rpx 48rpx;
  }

  .label-title {
    font-weight: 600;
    font-size: 28rpx;
    color: #2C365A;
    letter-spacing: 0;
    margin-top: 32rpx;
  }

  .u-textarea {
    background: #F2F4F8 !important;
    margin-top: 16rpx;
    padding: 18rpx 32rpx;

    .uni-textarea-placeholder {
      color: #8397B1 !important;
      font-size: 28rpx !important;
    }
  }

  .u-textarea--radius {
    border-radius: 16rpx;
  }

  .textarea {
    /deep/ .u-textarea__field {
      line-height: 60rpx !important;
      font-size: 28rpx;
      color: #2C365A;
    }
  }

  .save {
    font-size: 28rpx;
    color: #1E5EFF;
  }
</style>

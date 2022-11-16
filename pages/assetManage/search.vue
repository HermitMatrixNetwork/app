<template>
  <view class="asset-manage">
    <view :callGetContractInfo="callGetContractInfo" :change:callGetContractInfo="render.getContractInfo"></view>
    <view class="status_bar"></view>
    <view class="top">
      <u-search :placeholder="language.searchPlaceholder" shape="round" :clearabled="true" v-model="address"
        actionText="取消" :actionStyle="searchStyle" @search="searchCoin" @custom="goBack"
        searchIcon="/static/img/delegate/search2.png"></u-search>
    </view>
    <custom-loading v-if="loading" class="loading"></custom-loading>
    <view class="list" v-else-if="list.length">
      <view class="denom" v-for="(item, index) in list" :key="index">
        <view class="item">
          <view class="logo">
            <image :src="item.logo"></image>
          </view>
          <view class="content">
            <view class="title">
              <text>{{ item.alias_name }}</text>
            </view>
            <view class="contract-address">
              <text>{{ item.contract_address | sliceAddress(8, -10) }}</text>
            </view>
          </view>
          <view class="right" v-if="item.full_name !== mainCoin.full_name">
            <image v-if="tokenAddressList.includes(item.contract_address)" src="/static/img/account/ic-delect.png"
              @click="deleteToken(item)" style="width: 44rpx;height: 44rpx;"></image>
            <image v-else src="/static/img/account/ic-add.png" @click="addToken(item)"
              style="width: 44rpx;height: 44rpx;"></image>
          </view>
        </view>
        <view class="border">

        </view>
      </view>
    </view>
    <view v-else class="noData">
      <image v-if="reAddress!=''" class="data" src="/static/img/account/nodata.png" alt="" />
      <image v-else class="searchbg" src="/static/img/account/searchbg.png" alt="" />
      <view class="tip">
        {{address !== ''? language.text01 : language.text02 }}
      </view>
    </view>
  </view>
</template>

<script>
import languages from './language/index.js'
import List from './components/List.vue'
import mainCoin from '@/config/index.js'
import {
  sliceAddress
} from '@/utils/filters.js'
import {
  searchCoin
} from '@/api/token.js'
import {
  searchContract
} from '@/api/cosmos.js'
export default {
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      reAddress: '', //renderjs调用
      address: '', //查询地址
      callGetContractInfo: '',
      list: [], //查询结果
      tokenAddressList: [],
      tokenList: [],
      currentWallet: {},
      searchStyle: {
        fontSize: '28rpx',
        color: '#275EF1'
      },
      tokenSymbol: '',
      decimals: '',
      mainCoin,
      loading: true
    }
  },
  components: {
    List
  },
  onLoad(options) {
    if (options.address) {
      this.address = options.address
      this.search(options.address)
    }
  },
  onShow() {
    this.currentWallet = this.$cache.get('_currentWallet')
    this.tokenList = this.currentWallet.coinList
    if (this.tokenList.length) {
      this.tokenList.forEach(item => item.alias_name !== mainCoin.alias_name && this.tokenAddressList.push(item
        .contract_address))
    }
  },
  methods: {
    //查询合约
    searchCoin() {
      this.loading = true
      this.search(this.address)
    },
    async search(address) {
      if (address == '') return
      let data = await searchCoin(address)
      if (data.data.code !== 7) {
        let result = data.data.data.result || null
        this.searchData(result)
      } else {
        this.callGetContractInfo = this.address

      }
    },
    goBack() {
      this.reAddress = ''
      // uni.redirectTo({
      //   url: './index'
      // })
      uni.navigateBack()
    },
    goTo() {

    },
    //查询结果
    searchData(data) {
      if (data) {
        this.list[0] = data
        this.loading = false
        this.reAddress = ''
      }
    },
    addToken(token) {
      token.view_key = ''
      token.loadingBalance = true
      this.tokenList.push(token)

      this.tokenAddressList.push(token.contract_address)
      this.currentWallet.coinList = this.tokenList
      this.$cache.set('_currentWallet', this.currentWallet, 0)
      this.updateWalletList(this.currentWallet)
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('handlerChange')
    },
    deleteToken(token) {
      this.tokenAddressList = this.tokenAddressList.filter(item => item !== token.contract_address)
      this.tokenList = this.tokenList.filter(item => item.contract_address !== token.contract_address)
      this.currentWallet.coinList = this.tokenList
      this.$cache.set('_currentWallet', this.currentWallet, 0)
      this.updateWalletList(this.currentWallet)
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('handlerChange')
    },
    updateWalletList(wallet) {
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1, wallet)
      } else {
        walletList.unshift(wallet)
      }
      this.$cache.set('_walletList', walletList, 0)
      return true
    },
    async handlerContractInfo(res) {
      console.log('handlerContractInfo', res)
      if (res.parse_err) {
        
      } else if (res.code == 7) {
        this.tokenSymbol = ''
        this.decimals = ''
      } else {
        this.tokenSymbol = res.token_info.symbol
        this.decimals = res.token_info.decimals
      }
      this.callGetContractInfo = ''
      try {
        console.log(this.address)
        const res = (await searchContract(this.address)).data
        console.log('searchContract', res)
        if (res.error || res.result.creator) {
          this.list = []
          this.loading = false
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
            alias_name: this.tokenSymbol || res.result.label,
            decimals: this.decimals || 0,
            apply_type: 'SNIP20',
            full_name: res.result.label,
            logo: '/static/img/account/nologo.jpg',
            hot: 1,
            ID: this.$cache.get('_token_single_id')
          }
          console.log(result, this.tokenSymbol)
          this.searchData(result)
        }
      } catch (e) {
        this.list = []
        this.loading = false
        console.log('e', e)
      }
    },
  },
  filters: {
    sliceAddress
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

<style lang="scss" scoped>
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .top {
    padding: 20rpx 32rpx;
    margin-bottom: 32rpx;
  }

  .hot-asset {
    padding: 32rpx 30rpx 32rpx 32rpx;

    .title {
      height: 62rpx;
      padding-top: 16rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #2C365A;
    }
  }

  .noData {
    padding: 330rpx 130rpx 0 130rpx;
    text-align: center;

    .data {
      width: 240rpx;
      height: 240rpx;
    }

    .searchbg {
      width: 200rpx;
      height: 200rpx;
    }

    .tip {
      font-size: 28rpx;
      color: #8397B1;
    }
  }

  .loading {
    margin-top: 100rpx;
  }

  .denom {
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30rpx 30rpx 32rpx;

      .logo {
        margin-right: 24rpx;

        image {
          width: 72rpx;
          height: 72rpx;
        }
      }

      .content {
        flex: 1;

        .title {
          font-weight: 600;
          font-size: 28rpx;
          color: #2C365A;
          margin-bottom: 12rpx;
        }

        .contract-address {
          font-size: 24rpx;
          color: #8397B1;
        }
      }
    }

    .border {
      height: 2rpx;
      background-color: rgba(131, 151, 177, 0.20);
      margin-left: 126rpx;
    }
  }
</style>

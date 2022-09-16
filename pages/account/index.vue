<template>
  <view class="account">
    <view class="mask" v-show="updating"></view>
    <custom-updateApp :updating.sync="updating" checkImmediate />
    <!-- 钱包主页 -->
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>
    <view class="main">
      <view class="account-header">
        <view class="header-left" @click="showSwitchWallet = true">
          <view class="title">{{ currentWallet.name }}</view>
          <image src="/static/img/account/down.png" style="width: 32rpx; height: 32rpx;"></image>
        </view>

        <view class="header-icon">
          <image src="/static/img/account/saoma.png" style="width:44rpx;height:44rpx;" @click="scanCode" />
          <image src="/static/img/account/setting.png" style="width:44rpx;height:44rpx;" @click="toGo('/pages/walletManager/index')"></image>
        </view>
      </view>
      <view class="basic-data">
        <view class="user-msg">
          <view class="allassets" style="display: flex; align-items: center;">
            <!-- 总资产 -->
              <text style="font-size:28rpx; padding-right: 8rpx;">{{ languages.text02 }}</text>
              <image :src="eyeAsset? '/static/img/eye.png' : '/static/img/eye-close.png'" @click="assentIsShow" style="width: 32rpx; height: 32rpx;"></image>
          </view>
          <view class="user-balance">
            {{ eyeAsset ? '$' + allassets : '∗∗∗∗∗∗∗∗' }}
          </view>
          <view class="user-address"  @click="copy">
            <text >{{
              currentWallet.address | sliceAddress
            }}</text>
            <image class="copy-icon" src="/static/img/account/copy.png"></image>
            <!-- {{eyeAsset?(currentWallet.address|sliceAddress):'∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗'}} -->
          </view>
        </view>
      </view>
      <view class="account-column">
        <view class="column-item" @click="toGo('/pages/account/send/index')">
          <image src="/static/img/account/send.png" style="width:80rpx; height: 80rpx"></image>
          <text>{{ languages.text03 }}</text>
        </view>
        <view class="column-item" @click="toGo('./receive')">
          <image src="/static/img/account/receive.png" style="width:80rpx; height: 80rpx"></image>
          <text>{{ languages.text04 }}</text>
        </view>
        <view class="column-item" @click="toDelegate">
          <image src="/static/img/account/delegate.png" style="width:80rpx; height: 80rpx"></image>
          <text>{{ languages.text05 }}</text>
        </view>
        <view class="column-item" @click="dealBtn">
          <image src="/static/img/account/transaction.png" style="width:80rpx; height: 80rpx"></image>
          <text>{{ languages.text06 }}</text>
        </view>
      </view>

      <u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
        <view class="modalContent">
          <image src="/static/img/tishi2.png" style="width: 64rpx; height: 64rpx;"></image>
          <view class="modal-title">{{ languages.text172 }}</view>
          <text class="modal-content">{{ languages.text08 }}</text>
          <button @click="aa = false">{{ languages.text09 }}</button>
        </view>
      </u-modal>
      <view class="coin-list">
        <u-tabs :list="coinList" lineColor="#2C365A" @click="click" :inactiveStyle="inactiveStyle"
          :activeStyle="activeStyle" lineWidth="20" lineHeight="3" :itemStyle="itemStyle" :current="currentIndex">
          <view slot="right" style="padding-bottom: 8rpx">
            <image src="/static/img/account/add.png" @click="toAsset" style="width: 48rpx;height: 48rpx;"></image>
          </view>
        </u-tabs>
        <scroll-view v-if="visibaleTokenList.length" class="coinbox" scroll-y>
          <view class="content" v-for="item in visibaleTokenList" :key="item.ID">
            <TokenColumn :showWarn="item.showWarn" :tokenName="item.alias_name"
              :tokenIcon="item.logo" class="token" @click.native="queryToken(item)" @showTishi="aa = true">
              <template #right>
                <custom-loading v-if="item.loadingBalance"></custom-loading>
                <view class="coinNumber" v-else>
                  <view class="number">{{ item.balance || 0 }}</view>
                  <view class="money">$0.00000</view>
                </view>
              </template>
            </TokenColumn>
          </view>
        </scroll-view>
      </view>
    </view>
    <SwitchWallet :showSwitchWallet="showSwitchWallet" @close="closeSwitchWalletPopup" />

    <view :initRender="initRender" :change:initRender="render.init"></view>
    <view :callBalanceLoading="callBalanceLoading" :change:callBalanceLoading="render.setBalanceLoading"></view>

    <custom-notify ref="notify"></custom-notify>
    <tab-bar />
  </view>
</template>

<script>
import {
  sliceAddress
} from '@/utils/filters.js'
import {
  exceptE6
} from '@/utils/format.js'
import mainCoin from '@/config/index.js'
import SwitchWallet from '@/pages/walletManager/switchWallet.vue'
import TokenColumn from './send/components/TokenColumn.vue'
import languages from './language'
import mixin from './mixins/index.js'
export default {
  mixins: [mixin],
  components: {
    TokenColumn,
    SwitchWallet
  },
  filters: {
    sliceAddress
  },
  data() {
    return {
      updating: false,
      showSwitchWallet: false,
      address: '',
      currentWallet: this.$cache.get('_currentWallet'),
      languages: languages[this.$cache.get('_language')],
      coinList: [],
      inactiveStyle: {
        fontSize: '34rpx',
        color: '#8397B1',
        // fontWeight: '500'
      },
      activeStyle: {
        fontSize: '34rpx',
        color: '#2C365A',
        // fontWeight: '600'
      },
      itemStyle: {
        height: '70rpx',
        // alignItems: 'flex-start'
      },
      allassets: 0, //总资产
      eyeAsset: true,
      aa: false,
      firstShowAa: true,
      tokenList: [],
      tempList: [],
      coinType: 'All',
      initRender: 0, // call render.init
      callBalanceLoading: 0,
      currentIndex: 0
    }
  },
  onShow() {
    // this.newuserAdres = this.userAdres.replace(this.userAdres.slice(16, 36), '***')
    this.initCoinList()
    this.aa = false
    this.firstShowAa = true
    this.initRender++
    

        
  },
  created() {
    //获取选择的代币
    this.address = this.currentWallet.address

  },
  methods: {
    initCoinList() {
      let coinList = this.$cache.get('_currentWallet').coinList || []
      let tokenType = new Set()
      this.coinList = [{
        name: this.languages.text07
      },
      // {
      //   name: 'NFT',
      //   disabled: true
      // }
      ]
      // coinList.forEach(item => item.apply_type && (tokenType.add(item.apply_type)))
      // Array.from(tokenType).forEach(item => {
      //   switch (item) {
      //   case 'token':
      //     this.coinList.push({
      //       name: 'SNIP20'
      //     })
      //     break
      //   }
      // })
    },
    toDelegate() {
      uni.switchTab({
        url: '/pages/delegate/index'
      })
    },
    click(item) {
      this.coinType = item.name == this.languages.text07 ? 'All' : item.name
    },
    //页面跳转
    goTo(e) {
      uni.navigateTo({
        url: e.currentTarget.dataset.url
      })
    },
    //页面跳转
    toGo(url) {
      uni.navigateTo({
        url
      })
    },
    //复制地址
    copy() {
      uni.setClipboardData({
        data: this.currentWallet.address,
        showToast: false,
        success: () => {
          this.$refs.notify.show('', this.languages.text56, { bgColor: '#275EF1' })
        },
        fail: () => {
          // this.$refs.notify.show('error', this.language.copyfailure)
        }
      })
    },
    dealBtn() {
      uni.showToast({
        title: this.languages.text180,
        icon: 'none'
      })
    },
    assentIsShow() {
      //用户总资产是否显示
      this.eyeAsset = !this.eyeAsset
    },
    closeSwitchWalletPopup() {
      this.showSwitchWallet = false
      this.currentWallet = this.$cache.get('_currentWallet')
      this.initRender++
      this.initCoinList()
      this.tokenList = this.currentWallet.coinList
    },
    queryToken(token) {
      if (token.apply_type) {
        uni.navigateTo({
          url: `./send/token_content_other?tokenID=${token.ID}`
        })
      } else {
        uni.navigateTo({
          url: `./send/token_content?tokenID=${token.ID}`
        })
      }
    },
    updateWalletList(wallet) {
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1)
      }
      walletList.unshift(wallet)
      this.$cache.set('_walletList', walletList, 0)
      return true
    },
    updateCoinList(coinList) {
      this.tokenList = coinList
      const wallet = this.$cache.get('_currentWallet')
      wallet.coinList = coinList
      this.$cache.set('_currentWallet', this.currentWallet, 0)
      this.updateWalletList(this.currentWallet)
    },
    showError(msg) {
      this.$refs.notify.show('error', msg)
    },
    toAsset() {
      this.$nextTick(() => {
        uni.redirectTo({
          url: '/pages/assetManage/index'
        })
      })
      this.callBalanceLoading += 1
    }
  },
  computed: {
    visibaleTokenList() {
      const type = {
        'token': 'SNIP20',
        'default': 'NFT'
      }
      let result = this.coinType === 'All' ? this.tokenList : this.tokenList.filter(item => type[item.apply_type ||
          'default'] === this.coinType)
      if (result.length == 0) {
        result = this.tokenList
      }
      return result
    }
  },
  // watch: {
  //   tokenList: {
  //     deep: true,
  //     handler(newVal) {
  //       if (this.firstShowAa) {
  //         this.aa = newVal.find(item => item.showWarn) ? true : false
  //         if (this.aa) this.firstShowAa = false
  //       }
  //     }
  //   }
  // }
}
</script>

<script lang="renderjs" module="render">
  import {
    getBalance,
    getCodeHash,
    getOtherBalance,
    getTokenDecimals
  } from '@/utils/secretjs/SDK'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'

  export default {
    data() {
      return {
        balanceLoading: true
      }
    },
    methods: {
      async init() {
        this.balanceLoading = true
        let wallet;
        //#ifdef APP-PLUS
        wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
        //#endif

        //#ifndef APP-PLUS 
        wallet = uni.getStorageSync('_currentWallet').data
        //#endif
        //获取主网币余额
        let coinList = wallet.coinList || []
				
        //代币数组为空时，为其添加主币
        if (coinList.length == 0) coinList.push(mainCoin)
        renderUtils.runMethod(this._$id, 'updateCoinList', coinList, this)
        this.getBalance(coinList, wallet)
      },
      async getBalance(coin, wallet) {
        let coinList = JSON.parse(JSON.stringify(coin))
        for (let i = 0; i < coinList.length; i++) {
          let coin = coinList[i]
          let balance = 0
          if (coin.alias_name == mainCoin.alias_name) {
            coin.showWarn = false
            let res = await getBalance(wallet.address)
            balance = res.balance.amount
          } else { // 非主网币
            if (coin.view_key == '') {
              coin.showWarn = true
            } else {
              if (!coin.codeHash) {
                try {
                  let codeHash = await getCodeHash(coin.contract_address)
                  coin.codeHash = codeHash
                  balance = await this.getOtherTokenBalance(coin, wallet)
                } catch (e) {
                  let msg = '获取codeHash失败，请检查合约地址是否正确'
                  console.log('获取codeHash失败，请检查合约地址是否正确');
                  // renderUtils.runMethod(this._$id, 'showError', msg, this)
                }
              } else {
                balance = await this.getOtherTokenBalance(coin, wallet)
              }
            }
          }
          
          if (coin.decimals) balance = balance / coin.decimals
          coin.balance = balance
          coin.loadingBalance = false
        }
        this.balanceLoading && renderUtils.runMethod(this._$id, 'updateCoinList', coinList, this)
      },
      setBalanceLoading(newVal) {
        if (newVal == 0) return
        this.balanceLoading = false
      },
      async getOtherTokenBalance(coin, wallet) {
        let balance = 0
        let res = await getOtherBalance({
          address: wallet.address,
          contract: {
            address: coin.contract_address,
            codeHash: coin.codeHash
          },
          auth: {
            key: coin.view_key
          }
        })
        if (res.viewing_key_error) {
          coin.showWarn = true
        } else {
          const tokeninfo = await getTokenDecimals({
            contract: {
              address: coin.contract_address,
              codeHash: coin.codeHash
            }
          })

          coin.decimals = Math.pow(10, tokeninfo.token_info.decimals) || 1
          balance = res.balance.amount
          coin.showWarn = false
        }
        return balance
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5) !important;
    z-index: 9999;
  }
  
  page {
    width: 100%;
    height: 100%;
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .account {
    width: 100%;
    height: 100%;
  }

  .main {
    margin-left: 38rpx;
    margin-right: 26rpx;
    height: 100%;

    .account-header {
      width: 100%;
      font-size: 34rpx;
      padding-top: 20rpx;
      padding-bottom: 32rpx;
      font-weight: 600;
      color: #2c3457;
      letter-spacing: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
        align-items: center;
      }

      .header-icon {
        display: flex;
        align-items: center;
        width: 120rpx;
        justify-content: space-around;
      }
    }

    .basic-data {
      width: 100%;
      height: 280rpx;
      background-image: url('@/static/img/account/card1.png');
      background-size: 100% 100%;
      border-radius: 24rpx;

      .user-msg {
        color: #ffffff;
        padding: 40rpx 32rpx 48rpx 32rpx;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;

        .user-balance {
          font-family: DIN-Medium;
          font-weight: 600;
          font-size: 64rpx;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 64rpx;
        }

        .user-address {
          font-size: 24rpx;
          display: flex;
          align-items: center;

          text {
            opacity: 0.7;
            margin-right: 4rpx;
          }

          // overflow: hidden;
        }
      }
    }

    .account-column {
      width: 100%;
      height: 188rpx;
      margin-top: 24rpx;
      display: flex;
      border-radius: 24rpx;
      justify-content: space-around;
      border: 2px solid rgba(44, 54, 90, 0.06);

      .column-item {
        width: 25%;
        color: #2c4364;
        font-size: 28rpx;
        font-weight: 400;
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        text {
          padding-top: 16rpx;
        }
      }
    }

    .coin-list {
      width: 100%;
      margin-top: 48rpx;

      .coinbox {
        width: 100%;
        height: 600rpx;
      }
    }
  }

  /deep/ .hintModal {

    .u-modal__content {
      padding: 32rpx;
      padding-top: 48rpx !important;
    }

    .modalContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .modal-title {
        font-size: 32rpx;
        color: #2c365a;
        font-weight: 600;
        line-height: 32rpx;
         margin-top: 32rpx;
      }

      .modal-content {
        font-size: 28rpx;
        color: #8397b1;
        line-height: 42rpx;
        margin-top: 32rpx;
        margin-bottom: 48rpx;
      }

      button {
        width: 622rpx;
        height: 96rpx;
        font-size: 32rpx;
        line-height: 96rpx;
        background: #002fa8;
        color: #ffffff;
      }
    }
  }

  /deep/ .u-tabs__wrapper {
    justify-content: space-between;
  }

  /deep/ .u-tabs__wrapper__scroll-view-wrapper {
    flex: none;
  }

  .title {
    font-size: 34rpx;
    font-weight: 600;
  }

  .copy-icon {
    width: 32rpx;
    height: 32rpx;
  }

  .content {
    padding-top: 33rpx;

    /deep/ .token {
      padding-bottom: 40rpx;
    }

    .coinNumber {
      .number {
        height: 32rpx;
        font-weight: 600;
        font-size: 32rpx;
        color: #2C365A;
        line-height: 32rpx;
        margin-bottom: 20rpx;
      }

      .money {
        height: 28rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #8397B1;
        line-height: 28rpx;
      }
    }

    .border {
      height: 2rpx;
      opacity: 0.16;
      background-color: #8397B1;
    }
  }
</style>

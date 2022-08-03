<template>
  <view class="account">
    <!-- 钱包主页 -->
    <view class="status_bar">
      <!-- APP下会占用系统原生消息因此需要该占位符 -->
    </view>
    <view class="main">
      <view class="account-header">
        <view class="header-left" @click="showSwitchWallet = true">
          <view class="title"> 我的钱包 </view>
          <u-icon :name="require('@/static/img/account/down.png')" size="32rpx" color="#333655" />
        </view>

        <view class="header-icon">
          <u-icon name="scan" size="44rpx" color="#333655" @click="scanCode" />
          <u-icon name="setting" size="44rpx" color="#333655" @click="toGo('/pages/walletManager/index')" />
        </view>
      </view>
      <view class="basic-data">
        <view class="user-msg">
          <view class="allassets">
            <!-- 总资产 -->
            <u-icon :name="eyeAsset ? 'eye' : 'eye-off'" size="32rpx" color="#FFFFFF" label="总资产" labelPos="left"
              labelSize="28rpx" labelColor="#FFFFFF" space="8rpx" @click="assentIsShow" />
          </view>
          <view class="user-balance">
            ${{ eyeAsset ? allassets : '∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗' }}
          </view>
          <view class="user-address">
            <text v-if="eyeAsset">{{
              currentWallet.address | sliceAddress
            }}</text>
            <text v-else>∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗</text>
            <image class="copy-icon" src="/static/img/account/copy.png" @click="copy"></image>
            <!-- {{eyeAsset?(currentWallet.address|sliceAddress):'∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗'}} -->
          </view>
        </view>
      </view>

      <view class="account-column">
        <view class="column-item" @click="toGo('/pages/account/send/index')">
          <u-icon :name="require('../../static/img/account/send.png')" size="80rpx"></u-icon>
          <text>发送</text>
        </view>
        <view class="column-item" @click="toGo('./receive')">
          <u-icon :name="require('../../static/img/account/receive.png')" size="80rpx"></u-icon>
          <text>接收</text>
        </view>
        <view class="column-item" @click="toDelegate">
          <u-icon :name="require('../../static/img/account/delegate.png')" size="80rpx"></u-icon>
          <text>委托</text>
        </view>
        <view class="column-item" @click="dealBtn">
          <u-icon :name="require('../../static/img/account/transaction.png')" size="80rpx"></u-icon>
          <text>交易</text>
        </view>
      </view>

   <!--   <u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
        <view class="modalContent">
          <u-icon name="info-circle" size="64rpx" color="#FFA033" />
          <view class="modal-title">提示</view>
          <text class="modal-content">当前viewkey与链上不一致，代币余额和交易记录将无法获取，请进入代币详情页点击设置viewkey。</text>
          <button @click="aa = false">确认</button>
        </view>
      </u-modal> -->
      <view class="coin-list">
        <u-tabs :list="coinList" lineColor="#2C365A" @click="click" :inactiveStyle="inactiveStyle"
          :activeStyle="activeStyle" lineWidth="20" lineHeight="3" :itemStyle="itemStyle">
          <view slot="right" style="padding-bottom: 8rpx">
            <u-icon @click="toGo('/pages/assetManage/index')" :name="require('../../static/img/account/add.png')"
              size="48rpx" color="#8895b0" bold>
            </u-icon>
          </view>
        </u-tabs>
        <scroll-view v-if="visibaleTokenList.length" class="coinbox" scroll-y>
          <view class="content" v-for="item in visibaleTokenList" :key="item.full_name">
            <TokenColumn :tokenName="item.alia_name" :tokenAddress="item.contract_address" :tokenIcon="item.logo"
              class="token" @click.native="queryToken(item)">
              <template #right>
                <view class="coinNumber">
                  <view class="number">{{ item.balance || 0 }}</view>
                  <view class="money">$0.00000</view>
                </view>
              </template>
            </TokenColumn>
          </view>
        </scroll-view>
      </view>
    </view>
    <tab-bar />
    <SwitchWallet :showSwitchWallet="showSwitchWallet" @close="closeSwitchWalletPopup" />

    <view :initRender="initRender" :change:initRender="render.init"></view>
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
import {} from '@/utils/secretjs/SDK.js'
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
      showSwitchWallet: false,
      address: '',
      currentWallet: this.$cache.get('_currentWallet'),
      languages: languages[this.$cache.get('_language')],
      coinList: [],
      inactiveStyle: {
        fontSize: '32rpx',
        color: '#8397B1',
        fontWeight: '500'
      },
      activeStyle: {
        fontSize: '34rpx',
        color: '#2C365A',
        fontWeight: '600'
      },
      itemStyle: {
        height: '60rpx',
        alignItems: 'flex-start'
      },
      allassets: 66666666, //总资产
      eyeAsset: true,
      aa: true,
      tokenList: [],
      coinType: 'All',
      initRender: '', // call render.init
    }
  },
  onShow() {
    // this.newuserAdres = this.userAdres.replace(this.userAdres.slice(16, 36), '***')
    this.initCoinList()
    this.initRender++
  },
  created() {
    this.address = this.currentWallet.address
    //获取选择的代币
  },
  methods: {
    initCoinList() {
      let coinList = this.$cache.get('_currentWallet').coinList || []
      let tokenType = new Set()
      this.coinList = [{
        name: '代币'
      },
      {
        name: 'NFT'
      }
      ]
      coinList.forEach(item => item.apply_type && (tokenType.add(item.apply_type)))
      Array.from(tokenType).forEach(item => {
        switch (item) {
        case 'token':
          this.coinList.push({
            name: 'SNIP20'
          })
          break
        }
      })
    },
    toDelegate() {
      uni.switchTab({
        url: '/pages/delegate/index'
      })
    },
    click(item) {
      this.coinType = item.name == '代币' ? 'All' : item.name
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
        success: function() {
          console.log('success')
        }
      })
    },
    dealBtn() {
      uni.showToast({
        title: '暂未开放',
        icon: 'none'
      })
    },
    assentIsShow() {
      //用户总资产是否显示
      this.eyeAsset = !this.eyeAsset
      this.aa = true
    },
    closeSwitchWalletPopup() {
      this.showSwitchWallet = false
      this.currentWallet = this.$cache.get('_currentWallet')
      this.initCoinList()
      this.tokenList = this.currentWallet.coinList
    },
    queryToken(token) {
      console.log(token)
      if (token.apply_type) {
        uni.navigateTo({
          url: `./send/token_content_other?token=${JSON.stringify(token)}`
        })
      } else {
        uni.navigateTo({
          url: `./send/token_content?token=${JSON.stringify(token)}`
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
    }
  },
  computed: {
    visibaleTokenList() {
      const type = {
        'token': 'SNIP20',
        'default': 'NFT'
      }
      return this.coinType === 'All' ? this.tokenList : this.tokenList.filter(item => type[item.apply_type || 'default'] === this.coinType)
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    getBalance
  } from '@/utils/secretjs/SDK'
  import renderUtils from '@/utils/render.base.js'
  import mainCoin from '@/config/index.js'

  export default {
    methods: {
      async init() {
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
          if (coin.alia_name == mainCoin.alia_name) {
           
            // await new Promise((resolve) => {
            //   setTimeout(async () => {
            //     let res = await getBalance(wallet.address)
            //     balance = res.balance.amount
            //     console.log(balance);
            //     resolve()
            //   }, 5000)
            // })
           
            let res = await getBalance(wallet.address)
            balance = res.balance.amount
            
          } else { // 非主网币
        
          }
        
          if (coin.rate) balance = balance / coin.rate
          coin.balance = balance
        }
        renderUtils.runMethod(this._$id, 'updateCoinList', coinList, this)
      }
    }
  }
</script>
<style lang="scss" scoped>
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
      font-weight: 500;
      color: #2c3457;
      letter-spacing: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
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
          font-weight: 500;
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
    .u-modal {
      height: 510rpx;
    }

    .u-modal__content {
      padding: 32rpx;
      padding-top: 48rpx !important;
    }

    .modalContent {
      height: 430rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      .modal-title {
        font-size: 32rpx;
        color: #2c365a;
        font-weight: 500;
        line-height: 32rpx;
      }

      .modal-content {
        width: 564rpx;
        font-size: 28rpx;
        color: #8397b1;
        line-height: 42rpx;
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

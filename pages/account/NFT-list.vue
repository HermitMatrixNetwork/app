<template>
  <view class="page-wrapper">
    <view :callGetNFT="callGetNFT" :change:callGetNFT="render.getNFT"></view>
    <view :callGetTokenInfo="callGetTokenInfo" :change:callGetTokenInfo="render.getTokenInfo"></view>
    <custom-notify ref="notify" style="z-index: 99"></custom-notify>
    <custom-header tabUrl="/pages/account/index" :title="language.text265" :customStyle="{ 'z-index': 98 }">
      <template #right>
        <text class="header-right" @click="toNFTRecord">{{ language.text266 }}</text>
      </template>
    </custom-header>

    <view class="NFT_info">
      <view class="basic">
        <view class="image">
          <image :src="token.logo"></image>
        </view>
        <view class="words">
          <view>{{ token.full_name }}</view>
          <view style="display: flex; align-items: center;">
            <text>{{ token.contract_address | format }}</text>
            <image @click="copy" src="/static/img/account/copy2.png" style="width: 32rpx; height:32rpx; margin-left: 15rpx;"></image>
          </view>
        </view>
      </view>
      
      <view class="des">
        <view class="introduce" :class="{ ellipsis: showEllipsis }">
          <text>
           {{ token.desc }}
          </text>
        </view>
        <view class="expand" @click="expand" v-if="expandShow">
          <view v-show="showEllipsis">
            <text style="color: #8397B1;">{{ `... ` }}</text>
            <text>{{ language.text267 }}</text>
          </view>
          <view v-show="!showEllipsis">
            <text>&nbsp;&nbsp;&nbsp; </text>
            {{ language.text268 }}
          </view>
        </view>
      </view>
      
      <u-button class="btn" type="primary" color="#002FA7" @click="toViewkey">{{ language.text269 }}</u-button>

    </view>
    <view class="space" style="height: 24rpx; background-color: #F4F6F9;"></view>
    <view class="NFT_list">
      <view class="title">
        {{ language.text270 }}
      </view>
      <view class="line" />
      <template v-if="!token.view_key">
        <!-- :style="{ height: scrollHeight } " -->
        <no-data  class="no-data" :tip="language.text114"></no-data>
      </template>
      <custom-loading v-else-if="loading" style="margin-top: 32rpx;"></custom-loading>
      <scroll-view v-else-if="token.view_key && tokenList.length"  scroll-y class="scrollView" :style="{ height: scrollHeight } " >
        <template>
          <view class="nft_list_box">
            <view class="list-item" v-for="(item, index) in tokenList" :key="index" @click="toDetail(item)">
              <view class="nft_image">
                <image :src="item.logo" mode=""></image>
              </view>
              <view class="nft_id">
                #{{ item.id }}
              </view>
            </view>
          </view>
        </template>
      </scroll-view>
      <template v-else-if="token.view_key">
        <view class="no-assets">
          <image src="../../static/img/mipmap.png" mode=""></image>
          <text>{{ language.text277 }}</text>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import language from './language/index.js'
export default {
  data() {
    return {
      hasAssets: true,
      language: language[this.$cache.get('_language')],
      showEllipsis: false,
      nftInfoHeight: 0,
      systemBarHeight: 0,
      nftInfoTitleHeight: 0,
      token: {},
      expandShow: false,
      loading: true,
      callGetNFT: {},
      tokenList: [],
      callGetTokenInfo: {}
    }
  },
  onLoad(options) {
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.symbol == options.symbol)
    console.log('this.token', this.token)
    if (this.token.tokenList) {
      this.tokenList = this.token.tokenList
      this.loading = false
    }
    this.callGetNFT = JSON.parse(JSON.stringify(this.token))
  },
  onShow() {
    if (this.token.symbol) {
      this.token = this.$cache.get('_currentWallet').coinList.find(item => item.symbol == this.token.symbol)
      if (this.token.tokenList) {
        this.tokenList = this.token.tokenList
        this.loading = false
      }
      this.callGetNFT = JSON.parse(JSON.stringify(this.token))
    }
  },
  mounted() {
    this.calculateHeight()
    this.getSystemStatusHeight()
  },
  filters: {
    format(val) {
      return val && val.slice(0, 12) + '...' + val.slice(-12)
    }
  },
  methods: {
    getSystemStatusHeight() {
      uni.getSystemInfo({
        success: res => {
          this.systemBarHeight = res.statusBarHeight
        }
      })
    },
    calculateHeight() {
      
      const query = uni.createSelectorQuery().in(this)
      query.select('.introduce').boundingClientRect(data => {
        if (Math.ceil(Number(data.height)) > 36) {
          this.showEllipsis = true
        } else {
          this.showEllipsis = false
          this.expandShow = false
        }
      })
      
      query.exec()
      
      
      const query2 = uni.createSelectorQuery().in(this)
      this.$nextTick(() => {
        query2.select('.NFT_info').boundingClientRect(data => {
          this.nftInfoHeight = data.height + 'px'
        })
        
        query2.select('.NFT_list .title').boundingClientRect(data => {
          this.nftInfoTitleHeight = data.height + 'px'
        })
        query2.exec()
      })
    },
    expand() {
      this.showEllipsis = !this.showEllipsis
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this)
        query.select('.NFT_info').boundingClientRect(data => {
          this.nftInfoHeight = data.height + 'px'
          
        })
        query.exec()
      })
    },
    copy() {
      uni.setClipboardData({
        data: this.token.contract_address,
        showToast: false,
        success: () => {
          this.$refs.notify.show('error', this.language.text56, { bgColor: '#275EF1' })
        },
        fail: () => {
          // this.$refs.notify.show('error', '复制失败')
        }
      })
    },
    toViewkey() {
      if (this.token.view_key) {
        // 查看Viewkey
        uni.navigateTo({
          url: `/pages/account/send/checkViewKey?symbol=${this.token.symbol}`
        })
      } else {
        // 设置Viewkey
        uni.navigateTo({
          url: `/pages/account/send/settingViewKey?symbol=${this.token.symbol}`
        })
      }
    },
    handlerTokenList(res) {
      console.log('handlerTokenList', res)
      if (res.generic_err) {
        this.tokenList = []
        this.token.tokenList = []
        this.token.nums = 0
        const wallet = this.$cache.get('_currentWallet')
        const coinList = wallet.coinList
        let coinIndex = coinList.findIndex(item => item.alias_name == this.token.symbol)
        coinList.splice(coinIndex, 1, this.token)
        wallet.coinList = coinList
        this.$cache.set('_currentWallet', wallet, 0)
        this.loading = false
        this.updateWalletList(wallet)
        this.loading = false
        return
      }
      this.callGetTokenInfo = { tokens: res.token_list.tokens }
      if (this.callGetTokenInfo.tokens.length == 0) {
        this.loading = false
      }
    },
    handlerTokenListInfo(res) {
      console.log('handlerTokenListInfo', res)
      this.tokenList = res
      this.token.tokenList = res
      this.token.nums = this.tokenList.length
      const wallet = this.$cache.get('_currentWallet')
      const coinList = wallet.coinList
      let coinIndex = coinList.findIndex(item => item.alias_name == this.token.symbol)
      coinList.splice(coinIndex, 1, this.token)
      wallet.coinList = coinList
      this.$cache.set('_currentWallet', wallet, 0)
      this.loading = false
      this.updateWalletList(wallet)
    },
    updateWalletList (wallet) {
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
    toDetail(item) {
      uni.navigateTo({
        url: `./NFT-detail?symbol=${this.token.symbol}&id=${item.id}`
      })
    },
    toNFTRecord() {
      uni.navigateTo({
        url: `./NFT-txs?symbol=${this.token.symbol}`
      })
    }
  },
  computed: {
    scrollHeight() {
      return `calc(100vh - 112rpx - ${this.nftInfoHeight} - ${this.systemBarHeight + 'rpx'} - ${this.nftInfoTitleHeight} - 26rpx - 24rpx)`
    }
  },
  onBackPress(event) {
    if (event.from === 'backbutton') {
      uni.switchTab({
        url: '/pages/account/index'
      })
      return true
    }
  }
}
</script>

<script lang="renderjs" module="render">
  import {
    getOwnedTokens,
    getTokenInfo
  } from '@/utils/secretjs/SDK.js'
  import renderUtils from '@/utils/render.base.js'
export default {
  data() {
    return {
      tokenCopy: {}
    }
  },
  methods: {
    async getNFT(token) {
      // if (token.view_key == '' || !token.view_key) return;
      if (!token.symbol) return
      let wallet;
      //#ifdef APP-PLUS
      wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
      //#endif
      
      //#ifndef APP-PLUS 
      wallet = uni.getStorageSync('_currentWallet').data
      //#endif
      this.tokenCopy = token
      console.log('token', token);
      const res = await getOwnedTokens(wallet.address, token)
      renderUtils.runMethod(this._$id, 'handlerTokenList', res, this)
    },
    async getTokenInfo(tokens) {
      if (!tokens.tokens) return;
      let wallet;
      //#ifdef APP-PLUS
      wallet = JSON.parse(plus.storage.getItem('_currentWallet')).data.data
      //#endif
      
      //#ifndef APP-PLUS 
      wallet = uni.getStorageSync('_currentWallet').data
      //#endif
      const p = []
      for (let i = 0; i < tokens.tokens.length; i++) {
        p.push(getTokenInfo(this.tokenCopy, tokens.tokens[i], wallet.address))
      }
      
      Promise.all(p).then(res => {
        try {
          let tokenInfoList = []
          res.forEach((item, index) => {
            tokenInfoList.push({
              id: tokens.tokens[index],
              logo: item.all_nft_info.info.token_uri
            })
          })
          renderUtils.runMethod(this._$id, 'handlerTokenListInfo', tokenInfoList, this)
        } catch (e) {
          console.log('e', e);
        }
      })
    }
  }
}
  
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
    overflow: hidden;
    // background-color: #F4F6F9;
  }


  .NFT_info {
    width: 100%;
    padding-bottom: 32rpx;
    background-color: #fff;

    .basic {
      display: flex;
      align-items: center;
      height: 142rpx;
      padding: 32rpx;

      .image {
        >image {
          width: 80rpx;
          height: 80rpx;
        }


      }

      .words {
        padding-left: 32rpx;

        view:nth-child(1) {
          font-family: PingFangSC-S0pxibold;
          font-weight: 600;
          font-size: 32rpx;
          color: #2C365A;
          line-height: 32rpx;
          white-space: nowrap;
        }

        view:nth-child(2) {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 24rpx;
          color: #2C365A;
          line-height: 28rpx;
          margin-top: 16rpx;
        }
      }
    }

    .introduce {
      
      word-break: break-all;
      font-family: PingFangSC-Regular;
      font-size: 28rpx;
      color: #8397B1;
      line-height: 36rpx;
    }

    .ellipsis {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden; //溢出内容隐藏
      text-overflow: ellipsis; //文本溢出部分用省略号表示
      display: -webkit-box; //特别显示模式
      -webkit-line-clamp: 2; //行数
      line-clamp: 2;
      -webkit-box-orient: vertical; //盒子中内容竖直排列
    }

    .btn {
      margin: 32rpx;
      width: auto;
      height: 80rpx;
      border-radius: 16rpx;
      background-color: #002FA7 !important;
      font-weight: 400;
      font-size: 32rpx;
      color: #FCFCFD;
    }
  }

  .NFT_list {
    // margin-top: 24rpx;
    background-color: #fff;

    .title {
      padding: 32rpx;
      font-family: PingFangSC-Medium;
      font-weight: bold;
      font-size: 28rpx;
      color: #2C365A;
      letter-spacing: 0;
      line-height: 28rpx;
    }

    .line {
      height: 2rpx;
      margin: 0 32rpx;
      background: #8397B1;
      opacity: 0.16;
    }

    .scrollView {
      margin-top: 32rpx;
      
      .nft_list_box {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: flex-start;
        padding: 0 32rpx 32rpx;
      }

      .list-item {
        margin-bottom: 40rpx;

        .nft_image {
          width: 328rpx;
          height: 328rpx;
          border-radius: 32rpx;

          >image {
            width: 100%;
            height: 100%;
          }
        }

        .nft_id {
          height: 32rpx;
          font-family: PingFangSC-Medium;
          font-weight: bold;
          font-size: 32rpx;
          color: #2C365A;
          letter-spacing: 0;
          line-height: 32rpx;
          margin: 16rpx 0 8rpx 0;
          width: 328rpx;
        }
      }
    }

    .no-assets {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      >image {
        width: 240rpx;
        height: 240rpx;
      }

      >text {
        display: block;
        text-align: center;
        height: 28rpx;
        opacity: 0.6;
        font-family: PingFangSC-Regular;
        font-size: 28rpx;
        color: #8397B1;
        line-height: 28rpx;
      }
    }
  }

  .header-right {
    font-family: PingFangSC-Regular;
    font-size: 28rpx;
    color: #8397B1;
    letter-spacing: 0;
    line-height: 28rpx;
  }
  
  .des {
    position: relative;
    padding: 0 32rpx;
    
    .expand {
      position: absolute;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      font-size: 28rpx;
      color: #1E5EFF;
      line-height: 28rpx;
      bottom: 0;
      right: 36rpx;
      // background-image: linear-gradient(left, right, #000,#fff);;
      background-color: rgb(255, 255, 255);
      width: 100rpx;
      text-align: right;
      line-height: 36rpx;
    }
  }
  
  .no-data {
    padding: 0 32rpx;
    justify-content: center;
    /deep/ .tip {
      text-align: center;
    }
  }
</style>

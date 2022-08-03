<template>
  <view class="list">
    <view class="item" v-for="(item,index) in list" :key="index">
      <view class="left">
        <image :src="item.logo" style="width: 72rpx; height: 72rpx;" />
      </view>
      <view class="center">
        <view class="title">{{item.alia_name}}</view>
        <view class="address">
          {{ item.contract_address }}
        </view>
      </view>
      <view class="right" v-if="item.alia_name != mainCoin.alia_name">
        <u-icon v-if="searchList.includes(item.contract_address)" :name="require('@/static/img/account/ic-delect.png')"
          size="44rpx" @click="changeCoin(item,'del')"></u-icon>
        <u-icon v-else :name="require('@/static/img/account/ic-add.png')" size="44rpx" @click="changeCoin(item,'add')">
        </u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import mainCoin from '@/config/index.js'
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      searchList: [], //选择的代币列表地址数组	
      mainCoin: {} //主网币参数
    }
  },
  created() {
    this.mainCoin = mainCoin
    let currentWallte = this.$cache.get('_currentWallet')
    let coinList = currentWallte.coinList
    coinList.forEach(item => {
      this.searchList.push(item.contract_address)
    })
  },
  methods: {
    //修改coin列表，index选择索引，type类型 add添加，del为删除
    changeCoin(item, type) {
      let currentWallte = this.$cache.get('_currentWallet')
      let coinList = currentWallte.coinList || []
      if (type == 'add') {
        coinList.push(item)
        this.searchList.push(item.contract_address)
      } else {
        const index = coinList.findIndex(coin => coin.contract_address == item.contract_address)
        const searchListIndex = this.searchList.findIndex(address => address == item.contract_address)
        coinList.splice(index, 1)
        this.searchList.splice(searchListIndex, 1)
      }

      currentWallte.coinList = coinList
      this.$cache.set('_currentWallet', currentWallte, 0)
      this.updateWalletList(currentWallte)
      // uni.showToast({
      // 	icon: 'none',
      // 	title: '添加成功'
      // })
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
  }
}
</script>

<style lang="scss" scoped>
  .list {
    .item {
      display: flex;
      padding: 33rpx 32rpx;
      border-bottom: 2rpx solid rgba(131, 151, 177, 0.2);
      align-items: center;

      .left {
        width: 72rpx;
      }

      .center {
        width: 100%;
        padding-left: 24rpx;

        .title {
          margin-bottom: 12rpx;
          font-size: 28rpx;
          color: #2C365A;
        }

        .address {
          font-size: 24rpx;
          color: #8397B1;
        }
      }

      .right {
        width: 44rpx;
      }
    }
  }
</style>

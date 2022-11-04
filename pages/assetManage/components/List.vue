<template>
  <view class="list">
    <template v-if="showSwiper">
      <view class="swiper-item">
        <u-swipe-action>
          <u-swipe-action-item v-for="(item,index) in list" :key="index" :options="options"
            @click="clickSwiper($event, item)">
            <view class="contain">
              <view class="left">
                <image :src="item.logo" style="width: 72rpx; height: 72rpx;" />
              </view>
              <view class="center">
                <view class="title">{{item.alias_name}}</view>
                <view class="address">
                  {{ item.contract_address | sliceAddress(8, -10) }}
                </view>
              </view>
              <view class="right" v-if="item.alias_name != mainCoin.alias_name">
                <image v-if="searchList.includes(item.contract_address)" src="/static/img/account/ic-delect.png"
                  @click="changeCoin(item,'del')" style="width: 44rpx;height: 44rpx;"></image>
                <image v-else src="/static/img/account/ic-add.png" @click="changeCoin(item,'add')"
                  style="width: 44rpx;height: 44rpx;"></image>
              </view>
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
      </view>
    </template>
    <template v-else>
      <view class="item" v-for="(item,index) in list" :key="index">
        <view class="left">
          <image :src="item.logo" style="width: 72rpx; height: 72rpx;" />
        </view>
        <view class="center">
          <view class="title">{{item.alias_name}}</view>
          <view class="address">
            {{ item.contract_address | sliceAddress(8, -10) }}
          </view>
        </view>
        <view class="right" v-if="item.alias_name != mainCoin.alias_name">
          <image v-if="searchList.includes(item.contract_address)" src="/static/img/account/ic-delect.png"
            @click="changeCoin(item,'del')" style="width: 44rpx;height: 44rpx;"></image>
          <image v-else src="/static/img/account/ic-add.png" @click="changeCoin(item,'add')"
            style="width: 44rpx;height: 44rpx;"></image>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import mainCoin from '@/config/index.js'
import {
  sliceAddress
} from '@/utils/filters.js'
import languages from '@/pages/account/language/index.js'
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    showSwiper: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchList: [], //选择的代币列表地址数组	
      mainCoin: {}, //主网币参数
      options: [{
        text: languages[this.$cache.get('_language')].text257,
        style: {
          backgroundColor: '#f56c6c'
        }
      }]
    }
  },
  methods: {
    clickSwiper(e, item) {
      if (e.index === 0) {
        this.$emit('deleteItem', item.contract_address)
      }
    },
    init() {
      this.searchList = []
      this.mainCoin = mainCoin
      let currentWallte = this.$cache.get('_currentWallet')
      let coinList = currentWallte.coinList
      coinList.forEach(item => {
        if (item.contract_address) this.searchList.push(item.contract_address)
      })
    },
    //修改coin列表，index选择索引，type类型 add添加，del为删除
    changeCoin(item, type) {
      let currentWallte = this.$cache.get('_currentWallet')
      let coinList = currentWallte.coinList || []
      if (type == 'add') {
        let addressList = []
        coinList.forEach(item => {
          if (item.alias_name !== mainCoin.alias_name) {
            addressList.push(item.contract_address)
          }
        })

        item.view_key = ''
        item.loadingBalance = true
        if (addressList.includes(item.contract_address)) {} else {
          coinList.push(item)
        }
        this.searchList.push(item.contract_address)
      } else {
        const index = coinList.findIndex(coin => coin.contract_address == item.contract_address)
        const searchListIndex = this.searchList.findIndex(address => address == item.contract_address)
        if (index > -1) coinList.splice(index, 1)
        if (searchListIndex > -1) this.searchList.splice(searchListIndex, 1)
      }
      this.$emit('change', {
        coinList,
        contract: item.contract_address
      })


      // uni.showToast({
      // 	icon: 'none',
      // 	title: '添加成功'
      // })
    }
  },
  filters: {
    sliceAddress
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

  .swiper-item {
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

  /deep/ .u-swipe-action-item__content {
    // transform: translateX(0px);
    position: relative;
    z-index: 2;
  }

  .contain {

    display: flex;
    padding: 33rpx 32rpx;
    border-bottom: 2rpx solid rgba(131, 151, 177, 0.2);
    align-items: center;
  }
</style>

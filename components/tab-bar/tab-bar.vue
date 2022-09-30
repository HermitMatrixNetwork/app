<template>
	<view class="tabbar-container">
		<view class="tabbar-item" v-for="(item,index) in tabbarList" :class="[item.centerItem ? 'center-item' : '']"
			@click="changeItem(item)">
     <view v-if="item.centerItem" class="center">
        <image :src="require('../../static/img/tabbar/delegate.png')" style="width: 112rpx; height: 112rpx"></image>
      </view>
			<view class="item-top">
				<image :src="currentItem==item.id?item.selectIcon:item.icon"></image>
			</view>
			<view class="item-bottom" :class="[currentItem==item.id ? 'item-active' : '']">
				<text>{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import languages from './language/index.js'
export default {
  props: {
    currentPage: {
      type: Number,
      default: 0
    }
  },
  beforeCreate() {
    uni.hideTabBar()
  },
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      currentItem: 0,
      tabbarList: [{
        id: 0,
        path: '/pages/account/index',
        icon: require('../../static/img/tabbar/assets.png'),
        selectIcon: require('../../static/img/tabbar/selAssets.png'),
        text: languages[this.$cache.get('_language')].text01,
        centerItem: false
      }, {
        id: 1,
        path: '/pages/market/index',
        icon: require('../../static/img/tabbar/market.png'),
        selectIcon: require('../../static/img/tabbar/selMarket.png'),
        text: languages[this.$cache.get('_language')].text04,
        centerItem: false
      }, {
        id: 2,
        path: '/pages/delegate/index',
        icon: require('../../static/img/tabbar/delegate.png'),
        selectIcon: require('../../static/img/tabbar/delegate.png'),
        text: '委托',
        centerItem: true
      }, {
        id: 3,
        path: '/pages/transaction/index',
        icon: require('../../static/img/tabbar/transaction.png'),
        selectIcon: require('../../static/img/tabbar/selTransaction.png'),
        text: languages[this.$cache.get('_language')].text03,
        centerItem: false
      }, {
        id: 4,
        path: '/pages/mine/index',
        icon: require('../../static/img/tabbar/mine.png'),
        selectIcon: require('../../static/img/tabbar/selMine.png'),
        text: languages[this.$cache.get('_language')].text02,
        centerItem: false
      }]

    }
  },
  mounted() {
    this.currentItem = this.currentPage
    
  },

  methods: {
    //切换tabbar
    changeItem(item) {
      if (item.id == 3) { // 交易
        uni.showToast({
          title: this.language.text07,
          icon: 'none'
        })
      } else {
        uni.switchTab({
          url: item.path
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
	view {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		box-shadow: 0 -17.68px 24px 0 rgba(0, 0, 0, 0.05);
		border-top: 1px;
		display: flex;
		align-items: center;
		// padding: 26rpx 0 20rpx 0;
		font-size: 32rpx;
		z-index: 200;
		background-color: #fff;
		color: #B0C1D0;
	}

	.tabbar-container .tabbar-item {
		width: 20%;
		// height: 120rpx;
		padding: 26rpx 0 20rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		text-align: center;
	}


	.tabbar-container .center-item {
		// display: block;
		// position: relative;
	}

	.tabbar-container .tabbar-item .item-top {
		width: 60rpx;
		height: 60rpx;
		// padding: 10rpx;
	}

	.center {
    display: flex;
    align-items: center;
    justify-content: center;
		flex-shrink: 0;
		width: 112rpx;
		height: 112rpx;
		position: absolute;
		top: -50%;
		// left: calc(50%);
    left: 50%;
    transform: translate(-50%);
		border-radius: 50%;
		background-image: linear-gradient(178deg, #2C80EE 0%, #002FA7 100%);
		box-shadow: 5.89px 8px 24px 0 rgba(36, 107, 253, 0.32);
		background-color: #ffffff;
    image {
      width: 112rpx !important;
      height: 112rpx !important;
    }
	}
  
  .tabbar-container .center-item {
    
  }

	.tabbar-container .tabbar-item .item-top image {
		width: 50rpx;
		height: 50rpx;
	}

	tabbar-container .tabbar-item:nth-child(3) .item-top image {
		background: #ff0000;
	}

	.tabbar-container .tabbar-item .item-bottom {
		font-size: 24rpx;
		color: #B0C1D0;
		width: 100%;
	}

	.tabbar-container .center-item .item-bottom {
		// position: absolute;
		// bottom: 5rpx;
	}

	.tabbar-container .tabbar-item .item-active {
		color: #275EF1;
	}
  
  
  .center-item .item-top {
    image {
      opacity: 0;
    }
  }
</style>

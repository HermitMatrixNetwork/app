<template>
	<view class="transtion">
		<custom-header :title="'交易记录'" >
		</custom-header>
		<u-tabs class="tabs" :inactiveStyle="inactiveStyle" :activeStyle="activeStyle" :itemStyle="itemStyle" :list="list1" lineColor="#1E5EFF" lineHeight="4"></u-tabs>
		<view class="lists">
			<TranList />
		</view>
	</view>
</template>

<script>
import TranList from './components/TranList'
export default {
  components: {
    TranList
  },
  data(){
    return {
      list1: [{
        name: '全部',
      }, {
        name: '委托',
      }, {
        name: '取消委托'
      }, {
        name: '奖励领取'
      }],
      inactiveStyle: {
        fontSize: '28rpx',
        color: '#8397B1',
      },
      activeStyle: {
        fontSize: '28rpx',
        color: '#1E5EFF',
        fontWeight: '600'
      },
      itemStyle: {
        height: '80rpx'
      }
    }
  },


}
</script>

<style  lang="scss" scoped>
	.lists {
		padding: 0 32rpx;
	}
  
  .tabs {
    border-bottom: 2rpx solid rgba(131,151,177,0.20);
  }
</style>
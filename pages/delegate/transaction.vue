<template>
	<view class="transtion">
		<custom-header :title="'交易记录'" >
		</custom-header>
		<u-tabs :list="list1" lineColor="#1E5EFF" lineHeight="4"></u-tabs>
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
      }]
    }
  },


}
</script>

<style  lang="scss" scoped>
	.lists {
		padding: 0 32rpx;
		border-top: 2rpx solid rgba(131,151,177,0.20);
	}
</style>
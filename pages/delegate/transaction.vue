<template>
	<view class="transtion">
		<custom-header :title="language.text38" >
		</custom-header>
		<u-tabs class="tabs" :inactiveStyle="inactiveStyle" :activeStyle="activeStyle" :itemStyle="itemStyle" :list="list1" lineColor="#1E5EFF" lineHeight="4" @change	="changeTab"></u-tabs>
		<view class="lists">
			<TranList :currentTab="currentTab" />
		</view>
	</view>
</template>

<script>
import TranList from './components/TranList'
import language from './language/index.js'
export default {
  components: {
    TranList
  },
  data(){
    return {
      language: language[this.$cache.get('_language')],
      list1: [{
        name: language[this.$cache.get('_language')].text70,
      }, {
        name: language[this.$cache.get('_language')].text71,
      }, {
        name: language[this.$cache.get('_language')].text72
      }, {
        name: language[this.$cache.get('_language')].text73
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
      },
      currentTab: 0
    }
  },
  methods: {
    changeTab(item) {
      this.currentTab = item.index
    }
  }

}
</script>

<style  lang="scss" scoped>
	.lists {
		padding: 0 32rpx;
	}
  
  .tabs {
    border-bottom: 2rpx solid rgba(131,151,177,0.20);
    height: 80rpx;
  }
</style>
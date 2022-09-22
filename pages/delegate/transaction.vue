<template>
	<view class="transtion">
		<custom-header :title="language.text38" :customStyle="{ 'z-index': 99, 'background-color': '#fff' }">
		</custom-header>
		<u-tabs class="tabs" :inactiveStyle="inactiveStyle" :activeStyle="activeStyle" :itemStyle="itemStyle" :list="list1" lineColor="#1E5EFF" lineHeight="4" @change	="changeTab"></u-tabs>
		<scroll-view class="lists" scroll-y :style="{ height: scrollHeight }" refresher-enabled="true" :refresher-triggered="triggered" :refresher-threshold="60" @refresherrefresh="onRefresh">
			<TranList :currentTab="currentTab" ref="tranList" :triggered.sync="triggered" />
		</scroll-view>
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
      currentTab: 0,
      systemBarHeight: 0,
      triggered: true
    }
  },
  mounted() {
    this.getSystemStatusHeight()
  },
  methods: {
    onRefresh() {
      console.log('refresh')
      this.triggered = true
      const res = this.$refs.tranList.init()
    },
    getSystemStatusHeight() {
      uni.getSystemInfo({
        success: res => {
          this.systemBarHeight = res.statusBarHeight
        }
      })
    },
    changeTab(item) {
      this.currentTab = item.index
    }
  },
  computed: {
    scrollHeight() {
      return `calc(100vh - 112rpx  - ${this.systemBarHeight + 'rpx'} - 92rpx - 32rpx)`
    }
  }

}
</script>

<style  lang="scss" scoped>
  .transtion {
    padding-top: calc(112rpx + var(--status-bar-height));
  }
	.lists {
		padding: 0 32rpx;
	}
  
  .tabs {
    border-bottom: 2rpx solid rgba(131,151,177,0.20);
    height: 80rpx;
  }
</style>
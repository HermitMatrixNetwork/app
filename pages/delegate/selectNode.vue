<template>
	<view class="select-node">
		<custom-header :redirUrl='`${redirectURL}?selectIndex=${selectIndex}`' :title="language.text21" >
			<template #right>
        <image src="/static/img/delegate/search2.png" style="width: 44rpx; height: 44rpx;" @click="toSearch"></image>
			</template>
		</custom-header>
		<view class="lists">
      <custom-loading class="loading" v-if="loading"></custom-loading>
			<List v-else-if="list.length" :list="list" :selectIndex="selectIndex" :redirectURL="redirectURL"/>
			<view v-else class="no-data">
				<no-data ></no-data>
			</view>
		</view>
	</view>
</template>

<script>
import List from './components/List.vue'
import language from './language/index.js'
import {
  sliceAddress
} from '@/utils/filters.js'
export default {
  components: {
    List
  },
  filters: {
    sliceAddress
  },
  data(){
    return {
      language: language[this.$cache.get('_language')],
      list: [],
      loading: true,
      currentWallet: this.$cache.get('_currentWallet'),
      selectIndex: -1,
      redirectURL: ''
    }
  },
  onLoad(options) {
    options.selectIndex && (this.selectIndex = Number(options.selectIndex))
    options.redirectURL && (this.redirectURL = options.redirectURL)
  },
  created() {
    if (!this.$cache.get('_delegateInfo')) {
      this.timer = setInterval(() => {
        if (this.$cache.get('_delegateInfo')) {
          this.list = this.$cache.get('_delegateInfo').list
          this.loading = false
          clearInterval(this.timer)
        }
      }, 2000)
    } else {
      this.list = this.$cache.get('_delegateInfo').list
      this.loading = false
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    toSearch() {
      uni.navigateTo({
        url: `./search?selectIndex=${this.selectIndex}&redirectURL=/pages/delegate/cancel`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
	.lists {
		padding: 0 32rpx;
		border-top: 2rpx solid rgba(131,151,177,0.20);
	}
  
  .loading {
    margin-top: 20rpx;
  }
	.no-data {
		height: calc(100vh - var(--status-bar-height) - 112rpx);
		display: flex;
		flex-direction: column;
		justify-content: center;
		transform: translateY(-112rpx);
	}
</style>
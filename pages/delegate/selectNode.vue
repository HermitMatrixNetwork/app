<template>
	<view class="select-node">
    <!-- :redirUrl='`${redirectURL}?selectIndex=${selectIndex}`' -->
		<custom-header  :title="language.text21" :customStyle="{ 'z-index': 99 }">
			<template #right>
        <view class="search_icon">
          <image src="/static/img/delegate/search2.png" style="width: 44rpx; height: 44rpx;" @click="toSearch"></image>
        </view>
			</template>
		</custom-header>
		<view class="lists">
      <custom-loading class="loading" v-if="loading"></custom-loading>
			<List v-else-if="list.length" :list="list" :selectIndex="selectIndex" :redirectURL="redirectURL"/>
			<view v-else class="no-data">
				<no-data v-if="redirectURL == '/pages/delegate/cancel'" :tip="language.text12" :btnTx="language.text64" @btnClick="btnClick"></no-data>
        <no-data v-else></no-data>
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
      redirectURL: '',

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
    btnClick() {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('selindexChange') 
      uni.navigateBack({
        delta: 2
      })
    },
    toSearch() {
      const eventChannel = this.getOpenerEventChannel()
      
      uni.navigateTo({
        url: `./search?selectIndex=${this.selectIndex}&redirectURL=${this.redirectURL}&from=search`,
        events: {
          indexChange: (index) => {
            eventChannel.emit('indexChange', index)
          }
        }
      })
    }
  },
  onBackPress(event) {
    if (event.from == 'backbutton') {
      uni.navigateBack()
      // uni.redirectTo({
      //   url: this.redirectURL + `?selectIndex=${this.selectIndex}`
      // })
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  .select-node {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
  }
  
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
  
  .search_icon {
    height: 112rpx;
    display: flex;
    align-items: center;
  }
</style>
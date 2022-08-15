<template>
	<view class="main">
		<custom-header :title="'查看viewkey'"></custom-header>
		<view style="margin: 0 32rpx;">
			<view class="title">
				当前viewkey
			</view>
			<u--textarea v-model="view_key" cols="30" rows="10" placeholder="当前viewkey" class="viewkey_input" disabled></u--textarea>
			

		</view>
		
    
    <view class="viewkey_btn">
    	<button @click="copy">复制viewkey</button>
    	<button @click="toSetViewKey">设置viewkey</button>
    </view>
    
    <Notify ref="notify"></Notify>
	</view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
import mixin from '../mixins/index.js'
import Notify from './components/notify.vue'
export default {
  components: { InputTitle, Notify },
  mixins:[mixin],
  data() {
    return {
      view_key: ''
    }
  },
  onLoad(options) {
    this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
    this.view_key = this.token.view_key
  },
  methods: {
    copy() {
      uni.setClipboardData({
        data: this.view_key,
        showToast: false,
        success: () => {
          this.$refs.notify.show('error', '复制成功')
        },
        fail: () => {
          this.$refs.notify.show('error', '复制失败')
        }
      })
    },
    toSetViewKey() {
      uni.redirectTo({
        url: `/pages/account/send/settingViewKey?tokenID=${this.token.ID}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.main{
	position: relative;
	height: 100vh;
	width: 100%;
}

.title{
	height: 28rpx;
	margin-top: 48rpx;
	font-family: PingFangSC-Medium;
	font-weight: 500;
	font-size: 28rpx;
	color: #2C365A;
	letter-spacing: 0;
	line-height: 28rpx;
	margin-bottom: 24rpx;
}

.viewkey_input{
	width: 100%;
	height: 240rpx;
	background: #F2F4F8;
	border-radius: 16rpx;

	font-family: PingFangSC-Regular;
	font-weight: 400;
	font-size: 28rpx;
	color: #2C365A;
	letter-spacing: 0;
	line-height: 40rpx;
	padding: 32rpx;
}
.viewkey_btn{
	position: fixed;
  width: 100vw;
	bottom: 48rpx;
	display: flex;
	justify-content: space-around;
	button{
		width: 320rpx;
		height: 96rpx;
		background: rgba(255,255,255,0.00);
		border: 2rpx solid rgba(131,151,177,0.31);
		border-radius: 16rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		color: #2C3457;
		&:nth-child(2){
			background: #002FA8;
			color: #FFFFFF;
		}
	}
}
</style>

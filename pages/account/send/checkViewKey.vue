<template>
	<view class="main">
		<custom-header :title="'查看viewkey'"></custom-header>
		<view style="margin: 0 32rpx;">
			<view class="title">
				当前viewkey
			</view>
			<textarea v-model="viewkey" cols="30" rows="10" placeholder="当前viewkey" class="viewkey_input"></textarea>
			
			<view class="viewkey_btn">
				<button @click="copy(viewkey)">复制viewkey</button>
				<button @click="toGo('/pages/account/send/settingViewKey')">设置viewkey</button>
			</view>
		</view>
		
	</view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
import mixin from '../mixins/index.js'
export default {
  components:{InputTitle},
  mixins:[mixin],
  data() {
    return {
      viewkey:'1321313213213'
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
	width: 100%;
	padding: 0 32rpx;
	position: absolute;
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
		font-weight: 400;
		font-size: 32rpx;
		color: #2C3457;
		letter-spacing: 0;
		&:nth-child(2){
			background: #002FA8;
			color: #FFFFFF;
		}
	}
}
</style>

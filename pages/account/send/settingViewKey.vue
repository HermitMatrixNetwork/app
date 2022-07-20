<template>
	<view>
		<custom-header :title="'设置viewkey'"></custom-header>
		 <view class="perform_contract">
		 	<view class="title">
		 		执行合约
		 	</view>
		 	<textarea v-model="viewkey" cols="30" rows="10" placeholder="当前viewkey" class="viewkey_input"></textarea>	
		 </view>
		<view style="height: 16rpx;background: #F4F6FA;"/>
		
		<view style="margin: 0 32rpx;">
			<InputTitle :title="'Memo'" :placeholder="'请输入Memo （选填）'"></InputTitle>
		</view>
		<view style="height: 16rpx;background: #F4F6FA;margin-top: 48rpx;" />
		<miners-column></miners-column>

		<view class="submit-button">
			<Submitbtn @click.native="submitPopupIsShow = true">确认</Submitbtn>
		</view>
		
		<u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" round="16rpx"
			:safeAreaInsetBottom="true" >
			<view class="submitPopup">
				<view class="main">
					<view class="popup-title">
						转账确认
						<u-icon :name="require('../../../static/img/account/close.png')" size="32rpx"
							@click="submitPopupIsShow=false"></u-icon>
					</view>
					
					<view class="" v-for="(item,key) in list" :key="key">
						{{item}}
					</view>
					<Submitbtn>确认</Submitbtn>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
import Submitbtn from './components/submit-btn.vue'
export default {
  components:{InputTitle,Submitbtn},
  data() {
    return {
      submitPopupIsShow:false,
      viewkey:'1321321321',
      list:{
        aa:'执行合约',
        bb:'详情',
        cc:'Memo',
        dd:'矿工费'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
	.perform_contract{
		width: 100%;
		height: 540rpx;
		padding: 48rpx 32rpx 38rpx;
		
		.title{
			height: 28rpx;
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
			height: 402rpx;
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
	}
	
	
	
	
	
	
	
.submitPopup {
		width: 100%;
		height: 1028rpx;

		.main {
			margin: 0 32rpx;

			.popup-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: 500;
				font-size: 32rpx;
				color: #2C365A;
				letter-spacing: 0;
				padding: 48rpx 0 16rpx 0;
				line-height: 32rpx;
				background: #F6F8FA;
			}

		}

	}
	.submit-button{
		width: 100%;
		background: #F4F6FA;
		padding: 130rpx 64rpx 64rpx;
		position: absolute;
		bottom:0;
		
	}
</style>

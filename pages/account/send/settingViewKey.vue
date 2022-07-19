<template>
	<view>
		<custom-header :title="'设置viewkey'"></custom-header>
		<InputTitle :title="'Memo'" :placeholder="'请输入Memo （选填）'"></InputTitle>
		
		<miners-column></miners-column>
		<!-- <button>确认</button> -->
		<Submitbtn @click.native="submitPopupIsShow = true">确认</Submitbtn>
		
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
</style>

<template>
	<u-popup :show="popupshow" @close="popupshow=false" mode="bottom" round="16rpx"
		:safeAreaInsetBottom="true">
		<view class="submitPopup">
			<view class="main">
				<view class="popup-title">
					{{title}}
					<u-icon :name="require('@/static/img/account/close.png')" size="32rpx"
						@click="popupshow=false"></u-icon>
				</view>
				
				<view class="main_item" v-for="item in keys" :key="item">
					{{item}}
				</view>
				
			</view>
<!-- 			<view class="submit-btn" @click="submitAgain">
					<Submitbtn>确认</Submitbtn>
			</view> -->
		</view>
	</u-popup>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default:''
    },
    popupshow:{
      type:Boolean,
      default:false
    },
    keys:{
      type:Array,
    }
  },
  data(){
    return {

    }
  },
  computed:{
		
  },
  watch:{
    popupshow(val){
      this.$emit('changeShow',val)
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
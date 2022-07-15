<template>
	<view class="choose_token">
		<custom-header :title="'代币选择'" />
		<view class="token-list">
			<TokenColumn :tokenName="'uGHM'">
				<template #right>
					<view>0.00</view>
					<view>0.00</view>
				</template>
			</TokenColumn>
		</view>
	</view>
</template>

<script>
	import TokenColumn from './components/TokenColumn.vue'
export default{
	components:{TokenColumn},
  data(){
    return{
				
    }
  }
}
</script>

<style lang="scss" scoped>
	.token-list{
		margin: 32rpx 32rpx 0;
	}
</style>
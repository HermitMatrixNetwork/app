<template>
	<view>
		<custom-header :title="'GHM'"></custom-header>

		<view class="basic">
			<view class="title">基本信息</view>
			<view class="content">
				<view v-for="(item,key) in basic" :key="key" class="content-item">
					<text>{{key}}</text>
					<text>{{item}}</text>
				</view>
			</view>
		</view>
		<view style="height: 16rpx;background: #F4F6FA;" />
		<view class="release">
			<view class="title">发行信息</view>
			<text>
				发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行信息描述发行......
			</text>
		</view>

	</view>
</template>

<script>
export default {
  data() {
    return {
      basic:{
        项目简称:'GHM',
        项目全称:'Hermit Matrix Network',
        官网:'https://ghmchain.org',
        合约地址:'暂无'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
	.basic {
		width: 750rpx;
		height: 340rpx;
		background: #FFFFFF;
		border-radius: 2rpx;
		padding: 32rpx;
	}

	.release {
		width: 750rpx;
		height: 380rpx;
		background: #FFFFFF;
		border-radius: 2rpx;
		padding: 32rpx;

		text {
			font-family: PingFangSC-Regular;
			font-weight: 400;
			font-size: 24rpx;
			color: #8397B1;
			letter-spacing: 0;
			line-height: 36rpx;
		}
	}
	.title {
		font-family: PingFangSC-Medium;
		font-weight: 500;
		font-size: 28rpx;
		color: #2C365A;
		letter-spacing: 0;
		margin-bottom: 16rpx;
	}
	.content-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 400;
		font-size: 24rpx;
		letter-spacing: 0;
		line-height: 24rpx;
		color: #2C365A;
		padding-bottom: 36rpx;
		text:nth-child(1){
			color: #8397B1;
		}
		&:nth-child(1){
			margin-top: 32rpx;
		}
	}
</style>

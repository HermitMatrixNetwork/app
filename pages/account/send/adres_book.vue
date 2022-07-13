<template>
	<view class="address-book">
		<custom-header :title="'地址簿'">
			<template #customIcon>
				加
			</template>
		</custom-header>

		<view class="address-list" v-if="addressList.length">
			<view class="address-item" v-for="(item,index) in addressList" :key="index">
				<view class="token-image">
					<image :src="item.icon"/>
				</view>
				<view class="token-content" :style="{height:item.remark?'136rpx':'96rpx'}">
					<view>{{item.title}}</view>
					<text>{{item.address}}</text>
					<view>{{item.remark}}</view>
				</view>
			</view>
		</view>
		
		<view class="no-address" v-else>
			<image src="../../../static/img/mipmap.png" />
			<view>暂无地址，点击<text class="add">添加</text></view>
		</view>
	</view>
</template>

<script>
export default {
  data() {
    return {
      addressList: [{
        icon: '../../../static/img/placeholder.jpeg',
        title: '我的地址',
        address: '0xd7B650061b098247A9C756D3c184002C93060e4c',
        remark: '这里是备注内容'
      },
      {
			  icon: '../../../static/img/placeholder.jpeg',
			  title: '我的地址',
			  address: '0xd7B650061b098247A9C756D3c184002C93060e4c',
			  remark: ''
      },
      {
			  icon: '../../../static/img/placeholder.jpeg',
			  title: '我的地址',
			  address: '0xd7B650061b098247A9C756D3c184002C93060e4c',
			  remark: ''
      }]
    }
  },
  onLoad() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
	}

	.address-book {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}

	.address-list {
		margin: 0 32rpx;
		height: auto;

		.address-item {
			width: 100%;
			padding: 32rpx 0;
			// height: 96rpx;
			display: flex;
			align-items: center;
			border-bottom: 1rpx solid #80808080;

			.token-image {
				padding-right: 32rpx;

				image {
					width: 72rpx;
					height: 72rpx;
				}
			}

			.token-content {
				width: 542rpx;
				height: 136rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				view:nth-child(1),
				view:nth-child(3) {
					font-weight: 400;
					font-size: 24rpx;
					color: #8397B1;
					letter-spacing: 0;
					line-height: 24rpx;
				}

				text {
					width: 542rpx;
					height: 56rpx;
					font-weight: 400;
					font-size: 24rpx;
					color: #2C365A;
					letter-spacing: 0;
					line-height: 28rpx;
					word-wrap: break-word;
				}
			}
		}
	}

	.no-address{
		width: 252rpx;
		height: 272rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		image{
			width: 240rpx;
			height: 240rpx;
		}
		view{
			font-family: PingFangSC-Regular;
			font-weight: 400;
			font-size: 28rpx;
			color: #8397B1;
			letter-spacing: 0;
			text-align: center;
			line-height: 28rpx;
			.add{
				color: #1E5EFF;
			}
		}
	}

</style>

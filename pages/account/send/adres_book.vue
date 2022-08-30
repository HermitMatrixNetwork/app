<template>
	<view class="address-book">
		<custom-header class="header" :title="language.text02">
			<template #right>
				<u-icon :name="require('@/static/img/account/add2.png')" size="44rpx" @click="toGo('/pages/account/writeAddress')"></u-icon>
			</template>
		</custom-header>
    <view class="border">
      
    </view>
		<view class="address-list" v-if="addressList.length">
			<view v-for="(item,index) in addressList" :key="index">
				<view class="address-item" @click="toEditAddress(item)">
				  <view class="token-image">
				  	<image :src="item.icon || '/static/img/account/uGHM.png'"/>
				  </view>
				  <view class="token-content">
				  	<view>{{ item.walletName }}</view>
				  	<view>{{ item.walletAddress }}</view>
				  	<view>{{ item.walletDescribe }}</view>
				  </view>
				</view>
        <view class="border"></view>
			</view>
		</view>
		
		<view class="no-address" v-else>
			<image src="../../../static/img/mipmap.png" />
			<view>{{ language.text03 }} {{ language.text86 }} <text class="add" @click="toGo('/pages/account/writeAddress')">{{ language.text04 }}</text></view>
		</view>
	</view>
</template>

<script>
import mixin from '../mixins/index.js'
import language from '@/pages/mine/language/index.js'
export default {
  data() {
    return {
      addressList: this.$cache.get('_addressBook') || [],
      language: language[this.$cache.get('_language')]
    }
  },
  onLoad(options) {
    this.edit = options.edit
  },
  methods: {
    toEditAddress(item) {
      if (this.edit) {
        uni.navigateTo({
          url: `/pages/account/editAddress?book=${JSON.stringify(item)}`
        })
      } else {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('reciveAddress', item.walletAddress)
        uni.navigateBack()
      }
    }
  },
  mixins:[mixin]
}
</script>

<style lang="scss" scoped>
  .border {
    height: 2rpx;
    opacity: 0.16;
    background-color: #8397B1;
  }

	.address-book {
		width: 100%;
		background: #FFFFFF;
	}

	.address-list {
		margin: 0 32rpx;

		.address-item {
			width: 100%;
			padding: 32rpx 0;
			// height: 96rpx;
			display: flex;
			align-items: center;

			.token-image {
				padding-right: 32rpx;

				image {
					width: 72rpx;
					height: 72rpx;
				}
			}

			.token-content {
				width: 542rpx;
				display: flex;
				flex-direction: column;

				view:nth-child(1),
				view:nth-child(3) {
					font-weight: 400;
					font-size: 24rpx;
					color: #8397B1;
					letter-spacing: 0;
					line-height: 24rpx;
				}
        
        view:nth-child(2) {
          margin-top: 16rpx;
          margin-bottom: 18rpx;
          font-weight: 400;
          font-size: 24rpx;
          color: #2C365A;
          line-height: 28rpx;
          word-wrap: break-word;
        }
			}
		}
	}

	.no-address{
		width: 252rpx;
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

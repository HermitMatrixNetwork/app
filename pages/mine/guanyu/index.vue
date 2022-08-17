<template>
	<view class="container">
		<custom-header title="关于我们"></custom-header>
		<view class="border"> </view>

		<view class="logo">
			<image src="/static/img/account/uGHM.png"></image>
		</view>

		<view class="title">
			<view>
				Hermit Wallet
			</view>
		</view>

		<view class="list">
			<view class="item">
				<view class="label">
					<view>版本信息</view>
				</view>
				<view class="arrow tag">
					<text>{{version}}</text>
				</view>
			</view>
			<view class="border"> </view>
			<view class="item">
				<view class="label">
					<view>检查版本</view>
				</view>
				<view class="arrow tag-info" @click="getData">
					<text v-if="initIsShow">当前已是最新版</text>
					<image src="/static/img/ic-arrow1.png"></image>
				</view>
				
			</view>
			<button @click="test" v-if="updateIsShow">test</button>
		</view>
	</view>
</template>

<script>
import {
  getVersion
} from '@/api/token.js'
import updateApp from '@/utils/updateApp.js'
export default {
  data() {
    return {
      version: '',
      initIsShow: false,
      appId: '',
      updateIsShow:false,
    }
  },
  onLoad() {
    // if(this.$cache.get('_version')){
    //   this.version = this.$cache.get('_version')
    // }else{
    //   this.getData()
    // }
    //#ifdef APP-PLUS
    this.getAppVersion()
    //#endif
  },
  methods: {
    async getData() {
      const res = await getVersion()
      console.log('版本信息', res)
      const {
        version
      } = res.data.data.version
      if (this.appId < version) {
        console.log('发现新版本')
        this.updateIsShow = true
        return
      } else if (this.appId === version) {
        return this.initIsShow = true
      }
      // this.version = res.data.data.version
    },
    getAppVersion() {
      plus.runtime.getProperty(plus.runtime.appid, res => {
        console.log('获取当前版本信息', res)
        this.appId = res.versionCode * 1
        this.version = res.version
      })
    },
    test() {
      plus.runtime.openURL('https://package-manage.gstchain.net/app/new-gst-office-wallet/apk/GST_Wallet_219.apk')
      // var dtask = plus.downloader.createDownload(
      //   'https://package-manage.gstchain.net/app/new-gst-office-wallet/apk/GST_Wallet_219.apk',{},function (d,status){
      //     if(status==200){
      //       console.log('下载完成')
      //  plus.runtime.install('/storage/emulated/0/安装包',{},function(){
      // 	 console.log('完成')
      //  })
      //     } 
      //   })
      // dtask.start()
    }
  }
}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background-color: #F4F6F9;
	}

	.border {
		height: 2rpx;
		background-color: #8397B1;
		opacity: 0.16;
	}

	.logo {
		text-align: center;
		margin-top: 64rpx;

		image {
			width: 108rpx;
			height: 108rpx;
		}
	}

	.title {
		height: 32rpx;
		margin-top: 24rpx;
		margin-bottom: 114rpx;
		font-size: 32rpx;
		color: #0F172A;
		text-align: center;
		font-weight: 600;
		line-height: 32rpx;
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 38rpx 34rpx 38rpx 32rpx;
		background-color: #fff;

		&:not(:last-child) {
			border-top: 2rpx solid #F4F6F9;
		}

		.label {
			display: flex;
			align-items: center;

			font-size: 28rpx;
			color: #0F172A;
			line-height: 32rpx;

			&-icon {
				margin-right: 24rpx;

				image {
					width: 44rpx;
					height: 44rpx;
				}
			}
		}

		.arrow {
			display: flex;
			align-items: center;

			text {
				font-weight: 400;
				font-size: 28rpx;
				line-height: 32rpx;
			}

			image {
				width: 32rpx;
				height: 32rpx;
			}
		}

		.tag {
			color: #0F172A;
		}

		.tag-info {
			color: #8397B1;

			text {
				padding-right: 12rpx;
			}
		}
	}
</style>

<template>
	<view class="container">
    <view class="mask" v-show="updating"></view>
		<custom-header :title="language.text78"></custom-header>
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
					<view>{{ language.text79 }}</view>
				</view>
				<view class="arrow tag">
					<text>{{version}}</text>
				</view>
			</view>
			<view class="border"> </view>
			<view class="item" @click="checkVersion">
				<view class="label">
					<view>{{ language.text80 }}</view>
				</view>
				<view class="arrow tag-info">
					<text v-if="latestVersion == version">{{ language.text81 }}</text>
					<image v-else-if="!checking" src="/static/img/ic-arrow1.png"></image>
          <u-loading-icon v-else :text="language.text114" textSize="14"></u-loading-icon>
				</view>
			</view>
		</view>
    <custom-updateApp tip :updating.sync="updating" :checking.sync="checking" :latestVersion.sync="latestVersion" ref="updateApp" />
		<view class="Agreement">
			<view style="color: #1e42ed;" @click="jump">《{{ language.text125 }}》</view>
      <view>{{ language.text126 }}</view>
		</view>
	</view>
</template>

<script>
import {
  getVersion
} from '@/api/token.js'
import language from '../language/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      version: '',
      updateIsShow:false,
      latestVersion: '-1',
      updating: false,
      checking: false
    }
  },
  onLoad() {
    //#ifdef APP-PLUS
    this.getAppVersion()
    //#endif
  },
  methods: {
    checkVersion() {
      this.checking = true
      this.$refs.updateApp.checkUpdate()
    },
    getAppVersion() {
      plus.runtime.getProperty(plus.runtime.appid, res => {
        this.version = res.version
      })
    },
    jump(){
      uni.navigateTo({
        url:'./userAgreement'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5) !important;
    z-index: 9999;
  }
  
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
    height: 130rpx;

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
	.Agreement{
		width: 100%;
		position: absolute;
		bottom: 32rpx;
		text-align: center;
		font-size: 28rpx;
	}
</style>

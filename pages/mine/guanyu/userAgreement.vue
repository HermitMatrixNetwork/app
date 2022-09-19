<template>
	<view class="container">
		<custom-header class="header" :title="language.text125"></custom-header>

		<view class="message">
			<view class="title">Hermit Matrix Network {{language.text125}}</view>
			<view class="meta">
				<view class="create-time">{{ language.text127 }}：2022-9-3</view>
				<!-- <view class="create-author">
					<text>{{ language.text92 }}：{{msg.author}}</text>
				</view> -->
			</view>
			<view class="content" v-html="contentMsg">
			</view>
			
		</view>
	</view>
</template>

<script>
import language from '../language/index.js'
import indexLanguage from '@/pages/index/language/index.js'
export default {
  data() {
    return {
      msg: {
        author:'',
        timestamp:'',
        title:''
      },
      content:'',
      language: language[this.$cache.get('_language')],
      contentMsg: indexLanguage[this.$cache.get('_language')].text87
    }
  },
  created() {
    const language = this.$cache.get('_language')
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', data => {
      this.msg.author = data.author
      this.msg.timestamp = data.timestamp
      this.msg.title = data[`${language.toLowerCase()}_title`]
      this.content = data[`${language.toLowerCase()}_content`]
    })
  },
  computed: {
    timestamp() {
      return function(time) {
        let date = new Date(time * 1000)
        let year = date.getFullYear()
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let hours = date.getHours()
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let seconds = date.getSeconds()
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
    }
  }
}
</script>

<style lang="scss" scoped>
	.container{
		height: 100vh;
	}
	.header {
		border-bottom: 2rpx solid #F4F6F9;
	}

	.message {
		height: calc(100vh - 112rpx - 1px - var(--status-bar-height));
		overflow-y: auto;
		padding: 0 32rpx 0;

		.title {
			font-weight: 600;
			font-size: 36rpx;
			color: #32475F;
			margin-bottom: 24rpx;
		}

		.meta {
			display: flex;
			height: 24px;
			font-size: 24rpx;
			color: #8397B1;
			line-height: 24rpx;
			margin-bottom: 32rpx;

			.create-time {
				margin-right: 18rpx;
			}
		}

		.content {
			font-size: 28rpx;
			color: #8397B1;
		}
	}
</style>

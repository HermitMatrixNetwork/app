<template>
	<view class="container">
		<custom-header class="header" :title="language.text118"></custom-header>

		<view class="message">
			<view class="title">{{msg[`${currentLanguage.toLowerCase()}_title`]}}</view>
			<view class="meta">
				<view class="create-time">{{timestamp(msg.timestamp)}}</view>
				<view class="create-author">
					<text>{{ language.text92 }}：{{msg.author}}</text>
				</view>
			</view>
			<view class="content" v-html="contentMsg">
			</view>
			
		</view>
	</view>
</template>

<script>
import language from '../language/index.js'
export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      currentLanguage: this.$cache.get('_language'),
      msg: {
        author:'',
        timestamp:'',
        title:''
      },
      content:''
    }
  },
  created() {
    // this.msg = JSON.parse(value.data)
    const eventChannel = this.getOpenerEventChannel()
    let _this = this
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
		    console.log('接收到的数据',data.data)			
      _this.msg = data.data
      _this.content = data.data[`${_this.currentLanguage.toLowerCase()}_content`]
      // this.msg = data.data
      // console.log(this.msg)
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
    },
    contentMsg(){
      return this.content.replace(/<a/g,'<h3').replace(/<\/a/g,'<h3')
    }
  }
}
</script>

<style lang="scss" scoped>
	.container{
		min-height: 100vh;
    padding-top: calc(112rpx + var(--status-bar-height));
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
			white-space: normal;
			word-break: break-all;
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

<template>
	<view class="container">
		<custom-header class="header" :title="language.text122" :customStyle="{ 'background-color': '#fff' }"></custom-header>

		<view class="message">
			<view class="message-item" v-for="(item, index) in noticeList" :key="index" @click="toDetail(item)">
				<view class="title">{{item.title}}</view>
				<view class="content" v-html="item.desc"></view>
				<view class="time">{{timestamp(item.timestamp)}}</view>
			</view>
		</view>
	</view>
</template>

<script>
import language from '../language/index.js'
export default {
  data() {
    return {
      noticeList:[],
      language: language[this.$cache.get('_language')],
    }
  },
  methods: {
    toDetail(data) {
		  uni.navigateTo({
		    url: './detail',
		    events: {
		      sendMessage(data) {
		        console.log(data)
		      }
		    },
		    success(res) {
		      res.eventChannel.emit('acceptDataFromOpenerPage', {
		        data
		      })
		    }
		  })
    },	
  },
  created(){
    const eventChannel = this.getOpenerEventChannel()
    let _this = this
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
			    console.log('接收到的数据',data)			
			  _this.noticeList = data.data.data.notices.reverse()
      console.log(_this.noticeList)
    })
  },
  computed:{
    timestamp() {
		  return function(time) {
		    let date = new Date(time * 1000)
		    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
		    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
		    let hours = date.getHours()
		    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
		    return month + '-' + day + ' ' + hours + ':' + minutes
		  }
    },
  }
}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background-color: #F4F6F9;
    padding-top: calc(112rpx + var(--status-bar-height));
	}

	.header {
		margin-bottom: 2rpx;
	}

	.message {
		// #ifdef H5
		height: calc(100vh - 112rpx - 1px);
		// #endif
		// #ifdef APP-PLUS
		height: calc(100vh - 112rpx - 1px - var(--status-bar-height));
		// #endif
		overflow: auto;

		&-item {
			padding: 32rpx 30rpx 34rpx 42rpx;
			background-color: #fff;

			&:not(:last-child) {
				margin-bottom: 16rpx;
			}
		}



		.title {
			font-weight: 400;
			font-size: 28rpx;
			color: #2C365A;
			letter-spacing: 0;
		}

		.content {
			font-weight: 400;
			font-size: 24rpx;
			color: #8397B1;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			margin: 16rpx 0 24rpx;
		}

		.time {
			font-weight: 400;
			font-size: 24rpx;
			color: #8397B1;
		}
	}
	.unread{
		background:#dafefe40;
	}
</style>


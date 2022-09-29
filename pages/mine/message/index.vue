<template>
	<view class="container">
		<custom-header class="header" :title="language.text19" :customStyle="{ 'background-color': '#fff' }"></custom-header>
    
    <custom-loading v-if="loading" class="custom-loading"></custom-loading>
    
		<view class="message" v-else>
			<view class="message-item" v-for="(item, index) in [...noticeList,...readList]" :key="index" @click="toDetail(item)"
				:class="alreadyRead.includes(item.ID)?'':'unread'">
				<view class="title">{{ item[`${currentLanguage.toLowerCase()}_title`] }}</view>
				<view class="content" v-html="content(item[`${currentLanguage.toLowerCase()}_content`])"></view>
				<view class="time">{{timestamp(item.timestamp)}}</view>
				<view class="line"></view>
			</view>
		</view>
	</view>
</template>

<script>
import {
  getNotice
} from '@/api/token.js'
import language from '../language/index.js'

export default {
  data() {
    return {
      language: language[this.$cache.get('_language')],
      currentLanguage: this.$cache.get('_language'),
      noticeList: [],
      alreadyRead: this.$cache.get('_alreadyRead') || [],
      readList:[],
      loading: true
    }
  },
  onLoad() {
    this.getData()
  },
  methods: {
    toDetail(data) {
      this.alreadyRead.push(data.ID)
      this.$cache.set('_alreadyRead', Array.from(new Set(this.alreadyRead)), 0)
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
    async getData() {
      const res = await getNotice()
      console.log('通知信息', res)
      let arr = res.data.data.notices.sort((a, b) => b.timestamp - a.timestamp)
      // if(this.alreadyRead.length == 0){
      this.noticeList = arr
      // } else {
      //   arr.forEach(item=>{
      //     if(this.alreadyRead.includes(item.ID)){
      //       this.readList.push(item)
      //     }else{
      //       this.noticeList.push(item)
      //     }
      //   })
      // }
      this.loading = false
    },
  },
  computed: {
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
    //替换a标签
    content(){
      return function(value){
        return value.replace(/<a/g,'<h3').replace(/<\/a/g,'<h3')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .custom-loading {
    margin-top: 20rpx;
  }
	.container {
		padding-top: calc(112rpx + var(--status-bar-height));
    min-height: 100vh;
		background-color: #F4F6F9;
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
			padding: 32rpx 30rpx 0 42rpx;
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
			word-break: break-all;
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
		background: #F5F8FF;
	}
	
	.line {
		  height: 2rpx;
			padding-top: 37rpx;
		  border-bottom:2rpx solid rgba(131,151,177, 0.3);
	}
</style>

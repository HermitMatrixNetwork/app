<template>
	<view class="mine">
		<custom-header :showGoBack="false" :title="language.text01" :customStyle="{ 'background-color': '#fff', 'z-index': 999 }">
			<template slot="right">
				<view class="header-icon" @click="toMessage">
					<image src="@/static/img/mine/message.png"></image>
					<view class="message-badge" v-if="noNotice"><text>{{ messageNum }}</text></view>
				</view>
			</template>
		</custom-header>
		<view class="import-container">
			<view class="top">
				<view class="import-type" v-for="(item, index) in top" :key="item.name" @click="toPage('top', index)">
					<view class="content">
						<view class="content-icon">
							<image :src='`/static/img/mine/${item.icon}`'></image>
						</view>
						<view class="content-content">
							<view class="content-content-name">{{ item.name }}</view>
						</view>
						<view class="content-arrow-right">
              <image src="/static/img/ic-arrow1.png" style="width:32rpx; height: 32rpx;"></image>
						</view>
					</view>
					<view class="border">
					</view>
				</view>
			</view>
			<view class="center">
				<view class="import-type" v-for="(item, index) in center" :key="item.name" @click="toPage('center', index)">
					<view class="content">
						<view class="content-icon">
							<image :src='`/static/img/mine/${item.icon}`'></image>
						</view>
						<view class="content-content">
							<view class="content-content-name">{{ item.name }}</view>
						</view>
						<view class="content-arrow-right">
              <image src="/static/img/ic-arrow1.png" style="width:32rpx; height: 32rpx;"></image>
						</view>
					</view>
					<view class="border">
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="import-type" v-for="(item, index) in bottom" :key="item.name" @click="toPage('bottom', index)">
					<view class="content">
						<view class="content-icon">
							<image :src='`/static/img/mine/${item.icon}`'></image>
						</view>
						<view class="content-content">
							<view class="content-content-name">{{ item.name }}</view>
						</view>
						<view class="content-arrow-right">
              <image src="/static/img/ic-arrow1.png" style="width:32rpx; height: 32rpx;"></image>
						</view>
					</view>
					<view class="border">
					</view>
				</view>
			</view>
		</view>

		<tab-bar :current-page="4" />
	</view>
</template>

<script>
import {
  getNotice
} from '@/api/token.js'
import language from './language/index.js'
export default {
  data () {
    return {
      language: language[this.$cache.get('_language')],
      top: [{
        name: language[this.$cache.get('_language')].text02,
        icon: 'dizhipu.png',
        page: '/pages/account/send/adres_book?edit=true'
      }, {
        name: language[this.$cache.get('_language')].text22,
        icon: 'dae.png',
        page: './dae/index'
      }],
      center: [{
        name: language[this.$cache.get('_language')].text31,
        icon: 'anquan.png',
        page: './anquan/index'
      }, {
        name: language[this.$cache.get('_language')].text37,
        icon: 'jiedian.png',
        page: './jiedian/index'
      }, {
        name: language[this.$cache.get('_language')].text55,
        icon: 'yuyan.png',
        page: './yuyan/index'
      }],
      bottom: [{
        name: language[this.$cache.get('_language')].text128,
        icon: 'yaoqing.png',
        page: './yaoqing/index'
      },{
        name: language[this.$cache.get('_language')].text61,
        icon: 'bangzhu.png',
        page: './bangzhu/index'
      }, {
        name: language[this.$cache.get('_language')].text64,
        icon: 'lianxi.png',
        page: './lianxi/index'
      }, {
        name: language[this.$cache.get('_language')].text93,
        icon: 'wentifankui.png',
        page: './wenti/index'
      }, {
        name: language[this.$cache.get('_language')].text78,
        icon: 'guanyu.png',
        page: './guanyu/index'
      }],
      messageNum: 0, //要显示的通知数量
      noNotice: false, //通知是否显示
      notices: 0, //本地存储中的通知数量
      reflesh: false
    }
  },
  onShow () {
    this.notices = this.$cache.get('_alreadyRead') ? this.$cache.get('_alreadyRead').length : 0
    this.getNoticenum()
  },
  methods: {
    toPage (position, index) {
      if (this[position][index].page == './yuyan/index') {
        uni.redirectTo({
          url: './yuyan/index'
        })
      } else {
        uni.navigateTo({
				  url: this[position][index].page,
        })
      }

    },
    toMessage () {
      uni.navigateTo({
        url: './message/index'
      })
    },
    async getNoticenum () {
      const res = await getNotice()
      // console.log(res)
      const messageNum = res.data.data.notices.length
      if (messageNum == 0 || this.notices === messageNum) {
        return this.noNotice = false
      } //如果获取的通知数量为0则结束

      if (this.notices !== messageNum) { //若不相等
        this.messageNum = messageNum - this.notices>0?messageNum - this.notices:messageNum
        this.noNotice = true
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.mine {
  height: 100vh;
	background-color: #F4F6F9;
  padding-top: calc(112rpx + var(--status-bar-height));
}

.header-icon {
	position: relative;
	display: flex;
	align-items: center;
	height: 46rpx;
	width: 46rpx;

	image {
		width: 46rpx;
		height: 46rpx;
	}

	.message-badge {
		position: absolute;
		right: -8rpx;
		top: -12rpx;
		width: 34rpx;
		height: 34rpx;
		border-radius: 50%;
		background-color: #EE2933;
		font-size: 22rpx;
		color: #fff;
		text-align: center;
		line-height: 34rpx;
	}
}

image {
	width: 44rpx;
	height: 44rpx;
}

.import-container {
	margin: 32rpx 0 0;
  padding-bottom: calc( 120rpx + 56rpx);
}

.import-type {
	padding: 40rpx 0 0rpx 0;

	.content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx 33rpx 48rpx;

		&-icon {
			width: 44rpx;
			height: 44rpx;
		}

		&-content {
			flex: 1;
			margin-left: 32rpx;

			&-name {
				// font-weight: 600;
				font-size: 32rpx;
				color: #0F172A;
				line-height: 32rpx;
			}
		}
	}

	.border {
		border-bottom: 2rpx solid #F2F4F8;
		margin-left: 48rpx;
	}

	&:last-child {
		.border {
			border-bottom: 0;
		}
	}
}

.top,
.center,
.bottom {
	margin-top: 25rpx;
	background: #FFFFFF;
}
</style>

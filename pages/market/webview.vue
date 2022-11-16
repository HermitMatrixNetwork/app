<template>
	<view class="page-wrapper">
		<custom-notify ref="notify" style="z-index: 99"></custom-notify>
		<!-- :showGoBack="false" -->
		<custom-header :title="name" :customStyle="{ 'z-index': 98 }">
			<!-- <template #left>
        <view class="back_button">
          <image  @click="goback"  src="/static/img/black.png"  style="width:48rpx;height:48rpx"></image> 
        </view>
      </template> -->
			<template #right>
				<view class="capsule">
					<image src="/static/img/mine/more.png" @click="showup"></image>
					<view class="border"></view>
					<image src="/static/img/mine/close.png" @click="back"></image>
				</view>
			</template>
		</custom-header>
		<iframe v-if="refreshIframe" id="iframe" ref="iframe"
			style="width: 100vw; height: calc(100vh - 112rpx - var(--status-bar-height));" :src="jumpUrl"
			frameborder="0"></iframe>
		<u-popup class="popup" :show="show" @close="close">
			<view class="popup-top" style="text-align: right; padding: 32rpx 25rpx 0 0;">
				<image src="/static/img/mine/close.png" @click="close" style="width:32rpx; height: 32rpx;"></image>
			</view>
			<view class="control_btn">
				<view class="item" @click="copylink">
					<image src="/static/img/mine/copylink.png" style="width:100rpx; height: 100rpx;"></image>
					<text>{{ language.text12 }}</text>
				</view>
				<view class="item" @click="refresh">
					<image src="/static/img/mine/refresh.png" style="width:100rpx; height: 100rpx;"></image>
					<text>{{ language.text13 }}</text>
				</view>
				<view class="item" @click="collection">
					<image
						:src="this.isCollect ? '/static/img/mine/collection2.png' : '/static/img/mine/collection.png'"
						style="width:100rpx; height: 100rpx;"></image>
					<text>{{ this.isCollect ? language.text20 : language.text14 }}</text>
				</view>
			</view>
		</u-popup>

		<u-popup :show="pop" @close="render.closeRq" mode="bottom" class="double-check-popup"
			:safeAreaInsetBottom="true">
			<view class="submitPopup">
				<view class="main">
					<view class="popup-title">
						{{ language.text42 }}
						<image src="/static/img/account/close.png" style="width: 32rpx; height: 32rpx;"
							@click="render.closeRq"></image>
					</view>

					<!-- 发送账户 -->
					<view class="send-address">
						<text>{{language.text43}}</text>
						<text>{{sendFormData.userAddress}}</text>
					</view>

					<!-- 接收账户 -->
					<view class="receive_address" v-if="sendFormData.receiveAddress">
						<text>{{ language.text48 }}</text>
						<text>{{sendFormData.receiveAddress}}</text>
					</view>

					<!-- 转账金额 -->
					<view class="transfer_amount" v-if="sendFormData.sendAmount">
						<text>{{ language.text45 }}</text>
						<text>{{sendFormData.sendAmount?sendFormData.sendAmount:'0'}} GHM</text>
					</view>

					<!--Memo-->
					<view class="memo_type" v-if="sendFormData.memo">
						<text>Memo</text>
						<text class="memo">{{ sendFormData.memo }}</text>
					</view>

					<!--矿工费-->
					<view class="miners_fee">
						<text>{{language.text46}}</text>
						<view>
							<view>{{ sendFormData.gasLimit }} * {{ sendFormData.gasPriceInFeeDenom }}
								ughm
							</view>
							<view class="price">
								{{ sendFormData.totalGas }}
								GHM
							</view>
						</view>
					</view>
				</view>
				<view class="submit-btn" @click="render.sendTx" style="position: absolute; bottom: 64rpx; width: 622rpx;">
					<Submitbtn>{{language.text47}}</Submitbtn>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import uniImageMenu from './share.js'
	import language from './language/index.js'
	import Submitbtn from '@/pages/account/send/components/submit-btn.vue'
	import decimal from 'decimal'

	export default {
		components: {
			Submitbtn
		},
		onLoad(options) {
			// console.log(uni.getSystemInfoSync().statusBarHeight)
			let tempUrl = options.jumpUrl
			if (tempUrl.startsWith('http://') || tempUrl.startsWith('https://')) {} else {
				tempUrl = 'http://' + tempUrl
			}
			this.jumpUrl = tempUrl
			this.name = options.name
			this.collectionList = this.$cache.get('_collectionList') || []
			this.isCollect = this.collectionList.find(item => item.url === this.jumpUrl)
		},
		data() {
			return {
				name: '',
				hidden: false,
				firstIn: true,
				show: false,
				refreshIframe: 1,
				submitPopupIsShow: false,
				sendFormData: {},
				callBack: 0,
				pop: false,
				language: language[this.$cache.get('_language')],
				collectionList: []
			}
		},
		methods: {
			cpop(e) {
				this.pop = e.pop
				if (e.sendFormData) {
					e.sendFormData.sendAmount = new decimal(e.sendFormData.sendAmount + '').div(new decimal(10 ** 6))
					e.sendFormData.totalGas = new decimal(e.sendFormData.gasPriceInFeeDenom + '').mul(new decimal(e
						.sendFormData.gasLimit)).div(new decimal(10 ** 6)).toString()
					this.sendFormData = e.sendFormData
				}
			},
			showup() {
				this.firstIn = false
				this.hidden = false
				this.show = true

			},
			close() {
				this.show = false
				this.hidden = true
			},
			back() {
				uni.navigateBack()
			},
			copylink() {
				uni.setClipboardData({
					data: this.jumpUrl,
					showToast: false,
					success: () => {
						this.show = false
						this.$refs.notify.show('', this.language.text15, {
							bgColor: '#275EF1'
						})
					},
					fail: () => {
						// this.$refs.notify.show('error', this.language.copyfailure)
					}
				})
			},
			refresh() {
				this.show = false
				this.refreshIframe = 0
				this.$nextTick(() => {
					this.refreshIframe = 1
				})
			},
			collection() {
				if (!this.isCollect) {
					this.isCollect = true
					this.$refs.notify.show('', this.language.text16, {
						bgColor: '#275EF1'
					})
					this.$cache.set('_tempCollection', {
						url: this.jumpUrl,
						collect: true
					}, 0)
				} else {
					this.isCollect = false
					this.$refs.notify.show('', this.language.text17, {
						bgColor: '#275EF1'
					})
					this.$cache.set('_tempCollection', {
						url: this.jumpUrl,
						collect: false
					}, 0)
				}
				this.show = false
			},
			goback() {
				this.callBack++
			}
		}
	}
</script>

<script module="render" lang="renderjs">
	const DAPPWEB = "dappWeb-"
	import {
		getMsgObj,
		getOptions,
		getSecret
	} from '@/utils/secretjs/SDK.js'
	export default {
		data() {
			return {
				iframeDom: '',
				secretjs: null,
				sendData: null,
			}
		},
		async mounted() {
			this.iframeDom = document.getElementById('iframe')
			window.addEventListener('message', this.handleEvent)
			this.secretjs = await getSecret()
		},
		methods: {
			// 事件处理
			handleEvent(e) {
				if (e.data && e.data.event && e.data.event.startsWith(DAPPWEB)) {
					if (e.data.event === DAPPWEB + "init") {
						this.iframePostMsg(DAPPWEB + 'cs', getOptions())
					} else if (e.data.event === DAPPWEB + "sendRq" && !this.sendData) {
						this.sendData = e.data.data
						console.log("this.sendData", this.sendData)
						this.sendRq(e.data.data)
					}
				}
			},
			// 转账
			sendRq(data) {
				let userAddress = this.secretjs.address
				let sendAmount, receiveAddress
				for (var i = 0; i < data.messages.length; i++) {
					let obj = data.messages[i]
					if ("amount" in obj) sendAmount = obj.amount[0].amount
					if ("toAddress" in obj) receiveAddress = obj.toAddress
				}
				let sendFormData = {
					userAddress,
					receiveAddress,
					sendAmount,
					...data.txOptions
				}
				this.serverPostMsg("cpop", {
					pop: true,
					sendFormData
				})
			},
			closeRq() {
				this.serverPostMsg("cpop", {
					pop: false
				})
				this.iframePostMsg(DAPPWEB + 'broadcast-' + this.sendData.eventId)
				this.sendData = null
			},
			// 广播交易签名
			sendTx() {
				let messages = []
				for (let i = 0; i < this.sendData.messagesKey.length; i++) {
					messages.push(getMsgObj(this.sendData.messagesKey[i], this.sendData.messages[i]))
				}
				let eventId = this.sendData.eventId
				let res = this.secretjs.tx.broadcast(messages, this.sendData.txOptions).then(res => {
					this.iframePostMsg(DAPPWEB + 'broadcast-' + eventId, {
						status: 1,
						res
					})
				})
				this.serverPostMsg("cpop", {
					pop: false
				})
				this.sendData = null
			},
			// 主动与Server通讯
			serverPostMsg(method, data) {
				this.$ownerInstance.callMethod(method, data)
			},
			// 主动与ifrom
			iframePostMsg(event, data) {
				let param = {
					event,
					data
				}
				this.iframeDom.contentWindow.postMessage(param, '*')
			}

		}
	}
</script>

<style lang="scss" scoped>
	// .status_bar {
	//   height: var(--status-bar-height);
	//   width: 100%;
	// }

	/deep/ .u-popup {
		position: fixed;
		z-index: 99999 !important;

		.u-transition {
			z-index: 9999 !important;
		}
	}

	.pop-up {
		position: fixed;
		bottom: 0;
		height: 300rpx;
		width: 100vw;
		background-color: #fff;

	}

	.h0 {
		bottom: -300rpx;
	}

	.h300 {
		bottom: 0;
	}

	.capsule {
		// width: 200rpx;
		display: flex;
		// rgba(255, 255, 255, .5)
		padding: 10rpx 24rpx;
		border-radius: 27rpx;
		border: 2rpx solid #f4f4f4;

		.border {
			margin: 0 20rpx;
			border: 2rpx solid #f4f4f4;

		}

		image {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.page-wrapper {
		height: 100vh;
		padding-top: calc(112rpx + var(--status-bar-height));
	}

	/deep/ .popup {
		// height: 360rpx;
		.u-popup__content {
			flex-shrink: 0 !important;
			flex-basis: 360rpx !important;
			border-top-right-radius: 16rpx;
			border-top-left-radius: 16rpx;
			background: #F7F8FA;
		}
	}

	.control_btn {
		display: flex;
		margin-top: 32rpx;

		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-left: 50rpx;

			text {
				margin-top: 18rpx;
				font-family: PingFangSC-Regular;
				font-size: 22rpx;
				color: #2C365A;
				text-align: center;
			}
		}
	}

	//弹出层
	.submitPopup {
		width: 100%;
		height: 1028rpx;

		.main {
			margin: 0 32rpx;

			.popup-title {
				font-weight: 600;
				font-size: 32rpx;
				color: #2C365A;
				letter-spacing: 0;
				padding: 48rpx 0 16rpx 0;
				line-height: 32rpx;
				border-bottom: 0 !important;
			}

			>view {
				font-size: 28rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #dddddd80;

				text:nth-child(2) {
					width: 400rpx;
					word-wrap: break-word;
					text-align: right;
					font-weight: 400;
					color: #030319;
					letter-spacing: 0;
					line-height: 36rpx;
				}

				text:nth-child(1) {
					font-family: PingFangSC-Regular;
					font-weight: 400;
					color: #8F9BB3;
					letter-spacing: 0;
				}
			}

			.send-address,
			.receive_address {
				padding: 33rpx 0;
			}

			.transfer_amount,
			.memo_type {
				padding-top: 33rpx;
				padding-bottom: 43rpx;

				.memo {
					-webkit-line-clamp: 2;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.transfer_amount {}

			.miners_fee {
				padding: 33rpx 0 39rpx 0;

				view {
					height: 80rpx;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					line-height: 28rpx;
					font-size: 28rpx;
					color: #030319;

					.price {
						color: #8F9BB3;
						margin-top: 24rpx;
					}
				}
			}

		}

	}

	.main-bottom {
		width: 100%;
		background: #F4F6FA;

		.submit-btn {
			margin: 96rpx 32rpx 48rpx;
		}
	}

	.submit-btn {
		margin: 0 64rpx;

	}
</style>

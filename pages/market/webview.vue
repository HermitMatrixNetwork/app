<template>
	<view class="page-wrapper">
    <view :callTx="callTx" :change:callTx="render.sendTx"></view>
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
				<view class="submit-btn" @click="submitAgain" style="position: absolute; bottom: 64rpx; width: 622rpx;">
					<Submitbtn>{{language.text47}}</Submitbtn>
				</view>
			</view>
		</u-popup>
    
    <!-- 密码 -->
    <u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
    	<view class="modal_main">
    		<view class="modal_title">
    			<view>
    				{{ verifyMethod == 'touchID' ? languages.text196 : languages.text48 }}
    				<text v-if="verifyMethod == 'touchID' && verifyTouchErrorTip !== ''"
    					class="verifyTouchErrorTip">({{ verifyTouchErrorTip }})</text>
    			</view>
    			<image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAHlBMVEUAAAC0tLQzMzM1NTU1NTVAQEBVVVU0NDQ0NDQ2NjaffAksAAAACnRSTlMABP6alSUMwJyTpBRv+gAAAJpJREFUKM9tkbsRgzAMhv1fHrV8qdIquUvKJBPkmICKmoYFGIEN2BgbIVH8qLAl+ZP1SgeCXRWzs9t59cgA2VDpUM7rOGMLuL96SbjoA2LAT9uiSaMfrMBJn6j3rSIGfGFkQSpgD665PxAHHAkgkAA8oSUPZFJ9G2CSz6r/nMjBIfQpp6XCuHRqjtrnAdEIaci0BloUrZKWTbIAEzsbXdctYEYAAAAASUVORK5CYII=" style="width: 32rpx;height: 32rpx;"
    				@click="closeModalPasswordIsShow"></image>
    		</view>
    		<!--  -->
    		<view v-if="verifyMethod == 'password'">
    			<view class="item">
    				<view class="item-input item-input-password">
    					<u-input :password="!passwordEye" v-model="payPassword" :placeholder="languages.text49">
    					</u-input>
    					<image
    						:src="passwordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'"
    						@click="passwordEye = !passwordEye"
    						style="width: 32rpx; height: 32rpx; margin-right: 36rpx;"></image>
    				</view>
    			</view>
    			<text v-if="passwordCheck" class="waringPrompt">{{ languages.text51 }}</text>
    			<u-button @click="passwordButton" class="btn">{{ languages.text107 }}</u-button>
    		</view>
    		<view v-else class="touch-verify">
    			<view class="logo">
    				<image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAilBMVEUAAACLmraEl7WHm7GEmLOEl7KDmLKDl7KEl7KEmLKFmLOEmLOEmbKEmrKEmLKEmLKEmLOGmbSGmrSEmLGDl7KEmLKFmbKEmbOFmbODl7KEmLKEmLKDmLOEmLKEmLOGmrSEmLKDmLKFmLODl7KEmLKFmLOEmLGEmLOEmLOEmLKEmLOEmLKFmLKDl7FBEcR1AAAALXRSTlMABhALSvro9+1SNKkuG/HMlSAW4LZCfWxj17uvg1xOKNuHddGjV+Ryv50+w5Al6cn+AAACy0lEQVQ4y7VV2YKiQAzs5mzkvgZBEFC8rf//vU16ZlVmdNaXrQeVdJFUKgHFE0gN8QYeSO/w07NFOKf/ZpZJkdsg2HmRlL8xs6rGDHWVveJWuc64qjxCtdIVhuopNTjyWRJI+deTRTIAaIInYiNAbbKbd5+6NgqIfkjvbKAI6YdZdskxjo9JV5p0GRaA3c25O+J+SErVxrghbqmQ/ABcb2ZDpG83KgcEFTdNrEBwKkOIpY3o0RTDwVKIPubzxAoMigRW4nD2nthwKHJHSDGLDvcH8x40D3vAsSgLNzOX7QITR6WZrq3UlJxjAtzdz/UJFLXIinaFcomiih3XpvZU8H2ljC2woaC3xQ1bjwIb+ja+JU6AhL5GbtEfq2r0ub32fvKARYSYWrsC9pgKjXS0gSu1GSNazFKfAEtwyfz8sAE5cBBiDZxmzrloaJVsOLw13uSvpjXXc+BSoIEbPihuwUPxgR2Vb6DRkJwO8HkoLP5GXiEyxEKnD2vAHQYXqENKynqNCKt7i+GAo+QEa53+0kvZX4CJ9HJJecRw13G2eR4F8lQErraFTWC9/R4rnox9vqmwgE6YNcdHbcuCvLJYKQncmizd+tIhuZgnzD03M0GxepeUKkxMdkzhPZItTXZuZH2zoa8/cJHPyAMfntiXkj2UMepMSItaS0CVPiFvhwVrthci0EkPwKgJpY3jbDNadqMOWcGGfrLSNAeuhil3Cuhm+9lIzlTyACZWyrd4NqDqPX0mzLpPcG9+tiUv7Hbm8KdY52DY7WxDN2xxoL4WYckBFCY/hb7vX3sxx5n6JqVRyEoHU8iG2Jn4BUvw1EdtQrYF9p3x+p1uOvy4GQPckpq+AKhPbWWJ52h1agtQC35vKWhsnpOzGirVxjk8sf6wjVygeq2an4kT4C61XLP3FuIVTnXPnCts9vytfzYpOoW1eBtBKcX/wVPBfwD7ulkDVNhScwAAAABJRU5ErkJggg==" style="width: 88rpx; height: 88rpx;"></image>
    			</view>
    		</view>
        <view v-if="touchId" class="changeVerifyMethod" @click="changeVerifyMethod">{{ languages.text197 }}
        </view>
    	</view>
    </u-modal>
    
    <!-- 指纹验证 -->
    <view class="toast" v-show="showToast">
    	<view class="toast-icon">
    		<image :src="toast.icon"></image>
    	</view>
    	<view class="toast-content">
    		<text>{{ toast.msg }}</text>
    	</view>
    </view>
    
	</view>
</template>

<script>
import uniImageMenu from './share.js'
import language from './language/index.js'
import languages from '@/pages/account/language/index.js'
import Submitbtn from '@/pages/account/send/components/submit-btn.vue'
import decimal from 'decimal'
import WalletCrypto from '@/utils/walletCrypto.js'
import verifyTouchID from './verifyTouchID.js'

export default {
  mixins: [verifyTouchID],
  components: {
    Submitbtn
  },
  onLoad(options) {
    if (this.touchId) this.verifyMethod = 'touchID'
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
      languages: languages[this.$cache.get('_language')],
      collectionList: [],
      modalPasswordIsShow: false,
      verifyMethod: 'password',
      touchId: this.$cache.get('_touchId'),
      passwordEye: false,
      payPassword: '', //资金密码
      passwordCheck: false, //密码校验
      showToast: false,
      toast: {
        icon: '/static/img/mine/loading.gif',
        // msg: '失败次数超出限制，请稍后再设置',
        msg: '失败次数超出限制，请切换其它方式验证'
      },
      loading: false,
      verifyTouchErrorTip: '',
      callSend: {},
      callTx: 0
    }
  },
  methods: {
    closeModalPasswordIsShow() {
      this.modalPasswordIsShow = false
      // if (this.$cache.get('_touchId')) this.verifyMethod = 'touchID'
      if (this.touchId) {
        plus.fingerprint.cancel()
      }
    },
    async passwordButton() {
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.loading = true
        this.passwordCheck = false
        // this.checkSuccess = this.sendFormData // 调用render.sendToken
        // this.modalPasswordIsShow = false
    		this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.languages.text37
        // this.toast.icon = '/static/img/mine/loading.gif'
        this.toast.icon = '/static/img/mine/success.png'
        this.modalPasswordIsShow = false
        setTimeout(() => {
          this.showToast = false
        }, 1500)
        // @todo 执行发送逻辑
        this.callTx++
      }
    },
    changeVerifyMethod() {
      this.verifyMethod == 'password' ? this.verifyMethod = 'touchID' : this.verifyMethod = 'password'
      if (this.verifyMethod == 'touchID') {
        this.verify()
      } else {
        plus.fingerprint.cancel()
      }
    },
    hideModel() {
      this.modalPasswordIsShow = false
    },
    verifyTouchIDFail() {
      this.showToast = false
    },
    verifyTouchIDOverTime() {
      this.showToast = false
    },
    verifyTouchIDSuccess() {
      this.$nextTick(() => {
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.languages.text37
        // this.toast.icon = '/static/img/mine/loading.gif'
        this.toast.icon = '/static/img/mine/success.png'
        
        this.passwordCheck = false
        this.loading = true
        setTimeout(() => {
          this.showToast = false
        }, 1500)
        // @todo 执行发送逻辑
        this.callTx++
      })
    },
    async submitAgain() {
      this.modalPasswordIsShow = true
      this.firstTime = true
      // #ifdef APP-PLUS
      if (this.touchId) {
        this.verify()
      }
      // #endif
    
      // #ifndef APP-PLUS
      this.touchId = 0
      // #endif
    
      this.pop = false
    },
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
			sendTx(val) {
        if (val == 0) return;
        console.log('执行发送');
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
  
  .modal_main {
  	width: 100%;
  
  	.modal_title {
  		font-family: PingFangSC-Medium;
  		font-weight: 600;
  		font-size: 32rpx;
  		color: #2C365A;
  		letter-spacing: 0;
  		display: flex;
  		justify-content: space-between;
  		align-items: center;
  	}
  
  	.modal_submit {
  		margin-top: 80rpx;
  	}
  }
  
  .toast {
  	position: fixed;
  	left: 50%;
  	top: 50%;
  	transform: translate(-50%, -50%) !important;
  	width: 240rpx;
  	background: rgba(0, 0, 0, .6);
  	padding: 0 20rpx 32rpx;
  	justify-content: center;
  	border-radius: 6rpx;
  	z-index: 999999999;
  
  	&-icon {
  		text-align: center;
  		margin-top: 65rpx;
  
  		image {
  			width: 65rpx;
  			height: 65rpx;
  		}
  	}
  
  	&-content {
  		margin-top: 20rpx;
  		font-weight: 400;
  		font-size: 28rpx;
  		color: #FFFFFF;
  		text-align: center;
  	}
  }
  
  .item {
  	margin-top: 64rpx;
  
  	&-input {
  
  		.u-input {
  			height: 96rpx;
  			background-color: #F2F4F8;
  			border-radius: 16rpx 0 0 16rpx;
  			padding-left: 0 !important;
  
  			/deep/ input {
  				color: #2C365A !important;
  				font-size: 28rpx !important;
  				padding-left: 32rpx;
  				line-height: 48rpx !important;
  			}
  		}
  
  		/deep/ .input-placeholder {
  			// height: 48rpx !important;
  			font-weight: 400 !important;
  			font-size: 28rpx !important;
  			// color: #8397B1 !important;
  			color: #8397B1 !important;
  			// line-height: 48rpx !important;
  		}
  
  		&-password {
  			display: flex;
  			height: 96rpx;
  			align-items: center;
  			background-color: #F2F4F8;
  			border-radius: 16rpx;
  
  			.u-icon {
  				padding-right: 36rpx;
  				border-radius: 0 16rpx 16rpx 0 !important;
  			}
  		}
  	}
  }
  
  .btn {
  	height: 96rpx;
  	margin-top: 80rpx;
  	border-radius: 16rpx;
  	background-color: #002FA7 !important;
  	font-weight: 400;
  	font-size: 32rpx;
  	color: #FCFCFD;
  }
  
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .5) !important;
    z-index: 9999;
  }
  
  // 指纹验证
  .touch-verify {
  	margin-top: 80rpx;
  
  	.logo {
  		text-align: center;
  	}
  }
  
  .changeVerifyMethod {
  	text-align: right;
  	font-family: PingFangSC-Regular;
  	font-size: 28rpx;
  	color: #1E5EFF;
  	margin-top: 20rpx;
  }
  
  .waringPrompt {
    margin-top: 8rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #EC2828;
    letter-spacing: 0;
    line-height: 24rpx;
    height: 24rpx;
  }
</style>

<script>
	import {
		isTor
	} from '@/utils/index.js'
	import {
		MINERS_GAS,
		DEFAULT_RPC
	} from '@/config/index.js'
	export default {
		data() {
			return {
				isTor: false,
				language: {
					CN: {
						text01: '请开启洋葱代理服务器'
					},
					EN: {
						text01: 'Please open onion proxy server!'
					}
				}
			}
		},
		async onLaunch() {
		// 	uni.hideTabBar()
		// 	if (!this.isTor && this.$cache.get('_currentWallet') == null) {
		// 		uni.clearStorageSync()
		// 	}
			this.$cache.get('_language') || this.$cache.set('_language', 'CN', 0)
			this.$cache.get('_addressBook') || this.$cache.set('_addressBook', [], 0)
			this.$cache.get('_touchId') || this.$cache.set('_touchId', 0, 0)
			this.$cache.get('_MINERS_GAS') || this.$cache.set('_MINERS_GAS', MINERS_GAS, 0)
			this.$cache.get('_currentRpc') || this.$cache.set('_currentRpc', DEFAULT_RPC.link, 0)
		// 	// 0 表示第一次进入
		// 	this.$cache.get('_appInit') || this.$cache.set('_appInit', 0, 0)
		// 	let _appInit = this.$cache.get('_appInit')
		// 	console.log('_appInit', _appInit);
		// 	// #ifdef APP-PLUS
		// 	// 判断是否是被洋葱代理服务代理
		// 	this.isTor = await isTor()

		// 	if (!this.isTor) {
		// 		console.log(1);
		// 		uni.showToast({
		// 			icon: 'none',
		// 			title: this.language[this.$cache.get('_language')].text01,
		// 			duration: 3000,
		// 		})
		// 		uni.reLaunch({
		// 			url: '/pages/index/index',
		// 			success: () => {
		// 				plus.navigator.closeSplashscreen()
		// 				setTimeout(() => {
		// 					plus.runtime.quit()
		// 				}, 3000)
		// 			}
		// 		})
		// 	} else if (this.$cache.get('_currentWallet') == null) {
		// 		console.log(2);
		// 		this.$cache.set('_agree_protocol', false, 0)
		// 		uni.reLaunch({
		// 			url: '/pages/index/index',
		// 			success: () => {
		// 				plus.navigator.closeSplashscreen()
		// 			}
		// 		})
		// 	} else if (_appInit == 0 && this.$cache.get('_touchId') == 1) {
		// 		console.log(3)
		// 		uni.navigateTo({
		// 			url: '/pages/mine/anquan/backgroundVerify?redirectUrl=/pages/account/index&type=reLaunch',
		// 			animationType: 'none',
		// 			success: () => {
		// 				plus.navigator.closeSplashscreen()
		// 			}
		// 		})
		// 	} else if (_appInit !== 1) {
		// 		console.log(4);
		// 		uni.reLaunch({
		// 			url: '/pages/account/index',
		// 			success: () => {
		// 				plus.navigator.closeSplashscreen()
		// 			}
		// 		})
		// 	}
		// 	// #endif

		},
		// async onShow() {
		// 	var pages = getCurrentPages();
		// 	var page = pages[pages.length - 1];
		// 	uni.hideTabBar()
		// 	// #ifdef APP-PLUS
		// 	if (this.$cache.get('_appInit') == 1) {
		// 		// const _appInit = this.$cache.get('_appInit')
		// 		// 从后台唤起
		// 		if (this.$cache.get('_touchId') == 1) {
		// 			uni.navigateTo({
		// 				url: `/pages/mine/anquan/backgroundVerify?redirectUrl=`,
		// 				animationType: 'none',
		// 				success: () => {
		// 					plus.navigator.closeSplashscreen()
		// 				}
		// 			})
		// 		} else {
		// 			console.log(page && page.route)
		// 			if (this.$cache.get('_currentWallet') !== null && !page) {
		// 				uni.reLaunch({
		// 					url: '/pages/account/index',
		// 					success: () => {
		// 						plus.navigator.closeSplashscreen()
		// 					}
		// 				})
		// 			}

		// 			this.isTor = await isTor()
		// 			if (!this.isTor) {
		// 				console.log(7);
		// 				uni.showToast({
		// 					title: this.language[this.$cache.get('_language')].text01,
		// 					icon: 'none'
		// 				})
		// 				uni.reLaunch({
		// 					url: '/pages/index/index',
		// 					success: () => {
		// 						plus.navigator.closeSplashscreen()
		// 						setTimeout(() => {
		// 							plus.runtime.quit()
		// 						}, 3000)
		// 					}
		// 				})
		// 			}
		// 		}
		// 		this.$cache.set('_appInit', 0, 0)
		// 	}
		// 	// #endif
		// },
		onHide() {
			console.log('hide')
			this.$cache.set('_appInit', 1, 0)
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
</style>

<script>
import {
  MINERS_GAS,
  DEFAULT_RPC
} from '@/config/index.js'
export default {
	data() {
		return {
			language: {
				CN: {
					// text01: '请开启洋葱代理服务器'
				},
				EN: {
					// text01: 'Please open onion proxy server!'
				}
			}
		};
	},
	async onLaunch() {
		//   clearTimeout(this.timer)
		//   this.timer = setTimeout(() => {
		// console.log('plus.navigator.hasSplashscreen();',plus.navigator.hasSplashscreen(););
		//  plus.navigator.closeSplashscreen()
		//     clearTimeout(this.timer)
		//   }, 3500)
		// #ifdef APP-PLUS
		let a = plus.navigator.hasSplashscreen();
		console.log(a, 'aaaaa');
		// #endif
		uni.hideTabBar({
			animation: false
		});
		if (this.$cache.get('_currentWallet') == null) {
			uni.clearStorageSync();
		}
		this.$cache.get('_language') || this.$cache.set('_language', 'CN', 0);
		this.$cache.get('_addressBook') || this.$cache.set('_addressBook', [], 0);
		this.$cache.get('_touchId') || this.$cache.set('_touchId', 0, 0);
		this.$cache.get('_MINERS_GAS') || this.$cache.set('_MINERS_GAS', MINERS_GAS, 0);
		this.$cache.get('_currentRpc') || this.$cache.set('_currentRpc', DEFAULT_RPC.link, 0);
		// 0 表示第一次进入
		this.$cache.set('_appInit', 0, 0);
		let _appInit = this.$cache.get('_appInit');

		// #ifdef APP-PLUS
		if (this.$cache.get('_currentWallet') == null) {
		
			this.$cache.set('_testmsg', '本地缓存没有钱包（直接进入首页）', 0);
			this.$cache.set('_agree_protocol', false, 0);
			// console.log('plus.navigator.hasSplashscreen();',plus.navigator.hasSplashscreen(););
			uni.reLaunch({
				url: '/pages/index/index',
				complete: () => {
					plus.navigator.closeSplashscreen()
				}
			});
		} else if (_appInit == 0 && this.$cache.get('_touchId') == 1) {
			// 本地缓存有钱包 且开启了指纹锁
			console.log('本地缓存有钱包 且开启了指纹锁');
			this.$cache.set('_testmsg', '本地缓存有钱包 且开启了指纹锁', 0);

			uni.navigateTo({
				url: '/pages/mine/anquan/backgroundVerify?redirectUrl=/pages/account/index&type=reLaunch',
				animationType: 'none',
				complete: () => {
					// console.log('plus.navigator.hasSplashscreen();',plus.navigator.hasSplashscreen(););
					plus.navigator.closeSplashscreen()
				}
			});
		} else if (_appInit !== 1) {
			// 本地缓存有钱包 且没有开启指纹锁
			console.log('本地缓存有钱包 且没有开启指纹锁');
			this.$cache.set('_testmsg', '本地缓存有钱包 且没有开启指纹锁', 0);
			// console.log('plus.navigator.hasSplashscreen();',plus.navigator.hasSplashscreen(););
			uni.reLaunch({
				url: '/pages/account/index',
				complete: () => {
					plus.navigator.closeSplashscreen()
				}
			});
		}
		// #endif
	},
	async onShow() {
		uni.hideTabBar({
			animation: false
		});

		// #ifdef APP-PLUS
		if (this.$cache.get('_appInit') == 1) {
			// 从后台唤起
			console.log('后台唤起');
			if (this.$cache.get('_currentWallet') == null) {
				console.log('本地缓存没有钱包（直接进入首页）');
				this.$cache.set('_testmsg', '后台唤起 本地缓存没有钱包（直接进入首页）', 0);
				// this.$cache.set('_agree_protocol', false, 0)
				// uni.reLaunch({
				//   url: '/pages/index/index',
				//   success: () => {
				//     plus.navigator.closeSplashscreen()
				//   }
				// })
			} else if (this.$cache.get('_donotVerify')) {
				console.log('本地缓存有钱包, 且开启了指纹验证（但不验证）');
				this.$cache.set('_testmsg', '后台唤起 本地缓存有钱包, 且开启了指纹验证（但不验证）', 0);
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				let curRoute = routes[routes.length - 1].route; // 获取当前页面路由，也就是最后一个打开的页面路由
				// console.log(curRoute)
				this.$cache.set('_donotVerify', false, 0);
				if (curRoute == 'pages/mine/yaoqing/index') {
				}
			} else if (this.$cache.get('_touchId') == 1) {
				console.log('本地缓存有钱包, 且开启了指纹验证（进入指纹验证页）');
				this.$cache.set('_testmsg', '后台唤起 本地缓存有钱包, 且开启了指纹验证（进入指纹验证页）', 0);
				uni.navigateTo({
					url: '/pages/mine/anquan/backgroundVerify',
					animationType: 'none',
					success: () => {
						// plus.navigator.closeSplashscreen()
					}
				});
			}
			this.$cache.set('_appInit', 0, 0);
		}
		// #endif
	},
	onHide() {
		this.$cache.set('_appInit', 1, 0);
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uview-ui/index.scss';
/deep/ .uni-body {
	// height: auto !important;
	// overflow-y: scroll;
}
</style>

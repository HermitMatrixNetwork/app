<template>
	<view class="sendPage">
		<view class="mask" v-show="transferLoading"></view>
		<custom-header :title="language.text15" :style="titleStyle">
			<template #right>
				<image src="/static/img/account/saoma.png" style="width:44rpx; height: 44rpx;" @click="scanCode">
				</image>
			</template>
		</custom-header>
		<view class="container">
			<view class="main-top">

				<view class="content">

					<!-- 代币选择 -->
					<view class="change-token" @click="jumpTokenlist">
						<image :src="token.logo"></image>
						<text>{{ token.alias_name }}</text>
						<view class="icon-right">
							<image src="/static/img/ic-arrow1.png" style="width:32rpx; height: 32rpx;"></image>
						</view>
					</view>

					<!-- 收款地址 -->
					<view class="collection-adres">
						<InputTitle :title="language.text16" :type="'text'" :placeholder="language.text17"
							:isTextarea="true" ref="addressInptval" :inputVal.sync="sendFormData.receiveAddress">
							<template #title-icon>
								<image src="/static/img/account/addressbook.png" @click="toAddressBook"
									style="width:44rpx; height: 44rpx;"></image>
							</template>
						</InputTitle>
						<text :style="{ opacity: showAddressErrorTip ? 1 : 0 }"
							class="waringPrompt">{{ language[addressError] }}</text>
					</view>

					<!-- 发送金额 -->
					<view class="send-amount">
						<view class="send-amount">
							<view class="amount">
								<view class="label">
									<text>{{ language.text18 }}</text>
									<view class="can-be-use">
										{{ language.text193 }}：
										<custom-loading v-if="loading"></custom-loading>
										<text v-else>{{ formatBalance(token.balance) || '0.000000' }}
											{{ token.alias_name }}</text>
									</view>
								</view>
								<view class="value"
									:class="{ valueError : (Number(sendFormData.sendAmount) > Number(token.balance) || showAmountErrorTip)}">
									<!-- @input="sendAmountInput" -->
									<u--input :placeholder="language.text19" type="digit"
										v-model="sendFormData.sendAmount" :formatter="formatter"></u--input>
									<view class="value-info">
										<text class="denom">{{ token.alias_name }}</text>
										<view class="border"></view>
										<text class="all" @click="testAmount">{{ language.text21 }}</text>
									</view>
								</view>
							</view>
						</view>
						<text v-if="Number(sendFormData.sendAmount) > Number(token.balance)"
							class="waringPrompt">{{ language.text194 }}</text>
						<text v-else-if="showAmountErrorTip" class="waringPrompt">{{ language.text195 }}</text>
					</view>

					<view class="send-memo">
						<InputTitle :title="'Memo'" :type="'text'" :placeholder="language.text106"
							:inputVal.sync="sendFormData.memo">
						</InputTitle>
					</view>
				</view>
			</view>

			<view class="main-bottom">
				<miners-column @getMinersCost="getMinersCost" @getMinimumGas="getMinimumGas"></miners-column>

				<view class="submit-btn" @click="transferConfirm">
					<Submitbtn :loadingIsShow="btnLoading">{{ language.text144 }}</Submitbtn>
				</view>
			</view>

			<u-popup :show="submitPopupIsShow" @close="submitPopupIsShow=false" mode="bottom" class="double-check-popup"
				:safeAreaInsetBottom="true">
				<view class="submitPopup">
					<view class="main">
						<view class="popup-title">
							{{ language.text42 }}
							<image src="/static/img/account/close.png" style="width: 32rpx; height: 32rpx;"
								@click="submitPopupIsShow=false"></image>
						</view>

						<!-- 发送账户 -->
						<view class="send-address">
							<text>{{language.text43}}</text>
							<text>{{sendFormData.userAddress}}</text>
						</view>

						<!-- 接收账户 -->
						<view class="receive_address">
							<text>{{ language.text174 }}</text>
							<text>{{sendFormData.receiveAddress}}</text>
						</view>

						<!-- 转账金额 -->
						<view class="transfer_amount">
							<text>{{ language.text45 }}</text>
							<text>{{sendFormData.sendAmount?sendFormData.sendAmount:'0'}} {{ token.alias_name }}</text>
						</view>

						<!--Memo-->
						<view class="memo_type">
							<text>Memo</text>
							<text class="memo">{{ sendFormData.memo }}</text>
						</view>

						<!--矿工费-->
						<view class="miners_fee">
							<text>{{language.text46}}</text>
							<!-- <custom-loading v-if="feeLoading"></custom-loading> -->
							<view>
								<view>{{ sendFormData.gas }} * {{ sendFormData.gasPrice }}
									ughm
								</view>
								<view class="price">
									{{ totalGas }}
									GHM
								</view>
							</view>
						</view>
					</view>
					<view class="submit-btn" @click="submitAgain"
						style="position: absolute; bottom: 64rpx; width: 622rpx;">
						<Submitbtn>{{ language.text47 }}</Submitbtn>
					</view>
				</view>
			</u-popup>

			<u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
				<view class="modal_main">
					<view class="modal_title">
						<view>
							{{ verifyMethod == 'touchID' ? language.text196 : language.text48 }}
							<text v-if="verifyMethod == 'touchID' && verifyTouchErrorTip !== ''"
								class="verifyTouchErrorTip">({{ verifyTouchErrorTip }})</text>
						</view>
						<image src="/static/img/account/close.png" style="width: 32rpx;height: 32rpx;"
							@click="closeModalPasswordIsShow"></image>
					</view>
					<!--  -->
					<view v-if="verifyMethod == 'password'">
						<view class="item">
							<view class="item-input item-input-password">
								<u-input :password="!passwordEye" v-model="payPassword" :placeholder="language.text49">
								</u-input>
								<image
									:src="passwordEye? '/static/img/password-eye-open.png' : '/static/img/password-eye-close.png'"
									@click="passwordEye = !passwordEye"
									style="width: 32rpx; height: 32rpx; margin-right: 36rpx;"></image>
							</view>
						</view>
						<text v-if="passwordCheck" class="waringPrompt">{{ language.text51 }}</text>
						<u-button @click="passwordButton" class="btn">{{ language.text107 }}</u-button>
					</view>
					<view v-else class="touch-verify">
						<view class="logo">
							<image src="/static/img/mine/zhiwen.png" style="width: 88rpx; height: 88rpx;"></image>
						</view>
					</view>
				</view>
			</u-modal>
			<view :check="checkSuccess" :change:check="render.sendToken"></view>
			<view :callSimulate="callSimulate" :change:callSimulate="render.simulateFee"></view>

			<!-- 指纹验证 -->
			<view class="toast" v-show="showToast">
				<view class="toast-icon">
					<image :src="toast.icon"></image>
				</view>
				<view class="toast-content">
					<text>{{ toast.msg }}</text>
				</view>
			</view>

			<!-- 大额提醒 -->
			<u-modal :show="aa" width="686rpx" :showConfirmButton="false" class="hintModal">
				<view class="modalContent">
					<image src="/static/img/tishi2.png" style="width: 64rpx; height: 64rpx;"></image>
					<view class="modal-title">{{ language.text172 }}</view>
					<text class="modal-content">{{ language.text219 }}</text>
					<view class="confirm-button">
						<uni-button @click="aa = false" class="cancel">{{ language.text170 }}</uni-button>
						<uni-button @click="aaConfirm" class="confirm">{{ language.text09 }}</uni-button>
					</view>
				</view>
			</u-modal>
		</view>
		<custom-notify ref="notify"></custom-notify>
	</view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
import languages from '../language/index.js'
import Submitbtn from './components/submit-btn.vue'
import decimal from 'decimal'
import {
  SendTokentoOtherAddress,
  getBalance
} from '@/utils/secretjs/SDK.js'
import mixin from '../mixins/index.js'
import verifyTouchID from '../mixins/verifyTouchID.js'
import WalletCrypto from '@/utils/walletCrypto.js'
import mainCoin from '@/config/index.js'
import {
  checkAddress
} from '@/utils/index.js'
import {
  onlyPositiveNumber
} from '@/utils/directives.js'
export default {
  mixins: [mixin, verifyTouchID],
  components: {
    InputTitle,
    Submitbtn
  },
  directives: {
    onlyPositiveNumber
  },
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      verifyMethod: 'password',
      tokenUrl: '/static/img/account/uGHM.png',
      tokenName: 'GHM',
      inputVal: '',
      payPassword: '', //资金密码
      passwordCheck: false, //密码校验
      verifyTouchErrorTip: '',
      submitPopupIsShow: false,
      modalPasswordIsShow: false,
      checkSuccess: 0,
      callSimulate: {},
      sendFormData: {
        userAddress: this.$cache.get('_currentWallet').address,
        receiveAddress: '', //接收地址
        sendAmount: '', //发送金额
        memo: '',
        token: {},
        gas: '',
        gasPrice: '',
        decimals: null
      },
      titleStyle: {
        background: '#FFFFFF'
      },
      //发送金额样式
      sendAmountStyle: {
        height: '144rpx',
        fontSize: '40rpx',
        color: '#2C365A',
        fontWeight: '500'
      },
      token: {},
      showAddressErrorTip: false,
      showAmountErrorTip: false,
      passwordEye: false,
      loading: false,
      transferLoading: false,
      // 指纹验证
      touchId: this.$cache.get('_touchId'),
      showToast: false,
      toast: {
        icon: '/static/img/mine/loading.gif',
        // msg: '失败次数超出限制，请稍后再设置',
        msg: '失败次数超出限制，请切换其它方式验证'
      },
      mainCoin,
      aa: false,
      addressError: 'text188', // text188:收款地址不能为空 ; text220: 输入地址有误，请检查后重新输入
      isCustomFess: false,
      feeLoading: true,
      btnLoading: false
    }
  },
  onLoad(options) {
    if (options.receiveAddress) {
      this.sendFormData.receiveAddress = options.receiveAddress
    }
    if (this.touchId) this.verifyMethod = 'touchID'
    if (options.tokenID) {
      this.token = this.$cache.get('_currentWallet').coinList.find(item => item.ID == options.tokenID)
    } else {
      this.token = this.$cache.get('_currentWallet').coinList[0]
    }
    this.sendFormData.decimals = this.token.decimals || 1

    this.sendFormData.token = this.token

    clearInterval(this.timer)
    if (this.token.loadingBalance) {
      this.loading = true
      this.timer = setInterval(() => {
        const latestTokenInfo = this.$cache.get('_currentWallet').coinList.find(item => item.ID == this
          .token.ID)
        this.token.balance = latestTokenInfo.balance
        if (!latestTokenInfo.loadingBalance) {
          clearInterval(this.timer)
          this.loading = false
        }
      }, 1000)
    }
  },
  methods: {
    getMinimumGas() {
      this.$cache.set('_minimumGas', 0, 0)
      const data = JSON.parse(JSON.stringify(this.sendFormData))
      this.callSimulate = {}
      this.$nextTick(() => {
        this.callSimulate = data
      })
    },
    aaConfirm() {
      this.callSimulate = JSON.parse(JSON.stringify(this.sendFormData))
      // this.submitPopupIsShow = true
      this.btnLoading = true
      this.aa = false
    },
    formatBalance(val) {
      return val && val.toFixed(6)
    },
    formatter(val) {
      // if (val.split('.'))
      let num = val.replace(/[^\d.]/g, '')

      if (num.split('.')[1] && num.split('.')[1].length > 6) {
        return `${num.split('.')[0]}.${num.split('.')[1].substr(0, 6)}`
      } else {
        return num
      }
    },
    closeModalPasswordIsShow() {
      this.modalPasswordIsShow = false
      if (this.$cache.get('_touchId')) this.verifyMethod = 'touchID'
      if (this.touchId) {
        plus.fingerprint.cancel()
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
    toAddressBook() {
      uni.navigateTo({
        url: '/pages/account/send/adres_book',
        events: {
          reciveAddress: (address) => {
            this.$refs.addressInptval.childValue = address
          }
        }
      })
    },
    hideModel() {
      this.modalPasswordIsShow = false
    },
    verifyTouchIDSuccess() {
      this.$nextTick(() => {
        // this.checkSuccess = this.sendFormData
        // this.transferLoading = true
        this.verifyTouchID = 3
        this.showToast = false
        this.modalPasswordIsShow = true
        this.verifyMethod = 'password'
        // this.toast.msg = `${this.language.text198}...`
        // this.toast.icon = '/static/img/mine/loading.gif'
        // uni.showToast({
        //   title: `${this.language.text198}...`,
        //   icon: 'loading',
        //   duration: 999999999
        // })
      })
    },
    verifyTouchIDFail() {
      this.showToast = false
    },
    verifyTouchIDOverTime() {
      this.showToast = false
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

      this.submitPopupIsShow = false
    },
    async transferConfirm() { //转账确认
      if(this.btnLoading) return
      if (this.sendFormData.gas !== '') return this.submitPopupIsShow = true
      const {
        receiveAddress,
        sendAmount,
        memo
      } = this.sendFormData

      if (receiveAddress.trim() === '') {
        this.addressError = 'text188'
        this.showAddressErrorTip = true
      } else if (!checkAddress(receiveAddress)) {
        this.addressError = 'text220'
        this.showAddressErrorTip = true
      } else if (receiveAddress == this.sendFormData.userAddress) {
        this.addressError = 'text226'
        this.showAddressErrorTip = true
      } else {
        this.showAddressErrorTip = false
      }


      if (sendAmount == '' || sendAmount <= 0) {
        this.showAmountErrorTip = true
      } else {
        this.showAmountErrorTip = false
      }

      // && this.sendFormData.sendAmount < this.token.balance   
      // console.log(this.showAddressErrorTip, this.showAmountErrorTip, this.sendFormData.sendAmount <= this.token.balance)
      if (!this.showAddressErrorTip && !this.showAmountErrorTip && this.sendFormData.sendAmount <= this.token
        .balance) {
        this.btnLoading = true
        // if(this.btnLoading) return
        const quota = this.$cache.get('_quota') //最大限额
        if (quota == null) {
          if (!this.isCustomFess) {
            this.btnLoading = true
          }
          //给callSimulate赋值调用simulateFee方法
          this.callSimulate = JSON.parse(JSON.stringify(this.sendFormData))
          console.log('callSimulate', this.callSimulate)
          // this.submitPopupIsShow = true
          return
        } else if (Number(this.sendFormData.sendAmount) > Number(quota.amount)) {
          this.aa = true
        } else {
          if (!this.isCustomFess) {
            this.btnLoading = true
          }
          this.callSimulate = JSON.parse(JSON.stringify(this.sendFormData))
          // this.submitPopupIsShow = true
        }
      }
    },
    async passwordButton() {
      const decode = WalletCrypto.decode(this.$cache.get('_currentWallet').password)
      if (this.payPassword != decode) {
        this.passwordCheck = true
      } else {
        this.passwordCheck = false
        this.checkSuccess = this.sendFormData // 调用render.sendToken
        this.modalPasswordIsShow = false
        this.transferLoading = true
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = `${this.language.text198}...`
        this.toast.icon = '/static/img/mine/loading.gif'
        // uni.showToast({
        //   title: `${this.language.text198}...`,
        //   icon: 'loading',
        //   mask: true,
        //   duration: 999999999
        // })
      }
    },
    testAmount() {
      this.sendFormData.sendAmount = this.token.balance
    },
    getMinersCost(val) {
      if (val.speed == this.language.text27) {
        // this.sendFormData.gas = val.
        this.sendFormData.gas = val.minersGas
        this.isCustomFess = true
      } else {
        this.isCustomFess = false
      }
      this.sendFormData.gasPrice = val.amount
    },
    scanCode() { //扫码
      uni.scanCode({
        onlyFromCamera: false,
        scanType: ['qrCode'],
        success: (res) => {
          this.receiveAddress = this.$refs.addressInptval.childValue = res.result
        },
      })
    },
    jumpTokenlist() { //代币选择
      uni.navigateTo({
        url: '/pages/account/send/token_list',
        events: {
          changeToken: (data) => {
            this.token = data
            this.sendFormData.token = this.token
            clearInterval(this.timer)
            if (this.token.loadingBalance) {
              this.loading = true
              this.timer = setInterval(() => {
                const latestTokenInfo = this.$cache.get('_currentWallet').coinList
                  .find(item => item.ID ==
											this.token.ID)
                this.token.balance = latestTokenInfo.balance
                if (!latestTokenInfo.loadingBalance) {
                  clearInterval(this.timer)
                  this.loading = false
                }
              }, 1000)
            }
          }
        }
      })
    },
    dealSuccessJump({
      res: result,
      otherToken
    }) {
      this.transferLoading = false
      this.checkSuccess = 0
      let fee, usedAmount
      if (!otherToken && result.tx) {
        fee = result.tx.authInfo.fee.amount[0].amount / (this.token.decimals || 1)
        usedAmount = this.sendFormData.sendAmount
      }
      uni.hideToast()
      const eventChannel = this.getOpenerEventChannel()
      if (result.code == 0) {
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text185
        this.toast.icon = '/static/img/mine/success.png'
        setTimeout(() => {
          this.showToast = false
          uni.redirectTo({
            url: `./transactionDetails?data=${JSON.stringify(result)}`
          })
          eventChannel.emit('addRecordToSendList', result)
        }, 1500)

        !otherToken && fee && (this.token.balance = this.token.balance - fee - usedAmount)
      } else {
        this.verifyTouchID = 3
        this.showToast = true
        this.toast.msg = this.language.text182
        this.toast.icon = '/static/img/mine/fail.png'
        setTimeout(() => {
          this.showToast = false
        }, 3000)
        // uni.showToast({
        //   title: this.language.text182,
        //   image: '/static/img/mine/fail.png',
        //   mask: true,
        //   duration: 3000
        // })
        !otherToken && fee && (this.token.balance = this.token.balance - fee)
      }

      const wallet = this.$cache.get('_currentWallet')

      const tokenList = wallet.coinList

      const tokenIndex = tokenList.findIndex(item => item.alias_name == this.token.alias_name)

      tokenList.splice(tokenIndex, 1, this.token)

      wallet.coinList = tokenList

      this.$cache.set('_currentWallet', wallet, 0)

      this.updateWalletList(wallet)

      this.checkSuccess = 0
    },
    updateWalletList(wallet) {
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1)
      }
      walletList.unshift(wallet)
      this.$cache.set('_walletList', walletList, 0)
      return true
    },
    handlerGas(res) {
      // this.feeLoading = false
      this.btnLoading = false
      this.submitPopupIsShow = true
      if (!res.code) {
        this.$cache.set('_minimumGas', res, 0)
      }
      if (res.code || this.isCustomFess) return
      this.sendFormData.gas = res
    },
    gasError(e) {
      // console.log(res)
      this.$refs.notify.show('', e===0?'地址有误':this.language.text229)
      this.btnLoading = false
      this.sendFormData.sendAmount = ''
    }
  },
  computed: {
    totalGas() {
      return new decimal(this.sendFormData.gas + '').mul(new decimal(this.sendFormData.gasPrice)).div(
        new decimal(this.mainCoin.decimals)).toString()
    }
  },
  watch: {
    modalPasswordIsShow: {
      handler(val) {
        if (!val) {
          this.passwordCheck = false
          this.payPassword = ''
        }
      }
    },
    'sendFormData.receiveAddress':{
      handler(val){
        this.sendFormData.gas = ''
        this.callSimulate = {}
      }
    },
    'sendFormData.sendAmount':{
		  handler(val){
        this.sendFormData.gas = ''
        this.callSimulate = {}
		  }
    }
  }
}
</script>
<script lang="renderjs" module="render">
	import {
		SendTokentoOtherAddress,
		getBalance,
		transferOtherToken,
		getOtherTransationHistory,
		getSecret
	} from '@/utils/secretjs/SDK.js'
	import decimal from 'decimal'
	import secretjs from '@/utils/secretjs/index.js'
	import WalletCrypto from '@/utils/walletCrypto.js'
	import renderUtils from '@/utils/render.base.js'
	import mainCoin from '@/config/index.js'
	export default {
		methods: {
			async sendToken(newValue) {
				if (newValue == 0) return
				let res = {}
				let otherToken = false
				let {
					receiveAddress,
					userAddress,
					sendAmount,
					memo,
					gas,
					gasPrice,
					decimals
				} = newValue
				// let totalGas = new decimal(gas + '').mul(new decimal(gasPrice)).toString()
				if (newValue.token.alias_name == mainCoin.alias_name) {
					sendAmount = sendAmount * mainCoin.decimals
					try {
						res = await SendTokentoOtherAddress(userAddress, receiveAddress, sendAmount, memo, gas,
							gasPrice)
					} catch (e) {
						console.log(e);
						res.code = 7
					}
				} else {
					try {
						otherToken = true
						const result = await transferOtherToken({
							sender: userAddress,
							contractAddress: newValue.token.contract_address,
							codeHash: newValue.token.codeHash,
							msg: {
								transfer: {
									recipient: receiveAddress,
									amount: sendAmount * newValue.token.decimals + ''
								}
							}
						}, newValue.memo, gas, gasPrice)
						if (result.code !== 0) throw result
						res = (await getOtherTransationHistory({
							contract: {
								address: newValue.token.contract_address,
								codeHash: newValue.token.codeHash
							},
							address: userAddress,
							auth: {
								key: newValue.token.view_key
							}
						}, {
							page_size: 1,
							page: 1
						}, newValue.token)).transaction_history.txs[0]
						console.log('record', res)
						for (let val of Object.values(res.action)) {
							res.to_address = val.recipient
							res.from_address = val.from
							res.sender = val.sender
						}
						res.type = res.to_address == userAddress ? 'recipient' : 'transfer'

						res.amount = res.coins.amount / newValue.token.decimals + newValue.token.alias_name
						res.timestamp = new Date(res.block_time * 1000).toLocaleString()
						res.code = 0
					} catch (e) {
						console.log(e);
						res.code = 7
					}
				}
				renderUtils.runMethod(this._$id, 'dealSuccessJump', {
					res,
					otherToken
				}, this)

			},
			async simulateFee(val) {
				if (!val.sendAmount || Number(val.sendAmount) == '') return
				const Secret = await getSecret()
				let res = {}
				let {
					receiveAddress,
					userAddress,
					sendAmount,
					memo,
					gas,
					decimals
				} = val
				try {
					const msgSend = new secretjs.MsgSend({
						amount: [{
							amount: sendAmount * val.token.decimals + '',
							denom: 'ughm'
						}],
						fromAddress: userAddress,
						toAddress: receiveAddress
					})
					res = await Secret.tx.simulate([msgSend], {
						feeDenom: 'ughm',
					})
					let gas = Math.ceil(res.gasInfo.gasUsed * 1.15)
					renderUtils.runMethod(this._$id, 'handlerGas', gas, this)

				} catch (e) {
					console.log('e', e.message); // @todo out of gas
					res.code = 7
					let msg = e.message
					let error = ''
					if(msg.includes('decoding bech32 failed')){
						error = 0
					}else{
						error = 1
					}
					renderUtils.runMethod(this._$id, 'gasError', error, this) //错误调用gasError方法
				}
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
		background: rgba(0, 0, 0, .5) !important;
		z-index: 9999;
	}

	.sendPage {
		width: 100%;
		height: 100%;
		background: #F4F6FA;
		padding-top: calc(112rpx + var(--status-bar-height));
	}

	.main-top {
		background: #FFFFFF;
		padding-top: 48rpx;
		padding-bottom: 48rpx;
		width: 100%;

		.content {
			margin: 0 32rpx;
		}

		.change-token {
			background: #FFFFFF;
			border: 2rpx solid rgba(131, 151, 177, 0.16);
			border-radius: 16rpx;
			height: 112rpx;
			display: flex;
			align-items: center;
			position: relative;
			margin-bottom: 40rpx;

			&>image {
				width: 56rpx;
				height: 56rpx;
				margin-left: 32rpx;
				margin-right: 12rpx;
			}

			&>text {
				font-size: 32rpx;
				color: #2C365A;
				font-family: PingFangSC-Medium;
				font-weight: 600;
			}

			.icon-right {
				position: absolute;
				right: 20rpx;
			}
		}

		//收款地址
		.collection-adres {
			width: 100%;
			// height: 156rpx;
		}

		//发送金额
		.send-amount {
			margin-top: 52rpx;
			position: relative;

			.balance {
				font-family: PingFangSC-Regular;
				font-weight: 400;
				font-size: 24rpx;
				color: #8397B1;
				letter-spacing: 0;
				text-align: right;
				line-height: 24rpx;
			}

			.choose-num {
				position: absolute;
				top: 50%;
				right: 32rpx;
				transform: translateY(20%);
				font-weight: 600;
				font-size: 28rpx;
				color: #2C365A;
				width: 172rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				text:nth-child(2) {}

				text:nth-child(3) {
					color: #1E5EFF;
				}

			}

		}

		.send-memo {
			margin-top: 80rpx;
		}
	}


	.main-bottom {
		width: 100%;
		background: #F4F6FA;

		.submit-btn {
			margin: 96rpx 32rpx 48rpx;
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


	.submit-btn {
		margin: 0 64rpx;
		// position: relative;
		// top: 116rpx;
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

	.waringPrompt {
		margin-top: 8rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #EC2828;
		letter-spacing: 0;
	}

	/deep/ .u-popup__content {
		border-top-right-radius: 16rpx;
		border-top-left-radius: 16rpx;

		.u-modal__content {
			padding: 48rpx 32rpx !important;
		}
	}

	.send-amount {
		margin-top: 32rpx;
		position: relative;

		.balance {
			font-weight: 400;
			font-size: 24rpx;
			color: #8397B1;
			letter-spacing: 0;
			text-align: right;
			line-height: 24rpx;
		}

		.choose-num {
			font-size: 28rpx;
			background-color: #F2F4F8;
			color: #2C365A;



		}

	}

	.amount {

		.label {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 24rpx;

			text {
				font-weight: 600;
				font-size: 28rpx;
				color: #2C365A;
			}

			.can-be-use {
				display: flex;
				align-items: center;
				font-weight: 400;
				font-size: 24rpx;
				color: #8397B1;

				text {
					font-weight: 400;
					font-size: 24rpx;
					color: #8397B1;
				}
			}
		}

		.value {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 144rpx;
			background-color: #F2F4F8;
			padding: 0 32rpx;
			border-radius: 16rpx;
			border: 4rpx solid transparent;

			/deep/ .u-input {
				color: #2C365A;
				padding: 0 !important;

				.uni-input-input {
					font-size: 40rpx;
					font-weight: 600;
				}

				.input-placeholder {
					font-size: 28rpx;
					color: #8397B1 !important;
					font-weight: 400;
				}
			}

			.value-info {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.border {
					height: 24rpx;
					width: 2rpx;
					background-color: #8397B1;
					opacity: .4;
					margin: 0 23rpx;
				}

				text {
					font-size: 28rpx;
					line-height: 28rpx;
				}

				.denom {
					font-weight: 600;
					color: #2C365A;
				}

				.all {
					color: #1E5EFF;
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

	.verifyTouchErrorTip {
		color: red;
		font-size: 24rpx;
	}

	.valueError {
		border: 4rpx solid #EC2828 !important;
		background-color: rgba(236, 40, 40, 0.06) !important;

		/deep/ .u-input__content__field-wrapper__field {
			color: #EC2828 !important;
		}
	}

	/deep/ .hintModal {

		.u-modal__content {
			padding: 32rpx;
			padding-top: 48rpx !important;
		}

		.modalContent {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.modal-title {
				font-size: 32rpx;
				color: #2c365a;
				font-weight: 600;
				line-height: 32rpx;
				margin-top: 32rpx;
			}

			.modal-content {
				font-size: 28rpx;
				color: #8397b1;
				line-height: 42rpx;
				margin-top: 32rpx;
				margin-bottom: 48rpx;
			}

			.confirm-button {
				display: flex;
				width: 100%;
				justify-content: space-between;

				uni-button {
					width: 292rpx;
					height: 96rpx;
					font-weight: 400;
					font-size: 32rpx;
					line-height: 96rpx;
					color: #FCFCFD;
					border-radius: 16rpx;
				}

				.confirm {
					background-color: #002FA7;
				}

				.cancel {
					color: #8397B1;
					background-color: rgba(0, 47, 167, 0.00);
					border: 1px solid rgba(131, 151, 177, 0.30);

					&:after {
						border: 0 !important
					}
				}
			}
		}
	}

	.container {
		height: calc(100vh - 112rpx - var(--status-bar-height));
		// height: 100vh;
		overflow-y: scroll;
	}
</style>

<template>
  <view class="page-wrapper">
    <view class="mask" v-show="loading"></view>
    <view :callSimulateFee="callSimulateFee" :change:callSimulateFee="render.simulateFee"></view>
    <view :callSend="callSend" :change:callSend="render.send"></view>
    <custom-notify ref="notify" style="z-index: 99"></custom-notify>
    <custom-header :title="language.text15" :customStyle="{ 'z-index': 98 }">
      <template #right>
        <!-- <image src="/static/img/account/saoma.png" style="width:44rpx; height: 44rpx;" @click="scanCode"> -->
        <image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsBAMAAADsqkcyAAAAIVBMVEUAAACEmLKEmLKEmLKEmLKGmrKEmrOInrSFmbKDmLOEl7Iuf7PGAAAAC3RSTlMAn1mlS0RbBpglhaOo7aEAAACASURBVCjPYyAVTFFSUkotgLDZw4AcTxCLRVhQUFDYASLMYgjkGII4EzvQhTskgSznLnRDVpgAWYpCKDaBRQZGOFEMRQwmEmyKIgYTKXFHFUSI0B+UJikhAbVwmDsFUYApXmFMQwYC4AhYHNGAI9IGVarCluxxZBIcWQpHBiQRAACNgim1+covDwAAAABJRU5ErkJggg=="
          style="width:44rpx; height: 44rpx;" @click="scanCode">
        </image>
      </template>
    </custom-header>
    <view class="main">
      <view class="receive-address">
        <view class="name-icon">
          <text>{{ language.text272 }}</text>
          <image
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAOVBMVEUAAACEmbKGl7GEmLKFmbSEmLOJnbWGmbSEmbSEmLKEmLOEl7KFmLOFmbKDmLOEmLGEmLKFmbWFmbJIAxtDAAAAE3RSTlMAojqbQY8LGDJriIBQWS2VdCRlwQkDFwAAAV5JREFUOMu1lcGWgyAMRX0EkADC0P//2MnUVrSUzKKnd+GG64MTY1i+zlrMlLJeVXZQcHzSi6g6rhy5DpSyNRNsTgT3zGYQ+0XBM4GP4CSuaqdndAHyy9q6vrydgf3UAbDnBcMpxsRmOWGBsC8Cp4X1h3CHfvaNuzPILYIoMkcixKbLXtx03zAksb0qb7L7w/Bynk2TvevV/yup84ps9rC+jVHkDApdDoSsyBtq63Kr2D5P1s/8eTUkDL3OwPbfF0QKovuQoH9BoTkQJeZEBDf0xth1eKB0XSfconPxJjXU5I738lBkjc9lH4y9YIKfyI0rDVRu72RbIVxVCNWOcgYhbfaFLYGQr7JdjORkvwz4TCSeFbkPmQiyy1ssIfYhU4AcAF4msIgZKMdgvAFhJgfglo4+Z9RKcZ3Ja6RK4P5LVHLZTMiOqgSfrgkiTCGCK+PoHOkDteObdrU1v3yZX4MfDRW7cqiQAAAAAElFTkSuQmCC"
            style="width:44rpx; height: 44rpx;" mode="" @click="toAddressBook"></image>
        </view>
        <view class="input-box">
          <u--textarea v-model="sendFormData.receiveAddress" class='textarea' :placeholder="language.text273" autoHeight>
          </u--textarea>
        </view>
      </view>

      <view class="nft-card">
        <view class="title">
          {{ language.text03 }}
        </view>
        <view class="card-msg">
          <view class="icon">
            <image :src="token.logo" mode=""></image>
          </view>
          <view class="words">
            <view>{{ NFT.full_name }}</view>
            <view>#{{ token.id }}</view>
          </view>
        </view>
      </view>

      <!-- 矿工费 -->
      <miners-column ref="miners" @getMinersCost="getMinersCost" @getMinimumGas="getMinimumGas"></miners-column>

      <!-- 按钮 -->
      <view class="send-btn">
        <u-button @click="transfer" type="primary" color="#002FA7" :customStyle="{borderRadius:'16rpx'}">
          <text v-if="!simulating">{{ language.text15 }}</text>
          <custom-loading v-else></custom-loading>
        </u-button>
      </view>

      <!-- 弹窗 -->
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
              <text>{{ language.text43 }}</text>
              <text>{{ sendFormData.userAddress }}</text>
            </view>

            <!-- 调用合约 -->
            <view class="receive_address">
              <text>{{ language.text274 }}</text>
              <text>{{ sendFormData.token.contract_address }}</text>
            </view>

            <!-- 发送内容 -->
            <view class="send-address send-nftmsg">
              <text>{{ language.text275 }}</text>
              <image :src="token.logo" mode=""></image>
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
          <view class="submit-btn" @click="submitAgain" style="position: absolute; bottom: 64rpx; width: 622rpx;">
            <u-button color="#002FA8" :text="language.text47"></u-button>
          </view>
        </view>
      </u-popup>

      <!-- 密码 -->
      <u-modal :show="modalPasswordIsShow" :showConfirmButton="false">
      	<view class="modal_main">
      		<view class="modal_title">
      			<view>
      				{{ verifyMethod == 'touchID' ? language.text196 : language.text48 }}
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
      				<image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAilBMVEUAAACLmraEl7WHm7GEmLOEl7KDmLKDl7KEl7KEmLKFmLOEmLOEmbKEmrKEmLKEmLKEmLOGmbSGmrSEmLGDl7KEmLKFmbKEmbOFmbODl7KEmLKEmLKDmLOEmLKEmLOGmrSEmLKDmLKFmLODl7KEmLKFmLOEmLGEmLOEmLOEmLKEmLOEmLKFmLKDl7FBEcR1AAAALXRSTlMABhALSvro9+1SNKkuG/HMlSAW4LZCfWxj17uvg1xOKNuHddGjV+Ryv50+w5Al6cn+AAACy0lEQVQ4y7VV2YKiQAzs5mzkvgZBEFC8rf//vU16ZlVmdNaXrQeVdJFUKgHFE0gN8QYeSO/w07NFOKf/ZpZJkdsg2HmRlL8xs6rGDHWVveJWuc64qjxCtdIVhuopNTjyWRJI+deTRTIAaIInYiNAbbKbd5+6NgqIfkjvbKAI6YdZdskxjo9JV5p0GRaA3c25O+J+SErVxrghbqmQ/ABcb2ZDpG83KgcEFTdNrEBwKkOIpY3o0RTDwVKIPubzxAoMigRW4nD2nthwKHJHSDGLDvcH8x40D3vAsSgLNzOX7QITR6WZrq3UlJxjAtzdz/UJFLXIinaFcomiih3XpvZU8H2ljC2woaC3xQ1bjwIb+ja+JU6AhL5GbtEfq2r0ub32fvKARYSYWrsC9pgKjXS0gSu1GSNazFKfAEtwyfz8sAE5cBBiDZxmzrloaJVsOLw13uSvpjXXc+BSoIEbPihuwUPxgR2Vb6DRkJwO8HkoLP5GXiEyxEKnD2vAHQYXqENKynqNCKt7i+GAo+QEa53+0kvZX4CJ9HJJecRw13G2eR4F8lQErraFTWC9/R4rnox9vqmwgE6YNcdHbcuCvLJYKQncmizd+tIhuZgnzD03M0GxepeUKkxMdkzhPZItTXZuZH2zoa8/cJHPyAMfntiXkj2UMepMSItaS0CVPiFvhwVrthci0EkPwKgJpY3jbDNadqMOWcGGfrLSNAeuhil3Cuhm+9lIzlTyACZWyrd4NqDqPX0mzLpPcG9+tiUv7Hbm8KdY52DY7WxDN2xxoL4WYckBFCY/hb7vX3sxx5n6JqVRyEoHU8iG2Jn4BUvw1EdtQrYF9p3x+p1uOvy4GQPckpq+AKhPbWWJ52h1agtQC35vKWhsnpOzGirVxjk8sf6wjVygeq2an4kT4C61XLP3FuIVTnXPnCts9vytfzYpOoW1eBtBKcX/wVPBfwD7ulkDVNhScwAAAABJRU5ErkJggg==" style="width: 88rpx; height: 88rpx;"></image>
      			</view>
      		</view>
          <view v-if="touchId" class="changeVerifyMethod" @click="changeVerifyMethod">{{ language.text197 }}
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
  </view>
</template>

<script>
import languages from './language/index.js'
import decimal from 'decimal'
import mainCoin from '@/config/index.js'
import WalletCrypto from '@/utils/walletCrypto.js'
import verifyTouchID from './mixins/verifyTouchID.js'
export default {
  mixins: [verifyTouchID],
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      callSimulateFee: {},
      sendFormData: {
        userAddress: this.$cache.get('_currentWallet').address,
        receiveAddress: '', //接收地址
        sendAmount: '', //发送金额
        memo: '',
        token: {},
        gas: '',
        gasPrice: '',
        decimals: null,
        id: null,
      },
      submitPopupIsShow: false,
      modalPasswordIsShow: false,
      NFT: {},
      token: {},
      simulating: false,
      mainCoin,
      isCustomFess: false,
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
      callSend: {}
    }
  },
  onLoad(options) {
    if (this.touchId) this.verifyMethod = 'touchID'
    this.NFT = this.$cache.get('_currentWallet').coinList.find(item => item.symbol == options.symbol)
    this.NFT.tokenList && (this.token = this.NFT.tokenList.find(item => item.id == options.id))
    this.sendFormData.decimals = this.NFT.decimals || 1
    this.sendFormData.id = this.token.id
    this.sendFormData.token = this.NFT
  },
  methods: {
    scanCode() { //扫码
      this.$cache.set('_donotVerify', true, 0)
      var mpaasScanModule = uni.requireNativePlugin('Mpaas-Scan-Module')
      mpaasScanModule.mpaasScan({
        // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
        'scanType': ['qrCode'],
        // 是否隐藏相册，默认false不隐藏
        'hideAlbum': false
      },
      (ret) => {
        if (ret.resp_code == 1000) {
          this.sendFormData.receiveAddress = ret.resp_result
        }
      })
    },
    getMinimumGas() {
      this.$cache.set('_minimumGas', 0, 0)
      const data = JSON.parse(JSON.stringify(this.sendFormData))
      this.callSimulateFee = {}
      this.$nextTick(() => {
        this.callSimulateFee = data
      })
    },
    toAddressBook() {
      uni.navigateTo({
        url: '/pages/account/send/adres_book',
        events: {
          reciveAddress: (address) => {
            this.sendFormData.receiveAddress = address
          }
        }
      })
    },
    getMinersCost(val) {
      console.log('油费', val)
      this.sendFormData.gas = ''
      this.callSimulateFee = {}
      if (val.speed == this.language.text27) {
        // this.sendFormData.gas = val.
        this.sendFormData.gas = val.minersGas
        this.isCustomFess = true
      } else {
        this.isCustomFess = false
      }
      this.sendFormData.gasPrice = val.amount
    },
    submitAgain() {
      console.log('transfer')
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
    transfer() {
      if (this.simulating) return
      if (this.sendFormData.receiveAddress.trim() == '') {
        this.$refs.notify.show('', this.language.text188)
      } else if (this.isCustomFess) {
        this.submitPopupIsShow = true
      } else {
        this.simulating = true
        const data = JSON.parse(JSON.stringify(this.sendFormData))
        this.callSimulateFee = {}
        this.$nextTick(() => {
          this.callSimulateFee = data
        })
      }
    },
    handlerGas(res) {
      if (res.code) {  
      } else {
        this.simulating && ( this.submitPopupIsShow = true )
        this.$cache.set('_minimumGas', res, 0)
        this.sendFormData.gas = res
      }
      
      this.simulating = false
    },
    gasError(e) {
      // console.log(res)
      this.$refs.notify.show('', e===0 ? this.language.text238 : this.language.text237)
      this.simulating = false
    },
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
        this.toast.msg = this.language.text198 + '...'
        this.toast.icon = '/static/img/mine/loading.gif'
        this.modalPasswordIsShow = false
        // @todo 执行发送逻辑
        this.callSend = JSON.parse(JSON.stringify(this.sendFormData))
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
        this.toast.msg = this.language.text198 + '...'
        this.toast.icon = '/static/img/mine/loading.gif'
        this.passwordCheck = false
        this.loading = true

        // @todo 执行发送逻辑
        this.callSend = JSON.parse(JSON.stringify(this.sendFormData))
      })
    },
    handlerSend(res) {
      if (res.code == 7) {
        this.toast.msg = this.language.text186
        this.toast.icon = '/static/img/mine/fail.png'
        setTimeout(() => {
          this.showToast = false
        }, 1500)
      } else {
        this.toast.msg = this.language.text185
        this.toast.icon = '/static/img/mine/success.png'
        this.NFT.tokenList = this.NFT.tokenList.filter(item => {
          return Number(item.id) !== Number(this.sendFormData.id)
        })
        const wallet = this.$cache.get('_currentWallet')
        const coinList = wallet.coinList
        let coinIndex = coinList.findIndex(item => item.alias_name == this.NFT.symbol)
        coinList.splice(coinIndex, 1, this.NFT)
        wallet.coinList = coinList
        this.$cache.set('_currentWallet', wallet, 0)
        this.updateWalletList(wallet)
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/account/send/transactionDetails?data=${JSON.stringify(res)}&from=NFT`
          })
        }, 1500)
      }
    },
    updateWalletList (wallet) {
      const walletList = this.$cache.get('_walletList') || []
      if (!wallet) return false
      const walletIndex = walletList.findIndex(item => item.address === wallet.address)
      if (walletIndex > -1) {
        walletList.splice(walletIndex, 1, wallet)
      } else {
        walletList.unshift(wallet)
      }
      this.$cache.set('_walletList', walletList, 0)
      return true
    },
  },
  computed: {
    totalGas() {
      return new decimal(this.sendFormData.gas + '').mul(new decimal(this.sendFormData.gasPrice)).div(
        new decimal(this.mainCoin.decimals)).toString()
    }
  },


}
</script>

<script lang="renderjs" module="render">
  import renderUtils from '@/utils/render.base.js'
  import secretjs from '@/utils/secretjs/index.js'
  import {
    getSecret,
    sendNFT
  } from '@/utils/secretjs/SDK.js'
  export default {
    methods: {
      async simulateFee(val) {
        if (!val.token) return;
        let res = {}
        try {
          const Secret = await getSecret()
          console.log({
            sender: val.userAddress,
            contractAddress: val.token.contract_address,
            msg: {
              send_nft: {
                contract: val.token.contract_address
              },
              token_id: val.id
            }
          })
          let codeHash = val.token.codeHash
          
          if (!val.token.codeHash) {
            codeHash = await Secret.query.snip721.contractCodeHash(val.token.contract_address)
          }
    
          const msgExecuteContract = new secretjs.MsgExecuteContract({
            sender: val.userAddress,
            contractAddress: val.token.contract_address,
            codeHash,
            msg: {
              send_nft: {
                contract: val.token.contract_address,
                token_id: val.id
              },
            }
          })
          res = await Secret.tx.simulate([msgExecuteContract], {
            feeDenom: 'ughm',
          })
          let gas = Math.ceil(res.gasInfo.gasUsed * 1.15)
          renderUtils.runMethod(this._$id, 'handlerGas', gas, this)
        } catch (e) {
          console.log('e111', e.message);
          res.code = 7
        	 let msg = e.message
          let error = ''
          if (msg.includes('decoding bech32 failed')) {
            error = 0
          } else {
            error = 1
          }
          renderUtils.runMethod(this._$id, 'gasError', error, this) //错误调用gasError方法
        }
      },
      async send(val) {
        if (!val.token) return
        let res = {}
        try {
         res = await sendNFT(val)
         console.log(res);
         renderUtils.runMethod(this._$id, 'handlerSend', res, this) //错误调用gasError方法
        } catch (e) {
          console.log('e2222', e);
          res.code = 7
          renderUtils.runMethod(this._$id, 'handlerSend', res, this) //错误调用gasError方法
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-wrapper {
    padding-top: calc(112rpx + var(--status-bar-height));
    height: 100vh;
  }

  .main {
    background: #F4F6FA;
    // padding-top: 112rpx;
    width: 100%;
    height: 100vh;

    .receive-address {
      background: #FFF;
      padding: 0 32rpx;
      margin-bottom: 24rpx;

      .name-icon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 32rpx 0 16rpx 0;

        >text {
          font-family: PingFangSC-Medium;
          font-weight: bold;
          font-size: 28rpx;
          color: #2C365A;
          letter-spacing: 0;
          line-height: 28rpx;
        }
      }
    }
  }

  .nft-card {
    width: 100%;
    height: 228rpx;
    background: #FFFFFF;

    .title {
      font-family: PingFangSC-Medium;
      font-weight: bold;
      font-size: 28rpx;
      color: #2C365A;
      line-height: 28rpx;
      padding: 32rpx;
    }

    .card-msg {
      padding: 0 32rpx;
      display: flex;
      justify-content: flex-start;

      .icon {
        margin-right: 32rpx;

        >image {
          width: 96rpx;
          height: 96rpx;
        }
      }

      .words {
        view:nth-child(1) {
          font-family: PingFangSC-S0pxibold;
          font-weight: 600;
          font-size: 32rpx;
          color: #2C365A;
          letter-spacing: 1px;
          line-height: 32rpx;
        }

        view:nth-child(2) {
          margin-top: 36rpx;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 24rpx;
          color: #8397B1;
          letter-spacing: 1.2px;
          line-height: 28rpx;
        }
      }
    }
  }

  .send-btn {
    position: absolute;
    width: 100%;
    padding: 0 64rpx;
    bottom: 64rpx;
  }


  .input-box {
    padding-bottom: 40rpx;
  }

  //自动换行input
  .textarea {
    /deep/ .u-textarea__field {
      line-height: 60rpx !important;
      font-size: 28rpx;
      color: #2C365A;
    }

    /deep/ .uni-textarea-wrapper {
      width: 560rpx !important;
    }
  }

  .u-textarea {
    background: #F2F4F8 !important;
    padding: 18rpx 32rpx;

    .uni-textarea-placeholder {
      color: #8397B1 !important;
      font-size: 28rpx !important;
    }
  }

  .u-textarea--radius {
    border-radius: 16rpx;
  }


  .submitPopup {
    width: 100%;
    height: 1028rpx;

    .main {
      padding: 0 32rpx;

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

      .send-nftmsg {
        align-items: flex-start;

        >image {
          width: 96rpx;
          height: 96rpx;
        }
      }

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

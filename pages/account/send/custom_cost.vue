<template>
	<view class="custom_cost">
		<custom-header :redirUrl="redirectUrl" :title="language.text173" />
		<view class="custom_main">
			<!-- Gas price -->
			<view class="gas_price">
				<InputTitle :title="'Gas Price'" :type="'number'" :placeholder="'Gas Price'" :inputVal.sync="amount"
					:warningStyleisShow="waringIsShow">
				</InputTitle>

			</view>
			<view :style="{ opacity : waringIsShow ?  1 : 0}" class="waringPrompt">{{ language.text34 }}</view>
			<!-- Gas -->
			<view class="Gas_num">
				<InputTitle :title="'Gas Limit'" :type="'number'" :placeholder="'Gas'" :inputVal.sync="minersGas">
				</InputTitle>
			</view>
		</view>
		<view class="bottom-btn">
			<view @click="submitCustom" :class="amount && minersGas?'submit-btn':'submit-btn submit-btn-grey'">
				{{ language.text144 }}
			</view>
		</view>
	</view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
import language from '../language/index.js'
export default {
  components: {
    InputTitle
  },
  data() {
    return {
      amount: '',
      minersGas: '',
      leastGas: 0.000000215,
      waringIsShow: false,
      language: language[this.$cache.get('_language')],
      redirectUrl: ''
    }
  },
  onLoad(options) {
    if (options.data) {
      const data = JSON.parse(options.data)
      this.amount = data.amount
      this.minersGas = data.minersGas
    } else {
      // this.minersGas = this.$cache.get('_MINERS_GAS')
      this.minersGas = 20000
    }
    
    if (options.redirectUrl) {
      this.redirectUrl = options.redirectUrl
    }
  },
  watch: {
    amount(val) {
      if (val && Number(val) < this.leastGas) {
        this.waringIsShow = true
      } else {
        this.waringIsShow = false
      }
    }
  },
  onShow() {
    if (this.redirectUrl) {
      this.originRedirectUrl = this.redirectUrl
      this.redirectUrl = this.originRedirectUrl + `&minusIndex=3&minusData=${JSON.stringify({
        price: '0.00',
        demon: 'ughm',
        time: '约3秒',
        amount: this.amount,
        minersGas: this.minersGas,
        speed: this.language.text27,
      })
      }`
    }
  },
  methods: {
    submitCustom() {
      if (!(this.amount && this.minersGas)) return
      this.$cache.set('_MINERS_GAS', this.minersGas, 0)
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('someEvent', {
        amount: this.amount,
        minersGas: this.minersGas
      })
      if (this.redirectUrl) {
        this.redirectUrl = this.originRedirectUrl + `&minusIndex=3&minusData=${JSON.stringify({
          price: '0.00',
          demon: 'ughm',
          time: '约3秒',
          amount: this.amount,
          minersGas: this.minersGas,
          speed: this.language.text27,
        })
        }`
        uni.redirectTo({
          url: this.redirectUrl
        })
      } else {
        uni.navigateBack()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
	.custom_cost {
		width: 100%;
		height: 100%;
		background: #FFFFFF;

		.custom_main {
			margin: 48rpx 32rpx 0;
		}
	}


	.Gas_num {
		margin-top: 32rpx;
	}

	//超出警告
	.beyondWarning {
		background: rgba(236, 40, 40, 0.06) !important;
		border: 2rpx solid #EC2828;
	}

	//提示
	.waringPrompt {
		font-weight: 400;
		font-size: 24rpx;
		color: #EC2828;
		letter-spacing: 0;
		margin-top: 10rpx;
		line-height: 30rpx;
	}

	.bottom-btn {
		position: absolute;
		bottom: 64rpx;
		width: 100%;
		height: 96rpx;

		.submit-btn {
			margin: 0 64rpx;
			height: 96rpx;
			background: #002FA7;
			border-radius: 16rpx;
			text-align: center;
			line-height: 96rpx;
			font-weight: 400;
			font-size: 32rpx;
			color: #FCFCFD;
		}

		.submit-btn-grey {
			background: #CCD5ED !important;
		}
	}
</style>

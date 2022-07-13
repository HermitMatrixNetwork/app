<template>
	<view class="custom_cost">
		<custom-header :title="'自定义'" />
		<view class="custom_main">


			<!-- Gas price -->
			<view class="gas_price">
				<InputTitle :title="'Gas Price'" :type="'number'" :placeholder="'Gas Price'" :inputVal.sync="priceValue"
					:warningStyleisShow="waringIsShow">
				</InputTitle>

			</view>
			<view v-if="waringIsShow" class="waringPrompt">Gas Price过低，将影响交易确认时间</view>
			<!-- Gas -->
			<view class="Gas_num">

				<InputTitle :title="'Gas'" :type="'number'" :placeholder="'Gas'" :inputVal.sync="numValue">
				</InputTitle>
			</view>
		</view>
		<view class="bottom-btn">
			<view @click="submitCustom" :class="priceValue&&numValue?'submit-btn':'submit-btn submit-btn-grey'">
				确认
			</view>
		</view>
	</view>
</template>

<script>
import InputTitle from './components/Input-title.vue'
export default {
  components: {
    InputTitle
  },
  data() {
    return {
      priceValue: '',
      numValue: '',
      waringIsShow: false
    }
  },
  watch: {
    'priceValue'(val) {
      if (val < 30) {
        this.waringIsShow = true
      } else {
        this.waringIsShow = false
      }
    }
  },
  onLoad() {


  },
  methods: {
    submitCustom() {
      if (!(this.priceValue && this.numValue)) return
      console.log('提交自定义')
      const eventChannel = this.$scope.eventChannel // 兼容APP-NVUE
      eventChannel.emit('someEvent', {
        price: this.priceValue,
        num: this.numValue
      })
      uni.navigateBack()
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
		line-height: 24rpx;
		height: 24rpx;
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

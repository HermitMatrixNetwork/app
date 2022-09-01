<template>
	<view class="no-data">
		<img class="no-img" src="@/static/img/account/nodata.png" alt="" />
		<view class="tip" @click="btnClick">
			<text>{{ tip || language.text01 }}</text>
			<text v-if="btnTx" class="btn">{{btnTx}}</text>
		</view>
	</view>
</template>

<script>
  import language from './language/index.js'
export default {
  props: {
    tip: {
      type: String,
      default: ''
    },
    btnTx: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      language: language[this.$cache.get('_language')]
    }
  },
  methods: {
    btnClick(){
      if(this.btnTx==''){
        return
      }
      this.$emit('btnClick')
    }
  }
}
</script>

<style lang="scss" scoped>
	.no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
		font-size: 28rpx;
		color: #8397B1;
		.no-img {
			width: 240rpx;
			margin-bottom: 32rpx;
		}
		.btn {
			color: rgba(30, 94, 255, 1);
		}
		
	}
</style>
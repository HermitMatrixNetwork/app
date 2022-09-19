<template>
	<view class="start-wrap u-flex u-row-center">
		<!-- <image class="start-img" src="/static/start2.gif" mode="aspectFill" @load="loadImage"></image> -->
    <h1>Hello World</h1>
	</view>
</template>

<script>
export default {
  data() {
    return {
				
    }
  },
  onLoad() {
    setTimeout(() => {
      plus.navigator.closeSplashscreen()
    }, 500)
  },
  mounted() {
    this.loadImage()
  },
  methods: {
    loadImage(){
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
	page{height: 100%;}
	.start-wrap,.start-img{width: 100%;height: 100%;}
</style>


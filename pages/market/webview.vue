<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="jumpUrl"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      jumpUrl: '',
      webviewStyles: {
        
      }
    }
  },
  onLoad(options) {
    this.jumpUrl = options.jumpUrl
  }
}
</script>

<style lang="scss" scoped>

</style>

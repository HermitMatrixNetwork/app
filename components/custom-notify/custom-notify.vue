<template>
  <u-notify class="notify" ref="uNotify"></u-notify>
</template>

<script>
export default {
  methods: {
    /**
       * 应用上方弹出提示
       * @param { string } type 类型 
       * @param { string } message 提示信息
       */
    show(type, message, options = {}) {
      if (!this.$refs.uNotify) return console.warn('没有注册uNotify组件')
      return this.$refs.uNotify.show({
        top: .1, // 0在H5下无效
        type: type || 'error',
        color: '#FFFFFF',
        bgColor: options.bgColor || '#EC6665',
        message: message || '信息',
        duration: 1000 * 3,
        fontSize: '28rpx', // 单位rpx
        safeAreaInsetTop: false
      })
    },
    close() {
      this.$refs.uNotify.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .u-notify {
    border-radius: 0 0 16rpx 16rpx;
    padding: 0 !important;
    
    .u-notify__warpper {
      align-items: flex-end !important;
      justify-content: flex-start;
      height: 200rpx;

      .u-notify__warpper__text {
        margin-bottom: 40rpx;
        margin-left: 40rpx;
        text-align: left;
      }
    }
  }
</style>

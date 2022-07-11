<script>
export default {
  onLaunch() {
    this.$cache.get('_language') !== null || this.$cache.set('_language', 'CN', 0)
  }
}
</script>

<style lang="scss">
  /*每个页面公共css */
  @import "@/uni_modules/uview-ui/index.scss";
</style>

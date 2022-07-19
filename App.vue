<script>
import isTor from 'is-tor'
export default {
  onLaunch() {
    this.$cache.get('_language') !== null || this.$cache.set('_language', 'CN', 0)
    uni.request({
      url:'http://pv.sohu.com/cityjson?ie=utf-8',
      method:'POST',
      success: (res) => {
        console.log('res',res)
        const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/
        let ip = reg.exec(res.data)
				   console.log('ip',ip[0])
        // let tor = isTor(ip[0])
        let tor = isTor('66.249.75.86')
        console.log('ip',tor)
        console.log('ip',isTor('176.10.99.200'))
     
      }
    })

  }
}
</script>

<style lang="scss">
  /*每个页面公共css */
  @import "@/uni_modules/uview-ui/index.scss";
</style>

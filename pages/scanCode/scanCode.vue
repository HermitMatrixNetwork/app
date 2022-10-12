<!-- <template>
  <view>
    <custom-header title="扫码">
      <template #right>
        <view @click="scanFromPic">相册</view>
      </template>
    </custom-header>
  </view>
</template>

<script>
export default {
  mounted() {
    this.scanCode()
  },
  methods: {
    scanCode() {
      const currentWebview = this.$mp.page.$getAppWebview() //注意相关操作写在APP-PLUS条件编译下
      this.barcode = plus.barcode.create('barcode', [plus.barcode.QR], {  
        top: '100px',  
        // left:'0px',  
        // width: '100vw',  
        // height: '60vh',  
        position: 'static',
      })  
      //此处未演示扫码成功回调的地址设置，实际请参考HTML5Plus API自行处理  
      //注意扫码区域需为正方形，否则影响扫码识别率  
      currentWebview.append(this.barcode) 
      var eventChannel = this.getOpenerEventChannel()
     
      this.barcode.start()
      this.barcode.onmarked = (type, code) => {
        eventChannel.emit('qrCodeResult', code)
        uni.navigateBack()
        this.barcode.close()
      }
    },
    scanFromPic() {
      let that=this
      plus.gallery.pick(function (path) {
        console.log(path)
        plus.barcode.scan(path, that.onmarked, that.onerror, [2])
      }, function (err) {
        console.log('选择相片失败: ' + JSON.stringify(err.message))
      })
    },
    // 识别成功
    onmarked(type, result) {
      console.log(type)
      var eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('qrCodeResult', result)
      uni.navigateBack()
      this.barcode.close()
    },
    // 识别失败
    onerror(err){
      this.barcode.close()
      console.log('扫码失败',JSON.stringify(err)) 
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
 -->
 
 <template>
   <view></view>
 </template>
 
<script>
export default {
  onReady() {
    this.scanCode()
  },
  mounted() {
    
  },
  methods: {
    scanCode() {
      // uni.scanCode({
      //   onlyFromCamera: false,
      //   scanType: ['qrCode'],
      //   success: (res) => {
      //     console.log(res)
      //     if (res.scanType == 'EAN_8') { }
      //     else {
               
      //     }
      //   },
      // })
    }
  }
}
</script>
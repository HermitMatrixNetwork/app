export default {
  created() {
    this.firstTime = true
  },
  methods: {
    verify() {
      console.log('star verify')

      plus.fingerprint.authenticate(res => {
        // 指纹验证中
        this.toast.msg = this.language.text87
        this.toast.icon = '/static/img/mine/loading.gif'
        this.showToast = true
        setTimeout(() => {
          // 验证成功
          this.toast.msg = this.language.text88
          this.verifyTouchID = 1
          this.toast.icon = '/static/img/mine/success.png'
          this.hideModel && this.hideModel()
        }, 1000)

      }, e => {
        console.log(e)
        if (e.code == 6) {
          plus.fingerprint.cancel()
          this.verifyTouchErrorTip = ''
          this.firstTime = false
        } else if (this.firstTime && e.code == 5 || e.code == 7) {
          // '尝试次数过多。请切换验证方式'
          this.verifyTouchErrorTip = this.language.text90
          this.verifyTouchID = 2
        } else {
          // 验证指纹中
          this.toast.msg = this.language.text87
          this.toast.icon = '/static/img/mine/loading.gif'
          this.showToast = true
          this.verifyTouchErrorTip = ''
          this.firstTime = false
        }
        setTimeout(() => {
          this.toast.icon = '/static/img/mine/fail.png'
          if (e.code !== 5 && e.code !== 7 && e.code !== 6) {
            this.verifyTouchID = 0
          }
          plus.nativeUI.closeWaiting() //兼容Android平台关闭等待框
          // 验证失败
          this.toast.msg = this.language.text89
          if (this.firstTime && e.code == 5 || e.code == 7) {
            // '尝试次数过多。请切换验证方式'
            this.verifyTouchErrorTip = this.language.text90
            this.firstTime = false
          }
        }, 1000)
      })
    }
  },
  watch: {
    showToast: {
      handler(newVal) {
        if (newVal) {
          setTimeout(() => {
            // this.showToast = false
            switch (this.verifyTouchID) {
            case 1:
              this.verifyTouchIDSuccess && this.verifyTouchIDSuccess()
              break
            case 0:
              this.verifyTouchIDFail && this.verifyTouchIDFail()
              break
            case 2:
              this.verifyTouchIDOverTime && this.verifyTouchIDOverTime()
              break
            case 3: // 啥也不做
              break
            default:
              this.verifyTouchIDFail && this.verifyTouchIDFail()
            }
          }, 3000)
        }
      }
    }
  }
}

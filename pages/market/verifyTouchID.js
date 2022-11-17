export default {
  created() {
    this.firstTime = true
  },
  methods: {
    verify() {
      try {
        console.log('star verify')
        this.verifyTouchErrorTip = ''
        plus.fingerprint.authenticate(res => {
          // 验证指纹中
          this.toast.msg = this.languages.text201 + '...'
          this.toast.icon = '/static/img/mine/loading.gif'
          this.showToast = true
          setTimeout(() => {
            // 验证成功
            // this.toast.msg = this.languages.text202
            this.toast.msg = this.languages.text37
            this.verifyTouchID = 1
            this.toast.icon = '/static/img/mine/success.png'
            this.hideModel && this.hideModel()
          }, 1000)
        
        }, e => {
          console.log(e)
          if (e.code == 6) {
            plus.fingerprint.cancel()
            this.firstTime = false
          } else if (this.firstTime && e.code == 5 || e.code == 7) {
            // '尝试次数过多。请切换验证方式'
            this.verifyTouchErrorTip = this.languages.text204
            console.log(this.verifyTouchErrorTip)
            this.verifyTouchID = 2
          } else {
            // 验证指纹中
            this.toast.msg = this.languages.text201 + '...'
            this.toast.icon = '/static/img/mine/loading.gif'
            this.showToast = true
            this.firstTime = false
          }
          setTimeout(() => {
            this.toast.icon = '/static/img/mine/fail.png'
            if (e.code !== 5 && e.code !== 7 && e.code !== 6) {
              this.verifyTouchID = 0
            }
            plus.nativeUI.closeWaiting() //兼容Android平台关闭等待框
            // 验证失败
            this.toast.msg = this.languages.text203
            if (!this.firstTime && e.code == 5 || e.code == 7) {
              this.verifyTouchErrorTip = this.languages.text204
              console.log(this.verifyTouchErrorTip)
              this.firstTime = false
            }
          }, 1000)
        })
      } catch (e) {
        console.log(e)
      }
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
            case 3:
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
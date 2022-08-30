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
          this.toast.msg = '验证指纹中'
          this.toast.icon = '/static/img/mine/loading.gif'
          this.showToast = true
          setTimeout(() => {
            this.toast.msg = '验证成功'
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
            this.verifyTouchErrorTip = '尝试次数过多。请切换验证方式'
            this.verifyTouchID = 2
          } else {
            this.toast.msg = '验证指纹中'
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
            this.toast.msg = '指纹匹配失败，请重新验证'
            if (this.firstTime && e.code == 5 || e.code == 7) {
              this.verifyTouchErrorTip = '尝试次数过多。请切换验证方式'
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
            this.showToast = false
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
            default:
              this.verifyTouchIDFail && this.verifyTouchIDFail()
            }
          }, 3000)
        }
      }
    }
  }
}

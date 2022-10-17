export default {
  methods: {
    scanCode() {
      this.$cache.set('_donotVerify', true, 0)
      var mpaasScanModule = uni.requireNativePlugin('Mpaas-Scan-Module')
      mpaasScanModule.mpaasScan({
        // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
        'scanType': ['qrCode'],
        // 是否隐藏相册，默认false不隐藏
        'hideAlbum': false
      },
      (ret) => {
        // 返回值中，resp_code 表示返回结果值，10：用户取消，11：其他错误，1000：成功
        // 返回值中，resp_message 表示返回结果信息
        // 返回值中，resp_result 表示扫码结果，只有成功才会有返回
        // console.log('扫码',ret);
        // this.$cache.set('_donotVerify', false, 0)
        if (ret.resp_code == 1000) {
          uni.navigateTo({
            url: `./send/index?receiveAddress=${ret.resp_result}`
          })
        }
      })
      // uni.scanCode({
      //   onlyFromCamera: false,
      //   scanType: ['qrCode'],
      //   success: (res) => {
      //     console.log(res)
      //     // console.log('条码类型：' + res.scanType)
      //     if (res.scanType == 'EAN_8') {
      //       uni.showToast({
      //         title: 'Error',
      //         icon : 'none'
      //       })
      //       // var filters = [plus.barcode.QR]
      //       // plus.barcode.scan(res.path, (type, result, file, charset) => {
      //       //   console.log(type)
      //       //   console.log(result)
      //       // }, (error) => { console.log(error) }, filters)
      //     } else {
      //       uni.navigateTo({
      //         url: `./send/index?receiveAddress=${res.result}`
      //       })
      //     }  
      //   },
      //   complete: (res) => {
      //     console.log('complete ')
      //     this.$cache.set('_donotVerify', false, 0)
      //     if (this.$cache.get('_touchId') == 1) {
      //       uni.navigateTo({
      //         url: '/pages/mine/anquan/backgroundVerify',
      //         animationType: 'none',
      //         success: () => {
      //           plus.navigator.closeSplashscreen()
      //         }
      //       })
      //     }
      //   }
      // })
    },
    //页面跳转
    goTo(e) {
      uni.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    toGo(url) {
      uni.navigateTo({
        url,
      })
    },
    //复制地址
    copy(data) {
      uni.setClipboardData({
        data,
        showToast: false,
        success: () => {
          this.$refs.notify.show('error', this.language.text56, {
            bgColor: '#275EF1'
          })
        },
      })
    },
    dealBtn() {
      uni.showToast({
        title: this.language.text180,
        icon: 'none',
      })
    },
    dealInputValue(string) {
      if (typeof string !== 'string') return
      let obj = {
        // '\&': {
        // 	key: /&/g,
        // 	value: '&amp'
        // },
        '\<': {
          key: /</g,
          value: '&lt'
        },
        '\>': {
          key: />/g,
          value: '&gt'
        },
        '\'': {
          key: /'/g,
          value: '&lsquo'
        },
        '\"': {
          key: /"/g,
          value: '&ldquo'
        }
      }
      // for (let i in obj) {
      // 	if (string.includes(i)) {
      // 		string = string.replace(obj[i].key, obj[i].value)
      // 	}
      // }
      string = string.replace(/[\>\<\&\'\"]/g, '')
      // console.log(string);
      return string
    }

  }
}

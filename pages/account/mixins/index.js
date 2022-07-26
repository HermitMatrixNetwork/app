export default {
  methods:{
    scanCode() {
		  uni.scanCode({
		    onlyFromCamera: false,
		    scanType: ['qrCode'],
		    success(res) {
		      // console.log('条码类型：' + res.scanType)
		      console.log('条码内容：' + res.result)
		      uni.navigateTo({
		        url:`./send/index?receiveAddress=${res.result}`
		      })
		    },
		  })
    },
    //页面跳转
    goTo(e) {
		  uni.navigateTo({
		    url: e.currentTarget.dataset.url,
		  })
    },
    toGo(url) {
      console.log(url)
		  uni.navigateTo({
		    url,
		  })
    },
    //复制地址
    copy(data) {
		  uni.setClipboardData({
		    data,
		    success: function () {
		      console.log('success')
		    },
		  })
    },
    dealBtn() {
		  uni.showToast({
		    title: '暂未开放',
		    icon: 'none',
		  })
    },
  }
}
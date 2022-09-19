export default {
  onPullDownRefresh() {
    var pages = getCurrentPages()
    var page = pages[pages.length - 1]
    // tabList: ['pages/account/index', 'pages/market/index', 'pages/delegate/index', 'pages/transaction/index', 'pages/mine/index']
    console.log(page.route, page.__page__.fullPath)
    setTimeout(function() {
      uni.stopPullDownRefresh()
    }, 1000)
  }
}
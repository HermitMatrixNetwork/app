<template>
	<view class="tabbar-container">
		<view class="tabbar-item" v-for="(item,index) in tabbarList" :class="[item.centerItem ? 'center-item' : '']"
			@click="changeItem(item)">
     <view v-if="item.centerItem" class="center">
        <image :src="require('../../static/img/tabbar/delegate.png')" style="width: 112rpx; height: 112rpx"></image>
      </view>
			<view class="item-top">
				<image :src="currentItem==item.id?item.selectIcon:item.icon"></image>
			</view>
			<view class="item-bottom" :class="[currentItem==item.id ? 'item-active' : '']">
				<text>{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import languages from './language/index.js'
export default {
  props: {
    currentPage: {
      type: Number,
      default: 0
    }
  },
  beforeCreate() {
    uni.hideTabBar()
  },
  data() {
    return {
      language: languages[this.$cache.get('_language')],
      currentItem: 0,
      tabbarList: [{
        id: 0,
        path: '/pages/account/index',
        // icon: '/static/img/tabbar/assets.png',
        // selectIcon: '/static/img/tabbar/selAssets.png',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAATlBMVEUAAADQ2uPR2+TT2+TR2+TP4+bR3OXR2+TS2ubR3OTS3ObR2+TQ2+XR2+bS2+bR2+TR2+TS2+XR2+XR2+TQ2+TQ2+TQ2+TT3ObS3OTQ2uPmA9t0AAAAGXRSTlMA+TYg8Qt25D1jGNucRiu2z02ofJfEjWtY4RwIbgAAAdBJREFUWMPtl9uWqyAMQI0EEKjgrdPm/3/0HDqdRhm1A/rY3cfGvTAJGKoPH07BCu/rHbwX9p1DtCo4pF3QBdWKPYnpCP4Hwi4xgDqzKeq7bwG94xHU9esWhaz4g4lQrVqIJX8UrXh6yLPEBEGbWoSLyc31dGnpDVtyPCbpObf4O/1tatxyOQ2Hrjyz42kWmnEeiToBaYOkWDKwBse6SWi/aIsgK8Zq9k/Vb2S3YVkmxyK8NGMlU6pqmOcOZui5RhBrrr76RY28m5LkiETzwl2my5LBccUwTKNhbjLVvAdIK29llbCuge2+GcSGIGc18FUx5ZrhWf2m/aEXeRpuER80zlC5Gng80evk7BKZGm2/Gwj2++Yd15iWKR4OxtdDseYSE+OI0PBeztJwtWsEco8jZirUPHa+188jRlxLNSG+y4WAcLiNjqAwNy4GthxYqMF7jLwVF5wrHrl3iMAMMlfzbHxZG/XiLvO3JvZn7HAgNPKAhj0w1PaIhhcUVN/UTJOnYdGRvmFgAbKGP3f5ANrk41uGtukoUABQkOlgUsSYjEmFq2nSoa0IZ08bIY8PtE6cMl73Jw37x68egOrYRQiIL0LHr2VnXRKPX1k/fDiDf7jx3WEs2aSMAAAAAElFTkSuQmCC',
        selectIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAA/FBMVEUAAAAXX9YPTcYfY94YYtskd+0leO0OTMQVWM8jceYfbeQjdu0gb+cebeMYYdgicekbZ94ea+IWW9QSVMoeauEcZ+EgcOYbZtwidOkdauAaY9kjdu4bZdwfbuQRUMgfbuQXX9YfbeQaZNskd+0ic+kdauEaYtsic+oXWtIRUscSU8skd+4PTsYVWtEQTsYfb+USUckQUccRUskldu0VWM0QTsYbZdwic+kZYtgVV84bZdsZYNYgb+Udad8ZYNckdOsVV84lee4ZYNcgbuUQTcQdZ9wXXdUYYdkSVMwUWNAcaOAWXNQPTsYjd+wfb+UaZdwRUckhc+khcegebOPSq9mTAAAAR3RSTlMA+/kHIvk2Nvk++fzknHYc8Ec5HGUO+/n5+vp0FfHbKvXd3M+3qZpMPiz58vLtz316dGRjTknj2cO5s6aVYVgu397UzLSMY28jWm0AAAMjSURBVFjD7ZfpdqIwGIaDODNaO6IiVututdXR1q123zdQXPH+72W+5KQQIpue/vRJTELy5iHA6Y+iPXt+hEK4/Pzbg+dyuODnkJL5+mt75kn7tZ5PSl6S4cksBsHYLw9IYHYydBWdgQRikPMmBikQnTlKxHw7BqvBgPvN2nnRQZOfZbOwvsI/WghWT4p5Aem8wxNlY7FVcMATi2U3nku6XhmwCo1BenxlQOGwloDs6oR/z8NVlm40SEOgLq43l8Az5A9juJAxMhnDlWv7caJGZm7MCRk8MgxoLDKkpfPMMGNEbZouJE2K1UM7RUsJ2PS2j6XUGUk3ypN8mLtRV9hXU51TDuYPaBPl3U1TLbCa4ppyMO8iRdygsTY5sHEosZr1gRl7L6MNotZtaG9ehplYeJ2bmFT/8jSq6wkhl5sU6w/dtMljWmE1E9CsaXEGViB0GH+WFMTDauxQG2duSCKkPTX+5D6xRPTSHAXQNOjXjyZNpG01i0mtgKPlu6sEQ1xkNYujhR9Hcfw8ZwkYgtSclbbUXOEN0QTnXoTdNepChcqNb+AwyikEa4/laGNBpnmNeqz6cQqack1VE48wEO/IDmi21Bx/wu5U4litNRGMTp01QqDTtK5ggF91+EYlCFtr7si7gaBwn46/qS4as7BGckGnaziYZFacNbqqQ7U2clah8oSTadstBE6jCzqFyKARBIH86Ap0NyT69FapCN9UhHvFQSOYOnw66sMVbqxX4iQrpr7iJk8i4jQ+QOL8Erljafw9XyI5DwOniehBiNynCl6nGUfGGB0X0gBkgDGvIRW5jV82UxZNkdMEQv/O6bhiL/vBZUvjR4RDZjXn4x05t2leXHPaWIPKjS1eWI1yq3kBW6GaY3bpVkEMPW1Heoilqf3bwQGbmjaNXNJ2oiQjGwMwL3m0JclCx85Boc0/bYDsyKXlDsBhOC5Dy+UUCg/MQbV6i9Ay5PAn35+GQtPg4HQfbSL2O6HgIoh2+iJyYnQBq/4qGroYIRfkAYhwzhMIgGQgI3fkUe+j1Jl60il99Eay/7+srdYfD1qtcAHt2fMT/Ac8SaAhHgZEkQAAAABJRU5ErkJggg==',
        text: languages[this.$cache.get('_language')].text01,
        centerItem: false
      }, {
        id: 1,
        path: '/pages/market/index',
        // icon: '/static/img/tabbar/market.png',
        // selectIcon: '/static/img/tabbar/selMarket.png',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAAUVBMVEWxwdAAAAD///+xwtKhys+ywdPE0dvu8fT4+fna4+nP2eOywtGyw9GzxNO0xdO8yteyw9GvwtKyw9OyxNKxxdGyw9Hi6e6wwdC0x9Wvwc+5w9UlEMU2AAAAG3RSTlOZAJmcBHSZmZmZmVxQPhGZjm5nVEcYmYA1KB4k3kXNAAABaklEQVRYw+3Y226DMAwG4DS/GxhJOEMP7/+gKyhT27lLJpxJncR/hyI++YII2+qQJX/IUCJphmjyzvbHSHrr/EQUY67uBAAKqZzclX5iJqugfhnATi8Z8gyJQ8oTZ2hgSBIa6DtDPVfSTk/PDDmoLY6jJ+YMtSk4PzJ1qzamre8MjdjKYKTAhGIE5QTGY7sC/8VQt51R6CgwtRKlDswlWgyqqomeXwIzxhgUWhcxB+PKJG5TpW+ZEzdrZWyM+ViYIsbYwHRKwqguMEdZNcf/weCdqmnmcoaYwbx8cJAypry9WJosjN6ZnVkCgwyM0bqsxExTLA+NlDF6vSc7szPrz1fA3H++VlaNJdaYsC8+NCaxyzDQ6zapKh/uH+b1RXbE2iTetJnKsKaNHbGmTdpC5m1oD17C+NzNvnz0kA9CecYy+ZAIBUd5Rlb5AN1iIOE4j/Y+zvPlAmTLhRAKqw4IVh3yxYt8DfReu61PVcIawNP8XTEAAAAASUVORK5CYII=',
        selectIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAABKVBMVEUAAAAXZOIlee8OSsMmfPEZYtoiduwWXNIcZtscaN4PTsUkeO4ZZt0dauIPTMUkee8QUMkjdOohb+YUVs0SU8sPTMMmevASU8ohcugSVcwRUsgPTsYbZt0pe/ERT8cTVMsnevENS8ImfPIofPEPS8EleOwgbuUld+8md+wqeu8STsYPT8cidOwda+L///8caN4ZY9oXX9YgcecSVcwgb+UlefAUV88QUsoXXNQOS8MbZdwVW9H1+P3k7PoHTszH2PVGfdwOWdVThd2WufCTs+sKVdMTYNsJUdBIg+LK2/cUZeAPXNlUieEYauTs8vytyPQ1b9RXjeTT4Pdzm+FqleAjbeBNf9gARcd3qPBkkd8tcd3d6PlHieoweuc6e+M4ddsgXs+80/aeuerYaFQBAAAAK3RSTlMACPzBwcH5wQ/B+IUfwYRm7Ou3t6KYl4x2dmpcQSgo9tXVwq6upJ6NVzEx3EwddAAAA9RJREFUWMPNmHl30kAQwKVqRFDQnvb0PgmQEEhorCgqtKVSsIe29fb7fwhnNrM7m4TEUP2jv02XnZ2Z31te6HuESxee3F/IYlgvFxcfXnlwZTKQeLhYLK+nu54X77UyMNO6V3yeKFlfnAmgWgowpBgnyeL6ZEvZwMJsoM0oT3hn+actY8Y0WyYAc6tFy1BMk2DGMJ/mY5bHpqFauFsOhveh4XHEkyuaBiu4OS7k/Ra0FMPv6xlaWlOdBl8N85luuXHbjBFrjucbpnH7hqa5g4dp4IWTfAEasUHQ2jDv6IcxREZN7IzAYlrrxynTYegYcshI7TZpzaeBxrK6TbMNxKRZpLmdz0Z57d3j3qy8WXmjkUJzMBiaKXkjT5q1RhPLA+A1bPl2cvJ1iPsU45BTE+M1eZ+acVTtt1+12sFXEWA8AXmvis1kqic1YDRMKaFPcu4JVDerBCz0aPgONbtD3uMSCp6QZpY1TEwTgZ2zpLlZTSHQDFIqbv53TT1p1JWGN/HimDV1Tor5+Pi4Sgzip6mTAhDTddJcr0fo7/WrtPRJU59Miqb/ffRl9L3/r5rjEX7gzgaa5nUmje/XfT7Mhy/QuL+zp2v6kVaopyZf1zD1vY+voHFrZ0+EFmn8ZKTmqm/5TFjT/4sGWq+yxvJx4GQpjYUojZWI0lhMksaaVtMlTVdE9rk1H0Ka90JjZ9PYYoiJNbZtswYGXgiuYMhAaWwmWRNwtnNmR0jX9EQoNcTpVm3/qGclapjeJE1XrLs/Dmpbtd0f7eyaNz27jUPX9N5sQfDqrUjFNNfahEiyBqOu0rRDGo1rrGGUZlvUSo3IbWfVYO1b0rQTNZCarHnZfkmwBrdYAxWswShogj+lIUNY0xGhG2i2RdBhDaNpXNEBF4yO0riuKzW9kAZSVI0ojctENU6g8TDQNQrWzE3WiDCDZo40866TqPFIIwKl4XJonSfNkus4bPLGu1B7MIZaB65T1PwmzfgAgt2xBxlHaZZAgyw7Oq53uA//fzL8OYLDjGXuCFKHYNFZll/anAifDj85Hq29n6dH4w4FHZGKsEaa/F3PwaHofO6gINjzPkOEa07peHfzpMnNeYJg2wmaFWIz0JBXSNUe3ChixfsHVvjL/i2vIvBwiHWw4G0EYy6h1C3t2WMZcucApXSf+DhTwodhViuFc0igaTX8kFhCz/SWUi7yyDrPnuyW+fij71KlsDmNZLNQWVIWJrdS2JRUSAgLFeOapoDCCr8jnY2FzSlY2LiUxIvS/WyO+6UX6T+8bKyWFh5dTuHRQml1I5f7Dz8DXXT+AESB1w0RvihYAAAAAElFTkSuQmCC',
        text: languages[this.$cache.get('_language')].text04,
        centerItem: false
      }, {
        id: 2,
        path: '/pages/delegate/index',
        // icon: '/static/img/tabbar/delegate.png',
        // selectIcon: '/static/img/tabbar/delegate.png',
        icon: 'data:image/png;base64,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',
        selectIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAAClCAMAAAAK9c3oAAAAxlBMVEUAAAAkdOQka90UVcgfZ9kfZtgeZtkdZdYWWcwWWMwhb+AibuAVV8sib+Ahb+AldOMdZtgUVckkcuIkdOQWWMsgatwXWcwkcuMbY9UbY9UYXM8XW84UVMgdZ9gUVsgVVsskceEjcuEeZtkgbd0ZXdAUVMklc+MXXNAgbd7///8UV8odZ9kaYtQjcuP3+v4pbto5d9pckeQLWdRThtx1oeYxcdnb5/m4z/KxyvHE1/Tt8/zS4febu+6MsOlml+Pl7vtDgN9TjOLPqOfJAAAAJ3RSTlMA8Av0GxQuJFpLWY5+ULd+fr3hvo1stM/PvaLs6eTcaGJHPO7gzqCCxAMTAAALN0lEQVR42syWi27aMBSGQxRAAkEqEKKdVAlaqQpyIWvVXVi7rrz/S63sOPkS20nIha5/qe3j65ffNsHrSH5wM1qE47v5srftLed343Axugl877PIH0zC+bZI83Ay+F+sEIazbbVm4YeTQrhY5lh6//75O37QcvHxpP4wBECoNCeyK8LhB4L6wWpmoODlEZgcY0Wz1QfdqP56biL2yM0K29X5uu+dW/1J7xRGzKWdUZPzcgYj1rOI4OSgwpl3dhR451KwYh3jWpd46VZvdR7OPj5acp9Lt/Cz+333B8tt11p2/Q0ajPGmO/XGQaebPdueR7Putj2Yb8+neTd2+uuzGImda7+D3S48kXF5TBjrJP6XRUnO6Wy960N2WyZnRaqoINV5JEH07yNkOpc22fVhu92eLPUKcTJ5zHIR/9IpglMimOgfpTlty4nfAjLsMRN0DkaAIIApEmrTzIiJeqHfGHIcRdnVMIEwxiNdjhgBUWJw9mACGr1r3BCzf5dbDqI8H2viOiNgj3Kbz3Mlh+mu0R0KplttJccMLziLmEkzI3Ls9KMyYY6iadAIkkkxgKmJMMqo50Fgo7MRN8EcznGSY5gFpEgMUVoiwD/izBzvmg/rO2msHiXJCbEEElIsinWxtpv9aRQlNqTzsDSN+oYmsMdEZxJKCowUiFNanU1rXCH/Th5ZEqZMSKTsjEHILk9gxmCL7vwa35M8p2RMzB6lMRVAUk2Y6858BLW+N8N0JSYhVYKXihgacqoRMQI+PA1yggegZhCUWS2xA0UVEdmKKU5OgRzMDG/YYMufapcUcTkpVbPBKd9B1jROZmSQ81TqVDB06vdRaEzxYeKZqo/mumIaotKOkiijJ7GillCl9euqQ8lAJpHRALhW1n8Go2IEMzAmH6Lyo9mfOtxifjjhkhKCkxEktgdkTFTxDpqwFjRMhCmIfvQuZlT0YA0a0KgYcnjrXN+eSAFFYvYGgASsCt0OS96MCFCKWFBmU/V+V6vkTTmIkOma7SU2uXvDRVzNiAYFV2dZPES5nYAm6zFFzl59Ld0XaFQ50Ana5ajqCxTQ3jFjUwUOylX02bRyWfn5FDhO5efTyLrgt9Hn023fejd+Rk06tlIddUwRodHVHEpJ5ZuVYea6DV78dngo0+HtW55Vv6KMmqSH0oEyf2j60yIE88ekEau33/vduzZlOnZ4fjmwevrWTGKlrFB2Yup7KACB9518dAgxsVIPz5vT9ecpM4dKi4rVsqHuEHholTKq1PKkCKtkxF/3m3r6/pA9uxEpBSQPsgLSvxbyXFeNwgBJiA+/NrX1pGdmNdyjAbfVNVs+1I7lx6ZzZHJF/Lppopese8a8kctMfg1f4JHLO1Ajqt82zfSEe8a0OTPjhPsi3XDGsRfEYGceOf7ekHL3ljs4wiN5pHQQZy1LtnyAybkcUPv4vGya6llzxJKZN4j9E2410JSL90oe5lggl5l0xpTfdpvGeoWKEjIrF5ry0uwQuUMMwMpGZtbSpT6WnNuCF7HdsmtBuTvUw/Q5lgZdhQ6bNvqtSnVvxHIwL1Rt/W5Fub+HSJLshxrJ9HfRdX3KfSvKX4BIUu7ptT6WBb15Lj6iP60od2+ulfhnJQ7mwMGD5aijy8P1YQ1JyR0Hc0Kry3boqYk37ShfWfDeQrRXnXB5qOU/PxTUry0pn0Bk8vwiSK7Plbu7RYigbKgn+9hTtGmv3ilzHlsBRSa1KHf7n7Z+PO8KKVnJccZsY9MrTq19XEB0e/nr9dEl9bKroCTLWkrKJQ8MfMdY2tyUL4+x++btCynd16eoNvBuqHXdGNrA1pRYqdx6fKmz46xt6cYb2QMgRg4vubKPBZQ/Syixzd5r8yaNvAWtxhBimJ07vv/26NThTzGl20rIjZ+YF7Z34NFGDiWYrw8OPQFpUxbuIFXEF96YwMC1y5zLFmLHZf60IEn+lkg89r7Yx5fY/u5yU+4oltRCKWjCcH+UAN1LLUUdf/GuNAL8MkVaNH+AdOJlMqNkWIjBgiC0V96lFKARFPkQ0tzJe1xmxEaZnZDmY3rpXcvmQ6a950ccDUncntIQfE5de9pITQBmtlID6kKnlLZYHZq/zJp/a+JAEECHEIP9Bf4jaMtRKMJwGqxtrtc7q+19/091leneCxPZmKwnPlKzs9Psvh2TWGrkWwgtYRATwhEscaAgTUFqOcEgxvEt3byIhRxdE5mGXtZEyEZuv+UytgGWfgYT873GVG6ZHAiJaf+n8xIL33krV4SNUro4tJuWb68xfjcs1dUNLHJcycifD+2r85br7Z+XGKt394luloczkjHT44UbKRrecqMtPP9Y+lp2YiyXuB2M/ytY245+XCdZXsoDAXSyXLZaLl7SLB8kLzuBJbw+t8z6vP2eZJlLVnYDS/hVrWJUm2WaZSZyjM+ej58xuML7WS5EZFpCL8t2Ei2nIjIqO/NyWsuRiNyUnVkkWj51s7wRkeJzr90sdZlmWenXOGEzVAnr6UKkz0WuH2mWK0VJeVFCracz+WRm3nG0vtPE/6tbjcwhyJlbCOvpmewYBQPrdRuHMEiZ+B2FDab2omFge7HeenokO4pghKnFmJkd6SrJcqulKbD/MqSbhBayI0Mo5PBkjZazdLlOu3iMsrGv64XQTkuRCRkWRz3DCKRVk76HRKF0e2uFwDwmYozrK0I3wEGkU+7r7xqtpYH4WIyCJZAkIuAq0k16Kdntn9VCLcTIFFiJazsW/Z81UIjUsn5aGteuWJanuS/d+7kNZZh4LY1rnoHRBrFaWvKp513IETsvdxvPwGSzxgKjtbSRq3WvSjIOKv6dJp5l8o9hh1rS0fnZrLdKYzArDAVy9XVs3GRLYqi6PeemQAnj5ALZVHuysmcGW3nbVtqDaSYCF5rAYlXFWT1qTy6kzuBOz5G7gelRzHPkQuT8i0kpuRmdH0Px5Hp+5NLgXk/JfLc5fMe9wAmLOY/nfCtHDobHnn3uNl9Il/D5oQAMJge6+DkT3unIIJOB7KWw32dtrh60mHAejiFJMwzCb0WqzJH2U8h+sr/NnVFrhSAUgOWqq8AXIXpoUTAWgf//B44I+cYJr95utX33rjqa+uVx7m21pesolNwlHREs6bB9qATVp1wtoWB1UcZcJUxBdii7+qxUkpr70pCYvSI1XAELA0TTGNQqje0YIDOVoluQ6umWaeGlswqAnOc3GASZBkqBYJ9UoRyWQGPynaIRPfJFRQ4AYjAaiZgD9dF1DRuVwTGe0JE7hoxDLA+MR0k6pkUc1akcpovPtcTGAZcgddYPcaBMVGO2j1e201bQGZXl4zvKbUo0FzF9UyjDXEzXPNL3hyqgWaIBZwJiLsXk8BFhIhZz2agiXFhoJZ4ZkD4+l6gh7FQZj5ZWoov9ZFAkqkTjfUj825i/jFnNXi4ZoidzCdQXsXDRI5nFdtjx1DEklvUL5twuhXHa13RWvYDphANB6lw8bWl59qBCKh9OZHkWU+grBeWzeS/eKCjXXFnemaVySPeL2D7ocBM6hN6q12DfvMOTffKgprtHUgftkHxdsxnDHYwNkkeo/NVJ14Ed6DC2vTrrurUK3sj6daKabL+J8eEST71+vVEnYevxFKt44DzWVp2HafUhKcQAdGvO/p/g83tZ1/vL+YK3Kth6YIC8js7dNJDsUzGTJpGJ43O4TU9GXYWpNSoFaA6UrZ/aqCuxzVBol1YeGquuAk9P6sT4kC7xOF7Kw2y/SDo/iaC3aazNnS8hqRxWWeJidtVtiuyg04wpaH5+M09/+HYcN4Y8o/sHbxpqnE9m3rvmzw3hYb7qybW9nwc9zL5v3VSf916pH9tzerI+8Lm7AAAAAElFTkSuQmCC',
        text: languages[this.$cache.get('_language')].text08,
        centerItem: true
      }, {
        id: 3,
        path: '/pages/transaction/index',
        // icon: '/static/img/tabbar/transaction.png',
        // selectIcon: '/static/img/tabbar/selTransaction.png',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAARVBMVEWxwdAAAAD///++y9i1xtT2+PnK1d+xwtGyxNKxwtKywtOywNKzxdOzwdSyyNPh5+3V3uaywdKyw9KywtGvxdSyxM7q7/NZoD3DAAAAF3RSTlOZAJmZDJmZoIFuVUU8LReZmYd3YDQkmb1qg84AAAG/SURBVFjDzdgLcoQgDAbgVOMGxPej9z9qd9x1MxIUMbbT/wDfAAImwNct+SsGlygYxLkq7WD63gy2rGbEdAYbZ4EIPiEC6xpMYnB6GiDylCY8zWBl2PAlU+EpBmtGwlCNcaYZIZqxiTE8lOMBHTMOTsYdMFjC6ZToM6zQeYY2DgglzZGMg8S4EFNDcmrJNCadMY3P4EjpDI3IzO6U8rZ9nJkWM2gCSpFlRR6ZFm6YisJKFmGoYoYH4yk8mqPhMDPRRQVoYgZtqsKx+GGadIXTfBhH1xVyK4PWU74XpcvDEbNaGdimy5YUO/n2oJWZSTCHabezmhdG7r1HkcRUb6YESBlO4R208s1YuYXzx37EGr8YHECVAV+M0THmzfQ6pr+V0U/qxiWWH/zwa+eCsbz9EjZx5zNl+DC0Wcom5sMwSyY+HHk00b9uip0EGcCVEWscTrc4/nVjUVyiIvGrlRxf6VcUeaWjva5YlL+7dIUm+fNNV8CgKAWOmKwIKlRFCxNZpMQKk3jl92hbVjj13UWbvoTUF7T3l9f6Yl/feugbod9sy/RNor5l1TfQ+nZe/7igf+rQP7yon4H+y6PUufwAcRUY3U4KgNcAAAAASUVORK5CYII=',
        selectIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAABOFBMVEUAAAAdZtsOTcUeZ90idOolevAebeQRUskSU8skdeskde0VU80WW9ITVs0meu8UV84hc+gPTcUOTMMme/ERUMgleO0RUcgicugdaN4aY9oOTMQbYtoaY9keauEXW9IaY9kicukbZNkjc+sbY9ome/AUU8oUV80RUMYcYtojdewQT8cne/AfbeMOSsEnfPEmd+4RTscTVssTUcoofPEfa98pffIRTscQUsn+//8SVs0dauAebeQYYNYZZNwic+oYYdkOTcUWW9IgcecjduwkeO8VWdHj7PsXXdRlluhik+Q5e+MUV880cNjr8vwRY+AHUM9EetrY5PhNiulck+kOV9Lx9v3a5/omc+VZi98HTcrD1vWtx/KMsex4o+kZauQ0dd8KW9v2+f0lcOIsatagwPKcuetCg+ZQg9yQVy4dAAAAN3RSTlMACfwU+vr7+nJLJSX6+dbW1NO3totzYlr54N7Txri4s5qMimdjV0tLPPPz4NnHxqOjnpWNcDs7oMef3wAAA/ZJREFUWMPVmHlf2jAYxxvKJociHuCmbs557L4PWsrVIqIguk3YvHVzx/t/B/s1TQihbai6f/ZtTJsnT74+KfTz0Wr/FYRxA4P+YfXdzMvMs2eZlzPvVj/o5BqOVG7m1obErZlc6momfc513AIDFmqa06NLVjN0WX2wljozZVajiUgyQx04ZNwQFSUjbC31amMj7iqwCK0voLgXmHyVGmVJZuvxeF3JRryeTao3lHtSh2QESHmSIwrLw0o8XgH1St1rlWCQ9ZCEWh5UIIkEEh+Q8FoqkQmtJydZnIqDJs5SDA3JucDPKO7QJHRBGnSAXQNXlPRbUlkHHolvri0UpGdT/tvr3HYsy7HQccvZmXXmAC/IwhYbgduW7zYnEQSY5nzb/fLzeIuPqAadwHE9Q9vSs1zisAOWz4bR+80DwsYOmp7VJc0czBKwfDWM78a+pQCL5qRinlsBFrDZOrOUPNcVxfxgls5+sWi5LVI55F5RQlh2iz64mA3uEfGdKd5WWFRgofjuvJenfBYl78P21DoyQO/0vBXEeZHZy/RH7Eq/g3H/KF6cGpTNYDpHv3eR5knAHZ1pHhfhEVycGGp+VkU1WPqYaVbKVM7bxVZPJfluHNO0Mq9ohWmWy0Ooy+lsXcAhWGZ3eKk8TGt/K5T9VllmiXiaxWFLtVStlqtijIEY41JmkWkW+inSSqEAYizCaO7FAtPcrSrgCnR+aPyu0NwErlmoVkvuwU60k2BTFJ4ihnxTi6UbwW/x0lD8/GA7lINznwYfOGVZina3O4aKk+aQZpk/DHL4GN93Bb3tbqnUxAFot8IfzeZ4k4NqfhlqTvZKzT5Yyh9NfdymEdtu2s1S99NRZzMYT3MKjZvpYY/rTEPu24N0u5c7QVye9gxwtNPFLxTcJxojYUdg74De+s+f9kpSPKFx0vb4NS1YmIaA76ohYTdstMFxY9CCWTGDPfVZa4w3lJh/+hYpPtFY0wT6pNlum20ToGu0G20Gj15uMott0gg6gLxJ6W+BvDlhqvhj9FzLoS1FsSjPDbwcJTsdbpFBMRLrI8o5OP7ls2DJuiZD3iBYMNGCOSwcHpoFNlvw+gnzDdGGSE8WkAbcLK9jZxYVcYp7MZnWfKyPeSv9YIV/DOMYtuQnURhjeUwnRgFxJCe0IMgs8ygRltmwfxreYjKy5a2w+OuJxaJIkIVaQiGJp7VYrVYr1JBb49AhOkA7pDxNwKLg0VQtBpEKzE890kaQfo08hcidfJ3WRkJQUKgoRkshWhT0/Dxd4HcgNp+/wnuBtemYtww9zmje9fQaJFeApBMwDQJHIk2u8+LlY352+sXU/PzUi+nZ/Eed/IPXQP8TfwHJivBqStEYlQAAAABJRU5ErkJggg==',
        text: languages[this.$cache.get('_language')].text03,
        centerItem: false
      }, {
        id: 4,
        path: '/pages/mine/index',
        // icon: '../../static/img/tabbar/mine.png',
        // selectIcon: '../../static/img/tabbar/selMine.png',      
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAATlBMVEWxwdAAAAD///+0xNPk6u/u8vasvM34+vy8y9e2ydrS3OXG0t2yw9Gyw9K2xNKxwtHa4umzxNKxw9GzxNOuwdK4x9SzxdWyw9Cxw9G0w8tbns+qAAAAGnRSTlOZAJmcmZmZmZkJmZlpViWjmYxwLxxGPn1hEVoQpkYAAAK2SURBVFjD3ZjdcuIwDEa1kYljOwkO+QHe/0U3DW41SB+wJbsX23PR6bjpsZCxLId+/RX+H0249kt3aU+n9tIt/TW8owljd+YV2uCVczeG72lC3w1HJgUfh64PWAMlLTNBmFsrwppJJFg0/YEmzCQSLKI5vNJMpyO95HianmvGQVuwZxifaRb7gTBMy2PNTIB6BY3PjzQLUHDaYKBasGY0EkrReV9V3ruYyIhGpJkGnZeUffWFz0nnZ5isJpiVjjfJ+rP8Es26B6OZkUXAnllrJtKW8q8ux5hdUWoPTfea0PJ9dqMvCeF6hUuafLzPM7fhTtOzSt+hWjkkGUm3Ef1cLxoQTN7mTjXJUNriyTgcgsE029Q3i3i2cBoTjmg6lBlHCoey04kmDOrr67ZgtGYLx6kv8xC+NCOjeRutaVCMPH5pOrROzpZ0h9aq+9SEs572mUYHeQ5Fc2V6Pxria9H0/Pj513bui2ZhtLRVU6v1a7aVMvKlaDqtqSPch7fRWmu6ormQJnmw4s02mEhzKZqWDK4yaeDbGBnaojkRDEc8YpFghBPQyHaQjSibVbaC0siHMou74RKvpNUq5UbRohSr6QUJTnExC65SqnD4uU6+fpBb/ZWDiiC8yGbANM774vCuIQz3dmva4ze7lWyOXrs1baF43VHYQiE5fgvupIju0YyqpL+FlHRYKogYQGTLxLPjLsXsADkmdNzhw7eJh+ohh9jAw1eHw1piRayDsY0JO1+9wDuWYFSbpDekPwC83qTTg6Ytl/nWXAJSLLFmadpQCxk/P31d443xmbkoLaRpaOvmsFnkhLLIM9LQ6vY6ohqH62JU7bWwsKs8ONDAYegrx8vDq0f++Du95GO2bK8e4nG2yuGq6OZ/eS3bf0ncf2Xdf4Hef53f/3Jh/6uO/S9efsTbpG/wGxXoJHutcsNzAAAAAElFTkSuQmCC',
        selectIcon: 'data:image/png;base64,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',
        text: languages[this.$cache.get('_language')].text02,
        centerItem: false
      }]

    }
  },
  mounted() {
    this.currentItem = this.currentPage
    
  },

  methods: {
    //切换tabbar
    changeItem(item) {
      if (item.id == 3) { // 交易
        uni.showToast({
          title: this.language.text07,
          icon: 'none'
        })
      } else {
        uni.switchTab({
          url: item.path
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
	view {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	.tabbar-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 120rpx;
		box-shadow: 0 -17.68px 24px 0 rgba(0, 0, 0, 0.05);
		border-top: 1px;
		display: flex;
		align-items: center;
		// padding: 26rpx 0 20rpx 0;
		font-size: 32rpx;
		z-index: 200;
		background-color: #fff;
		color: #B0C1D0;
	}

	.tabbar-container .tabbar-item {
		width: 20%;
		// height: 120rpx;
		padding: 26rpx 0 20rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		text-align: center;
	}


	.tabbar-container .center-item {
		// display: block;
		// position: relative;
	}

	.tabbar-container .tabbar-item .item-top {
		width: 60rpx;
		height: 60rpx;
		// padding: 10rpx;
	}

	.center {
    display: flex;
    align-items: center;
    justify-content: center;
		flex-shrink: 0;
		width: 112rpx;
		height: 112rpx;
		position: absolute;
		top: -50%;
		// left: calc(50%);
    left: 50%;
    transform: translate(-50%);
		border-radius: 50%;
		background-image: linear-gradient(178deg, #2C80EE 0%, #002FA7 100%);
		box-shadow: 5.89px 8px 24px 0 rgba(36, 107, 253, 0.32);
		background-color: #ffffff;
    image {
      width: 112rpx !important;
      height: 112rpx !important;
    }
	}
  
  .tabbar-container .center-item {
    
  }

	.tabbar-container .tabbar-item .item-top image {
		width: 50rpx;
		height: 50rpx;
	}

	tabbar-container .tabbar-item:nth-child(3) .item-top image {
		background: #ff0000;
	}

	.tabbar-container .tabbar-item .item-bottom {
		font-size: 24rpx;
		color: #B0C1D0;
		width: 100%;
	}

	.tabbar-container .center-item .item-bottom {
		// position: absolute;
		// bottom: 5rpx;
	}

	.tabbar-container .tabbar-item .item-active {
		color: #275EF1;
	}
  
  
  .center-item .item-top {
    image {
      opacity: 0;
    }
  }
</style>

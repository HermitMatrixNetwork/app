export const onlyPositiveNumber = {
  bind: function(el) {
    el.handler = function() {
      el.value = Number(el.value.replace(/\D+/, ''))
      console.log(el.value)
    }
    el.addEventListener('input', el.handler)
  },
  unbind: function(el) {
    el.removeEventListener('input', el.hanlder)
  }
}
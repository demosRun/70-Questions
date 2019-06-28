
window.onresize = function() {
  changeDecorate(document.getElementsByClassName(owo.entry)[0])
}
document.addEventListener('touchmove', function(e){
  e.preventDefault()
}, false)

function changeDecorate ($el) {
  log('重新计算合适安全区')
  // 计算长宽比例
  const sw = document.body.offsetWidth / 750
  const sh = document.body.offsetHeight / 1500
  const ms = sw > sh ? sh : sw
  // 获取页面安全区
  const safety = $el.getElementsByClassName('safety')[0]
  safety.style.transform = `scale(${ms})`
  if (sw > sh) {
    safety.style.top = `${-1500 / 2 * (1 - sh)}px`
    safety.style.left = `${-750 / 2 * (1 - sw)}px`
  } else {
    safety.style.top = `${-1500 / 2 * (1 - sh)}px`
    safety.style.left = `${-750 / 2 * (1 - sw)}px`
  }
}

// 窗口大小改变自动刷新页面
$(window).on("orientationchange",function(){
  if(window.orientation != 0) {
    alert("建议锁定屏幕后竖屏浏览");
    location.reload()
  }
})
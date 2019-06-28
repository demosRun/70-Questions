// Fri Jun 28 2019 15:11:19 GMT+0800 (GMT+08:00)

"use strict";


window.onresize = function() {
  changeDecorate(document.getElementsByClassName(owo.entry)[0])
}
// document.addEventListener('touchmove', function(e){
//   e.preventDefault()
// }, false)

// 计算安全区合适的大小
function changeDecorate ($el) {
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

// 存储页面基本信息
var owo = {
  // 页面默认入口
  entry: "home",
  // 全局方法变量
  tool: {},
  // 框架状态变量
  state: {}
};

/*
  存储每个页面的函数
  键名：页面名称
  键值：方法列表
*/
owo.script = {
  "home": {
    // 页面显示运行的方法
    "created": function created() {
      // 3秒后跳转页面
      setTimeout(function () {
        // $go('two', 'moveToRight', 'moveFromLeft')
        owo.state.start = true; // 如果还是在首页则自动跳转

        if (owo.activePage === 'home') {
          $go('two', 'moveToLeft', 'moveFromRight');
        }
      }, 6000); // 计算长宽比例

      changeDecorate(this.$el);
    },
    "turn": function turn() {
      owo.state.start = true;
      $go('two', 'moveToLeft', 'moveFromRight');
    }
  },
  "two": {
    "created": function created() {
      // 返回首页
      if (!owo.state.start) {
        setTimeout(function () {
          location.replace('');
        }, 0);
      } // 注册返回方式


      owo.state.animation = {
        "in": 'moveToRight',
        "out": 'moveFromLeft'
      };
      changeDecorate(this.$el);
    },
    "look": function look() {
      $go('rule', 'moveToLeft', 'moveFromRight');
    },
    "toAnswerQuestions": function toAnswerQuestions() {
      $go('answer', 'moveToLeft', 'moveFromRight');
    }
  },
  "rule": {
    "created": function created() {
      // 返回首页
      if (!owo.state.start) {
        setTimeout(function () {
          location.replace('');
        }, 0);
      } // 注册返回方式


      owo.state.animation = {
        "in": 'moveToRight',
        "out": 'moveFromLeft' // 计算长宽比例

      };
      changeDecorate(this.$el);
    },
    "look": function look() {
      $go('two', 'moveToLeft', 'moveFromRight');
    },
    "toAnswerQuestions": function toAnswerQuestions() {
      $go('answer', 'moveToLeft', 'moveFromRight');
    }
  },
  "answer": {
    "data": {
      "index": 0,
      "total": 0,
      "right": 0,
      "running": false
    },
    "created": function created() {
      var _this = this;

      // 返回首页
      if (!owo.state.start) {
        setTimeout(function () {
          location.replace('');
        }, 0);
      } // 注册返回方式


      owo.state.animation = {
        "in": 'moveToRight',
        "out": 'moveFromLeft' // 初始化数据

      };
      owo.state.right = this.data.total = this.data.index = 0; // 清除对错标记

      this.clear(); // 获取屏幕宽度

      var screenW = document.body.offsetWidth; // 计算列表宽度

      var box = this.$el.getElementsByTagName('ul')[0];
      var list = this.$el.getElementsByTagName('li'); // 记录总数

      this.data.total = list.length; // console.log(box * list.length)

      box.style.width = list.length * screenW + 'px';

      for (var key in list) {
        if (list.hasOwnProperty(key)) {
          var element = list[key];
          element.style.width = screenW + 'px';
        }
      } // 改变页码显示


      this.changeDecorate(); // 绑定点击事件

      var card = this.$el.getElementsByTagName('span');

      for (var _key in card) {
        if (card.hasOwnProperty(_key)) {
          var _element = card[_key];

          _element.onclick = function (e) {
            if (_this.data.running) return; // 防止重复点击

            _this.data.running = true;
            var target = e.target; // 判断是否答对

            if (target.classList.contains('right')) {
              // 答对了
              _this.data.right++;
              target.classList.add('click'); // 进入下一题

              setTimeout(function () {
                _this.after();
              }, 500);
            } else {
              // 答错了
              target.classList.add('click');
              target.parentElement.getElementsByClassName('right')[0].classList.add('click'); // 进入下一题

              setTimeout(function () {
                _this.after();
              }, 1000);
            }
          };
        }
      }
    },
    "clear": function clear() {
      var clickList = this.$el.getElementsByClassName('click'); // console.log(clickList)

      for (var key in clickList) {
        if (clickList.hasOwnProperty(key)) {
          (function () {
            var element = clickList[key];
            setTimeout(function () {
              element.classList.remove('click');
            }, 0);
          })();
        }
      }
    },
    "changeDecorate": function changeDecorate() {
      this.data.running = true; // 获取屏幕宽度

      var screenW = document.body.offsetWidth; // 当前的index

      var index = this.data.index;
      var box = this.$el.getElementsByTagName('ul')[0];
      box.style.left = -screenW * this.data.index + 'px';
      var decorate = this.$el.getElementsByClassName('decorate')[0];
      decorate.innerHTML = "<span class=\"red\">".concat(index + 1, "</span> / <span class=\"blue\">").concat(this.data.total, "</span>");
      this.data.running = false;
    },
    "before": function before() {
      if (this.data.index > 0) {
        this.data.index--; // 改变页码显示

        this.changeDecorate();
      } else {
        owo.tool.toast('已经在最前了!');
      }
    },
    "after": function after() {
      // console.log(this.data.index, this.data.total - 1)
      if (this.data.index < this.data.total - 1) {
        this.data.index++; // 改变页码显示

        this.changeDecorate();
      } else {
        // 保存结果
        owo.state.right = this.data.right; // 已经在最后了则进入结果页

        if (this.data.right >= 6) {
          // 进入成功页面
          $go('victory', 'moveToLeft', 'moveFromRight');
        } else {
          // 进入失败页面
          $go('fail', 'moveToLeft', 'moveFromRight');
        }
      }
    }
  },
  "victory": {
    "created": function created() {
      // 返回首页
      if (!owo.state.start) {
        setTimeout(function () {
          location.replace('');
        }, 0);
      }
      // 注册返回方式


      owo.state.animation = {
        "in": 'moveToRight',
        "out": 'moveFromLeft' // 修复输入框弹出屏幕改变大小问题

      };

      if (document.body.clientWidth < document.body.clientHeight) {
        document.body.style.maxWidth = '100%';
        document.body.style.height = window.innerHeight + 'px';
      } // console.log(document.body.style)


      this.$el.getElementsByClassName('number')[0].innerText = owo.state.right ? owo.state.right : 0;
      this.$el.getElementsByTagName('span')[0].innerText = owo.state.right ? owo.state.right : 0;
      changeDecorate(this.$el);
    },
    "submit": function submit() {
      var name = document.getElementById('name').value;
      var phone = document.getElementById('phone').value; // console.log(name, phone)

      owo.tool.toast('提交成功!');
      $.post(serverIp, {
        name: name,
        phone: phone,
        code: owo.state.right
      }, function (result) {});
    }
  },
  "fail": {
    "created": function created() {
      // 返回首页
      if (!owo.state.start) {
        setTimeout(function () {
          location.replace('');
        }, 0);
      } // 注册返回方式


      owo.state.animation = {
        "in": 'moveToRight',
        "out": 'moveFromLeft'
      };
      this.$el.getElementsByTagName('span')[0].innerText = owo.state.right ? owo.state.right : 0; // 计算长宽比例

      changeDecorate(this.$el);
    },
    "toAnswerQuestions": function toAnswerQuestions() {
      $go('answer', 'moveToLeft', 'moveFromRight');
    }
  }
};

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* 方法合集 */


var _owo = {
  /* 对象合并方法 */
  assign: function assign(a, b) {
    var newObj = {};

    for (var key in a) {
      newObj[key] = a[key];
    }

    for (var key in b) {
      newObj[key] = b[key];
    }

    return newObj;
  },

  /* 运行页面初始化方法 */
  runCreated: function runCreated(pageFunction, entryDom) {
    pageFunction.created.apply(_owo.assign(pageFunction, {
      $el: entryDom,
      data: pageFunction.data,
      activePage: window.owo.activePage
    }));
  },

  /* 注册事件监听 */
  registerEvent: function registerEvent(pageFunction, entryDom) {
    // 判断是否包含事件监听
    if (pageFunction.event) {
      if (!window.owo.state.event) window.owo.state.event = {};

      for (var iterator in pageFunction.event) {
        if (!window.owo.state.event[iterator]) window.owo.state.event[iterator] = [];
        window.owo.state.event[iterator].push({
          dom: entryDom,
          pageName: window.owo.activePage,
          fun: pageFunction.event[iterator],
          script: pageFunction
        });
      }
    }
  }
};

/* 运行页面所属的方法 */
_owo.handlePage = function (pageName, entryDom) {
  _owo.handleEvent(entryDom, null, entryDom);
  /* 判断页面是否有自己的方法 */


  var newPageFunction = window.owo.script[pageName];
  if (!newPageFunction) return; // console.log(newPageFunction)
  // 如果有created方法则执行

  if (newPageFunction.created) {
    _owo.runCreated(newPageFunction, entryDom);
  } // 注册事件监听


  _owo.registerEvent(newPageFunction, entryDom); // 判断页面是否有下属模板,如果有运行所有模板的初始化方法


  for (var key in newPageFunction.template) {
    var templateScript = newPageFunction.template[key];

    if (templateScript.created) {
      // 获取到当前配置页的DOM
      // 待修复,临时获取方式,这种方式获取到的dom不准确
      var domList = document.querySelectorAll('[template="' + key + '"]'); // 有时候在更改html时会将某些块进行删除

      if (domList.length == 0) {
        console.info('无法找到页面组件:' + key);
      } // console.log(domList.length)


      for (var ind = 0; ind < domList.length; ind++) {
        _owo.runCreated(templateScript, domList[ind]); // 注册事件监听


        _owo.registerEvent(templateScript, domList[ind]);
      }
    }
  }
};


/* owo事件处理 */
_owo.handleEvent = function (tempDom, templateName, entryDom) {
  // console.log(templateName)
  var activePage = window.owo.script[owo.activePage];

  if (tempDom.attributes) {
    for (var ind = 0; ind < tempDom.attributes.length; ind++) {
      var attribute = tempDom.attributes[ind]; // 判断是否为owo的事件
      // ie不支持startsWith

      if (attribute.name[0] == '@') {
        var eventName = attribute.name.slice(1);
        var eventFor = attribute.textContent;

        switch (eventName) {
          case 'show':
            {
              // 初步先简单处理吧
              var temp = eventFor.replace(/ /g, ''); // 取出条件

              var condition = temp.split("==");

              if (activePage.data[condition[0]] != condition[1]) {
                tempDom.style.display = 'none';
              }

              break;
            }

          default:
            {
              // 处理事件 使用bind防止闭包
              tempDom["on" + eventName] = function (event) {
                // 因为后面会对eventFor进行修改所以使用拷贝的
                var eventForCopy = this; // 判断页面是否有自己的方法

                var newPageFunction = window.owo.script[window.owo.activePage]; // console.log(this.attributes)

                if (templateName) {
                  // 如果模板注册到newPageFunction中，那么证明模板没有script那么直接使用eval执行
                  if (newPageFunction.template) {
                    newPageFunction = newPageFunction.template[templateName];
                  }
                } // 待优化可以单独提出来
                // 取出参数


                var parameterArr = [];
                var parameterList = eventForCopy.match(/[^\(\)]+(?=\))/g);

                if (parameterList && parameterList.length > 0) {
                  // 参数列表
                  parameterArr = parameterList[0].split(','); // 进一步处理参数

                  for (var i = 0; i < parameterArr.length; i++) {
                    var parameterValue = parameterArr[i].replace(/(^\s*)|(\s*$)/g, ""); // console.log(parameterValue)
                    // 判断参数是否为一个字符串

                    if (parameterValue.charAt(0) === '"' && parameterValue.charAt(parameterValue.length - 1) === '"') {
                      parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
                    }

                    if (parameterValue.charAt(0) === "'" && parameterValue.charAt(parameterValue.length - 1) === "'") {
                      parameterArr[i] = parameterValue.substring(1, parameterValue.length - 1);
                    } // console.log(parameterArr[i])

                  }

                  eventForCopy = eventForCopy.replace('(' + parameterList + ')', '');
                } else {
                  // 解决 @click="xxx()"会造成的问题
                  eventForCopy = eventForCopy.replace('()', '');
                } // console.log(newPageFunction)
                // 如果有方法,则运行它


                if (newPageFunction[eventForCopy]) {
                  // 绑定window.owo对象
                  // console.log(tempDom)
                  // 待测试不知道这样合并会不会对其它地方造成影响
                  newPageFunction.$el = entryDom;
                  newPageFunction.$event = event;
                  newPageFunction[eventForCopy].apply(newPageFunction, parameterArr);
                } else {
                  // 如果没有此方法则交给浏览器引擎尝试运行
                  eval(eventForCopy);
                }
              }.bind(eventFor);
            }
        }
      }
    }
  }

  if (tempDom.children) {
    // 递归处理所有子Dom结点
    for (var i = 0; i < tempDom.children.length; i++) {
      var childrenDom = tempDom.children[i]; // console.log(childrenDom)

      var newTemplateName = templateName;

      if (tempDom.attributes['template'] && tempDom.attributes['template'].textContent) {
        newTemplateName = tempDom.attributes['template'].textContent;
      } // 待修复，逻辑太混乱了


      var _temp = tempDom.attributes['template'] ? tempDom : entryDom;

      if (newTemplateName === owo.entry) {
        _owo.handleEvent(childrenDom, null, _temp);
      } else {
        _owo.handleEvent(childrenDom, newTemplateName, _temp);
      }
    }
  } else {
    console.info('元素不存在子节点!');
    console.info(tempDom);
  }
};

_owo.getarg = function (url) {
  // 获取URL #后面内容
  var arg = url.split("#");
  return arg[1];
}; 

// 页面资源加载完毕事件
_owo.ready = function () {
  // 取出URL地址判断当前所在页面
  var pageArg = _owo.getarg(window.location.hash); // 从配置项中取出程序入口


  var page = pageArg ? pageArg.split('?')[0] : owo.entry;

  if (page) {
    var entryDom = document.getElementById('o-' + page);

    if (entryDom) {
      // 显示主页面
      entryDom.style.display = 'block';
      window.owo.activePage = page;

      _owo.handlePage(page, entryDom);
    } else {
      console.error('入口文件设置错误,错误值为: ', entryDom);
    }
  } else {
    console.error('未设置程序入口!');
  } // 设置状态为dom准备完毕


  window.owo.state.isRrady = true; // 判断是否有需要运行的其他方法

  if (window.owo.state.created != undefined) {
    window.owo.state.created.forEach(function (element) {
      // 运行对应的方法
      element();
    });
  } // 设置当前页面为活跃页面


  owo.state.newUrlParam = _owo.getarg(document.URL);
};

/*
  页面跳转方法
  参数1: 需要跳转到页面名字
  参数2: 离开页面动画
  参数3: 进入页面动画
*/
function $go(pageName, inAnimation, outAnimation, param) {
  owo.state.animation = {
    "in": inAnimation,
    "out": outAnimation
  };
  var paramString = '';

  if (param && _typeof(param) == 'object') {
    paramString += '?'; // 生成URL参数

    for (var paramKey in param) {
      paramString += paramKey + '=' + param[paramKey] + '&';
    } // 去掉尾端的&


    paramString = paramString.slice(0, -1);
  }

  window.location.href = paramString + "#" + pageName;
} // url发生改变事件


_owo.hashchange = function (e) {
  // console.log('页面切换:', e)
  // 这样处理而不是直接用event中的URL，是因为需要兼容IE
  owo.state.oldUrlParam = owo.state.newUrlParam;
  owo.state.newUrlParam = _owo.getarg(document.URL); // 如果旧页面不存在则为默认页面
  // console.log(owo.state.oldUrlParam, owo.state.newUrlParam)

  if (!owo.state.oldUrlParam) owo.state.oldUrlParam = owo.entry;
  var newUrlParam = owo.state.newUrlParam; // 如果没有跳转到任何页面则跳转到主页

  if (newUrlParam === undefined) {
    newUrlParam = owo.entry;
  } // 如果没有发生页面跳转则不需要进行操作
  // 切换页面特效


  switchPage(owo.state.oldUrlParam, newUrlParam);
}; // ios的QQ有BUG 无法触发onhashchange事件


if (/iPhone\sOS.*QQ[^B]/.test(navigator.userAgent)) {
  window.onpopstate = _owo.hashchange;
} else {
  window.onhashchange = _owo.hashchange;
}
/*
 * 传递函数给whenReady()
 * 当文档解析完毕且为操作准备就绪时，函数作为document的方法调用
 */


_owo.whenReady = function () {
  //这个函数返回whenReady()函数
  var funcs = []; //当获得事件时，要运行的函数

  var ready = false; //当触发事件处理程序时,切换为true
  //当文档就绪时,调用事件处理程序

  function handler(e) {
    if (ready) return; //确保事件处理程序只完整运行一次
    //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好

    if (e.type === 'onreadystatechange' && document.readyState !== 'complete') {
      return;
    } //运行所有注册函数
    //注意每次都要计算funcs.length
    //以防这些函数的调用可能会导致注册更多的函数


    for (var i = 0; i < funcs.length; i++) {
      funcs[i].call(document);
    } //事件处理函数完整执行,切换ready状态, 并移除所有函数


    ready = true;
    funcs = null;
  } //为接收到的任何事件注册处理程序


  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false);
    document.addEventListener('readystatechange', handler, false); //IE9+

    window.addEventListener('load', handler, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', handler);
    window.attachEvent('onload', handler);
  } //返回whenReady()函数


  return function whenReady(fn) {
    if (ready) {
      fn.call(document);
    } else {
      funcs.push(fn);
    }
  };
}(); // 执行页面加载完毕方法


_owo.whenReady(_owo.ready); // 隐藏旧页面，显示新页面


function dispalyEffect(oldDom, newDom) {
  if (oldDom) {
    // 隐藏掉旧的节点
    oldDom.style.display = 'none';
  } // 查找页面跳转后的page


  newDom.style.display = 'block';
}



// 切换页面动画
function animation(oldDom, newDom, animationIn, animationOut) {
  // 获取父元素
  var parentDom = newDom.parentElement;

  if (!oldDom) {
    console.error('旧页面不存在!');
  }

  oldDom.addEventListener("animationend", oldDomFun);
  newDom.addEventListener("animationend", newDomFun);
  oldDom.style.position = 'absolute';
  newDom.style.display = 'block';
  newDom.style.position = 'absolute'; // document.body.style.overflow = 'hidden'

  parentDom.style.perspective = '1200px';
  oldDom.classList.add('owo-animation');
  animationIn.split(',').forEach(function (value) {
    oldDom.classList.add('o-page-' + value);
  });
  newDom.classList.add('owo-animation');
  animationOut.split(',').forEach(function (value) {
    newDom.classList.add('o-page-' + value);
  }); // 旧DOM执行函数

  function oldDomFun(e) {
    // 排除非框架引起的结束事件
    if (e.target.getAttribute('template')) {
      // 移除监听
      oldDom.removeEventListener('animationend', oldDomFun, false); // 隐藏掉旧的节点

      oldDom.style.display = 'none'; // console.log(oldDom)

      oldDom.style.position = '';
      oldDom.classList.remove('owo-animation');
      parentDom.style.perspective = ''; // 清除临时设置的class

      animationIn.split(',').forEach(function (value) {
        oldDom.classList.remove('o-page-' + value);
      });
    }
  } // 新DOM执行函数


  function newDomFun() {
    // 移除监听
    newDom.removeEventListener('animationend', newDomFun, false); // 清除临时设置的style

    newDom.style.position = '';
    newDom.classList.remove('owo-animation');
    animationOut.split(',').forEach(function (value) {
      newDom.classList.remove('o-page-' + value);
    });
  }
} 


// 切换页面前的准备工作
function switchPage(oldUrlParam, newUrlParam) {
  var oldPage = oldUrlParam;
  var newPage = newUrlParam;
  var newPagParamList = newPage.split('&');
  if (newPage) newPage = newPagParamList[0]; // 查找页面跳转前的page页(dom节点)
  // console.log(oldUrlParam)
  // 如果源地址获取不到 那么一般是因为源页面为首页

  if (oldPage === undefined) {
    oldPage = owo.entry;
  } else {
    oldPage = oldPage.split('&')[0];
  } // console.log(oldPage, newPage)


  var oldDom = document.getElementById('o-' + oldPage);
  var newDom = document.getElementById('o-' + newPage);

  if (!newDom) {
    console.error('页面不存在!');
    return;
  } // console.log(owo.state.animation)
  // 判断是否有动画效果


  if (!owo.state.animation) owo.state.animation = {}; // 直接.in会在ie下报错

  var animationIn = owo.state.animation['in'];
  var animationOut = owo.state.animation['out'];

  if (animationIn || animationOut) {
    // 如果没用动画参数则使用默认效果
    if (!animationIn || !animationOut) {
      dispalyEffect(oldDom, newDom);
      return;
    }

    owo.state.animation = {};
    animation(oldDom, newDom, animationIn, animationOut);
  } else {
    dispalyEffect(oldDom, newDom);
  }

  window.owo.activePage = newPage;

  _owo.handlePage(newPage, newDom);
}


/**
* 显示toast提示 不支持ie8
* @param  {number} text       显示的文字
* @param  {number} time       显示时长
*/
owo.tool.toast = function (text, time) {
  if (window.owo.state.toastClock) {
    clearTimeout(window.owo.state.toastClock);
    hideToast();
  }

  if (time === undefined || time === null) {
    // 默认2秒
    time = 2000;
  }

  var toast = document.createElement("div");
  toast.setAttribute("id", "toast");
  toast.setAttribute("class", "toast"); // 设置样式

  toast.style.position = 'fixed';
  toast.style.zIndex = 999;
  toast.style['background-color'] = 'rgba(0, 0, 0, 0.5)';
  toast.style.bottom = '10%';
  toast.style.height = '40px';
  toast.style.borderRadius = '10px';
  toast.style.left = 0;
  toast.style.right = 0;
  toast.style.margin = 'auto';
  toast.style.lineHeight = '40px';
  toast.style.textAlign = 'center';
  toast.style.color = 'white';
  toast.style.maxWidth = '200px';
  toast.style.padding = '0 10px';
  toast.style.overflow = 'hidden';
  toast.style.textOverflow = 'ellipsis';
  toast.style.whiteSpace = 'nowrap';
  toast.innerHTML = text;
  document.body.appendChild(toast);

  function hideToast() {
    document.getElementById('toast').outerHTML = '';
    window.owo.state.toastClock = null;
  }

  window.owo.state.toastClock = setTimeout(hideToast, time);
};
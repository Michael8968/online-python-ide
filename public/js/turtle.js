// 老师端 ： http://localhost:3000/turtle.html?courseId=4e5925e81060b8a025c734838d673f63&sync=true&userId=17311111111
// 学生端 ： http://localhost:3000/turtle.html?courseId=4e5925e81060b8a025c734838d673f63&sync=false&userId=18616378968

var needMousemoveListen = false
var needMousedownListen = false
// global fonts
window.fonts = []
// caption
window.gameTitle = '未命名'
var source = window.parent
var origin = '*'

// These will hold handles to asynchronous code that skulpt sets up. We need them to
// implement the stopit function
var intervalFuncVars = []
var timeoutFuncVars = []
var isRunning = false
// Must capture the setInterval function so that processing errors
// are caught and sent to the output and so we know which asynchronous
// processes were started
var oldSetInterval = window.setInterval
var oldSetTimeout = window.setTimeout

Sk.imgPath = window.imageRoot
Sk.audioPath = window.audioRoot

var defaultTimeLimit = Sk.execLimit

function createRemoteVideoDiv(sync) {
  if (!syncMode) return
  let remote_video_div = document.getElementById('remote_video')
  if (remote_video_div) {
    const display = sync || writable ? 'none' : 'block'
    remote_video_div.style.cssText = `width:100%;height:800px;position: absolute;display:${display};z-index:1;`
    return
  }
  remote_video_div = document.createElement('div')
  remote_video_div.id = 'remote_video'
  const display = sync || writable ? 'none' : 'block'
  remote_video_div.style.cssText = `width:100%;height:800px;position: absolute;display:${display};z-index:1;`
  document.getElementById('mycanvas').appendChild(remote_video_div)
}

// show remote_video
function showRemoteVideoDiv() {
  const remote_video_div = document.getElementById('remote_video')
  if (remote_video_div) {
    remote_video_div.style.display = 'block'
  }
}

// hide remote_video
function hideRemoteVideoDiv() {
  const remote_video_div = document.getElementById('remote_video')
  if (remote_video_div) {
    remote_video_div.style.display = 'none'
  }
}

// Callback function to execute when mutations are observed
const observerHandler = function(mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // console.log(
      //   'A child node has been added or removed.',
      //   mutation.addedNodes
      // )
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        const node = mutation.addedNodes[0]
        node.style.display = 'none'
      }
    }
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(observerHandler)

window.addEventListener('load', function(event) {
  window.oncontextmenu = e => {
    e.preventDefault()
  }
  if (syncMode) {
    const mycanvas = document.getElementById('mycanvas')
    mycanvas.addEventListener('mousemove', this.debounceOnMouseMove)
    mycanvas.addEventListener('touchmove', this.debounceOnMouseMove)
    mycanvas.addEventListener('mousedown', this.onMouseEvent)
    mycanvas.addEventListener('touchstart', this.onMouseEvent)
    mycanvas.addEventListener('mouseup', this.onMouseEvent)
    mycanvas.addEventListener('touchend', this.onMouseEvent)
    mycanvas.addEventListener('keydown', this.onKeyPress)
    mycanvas.addEventListener('keyup', this.onKeyPress)

    // Select the node that will be observed for mutations
    const targetNode = document.getElementById('remote_video')
    if (targetNode) {
      // Options for the observer (which mutations to observe)
      const config = { attributes: false, childList: true, subtree: false }
      // Start observing the target node for configured mutations
      observer.observe(targetNode, config)
    }

    if (!sync) {
      createRemoteVideoDiv(sync)
      rtcJoin()
    }
  }
  // listen messgae
  window.addEventListener('message', receiveMessage, false)
})

window.addEventListener('unload', function(event) {
  if (syncMode) {
    // leave rtc
    rtcLeave()
    const mycanvas = document.getElementById('mycanvas')
    mycanvas.removeEventListener('mousemove', this.debounceOnMouseMove)
    mycanvas.removeEventListener('mousedown', this.onMouseEvent)
    mycanvas.removeEventListener('mouseup', this.onMouseEvent)
    mycanvas.removeEventListener('touchstart', this.debounceOnMouseMove)
    mycanvas.removeEventListener('touchmove', this.onMouseEvent)
    mycanvas.removeEventListener('touchend', this.onMouseEvent)
    mycanvas.removeEventListener('keydown', this.onKeyPress)
    mycanvas.removeEventListener('keyup', this.onKeyPress)

    // Later, you can stop observing
    observer.disconnect()
  }
  window.removeEventListener('message', receiveMessage)
})

var lastClientX = 0;
var lastClientY = 0;
var lastTimestamp = new Date().getTime()
function onMouseMove(event) {
  if (!sync) return
  if (!needMousemoveListen) return
  if (!event.isTrusted) {
    return
  }
  if (!isRunning) return
  if (new Date().getTime() - lastTimestamp < 50) return
  lastTimestamp = new Date().getTime()
  if (Math.abs(lastClientX - event.clientX) > 1 ||
      Math.abs(lastClientY - event.clientY) > 1) {
        lastClientX = event.clientX || event.changedTouches[0].clientX
        lastClientY = event.clientY || event.changedTouches[0].clientY
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        const data = {
          bubbles: true,
          cancelable: false,
          clientX: event.clientX + scrollLeft,
          clientY: event.clientY + scrollTop,
          type: 'mousemove',
        }
        source.postMessage({ type: 'mousemove', value: data }, origin)
  }
}

function onMouseEvent(event) {
  if (!sync) return
  if (!needMousedownListen) return
  if (!event.isTrusted) return
  if (!isRunning) return

  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const data = {
    bubbles: true,
    cancelable: (event.type !== "mousemove"),
    clientX: (event.clientX || event.changedTouches[0].clientX) + scrollLeft,
    clientY: (event.clientY || event.changedTouches[0].clientY) + scrollTop,
    type: event.type,
    button: event.button,
  }
  // console.log('onMouseEvent -> ', scrollLeft , scrollTop, data);
  source.postMessage({ type: 'mouse-event', value: data }, origin)
}

function onKeyPress(event) {
  if (!sync) return
  if (!event.isTrusted) return
  if (!isRunning) return
  // console.log('onKeyUp', event)
  const data = {
    key: event.key,
    code: event.code,
    location: event.location,
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    metaKey: event.metaKey,
    repeat: event.repeat,
    isComposing: event.isComposing,
    charCode: event.charCode,
    keyCode: event.keyCode,
    which: event.which,
    type: event.type, //  === 'keyup' ? 'keypress' : type, // === 'keypress' ? 'keydown' : event.type,
    bubbles: event.bubbles,
    cancelBubble: event.cancelBubble,
    cancelable: event.cancelable,
  }
  source.postMessage({ type: 'keyboard-event', value: data }, origin)
}

function debounceOnMouseMove(event) {
  if (!event.isTrusted) return
  $.debounce(500, true, onMouseMove(event))
}

var oReq = new XMLHttpRequest()
oReq.onload = function() {
  var data = JSON.parse(this.responseText)
  window.pygameImages = data.images || []
}
oReq.onerror = function(err) {
  console.error('Fetch Error :-S', err)
}
oReq.open('get', './image/image.json', true)
oReq.send()

// Stops any asynchronous functions still running
var stopit = function() {
  for (var i = 0; i < intervalFuncVars.length; i++) {
    window.clearInterval(intervalFuncVars[i])
  }
  intervalFuncVars = []
  for (var i = 0; i < timeoutFuncVars.length; i++) {
    window.clearTimeout(timeoutFuncVars[i])
  }
  timeoutFuncVars = []
}

var restoreAsync = function() {
  window.setInterval = setInterval = oldSetInterval
  window.setTimeout = setTimeout = oldSetTimeout
}

function receiveMessage(event) {
  if (!event.data || !event.data.type || event.data.type !== 'turtle') return
  // console.log('[turtle] console message', event.data)
  if (event.data.action === 'run') {
    // console.log('receiveMessage', event)
    window.focus();
    // const message = { code: content, action: 'run', type: 'turtle' }
    // console.log('run', event.data.code)
    // run code
    runit(event.data.code, event.data.files)
    // if (sync) {
      // jion rtc
      rtcJoin(sync)
    // }
  } else if (event.data.action === 'pause') {
    isRunning = false
    // leave rtc
    rtcLeave()
    // stop runing
    stopAllAudio()
    stopPython()
    stopit()
  } else if (event.data.action === 'register') {
    // evt.source, evt.origin
    source = event.source || window.parent
    origin = event.origin || '*'
  } else if (
    event.data.action === 'mousemove' ||
    event.data.action === 'mouse-event'
  ) {
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var mouseEvent = event.data.value
    mouseEvent.clientX = mouseEvent.clientX - scrollLeft
    mouseEvent.clientY = mouseEvent.clientY - scrollTop
    // if (event.data.action === 'mouse-event') {
    //   console.log('mouse-event', mouseEvent)
    // }
    const evt = new MouseEvent(
      event.data.value.type,
      Object.assign(mouseEvent, { view: window })
    )
    const canvas = document.getElementsByTagName('canvas')
    if (canvas && canvas.length > 2) {
      canvas[0].dispatchEvent(evt)
      // if (event.data.action === 'mouse-event') {
      //   console.log('mouse-event', evt)
      // }
    } else if (Sk.main_canvas) {
      Sk.main_canvas.dispatchEvent(evt)
    } else {
      const mycanvas = document.getElementById('mycanvas')
      mycanvas.dispatchEvent(evt)
    }
    $('#cursor').css('top', event.data.value.clientY + 'px')
    $('#cursor').css('left', event.data.value.clientX + 'px')
  } else if (event.data.action === 'keyboard-event') {
    const typeArg =
      event.data.value.type === 'keypress' ? 'keydown' : event.data.value.type
    const evt = new KeyboardEvent(
      typeArg,
      Object.assign(event.data.value, { view: window })
    )
    const canvas = document.getElementsByTagName('canvas')
    if (canvas && canvas.length > 2) {
      canvas[0].dispatchEvent(evt)
      // console.log('keyboard-event', evt)
    } else if (Sk.main_canvas) {
      Sk.main_canvas.dispatchEvent(evt)
    } else {
      const mycanvas = document.getElementById('mycanvas')
      mycanvas.dispatchEvent(evt)
    }
  } else if (event.data.action === 'paramter') {
    const data = event.data
    if (data.sync) { // start sync
      rtcPublish()
    } else { // stop sync
      rtcUnpublish()
    }
    if (data.writable) { // hide remote_video
      hideRemoteVideoDiv()
    } else { // show remote_video
      showRemoteVideoDiv()
    }
  } else if (event.data.action === 'easygui') {
    const data = event.data.value
    // console.log('easygui : ', data)
    if (data.type === 'input') {
      $("#dialog #usercontent").val(data.text)
    } else if (data.type === 'click') {
      const buttons = $(".ui-dialog button")
      if (buttons[data.index]) {
        buttons[data.index].dispatchEvent(new Event("click"))
      }
    }
  } else if (event.data.action === 'startSync') {
    sync = true
    rtcPublish()
  } else if (event.data.action === 'stopSync') {
    sync = false
    rtcUnpublish()
  }
}
function removeAllCanvas() {
  // canvas
  var eles = document.getElementsByTagName('canvas')
  if (eles && eles.length > 0) {
    eles.forEach(function(el) {
      el.remove()
    })
  }
}
function hideDialog() {
  var eles = document.getElementsByClassName('ui-dialog')
  if (eles && eles.length > 0) {
    var isOpen = $('#dialog').dialog('isOpen')
    if (isOpen) {
      $('#dialog').dialog('close')
    }
  }
}
function stopAllAudio() {
  if (window.audios && window.audios.length > 0) {
    for (var i = 0; i < window.audios.length; i++) {
      window.audios[i].pause();
    }
  }
  stopAudioMixing();
}
function resetTarget() {
  if (!Sk.TurtleGraphics) return
  var selector = Sk.TurtleGraphics.target
  var target =
    typeof selector === 'string' ? document.getElementById(selector) : selector
  // clear canvas container
  while (target.firstChild) {
    target.removeChild(target.firstChild)
  }
  return target
}
function outputHandler(text) {
  // text = text.replace(/</g, '&lt;')
  const message = { output: text, action: 'output', type: 'turtle' }
  // parent.postMessage(message, '*')
  source.postMessage(message, origin)
}
function errorHandler(text, error) {
  // text = text.replace(/</g, '&lt;')
  const message = {
    output: text,
    error: error,
    action: 'error',
    type: 'turtle',
  }
  // parent.postMessage(message, '*')
  source.postMessage(message, origin)
}
function handlerErrorInner(err) {}
function runit(prog, files) {
  if (!prog) return
  //  只有代码中包含鼠标事件时，才监听
  needMousemoveListen =
    prog.indexOf('MOUSEMOTION') > 0 || prog.indexOf('<Motion>') > 0
      ? true
      : false
  needMousedownListen =
    prog.indexOf('MOUSEBUTTONDOWN') > 0 || prog.indexOf('onscreenclick') > 0
      ? true
      : false

  stopit()
  resetTarget()
  removeAllCanvas()
  hideDialog()
  Sk.TurtleGraphics && Sk.TurtleGraphics.reset && Sk.TurtleGraphics.reset()

  if (Sk.main_canvas) {
    if (Sk.main_canvas.parentElement) {
      Sk.main_canvas.parentElement.removeChild(Sk.main_canvas)
    }
    Sk.main_canvas = null
  }
  Sk.main_canvas = document.createElement('canvas')
  Sk.main_canvas.id = 'pygame-main-canvas'
  Sk.main_canvas.width = 800
  Sk.main_canvas.height = 800
  Sk.main_canvas.position = 'absolute'
  var child = document.getElementById('mycanvas').appendChild(Sk.main_canvas)
  // remote_video
  createRemoteVideoDiv(sync)
  // console.log('appendChild', child);
  function builtinRead(x) {
    if (
      Sk.builtinFiles === undefined ||
      Sk.builtinFiles['files'][x] === undefined
    ) {
      throw "File not found: '" + x + "'"
      // console.log('File not found: ', x)
    }
    // console.log('File found: ', x)
    return Sk.builtinFiles['files'][x]
  }
  // in case of race conditions between pressing multiple start/stop
  Sk.execLimit = defaultTimeLimit

  var TurtleGraphics = Sk.TurtleGraphics || (Sk.TurtleGraphics = {})
  TurtleGraphics.target = 'mycanvas'

  Sk.configure({
    read: builtinRead,
    __future__: Sk.python3,
    output: outputHandler,
    inputfunTakesPrompt: true,
    killableWhile: true,
    killableFor: true,
    // execLimit: 30000, // 20 seconds
    excludeFiles: files,
  })

  var myPromise = Sk.misceval
    .asyncToPromise(function() {
      try {
        isRunning = true
        // register easygui event
        easyguiEventListen()
        return Sk.importMainWithBody('<stdin>', false, prog, true)
      } catch (err) {
        isRunning = false
        // console.log(err.toString())
        var error = []
        if (err.traceback) {
          for (let i = 0; i < err.traceback.length; i++) {
            error[i] = {
              line: err.traceback[i].lineno,
              column: err.traceback[i].colno,
            }
          }
        }
        errorHandler(err.toString(), error)
      } finally {
        // console.log('window.gameTitle : ', window.gameTitle);
        const message = { caption: window.gameTitle, action: 'caption', type: 'turtle' }
        // parent.postMessage(message, '*')
        source.postMessage(message, origin)
      }
    })
    .catch(function(err) {
      isRunning = false
      console.error(err.toString())
      // Create stacktrace message
      var error = []
      if (err.traceback) {
        for (let i = 0; i < err.traceback.length; i++) {
          error[i] = {
            line: err.traceback[i].lineno,
            column: err.traceback[i].colno,
          }
        }
      }
      errorHandler(err.toString(), error)
      // alert(e.toString());
    })
  myPromise.then(
    function(mod) {
      isRunning = false
      // console.log('success', mod)
      const message = { action: 'finished', type: 'turtle' }
      // parent.postMessage(message, '*')
      source.postMessage(message, origin)
    },
    function(err) {
      isRunning = false
      console.error(err.toString())
    }
  )
}
function stopPython() {
  Sk.execLimit = 1
  Sk.timeoutMsg = function() {
    Sk.execLimit = defaultTimeLimit
    return 'Stopped (not really a Timeout)'
  }
}
window.setInterval = setInterval = function(f, t) {
  var handle = oldSetInterval(function() {
    try {
      f()
    } catch (err) {
      // Report error and abort
      restoreAsync()
      console.error(err.toString())
      stopit()
    }
  }, t)
  intervalFuncVars.push(handle)
}

window.setTimeout = setTimeout = function(f, t) {
  var handle = oldSetTimeout(function() {
    try {
      f()
    } catch (err) {
      // Report error and abort
      restoreAsync()
      console.error(err.toString())
      console.error(f)
      console.error(t)
      stopit()
    }
  }, t)
  timeoutFuncVars.push(handle)
}

import { store } from '../redux/store'
import RtmClient from './peer'
// import { setLastLocalData } from '../redux/editor'
// import { debounce } from 'lodash-es'

// import queryString from 'query-string'

// ide in iFrame send change events to it's parent
class ideEventHandler {
  constructor() {
    // const param = queryString.parse(window.location.search)
    // this.sync = param.sync
    const state = store.getState()
    this.userId = state.app.userId
    this.source = window.parent
    this.origin = '*'

    window.addEventListener('load', event => {
      window.addEventListener('message', this.onMessage, false)
    })

    // window.addEventListener('beforeunload', event => {
    //   // cache data
    //   if (!state.app.isMaster && state.app.writable) {
    //     // Cancel the event as stated by the standard.
    //     event.preventDefault()
    //
    //     event.returnValue = ''
    //     return true
    //   }
    //   return // Returning undefined prevents the prompt from coming up
    // })
    window.addEventListener('unload', function(event) {
      window.removeEventListener('message', this.onMessage)
    })
  }

  sendCommand(data, to) {
    const timestamp = new Date().getTime()
    const state = store.getState()
    this.userId = state.app.userId
    const message = Object.assign(data, {
      timestamp: data.timestamp > 0 ? data.timestamp : timestamp,
      userId: this.userId,
      sync: 'pythonIde',
    })
    if (state.app.useRTM) {
      RtmClient.sendChannelMessage(message, state.app.courseId)
    } else {
      this.source.postMessage(message, this.origin)
    }
    // console.log('sendCommand : ', state.app.useRTM, message)
  }

  register(source, origin) {
    this.source = source || window.parent
    this.origin = origin || '*'
    // post canvas rect to parent python-result-iframe
    this.onCanvasRectChanged()
  }

  onCanvasRectChanged() {
    const state = store.getState()
    if (!state.app.sync) return
    const output = document.getElementById('python-result-iframe')
    if (output) {
      const rect = output.getBoundingClientRect()
      this.sendCommand({
        rect: rect,
        action: 'canvasRect',
        to: state.app.isMaster ? '' : state.app.teacherId,
      })
    }
  }

  onSyncContent(userId, to) {
    const state = store.getState()
    this.userId = state.app.userId
    // sync content {  tabs: {}, userId: '', action: 'syncContent', sync: 'pythonIde' }
    // get tabs
    if (userId !== this.userId) return
    let data = {
      isShowPopupScene: state.console.isShowPopupScene,
      consoleHeight: state.console.consoleHeight,
      editorWidth: state.editor.editorWidth,
      tabs: state.tabs,
      action: 'syncContent',
      from: this.userId,
      to: to,
    }
    if (state.app.isMaster) {
      // 老师，在sync状态下，发送群聊消息
      if (state.app.sync || state.app.writable) {
        if (state.app.sync) {
          data.to = ''
        }
        this.sendCommand(data)
      } else {
        // 老师在非sync状态下，发送私聊消息
        if (state.editor.lastSyncData.action === 'syncContent') {
          data = state.editor.lastSyncData
          data.to = to
          this.sendCommand(data)
        } else {
          this.sendCommand(data)
        }
      }
    } else {
      // 学生，只有在sync状态下发送私聊消息
      if (state.app.sync) {
        data.to = state.app.teacherId
        this.sendCommand(data)
      }
    }
  }

  onAddPane(title, content, key) {
    // tab added event { title: '', content: '', key: '', action: 'addPane', userId: '', snyc: 'pythonIde'}
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      title: title,
      content: content,
      key: key,
      action: 'addPane',
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onRemovePane(activeKey) {
    // tab removed event { activeKey: '', action: 'removePane', userId: '', snyc: 'pythonIde'}
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      activeKey: activeKey,
      action: 'removePane',
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onActiveKey(activeKey) {
    // active key changed event { userId: '', activeKey: '', action: 'setActiveKey', snyc: 'pythonIde'}
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      activeKey: activeKey,
      action: 'setActiveKey',
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onStartRun(activeKey) {
    // start run event { userId: '', action: 'startRun', sync: 'pythonIde' }
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      activeKey: activeKey,
      action: 'startRun',
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onStopRun() {
    // stop run event { userId: '', action: 'stopRun', sync: 'pythonIde' }
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      action: 'stopRun',
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onClearConsole() {
    // clear console event { userId: '', action: 'clearConsole', sync: 'pythonIde' }
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      action: 'clearConsole',
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onMessage(evt) {
    const state = store.getState()
    if (!state.app.sync) return
    // if (!state.console.isRunning) return
    if (!evt || !evt.data || !evt.data.type || !evt.data.value) return
    IdeEventHandler.sendCommand({
      action: evt.data.type,
      value: evt.data.value,
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onDragFinished(size) {
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      action: 'dragFinished',
      size: size,
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onOutputDragFinished(size) {
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      action: 'outputDragFinished',
      size: size,
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
  }
  onIdeSizeChanged(size) {
    // const state = store.getState()
    // // don't send message on mobile device
    // if (state.app.isMobile) return
    // this.sendCommand({
    //   action: 'ideSize',
    //   size: size,
    // })
  }
  onIdeScoll(offset) {
    // const state = store.getState()
    // // don't send message on mobile device
    // if (state.app.isMobile) return
    // this.sendCommand({
    //   action: 'ideScroll',
    //   offset: offset,
    // })
  }

  onPopupScene(isShowPopupScene) {
    const state = store.getState()
    if (!state.app.sync) return
    this.sendCommand({
      action: 'popupScene',
      isShowPopupScene: isShowPopupScene,
    })
  }

  onScreenshot(hash, url, width, height, error = false) {
    const state = store.getState()
    if (!state.app.sync) return
    if (error) {
      this.sendCommand({
        action: 'screenshot',
        value: { hash, url, width, height, error: true },
      })
    } else {
      this.sendCommand({
        action: 'screenshot',
        value: { hash, url, width, height, error: false },
      })
    }
  }
}

const IdeEventHandler = new ideEventHandler()
export default IdeEventHandler

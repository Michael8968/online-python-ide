import { store } from '../redux/store'
import { setActiveKey, addPane, removePane, resetPanes } from '../redux/tabs'
import { startSync, stopSync, setReadOnly } from '../redux/app'
import {
  clearConsole,
  setCommand,
  setConsoleHeight,
  showPopupScene,
  hidePopupScene,
} from '../redux/console'
import {
  setEditorWidth,
  setLastSycData,
  setKeyboardHeight,
  // setLastLocalData,
} from '../redux/editor'

import IdeEventHandler from '../lib/ide-event-handler'

// process message from parent
class ideMessageHandler {
  constructor() {
    const state = store.getState()
    this.userId = state.app.userId
    this.aceMessageHandlers = {}
  }

  handleMessage(data) {
    if (!data) return

    if (data.sync !== 'pythonIde') return
    const state = store.getState()
    this.userId = state.app.userId
    // if (!state.app.sync) return
    console.log('[PYTHON IDE] handleMessage(data) ', data)
    if (data.action === 'startSync') {
      // start sync {  userId: '', action: 'startSync', sync: 'pythonIde' }
      if (data.userId === this.userId) {
        // 同步时，停止运行
        store.dispatch(setCommand('stopRun'))
        IdeEventHandler.sendCommand({
          action: 'stopRun',
        })
        store.dispatch(startSync())
      } else {
        store.dispatch(stopSync())
      }
    } else if (data.action === 'stopSync') {
      // stop sync {  userId: '', action: 'stopSync', sync: 'pythonIde' }
      if (data.userId !== this.userId) return
      // 取消同步时，停止运行
      if (state.app.isMaster || !state.app.writable) {
        // for teacher, stop self
        store.dispatch(setCommand('stopRun'))
        // stop student
        IdeEventHandler.sendCommand({
          action: 'stopRun',
        })
      } else {
        // stop teacher
        IdeEventHandler.sendCommand({
          action: 'stopRun',
        })
        // stop sync
        if (state.console.isRunning) {
          const message = {
            action: 'stopSync',
            type: 'turtle',
          }
          const iframe = document.getElementById('python-result-iframe')
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(message, '*')
          }
        }
      }
      store.dispatch(stopSync())
    } else if (data.action === 'setReadOnly') {
      // set read only {userId: '',  readOnly: true, action: 'setReadOnly', sync: 'pythonIde' }
      if (data.userId === 'all' || data.userId === this.userId) {
        if (state.app.isMaster) {
          if (state.app.writable && data.readOnly) {
            // store current sync data
            const data = {
              consoleHeight: state.console.consoleHeight,
              editorWidth: state.editor.editorWidth,
              tabs: state.tabs,
              action: 'syncContent',
              timestamp: new Date().getTime(),
            }
            store.dispatch(setLastSycData(data))
          }
        }
        store.dispatch(setReadOnly(data.readOnly))
        // 读写切换时，停止运行
        store.dispatch(setCommand('stopRun'))
      }
    } else if (data.action === 'syncContent') {
      // sync content { userId: '', action: 'syncContent', sync: 'pythonIde' }
      if (data.userId === this.userId) {
        // get tabs
        IdeEventHandler.onSyncContent(data.userId, data.to)
      } else if (!state.app.writable || data.share) {
        // teacher and writable state, don't sync content
        if (state.app.isMaster && state.app.writable) return
        // student don't sync content from other student
        if (!state.app.isMaster && data.userId !== state.app.teacherId) return
        // {  tabs: {}, userId: '', action: 'syncContent', sync: 'pythonIde' }
        if (data.to && data.to.length > 0 && data.to !== this.userId) return
        // to check timestamp for student under writable state
        let needUpdate = true
        if (!state.app.isMaster && state.app.writable) {
          if (
            data.timestamp > 0 &&
            state.tabs.timestamp > 0 &&
            state.tabs.timestamp > data.timestamp
          ) {
            needUpdate = false
          }
        }
        // set tabs
        if (data.tabs.panes && needUpdate) {
          store.dispatch(resetPanes(data.tabs.panes))
          store.dispatch(setActiveKey(data.tabs.activeKey))
          store.dispatch(setEditorWidth(data.editorWidth || 400))
          store.dispatch(setConsoleHeight(data.consoleHeight || 100))
          if (data.isShowPopupScene) {
            store.dispatch(showPopupScene())
          } else {
            store.dispatch(hidePopupScene())
          }
        }
      }
    } else if (data.action === 'setActiveKey') {
      // set active tab { userId: '', activeKey: '', action: 'setActiveKey', sync: 'pythonIde' }
      if (data.userId === this.userId) return
      if (state.app.writable) return
      store.dispatch(setActiveKey(data.activeKey))
    } else if (data.action === 'addPane') {
      // add tab { userId: '', title: '', content: '', key: '', action: 'addPane', sync: 'pythonIde' }
      if (data.userId === this.userId) return
      if (state.app.writable) return
      store.dispatch(addPane(data.title, data.content, data.key))
    } else if (data.action === 'removePane') {
      // remove tab {userId: '', activeKey: '', action: 'removePane', sync: 'pythonIde' }
      if (data.userId === this.userId) return
      if (state.app.writable) return
      store.dispatch(removePane(data.activeKey))
    } else if (data.action === 'startRun') {
      // start run { userId: '', action: 'startRun', sync: 'pythonIde' }
      if (data.userId === this.userId) return
      if (state.app.writable) return
      data.activeKey && store.dispatch(setActiveKey(data.activeKey))
      store.dispatch(setCommand('startRun'))
    } else if (data.action === 'stopRun') {
      // stop run { userId: '', action: 'stopRun', sync: 'pythonIde' }
      if (data.userId === this.userId) return
      if (state.app.writable) return
      store.dispatch(setCommand('stopRun'))
    } else if (data.action === 'clearConsole') {
      // clear console { userId: '', action: 'clearConsole', sync: 'pythonIde' }
      if (data.userId === this.userId) return
      if (state.app.writable) return
      store.dispatch(clearConsole())
    } else if (
      data.action === 'mousemove' ||
      data.action === 'mouse-event' ||
      data.action === 'keyboard-event' ||
      data.action === 'easygui'
    ) {
      // clear console { userId: '', action: 'clearConsole', sync: 'pythonIde' }
      if (data.userId === this.userId) return
      if (state.app.writable) return
      const message = { value: data.value, action: data.action, type: 'turtle' }
      const iframe = document.getElementById('python-result-iframe')
      iframe.contentWindow.postMessage(message, '*')
      // console.log('ide-message-handler : ', message)
    } else if (data.action === 'dragFinished') {
      if (data.userId === this.userId) return
      if (state.app.writable) return
      store.dispatch(setEditorWidth(data.size))
    } else if (data.action === 'outputDragFinished') {
      if (data.userId === this.userId) return
      if (state.app.writable) return
      store.dispatch(setConsoleHeight(data.size))
    } else if (data.action === 'cacheEditorData') {
      if (state.app.isMaster) return
      if (data.userId !== this.userId) return
      if (!state.app.writable) return

      // just cache data while writable state for student
      // const content = {
      //   consoleHeight: state.console.consoleHeight,
      //   editorWidth: state.editor.editorWidth,
      //   tabs: state.tabs,
      //   action: 'syncContent',
      //   timestamp: new Date().getTime(),
      // }
      // store.dispatch(setLastLocalData(content))
      // persistor.flush()
    } else if (data.action === 'setKeyboardState') {
      if (state.app.isMaster) return
      if (data.userId !== this.userId) return
      if (!state.app.writable) return
      if (data.value.show && data.value.height) {
        store.dispatch(setKeyboardHeight(data.value.height))
      } else {
        store.dispatch(setKeyboardHeight(0))
      }
      // value: {show : true, height : xxx}
    } else if (data.action === 'popupScene') {
      if (data.userId === this.userId) return
      if (state.app.writable) return
      if (data.isShowPopupScene) {
        store.dispatch(showPopupScene())
      } else {
        store.dispatch(hidePopupScene())
      }
    } else if (data.action === 'keyPress') {
      // this.setOutput(data.key, data.text)
      store.dispatch(setActiveKey(data.key))
      const handler = this.aceMessageHandlers[data.key]
      handler.editor.editor.focus()
      if (data.clean) {
        handler.editor.editor.setValue('', -1)
      } else {
        handler.editor.editor.onTextInput(data.text)
      }
    } else if (data.action === 'TEST') {
      // this.setOutput(data.key, data.text)
      this.handelTest(data.timeout)
    } else {
      if (data.userId === this.userId) return
      if (state.app.writable) return
      console.error('unhandled message : ', data)
    }
  }

  addAceMessageHandler(handler, key) {
    this.aceMessageHandlers[key] = handler
  }

  removeAceMessageHandler(key) {
    delete this.aceMessageHandlers[key]
  }

  handelTest(timeout = 100) {
    const THIS = this
    const activeKey = '0'
    store.dispatch(setActiveKey(activeKey))
    const handler = this.aceMessageHandlers[activeKey]
    handler.editor.editor.focus()
    handler.editor.editor.setValue('', -1)
    // read python code
    fetch('./lesson/T1_migong.py')
      .then(response => response.text())
      .then(text => {
        let chars = text.split('')
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        this.timer = setInterval(() => {
          if (chars.length > 0) {
            const text = chars.shift()
            handler.editor.editor.onTextInput(text)
          } else {
            clearInterval(THIS.timer)
            THIS.timer = null
          }
        }, timeout)
      })
      .catch(err => console.error(err))
  }
}

const IdeMessageHandler = new ideMessageHandler()
export default IdeMessageHandler

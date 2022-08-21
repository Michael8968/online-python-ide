import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import { filter } from 'lodash-es'
import SplitPane from 'react-split-pane'
import html2canvas from 'html2canvas'
import CryptoJS from 'crypto-js'
import Editor from '@/components/ide/editor'
// import Editor from '@/components/ide/editor-codemirror'
import Console from '@/components/ide/console'
import Output from '@/components/ide/output'
import PopupScene from '@/components/ide/popup-scene'
import IdeMessageHandler from '../lib/ide-message-handler'
import IdeEventHandler from '../lib/ide-event-handler'
import RtmClient from '../lib/peer'
import { getCombindedCode } from '../lib/lesson'
import { setTurtlePageUrl } from '@/redux/editor'
import { setScreenshot } from '@/redux/courseware'

import { uploadBlob2oss, getUploadVendor, uploadBlob2cos } from '../lib/api'

import {
  setActiveKey,
  addPane,
  removePane,
  updateContent,
  resetPanes,
} from '../redux/tabs'
import {
  setConsoleHeight,
  startRun,
  stopRun,
  clearConsole,
  setCommand,
} from '../redux/console'
import { setCodeHash, setEditorWidth } from '../redux/editor'
import { getTurtlePageUrl } from '@/lib/utility'
import { TEACHER_PEER_ID, STUDENT_PEER_ID } from '@/lib/configure'

import './editor.scss'

const { TabPane } = Tabs

class EditorView extends Component {
  constructor(props) {
    super(props)
    this.newTabIndex = 0

    this.initEditorWidth = ((document.body.clientWidth - 80) * 2) / 3
    this.maxEditorWidth = ((document.body.clientWidth - 80) * 9) / 10
    this.initConsoleHeight = 450
    this.minOutputHeight = 50

    this.state = {
      editorWidth: this.initEditorWidth,
      maxEditorWidth: this.maxEditorWidth,
      consoleHeight: this.initConsoleHeight,
      outputHeight: Math.max(
        document.body.clientHeight - this.initConsoleHeight - 8,
        this.minOutputHeight
      ),
      maxConsoleHeight: 700,
      minConsoleHeight: 400,
    }

    this.onDragFinished = this.onDragFinished.bind(this)
    this.onDragStarted = this.onDragStarted.bind(this)
    this.onOutputDragFinished = this.onOutputDragFinished.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.loginRTM = this.loginRTM.bind(this)
    this.getScreenshot = this.getScreenshot.bind(this)
    this.onKeydown = this.onKeydown.bind(this)
  }

  componentDidMount() {
    const { appRole, useRTM } = this.props
    // console.log('userId, useRTM', userId, useRTM)
    if (useRTM) {
      if (appRole === 'teacher') {
        this.loginRTM(TEACHER_PEER_ID, STUDENT_PEER_ID)
      } else {
        this.loginRTM(STUDENT_PEER_ID, TEACHER_PEER_ID)
      }
    } else {
      //监听message事件
      window.addEventListener('message', this.handleMessage, false)
      window.addEventListener('resize', this.handleResize, false)
      window.addEventListener('scroll', this.handleScroll, false)
      document.addEventListener('keydown', this.onKeydown)
    }
    const THIS = this
    setTimeout(() => {
      THIS.handleResize()
    }, 1000)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage)
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('keydown', this.onKeydown)
  }

  componentDidUpdate(prevProps) {
    const {
      activeKey,
      panes,
      consoles,
      errors,
      isRunning,
      sync,
      command,
      startRun,
      stopRun,
      clearConsole,
      editorWidth,
      // setCodeHash,
      // lastCodeHash,
      setCommand,
      consoleHeight,
      setTurtlePageUrl,
    } = this.props
    if (prevProps.command !== command) {
      // console.log('console.command', command)
      if (command === 'startRun') {
        const pane = filter(panes, { key: activeKey })
        clearConsole()
        startRun()
        // const content = pane[0].content
        // const message = { code: content, action: 'run', type: 'turtle' }
        const contents = getCombindedCode(pane[0])
        const message = {
          code: contents[0].content,
          files: contents,
          action: 'run',
          type: 'turtle',
        }
        const iframe = document.getElementById('python-result-iframe')
        const src = getTurtlePageUrl()
        if (src === iframe.src) {
          iframe.contentWindow.location.reload()
        } else {
          iframe.src = src
          setTurtlePageUrl(src)
        }
        iframe.onload = function() {
          setTimeout(() => {
            iframe.contentWindow.postMessage(message, '*')
          }, 1000)
        }
        iframe.focus()
        // if (lastCodeHash !== pane[0].key) {
        //   setCodeHash(pane[0].key)
        //   // reload tutle.html
        //   const src = getTurtlePageUrl()
        //   if (isTurtlePageUrlChanged(src)) {
        //     // iframe.src = src
        //   } else {
        //     iframe.contentWindow.location.reload()
        //   }
        //   iframe.onload = function() {
        //     setTimeout(() => {
        //       iframe.contentWindow.postMessage(message, '*')
        //     }, 1000)
        //   }
        // } else {
        //   setTimeout(() => {
        //     iframe.contentWindow.postMessage(message, '*')
        //   }, 1000)
        // }
      } else if (command === 'stopRun') {
        stopRun()
        const message = { action: 'pause', type: 'turtle' }
        const iframe = document.getElementById('python-result-iframe')
        iframe.contentWindow.postMessage(message, '*')
      }
      // reset command
      setCommand('')
    }
    if (prevProps.editorWidth !== editorWidth) {
      this.setState(state => ({
        editorWidth:
          editorWidth > state.maxEditorWidth
            ? state.maxEditorWidth
            : editorWidth,
      }))
    }
    if (prevProps.consoleHeight !== consoleHeight) {
      this.setState({ consoleHeight: consoleHeight })
    }
    if (!sync) return
    if (prevProps.panes.length < panes.length) {
      let added = []
      panes.map(pane => {
        const found = filter(prevProps.panes, { key: pane.key })
        if (!found || found.length <= 0) {
          added.push(pane)
        }
        return pane
      })
      if (added && added.length > 0) {
        added.map(pane => {
          IdeEventHandler.onAddPane(pane.title, pane.content, pane.key)
          return pane
        })
      }
    } else if (prevProps.panes.length > panes.length) {
      let removed = []
      prevProps.panes.map(pane => {
        const found = filter(panes, { key: pane.key })
        if (!found || found.length <= 0) {
          removed.push(pane)
        }
        return pane
      })
      if (removed && removed.length > 0) {
        removed.map(pane => {
          IdeEventHandler.onRemovePane(pane.key)
          return pane
        })
      }
    }
    if (prevProps.activeKey !== activeKey) {
      IdeEventHandler.onActiveKey(activeKey)
    }
    if (prevProps.isRunning && !isRunning) {
      // IdeEventHandler.onStopRun()
    } else if (!prevProps.isRunning && isRunning) {
      IdeEventHandler.onStartRun(activeKey)
    }
    if (
      (prevProps.consoles.length > 0 && consoles.length <= 0) ||
      (prevProps.errors.length > 0 && errors.length <= 0)
    ) {
      IdeEventHandler.onClearConsole()
    }
  }

  onKeydown(e) {
    if (e.code === 'KeyP' && e.altKey) {
      // console.log('e.code : ', e)
      if (!this.getScreenshot()) {
        console.error('getScreenshot error')
        IdeEventHandler.onScreenshot('', '', 0, 0, true)
      }
    }
  }

  joinRoom() {
    const { userId /*, courseId*/ } = this.props
    RtmClient.connect()
      .then(() => {
        RtmClient.on('incoming-data', data => {
          if (userId === data.userId) return
          // action: "changeSelection"
          // end: {row: 0, column: 8}
          // key: "0"
          // start: {row: 0, column: 8}
          // sync: "pythonAce"
          // timestamp: 1657959969697
          // to: ""
          // userId: "17311111111"
          console.info('incoming data ', data)
          if (data.sync === 'pythonAce') {
            const handler = IdeMessageHandler.aceMessageHandlers[data.key]
            handler && handler.handleMessage(data)
          } else {
            IdeMessageHandler.handleMessage(data)
          }
        })
      })
      .catch(err => {
        console.error(err)
      })
    // const { userId, courseId } = this.props
    // // const THIS = this
    // RtmClient.joinChannel(courseId)
    //   .then(() => {
    //     RtmClient.channels[courseId].joined = true
    //     RtmClient.on('ChannelMessage', ({ channelName, args }) => {
    //       const [message, memberId] = args
    //       if (memberId === userId) return
    //       if (channelName !== courseId) return
    //       const data = JSON.parse(message.text)
    //       if (data.sync === 'pythonAce') {
    //         const handler = IdeMessageHandler.aceMessageHandlers[data.key]
    //         handler && handler.handleMessage(data)
    //       } else {
    //         IdeMessageHandler.handleMessage(data)
    //       }
    //     })
    //   })
    //   .catch(err => {
    //     console.error(err)
    //   })
  }

  loginRTM(localId, remoteId) {
    const THIS = this
    if (RtmClient._logined) {
      return
    }
    try {
      RtmClient.init(localId, remoteId)
      RtmClient.login()
        .then(() => {
          RtmClient._logined = true
          THIS.joinRoom()
        })
        .catch(err => {
          console.error(err)
        })
    } catch (err) {
      console.error(err)
    }
  }

  handleMessage(evt) {
    // const { resetPanes, setActiveKey, updateContent } = this.props
    // if (evt.origin !== window.location.origin) return
    if (!evt.data) return
    if (!evt.data.sync) return
    if (evt.data.sync === 'pythonIde') {
      if (evt.data.action === 'register') {
        console.log('register : ', evt)
        IdeEventHandler.register(evt.source, evt.origin)
      } else if (evt.data.action === 'screenshot') {
        // console.log('screenshot : ', evt)
        if (!this.getScreenshot()) {
          IdeEventHandler.onScreenshot('', '', 0, 0, true)
        }
      } else {
        IdeMessageHandler.handleMessage(evt.data)
      }
    } else if (evt.data.sync === 'pythonAce') {
      const handler = IdeMessageHandler.aceMessageHandlers[evt.data.key]
      handler && handler.handleMessage(evt.data)
    }
  }

  getScreenshot() {
    const { screenshots } = this.props
    const THIS = this
    const appDom = document.getElementById('app-container')
    if (!appDom) return false
    const width = appDom.clientWidth
    const height = appDom.clientHeight
    if (width <= 0 || height <= 0) return false
    html2canvas(appDom, {
      logging: true,
      foreignObjectRendering: false,
      useCORS: true,
      allowTaint: true,
      removeContainer: true,
    }).then(function(canvas) {
      if (!canvas) return false
      const dataURL = canvas.toDataURL()
      if (!dataURL) return false
      const hash = CryptoJS.MD5(dataURL).toString()
      const filtered =
        screenshots &&
        screenshots.filter(screenshot => screenshot.hash === hash)
      if (filtered && filtered.length > 0) {
        // post message to parent
        IdeEventHandler.onScreenshot(
          filtered[0].hash,
          filtered[0].url,
          filtered[0].width,
          filtered[0].height,
          false
        )
        return true
      }
      THIS.uploadCanvas(canvas, hash)
        .then(res => {
          // console.log('uploadCanvas : ', res.hash, res.url, width, height)
          // cache data
          setScreenshot({ hash: res.hash, url: res.url, width, height })
          // post message to parent
          IdeEventHandler.onScreenshot(res.hash, res.url, width, height, false)
          return true
        })
        .catch(err => {
          console.error('uploadImage error', err)
          IdeEventHandler.onScreenshot('', '', 0, 0, true)
          return false
        })
    })
    return true
  }

  uploadCanvas(canvas, hash) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        function(blob) {
          if (!blob) return reject('canvas blob is null')
          getUploadVendor('ide', 'screenshot', 'pythonide')
            .then(res => {
              // console.log('getUploadVendor -> ', res)
              if (res.status === 200) {
                if (res.data.name === 'oss') {
                  uploadBlob2oss(res.data.accessInfo, blob, hash)
                    .then(res => {
                      // console.log('upload2oss', hash, res.url)
                      return resolve({ hash, url: res.url })
                    })
                    .catch(err => {
                      console.error('upload2oss', err)
                      // err && message.error(err)
                      return reject(err)
                    })
                } else if (res.data.name === 'cos') {
                  uploadBlob2cos(res.data.accessInfo, blob, hash)
                    .then(res => {
                      let url = 'https://' + res.Location
                      if (
                        res.Location.includes('https://') ||
                        res.Location.includes('http://')
                      ) {
                        url = res.Location
                      }
                      // console.log('upload2cos', hash, url)
                      return resolve({ hash, url })
                    })
                    .catch(err => {
                      console.error('upload2oss', err)
                      // err && message.error(err)
                      return reject(err)
                    })
                } else {
                  console.error('getUploadVendor -> ', res.data)
                }
              }
            })
            .catch(err => {
              console.error('getUploadVendor', err)
              // err && message.error(err)
              return reject(err)
            })
        },
        'image/jpeg',
        0.9
      )
    })
  }

  handleResize(evt) {
    this.maxEditorWidth = ((document.body.clientWidth - 80) * 9) / 10
    this.setState({ maxEditorWidth: this.maxEditorWidth })
    // console.log('this.maxEditorWidth', this.maxEditorWidth)
    const appDom = document.getElementById('app-container')
    // https://us-try.count.ly/dashboard#/5fc8532de088592357a5495d/crashes/fc5af9272e000aa03c0175560fcb347366c7a188
    if (appDom) {
      const size = {
        ideWidth: appDom.clientWidth,
        ideHeight: appDom.clientHeight,
      }
      IdeEventHandler.onIdeSizeChanged(size)
    }
  }

  handleScroll(evt) {
    const offset = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    }
    IdeEventHandler.onIdeScoll(offset)
  }

  onDragStarted(size) {
    const iframeWrap = document.getElementById('python-iframe-wrap')
    iframeWrap.style.pointerEvents = 'none'
  }
  onDragFinished(size) {
    const { setEditorWidth } = this.props
    const iframeWrap = document.getElementById('python-iframe-wrap')
    iframeWrap.style.pointerEvents = 'auto'
    IdeEventHandler.onDragFinished(size)
    IdeEventHandler.onCanvasRectChanged()

    setEditorWidth(size)
  }

  onOutputDragFinished(size) {
    const { setConsoleHeight } = this.props
    const consoleHeight =
      size > this.state.maxConsoleHeight
        ? this.state.maxConsoleHeight
        : size < this.state.minConsoleHeight
        ? this.state.minConsoleHeight
        : size
    this.setState({
      consoleHeight: consoleHeight,
      outputHeight: Math.max(
        document.body.clientHeight - consoleHeight - 8,
        this.minOutputHeight
      ),
    })
    const iframeWrap = document.getElementById('python-iframe-wrap')
    iframeWrap.style.pointerEvents = 'auto'
    IdeEventHandler.onOutputDragFinished(consoleHeight)
    IdeEventHandler.onCanvasRectChanged()

    setConsoleHeight(consoleHeight)
  }

  onChange = activeKey => {
    const { setActiveKey } = this.props
    setActiveKey(activeKey)
    // IdeEventHandler.onActiveKey(activeKey)
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  add = () => {
    const { addPane, setActiveKey } = this.props
    const activeKey = `newTab${this.newTabIndex++}`
    addPane('New Tab', 'Content of new Tab', activeKey)
    setActiveKey(activeKey)

    // IdeEventHandler.onAddPane('New Tab', 'Content of new Tab', activeKey)
    // IdeEventHandler.onActiveKey(activeKey)
  }

  remove = targetKey => {
    const { removePane, setActiveKey, panes, activeKey } = this.props
    let lastIndex = 0
    let key = activeKey
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const filtered = panes.filter(pane => pane.key !== targetKey)
    if (filtered.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        key = panes[lastIndex].key
      } else {
        key = panes[0].key
      }
    }
    removePane(targetKey)
    setActiveKey(key)

    // IdeEventHandler.onRemovePane(targetKey)
    // IdeEventHandler.onActiveKey(key)
  }
  render() {
    const { activeKey, panes, keyboardHeight } = this.props
    // const paddingStyle = { paddingBottom: `${keyboardHeight}px` }
    return (
      <div className="editor-container">
        <SplitPane
          className="split-pane-container"
          split="vertical"
          minSize={380}
          maxSize={this.state.maxEditorWidth}
          defaultSize={this.initEditorWidth}
          size={this.state.editorWidth}
          onChange={size => this.setState({ editorWidth: size })}
          onDragFinished={size => this.onDragFinished(size)}
          onDragStarted={this.onDragStarted}
        >
          <div className="tabs-container" id="ace-editor-container">
            <Tabs
              onChange={this.onChange}
              activeKey={activeKey}
              type="editable-card"
              onEdit={this.onEdit}
              hideAdd={true}
            >
              {panes &&
                panes.map(pane => (
                  <TabPane
                    tab={pane.title}
                    key={pane.key}
                    closable={pane.closable}
                  >
                    <Editor
                      editorWidth={this.state.editorWidth}
                      key={pane.key}
                      id={pane.key}
                      keyboardHeight={keyboardHeight}
                    />
                  </TabPane>
                ))}
            </Tabs>
          </div>
          <SplitPane
            split="horizontal"
            minSize={this.state.minConsoleHeight}
            maxSize={this.state.maxConsoleHeight}
            defaultSize={this.initConsoleHeight}
            size={this.state.consoleHeight}
            onChange={size => this.setState({ consoleHeight: size })}
            onDragStarted={this.onDragStarted}
            onDragFinished={size => this.onOutputDragFinished(size)}
          >
            <div className="output-wrap" id="python-output-wrap">
              <PopupScene output={[<Output key={'1'} />]}></PopupScene>
            </div>
            <div style={{ height: this.state.outputHeight + 'px' }}>
              <Console />
            </div>
          </SplitPane>
        </SplitPane>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeKey: state.tabs.activeKey,
    panes: state.tabs.panes,
    isRunning: state.console.isRunning,
    consoles: state.console.consoles,
    errors: state.console.errors,
    sync: state.app.sync,
    command: state.console.command,
    editorWidth: state.editor.editorWidth,
    lastCodeHash: state.editor.lastCodeHash,
    consoleHeight: state.console.consoleHeight,
    useRTM: state.app.useRTM,
    userId: state.app.userId,
    appRole: state.app.appRole,
    courseId: state.app.courseId,
    isShowPopupScene: state.console.isShowPopupScene,
    keyboardHeight: state.editor.keyboardHeight,
    screenshots: state.courseware.screenshots,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setActiveKey,
      addPane,
      removePane,
      setConsoleHeight,
      updateContent,
      resetPanes,
      startRun,
      stopRun,
      clearConsole,
      setCodeHash,
      setCommand,
      setTurtlePageUrl,
      setEditorWidth,
      setScreenshot,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorView)

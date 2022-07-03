import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Icon, Button, Modal, message } from 'antd'
import { filter } from 'lodash-es'
import { saveAs } from 'file-saver'
import CryptoJS from 'crypto-js'
// import Fullscreen from './fullscreen'
import logoImage from '../../assets/img/logo.png'
import {
  startRun,
  stopRun,
  clearConsole,
  showPopupScene,
  hidePopupScene,
} from '@/redux/console'
import { addPane, setActiveKey } from '@/redux/tabs'
import { setMyFiles } from '@/redux/myfiles'
import { setCodeHash, setTurtlePageUrl } from '@/redux/editor'
// import { getWebideCode } from '../../lib/api'
// import UploadFile from './upload-file'
import IdeEventHandler from '../../lib/ide-event-handler'
import { getTurtlePageUrl } from '@/lib/utility'
import { getCombindedCode } from '../../lib/lesson'
import browserDetect from '../../lib/browser-detect'
import { showCourseware, hideCourseware } from '@/redux/courseware'

import './header.scss'

const JSZip = require('jszip')()

// const { SubMenu } = Menu

class AppHeader extends Component {
  constructor(props) {
    super(props)
    this.newTabIndex = 0
    this.inputOpenFileRef = React.createRef()
    this.isMobile = browserDetect.isMobile()

    this.state = { showUploadFile: false }

    this.onCreate = this.onCreate.bind(this)
    this.onRunCode = this.onRunCode.bind(this)
    this.onDownload = this.onDownload.bind(this)
    this.onOpenFile = this.onOpenFile.bind(this)
    this.onFileSelected = this.onFileSelected.bind(this)
    this.onUpload = this.onUpload.bind(this)
    // this.getMyFiles = this.getMyFiles.bind(this)
    this.onUploadFileCanceled = this.onUploadFileCanceled.bind(this)
    this.onUploadFileFinished = this.onUploadFileFinished.bind(this)
    this.onSoptRun = this.onSoptRun.bind(this)
    this.onPopupScene = this.onPopupScene.bind(this)
    this.onOpenCourseWare = this.onOpenCourseWare.bind(this)
  }

  componentDidMount() {
    // const THIS = this
    // setTimeout(() => {
    //   THIS.getMyFiles()
    // }, 1000)
  }

  // getMyFiles() {
  //   const { userId, setMyFiles } = this.props
  //   // const THIS = this
  //   getWebideCode(userId)
  //     .then(res => {
  //       // console.log('getWebideCode', res)
  //       setMyFiles(res.data || [])
  //     })
  //     .catch(err => {
  //       console.error('getWebideCode', err)
  //       err && message.error(err)
  //     })
  // }

  onUploadFileCanceled() {
    this.setState({ showUploadFile: false })
  }

  onUploadFileFinished() {
    this.getMyFiles()
    this.setState({ showUploadFile: false })
  }

  onCreate() {
    const { addPane, setActiveKey, panes } = this.props
    let activeKey = `temp${this.newTabIndex++}`
    let pane = filter(panes, { key: activeKey })
    while (pane && pane.length > 0) {
      activeKey = `temp${this.newTabIndex++}`
      pane = filter(panes, { key: activeKey })
    }
    addPane(`temp${this.newTabIndex}.py`, '', activeKey)
    setActiveKey(activeKey)
  }

  onOpenFile = e => {
    if (this.isMobile) {
      message.info('移动设备不支持该操作')
      return
    }
    // console.log('onOpenFile', e)
    e.preventDefault()
    this.inputOpenFileRef.current.click()
  }
  onUpload() {
    const { activeKey, panes } = this.props
    const pane = filter(panes, { key: activeKey })
    // check content in current tab
    if (!pane || !pane[0].content || pane[0].content.length <= 0) {
      // console.log('pane.content', pane.content)
      message.warning('请输入代码后再保存')
      return false
    }
    this.setState({ showUploadFile: true })
  }
  onFileSelected(files) {
    const { addPane, setActiveKey, panes } = this.props
    // console.log('onFileSelected', files)
    if (!files || files.length <= 0) return
    var reader = new FileReader()
    // Closure to capture the file information.
    reader.addEventListener(
      'load',
      function() {
        // name: "README.txt"
        // console.log('reader.result', reader.result)
        const hash =
          CryptoJS.MD5(reader.result).toString() + new Date().getTime()
        // console.log('hash', hash)
        let filename = files[0].name.replace('.txt', '.py')
        let pane = filter(panes, { title: filename })
        // console.log('filename 1', filename)
        let index = 0
        while (pane && pane.length > 0) {
          index++
          // change file name
          const fileArray = files[0].name.split('.')
          filename = fileArray[0] + index + '.py'
          // console.log('filename 2', filename)
          pane = filter(panes, { title: filename })
        }
        addPane(filename, reader.result, hash)
        setActiveKey(hash)
      },
      false
    )

    // Read in the image file as a data URL.
    reader.readAsText(files[0])
  }
  onDownload(e) {
    const { activeKey, panes } = this.props

    if (this.isMobile) {
      message.info('移动设备不支持该操作')
      return
    }

    const pane = filter(panes, { key: activeKey })
    if (e.key === 'download:1') {
      // download current file
      if (pane[0].content && pane[0].content.length > 0) {
        var blob = new Blob([pane[0].content], {
          type: 'text/plain;charset=utf-8',
        })
        saveAs(blob, pane[0].title)
      } else {
        Modal.warning({
          title: '警告',
          content: '当前文件为空，请输入内容后再下载。',
        })
      }
    } else if (e.key === 'download:2') {
      // download all files
      let empty = true
      panes.map(pane => {
        if (pane.content && pane.content.length > 0) {
          JSZip.file(pane.title, pane.content)
          empty = false
        }
        return pane
      })

      if (empty) {
        Modal.warning({
          title: '警告',
          content: '所有文件为空，请输入内容后再下载。',
        })
      } else {
        JSZip.generateAsync({ type: 'blob' }).then(function(content) {
          saveAs(content, 'python-turtle.zip')
        })
      }
    }
  }

  onRunCode() {
    const {
      startRun,
      activeKey,
      panes,
      clearConsole,
      setTurtlePageUrl,
    } = this.props
    // console.log('onRunCode')
    const pane = filter(panes, { key: activeKey })
    // const message = { code: content, action: 'run', type: 'turtle' }
    const contents = getCombindedCode(pane[0])

    if (
      !contents[0] ||
      !contents[0].content ||
      contents[0].content.length <= 0
    ) {
      message.warning('代码为空，请输入代码后再试')
      return false
    }
    clearConsole()
    startRun()

    const messageEx = {
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
        iframe.contentWindow.postMessage(messageEx, '*')
      }, 1000)
    }
    iframe.focus()
  }
  onSoptRun() {
    const { stopRun } = this.props

    stopRun()
    const message = { action: 'pause', type: 'turtle' }
    const iframe = document.getElementById('python-result-iframe')
    iframe.contentWindow.postMessage(message, '*')

    IdeEventHandler.onStopRun()
  }

  onPopupScene() {
    const { showPopupScene, hidePopupScene, isShowPopupScene } = this.props
    if (isShowPopupScene) {
      hidePopupScene()
      IdeEventHandler.onPopupScene(false)
    } else {
      showPopupScene()
      IdeEventHandler.onPopupScene(true)
    }
  }

  onOpenCourseWare() {
    // console.log('onOpenCourseWare')
    const { isCoursewareVisible, showCourseware, hideCourseware } = this.props
    isCoursewareVisible ? hideCourseware() : showCourseware()
  }

  render() {
    const { userName, isRunning } = this.props
    return (
      <div className="app-header">
        <div className="header-left">
          <div className="app-logo">
            <img src={logoImage} alt="logo" />
          </div>
        </div>
        <div className="tool-bar">
          <Button
            icon="file-add"
            type="link"
            ghost
            onClick={this.onOpenCourseWare}
          >
            课件代码
          </Button>
          <Button icon="file-add" type="link" ghost onClick={this.onCreate}>
            新建文件
          </Button>
          <input
            ref={this.inputOpenFileRef}
            type="file"
            style={{ display: 'none' }}
            onChange={e => this.onFileSelected(e.target.files)}
            onClick={e => {
              e.target.value = null
            }}
            accept=".txt, .py"
          />
          <Button
            icon="folder-open"
            type="link"
            ghost
            onClick={this.onOpenFile}
          >
            打开文件
          </Button>
          {/* {isLogon ? (
            <Button icon="save" type="link" ghost onClick={this.onUpload}>
              保存到云端
            </Button>
          ) : null}
          <Menu onClick={this.onDownload} mode="horizontal">
            <SubMenu
              title={
                <span className="submenu-title-wrapper">
                  <Icon type="download" />
                  下载
                </span>
              }
            >
              <Menu.Item key="download:1">下载当前文件</Menu.Item>
              <Menu.Item key="download:2">下载所有文件</Menu.Item>
            </SubMenu>
          </Menu> */}
          <Button
            icon="fullscreen"
            type="link"
            ghost
            onClick={this.onPopupScene}
          >
            弹出窗口
          </Button>
        </div>
        {isRunning ? (
          <div className="run-button" onClick={this.onSoptRun}>
            <Icon type="pause" className="run-button-icon" />
            停止
          </div>
        ) : (
          <div className="run-button" onClick={this.onRunCode}>
            <Icon type="caret-right" className="run-button-icon" />
            运行
          </div>
        )}
        <div className="header-right">
          <span>欢迎你！{userName}</span>
        </div>

        {/* <Modal
          title="保存到云端"
          visible={this.state.showUploadFile}
          footer={null}
          onCancel={this.onUploadFileCanceled}
        >
          {this.state.showUploadFile ? (
            <UploadFile
              onCancel={this.onUploadFileCanceled}
              onSave={this.onUploadFileFinished}
            />
          ) : null}
        </Modal> */}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userName: state.app.userName,
    userId: state.app.userId,
    activeKey: state.tabs.activeKey,
    panes: state.tabs.panes,
    myFiles: state.myfiles.myFiles,
    isRunning: state.console.isRunning,
    isLogon: state.app.isLogon,
    lastCodeHash: state.editor.lastCodeHash,
    sync: state.app.sync,
    writable: state.app.writable,
    turtlePageUrl: state.editor.turtlePageUrl,
    isShowPopupScene: state.console.isShowPopupScene,
    isCoursewareVisible: state.courseware.isCoursewareVisible,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      startRun,
      stopRun,
      addPane,
      setActiveKey,
      setMyFiles,
      clearConsole,
      setCodeHash,
      setTurtlePageUrl,
      showPopupScene,
      hidePopupScene,
      showCourseware,
      hideCourseware,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader)

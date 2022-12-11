import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { message } from 'antd'
import { PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { filter } from 'lodash-es'
import {
  hidePopupScene,
  stopRun,
  clearConsole,
  startRun,
} from '../../redux/console'
import IdeEventHandler from '../../lib/ide-event-handler'
import { getTurtlePageUrl } from 'lib/utility'
import { getCombindedCode } from '../../lib/lesson'
import renderMinImage from '../../assets/img/render-min.png'
import { setTurtlePageUrl } from 'redux/editor'

import './popup-scene.scss'

const Draggabilly = require('draggabilly')

class PopupScene extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEmbed: true,
      isMax: true,
      isMin: false,
      // top: 0,
      // left: 0,
    }

    this.onClose = this.onClose.bind(this)
    this.onMax = this.onMax.bind(this)
    this.onMin = this.onMin.bind(this)
    this.onSoptRun = this.onSoptRun.bind(this)
    this.onRunCode = this.onRunCode.bind(this)
  }
  componentDidMount() {
    const { isShowPopupScene } = this.props
    this.draggie = new Draggabilly('#popup-scene-container', {
      // options
      containment: '.editor-container',
      handle: '.popup-scene-title',
    })
    this.draggie.on('dragStart', function(event, pointer) {
      const iframeWrap = document.getElementById('python-iframe-wrap')
      if (iframeWrap) {
        iframeWrap.style.pointerEvents = 'none'
      }
    })
    this.draggie.on('dragEnd', function(event, pointer) {
      const iframeWrap = document.getElementById('python-iframe-wrap')
      if (iframeWrap) {
        iframeWrap.style.pointerEvents = 'auto'
      }
    })
    if (isShowPopupScene) {
      this.draggie.enable()
    } else {
      this.draggie.disable()
    }
    const rootDOM = document.getElementById('root')
    const left = rootDOM.clientWidth / 2 - 300
    const top = rootDOM.clientHeight / 2 - 250
    // this.setState({ top: top, left: left })
    this.draggie.setPosition(left, top)
  }
  componentDidUpdate(prevProps) {
    const { isShowPopupScene } = this.props
    if (prevProps.isShowPopupScene !== isShowPopupScene) {
      if (isShowPopupScene) {
        this.setState({ isEmbed: false })
        this.draggie && this.draggie.enable()
      } else {
        this.setState({ isEmbed: true })
        this.draggie && this.draggie.disable()
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

  onClose() {
    const { hidePopupScene } = this.props
    hidePopupScene()
    IdeEventHandler.onPopupScene(false)

    // stopRun()
    // const message = { action: 'pause', type: 'turtle' }
    // const iframe = document.getElementById('python-result-iframe')
    // iframe.contentWindow.postMessage(message, '*')
    //
    // IdeEventHandler.onStopRun()
    this.setState({ isMax: true, isMin: false })
  }
  onMax() {
    this.setState(state => ({
      isMax: !state.isMax,
    }))
  }

  onMin() {
    this.setState(state => ({
      isMin: !state.isMin,
    }))
  }

  render() {
    const { isShowPopupScene, output, isRunning, caption } = this.props
    const style = isShowPopupScene ? { display: 'flex' } : { display: 'none' }
    const className = this.state.isEmbed
      ? 'popup-scene-container-embed'
      : this.state.isMax
      ? 'popup-scene-container popup-scene-container-max'
      : this.state.isMin
      ? 'popup-scene-container popup-scene-container-min'
      : 'popup-scene-container'
    // const iconMax = this.state.isMax ? 'border' : 'arrows-alt'
    // const iconMin = this.state.isMin ? 'border' : 'shrink'

    return (
      <div className={className} id="popup-scene-container">
        <div className="popup-scene-title" style={style}>
          <div className="title-name">{caption}</div>
          <div className="button-wrap">
            {isRunning ? (
              <div className="run-button" onClick={this.onSoptRun}>
                <PauseOutlined className="run-button-icon" />
                停止
              </div>
            ) : (
              <div className="run-button" onClick={this.onRunCode}>
                <CaretRightOutlined className="run-button-icon"/>
                运行
              </div>
            )}
            {/*this.state.isMax ? null : (
              <Button
                icon={iconMin}
                type="link"
                ghost
                className="close-button"
                onClick={this.onMin}
              ></Button>
            )}
            {this.state.isMin ? null : (
              <Button
                icon={iconMax}
                type="link"
                ghost
                className="close-button"
                onClick={this.onMax}
              ></Button>
            )*/}
            {/*<Button
              icon="close"
              type="link"
              ghost
              className="close-button"
              onClick={this.onClose}
            ></Button>*/}
            <div className="close-button" onClick={this.onClose}>
              <img src={renderMinImage} className="close-button-icon" alt="" />
            </div>
          </div>
        </div>
        <div className="content" id="popup-scene-wrap">
          {output}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isShowPopupScene: state.console.isShowPopupScene,
    isRunning: state.console.isRunning,
    caption: state.console.caption,
    activeKey: state.tabs.activeKey,
    panes: state.tabs.panes,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { hidePopupScene, stopRun, clearConsole, startRun, setTurtlePageUrl },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupScene)

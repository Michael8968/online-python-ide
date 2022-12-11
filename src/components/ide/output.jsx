import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { message } from 'antd'
// import { clearConsole } from 'redux/console'
import { addConsole, updateError, stopRun, setCaption } from 'redux/console'
import { getTurtlePageUrl } from 'lib/utility'
import { setTurtlePageUrl } from 'redux/editor'

import './output.scss'

class Output extends Component {
  constructor(props) {
    super(props)
    this.iFrame = null

    this.handleMessage = this.handleMessage.bind(this)
    this.onLoad = this.onLoad.bind(this)
  }

  componentDidMount() {
    const { setTurtlePageUrl } = this.props
    //监听message事件
    window.addEventListener('message', this.handleMessage, false)

    const src = getTurtlePageUrl()
    setTurtlePageUrl(src)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage)
  }

  handleMessage(evt) {
    const {
      activeKey,
      addConsole,
      updateError,
      stopRun,
      setCaption,
    } = this.props
    // if (evt.origin !== window.location.origin) return
    if (!evt.data) return
    if (!evt.data.type || !evt.data.action) return
    if (evt.data.action === 'output') {
      // console.log('handleMessage', evt.data.output)
      addConsole(activeKey, evt.data.output, new Date().getTime())
    } else if (evt.data.action === 'error') {
      if (
        !(
          evt.data.output.includes('TimeLimitError') ||
          evt.data.output.includes('SystemExit')
        )
      ) {
        // console.log('handleMessage', evt.data.output, evt.data.error)
        addConsole(activeKey, evt.data.output, new Date().getTime(), true)
        updateError(activeKey, evt.data.error)
        // message.error(evt.data.output)
        stopRun()
      }
    } else if (evt.data.action === 'finished') {
      message.success('运行结束')
      stopRun()
    } else if (evt.data.action === 'caption') {
      setCaption(evt.data.caption)
    } else {
      if (evt.data.source !== '@devtools-page') {
        console.error('unhandled message : ', evt.data)
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // const { writable, sync } = this.props
    // // console.log('prevProps.writable', prevProps.writable, writable)
    // if (prevProps.writable !== writable || prevProps.sync !== sync) {
    //   // getTurtlePageUrl()
    //   // post message
    //   const message = {
    //     sync: sync,
    //     writable: writable,
    //     action: 'paramters',
    //     type: 'turtle',
    //   }
    //   this.iFrame.contentWindow.postMessage(message, '*')
    // }
  }

  onLoad() {
    // register to iFrame
    const message = { action: 'register', type: 'turtle' }
    this.iFrame.contentWindow.postMessage(message, '*')
  }
  render() {
    const { turtlePageUrl } = this.props
    return (
      <div className="result-container" id="python-iframe-wrap">
        <iframe
          className="iframe"
          title="Turtle"
          src={turtlePageUrl}
          width={'100%'}
          height={'100%'}
          frameBorder="0"
          scrolling="yes"
          id="python-result-iframe"
          allow="autoplay; microphone; camera"
          onLoad={this.onLoad}
          ref={iFrame => {
            this.iFrame = iFrame
          }}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeKey: state.tabs.activeKey,
    consoleHeight: state.console.consoleHeight,
    sync: state.app.sync,
    writable: state.app.writable,
    userId: state.app.userId,
    courseId: state.app.courseId,
    turtlePageUrl: state.editor.turtlePageUrl,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { updateError, addConsole, stopRun, setTurtlePageUrl, setCaption },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Output)

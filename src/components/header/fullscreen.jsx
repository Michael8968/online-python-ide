import React, { Component } from 'react'
// import { Icon } from 'antd'
import {FullscreenExitOutlined, FullscreenOutlined} from '@ant-design/icons';

export default class fullscreen extends Component {
  state = { fullscreen: false }

  openFullscreen() {
    const ele = document.documentElement
    if (ele.requestFullscreen) {
      return ele.requestFullscreen()
    } else if (ele.webkitRequestFullScreen) {
      return ele.webkitRequestFullScreen()
    } else if (ele.mozRequestFullScreen) {
      return ele.mozRequestFullScreen()
    } else {
      return ele.msRequestFullscreen()
    }
  }

  exitFullscreen() {
    if (document.exitFullScreen) {
      document.exitFullScreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }

  isFullScreen() {
    return !!(
      document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      document.webkitFullScreen ||
      document.msFullScreen
    )
  }

  componentDidMount() {
    // 监听键盘F11，替换默认的全屏事件
    document.addEventListener('keydown', e => {
      if (e.keyCode === 122) {
        e.preventDefault()
        this.state.fullscreen ? this.exitFullscreen() : this.openFullscreen()
      }
    })
    // 监听全屏切换事件
    document.addEventListener('fullscreenchange', e => {
      this.setState({
        fullscreen: this.isFullScreen(),
      })
    })
  }

  render() {
    return this.state.fullscreen ? (
        <FullscreenExitOutlined onClick={this.exitFullscreen}/>
    ) : (
        <FullscreenOutlined onClick={this.openFullscreen} />
    )
  }
}

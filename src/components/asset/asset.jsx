import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, message } from 'antd'
import { filter, keyBy } from 'lodash-es'
import { setCurNum, hideAssetView } from '../../redux/asset'
import Preview from './preview'
import { getFileData } from '../../lib/api'

import './asset.scss'

const Draggabilly = require('draggabilly')

class Asset extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      nums: {},
      filterImages: [],
      curImageName: '',
      isShowPreview: false,
      curImageUrl: '',
    }

    const THIS = this
    getFileData('./image/image.json')
      .then(res => {
        // console.log('loadPython res', res)
        const data = res.data
        const nums = keyBy(data.images, 'num')
        if (THIS.props.curNum === 0) {
          THIS.setState({
            images: data.images,
            nums: nums,
            filterImages: data.images,
          })
        } else {
          const filtered = filter(data.images, { num: THIS.props.curNum })
          THIS.setState({
            images: data.images,
            nums: nums,
            filterImages: filtered,
          })
        }
      })
      .catch(error => {
        // console.log(error)
        message.error(`lesson.json 打开失败(${error})`)
      })
    // fetch('./image/image.json')
    //   .then(r => r.json())
    //   .then(data => {
    //     const nums = keyBy(data.images, 'num')
    //     if (THIS.props.curNum === 0) {
    //       THIS.setState({
    //         images: data.images,
    //         nums: nums,
    //         filterImages: data.images,
    //       })
    //     } else {
    //       const filtered = filter(data.images, { num: THIS.props.curNum })
    //       THIS.setState({
    //         images: data.images,
    //         nums: nums,
    //         filterImages: filtered,
    //       })
    //     }
    //
    //     // console.log('images', Object.keys(nums))
    //   })

    this.onNumChoosed = this.onNumChoosed.bind(this)
    this.onFullChoosed = this.onFullChoosed.bind(this)
    this.onClose = this.onClose.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.onClosePreview = this.onClosePreview.bind(this)
  }
  componentDidMount() {
    const draggie = new Draggabilly('.asset-container', {
      // options
      containment: true,
      handle: '.asset-view-title',
    })
    draggie.on('dragStart', function(event, pointer) {
      const iframeWrap = document.getElementById('python-iframe-wrap')
      iframeWrap.style.pointerEvents = 'none'
    })
    draggie.on('dragEnd', function(event, pointer) {
      const iframeWrap = document.getElementById('python-iframe-wrap')
      iframeWrap.style.pointerEvents = 'auto'
    })
  }
  onNumChoosed(num, e) {
    const { setCurNum } = this.props
    e.preventDefault()
    // console.log('onNumChoosed', num)
    setCurNum(num)

    const filtered = filter(this.state.images, { num: num })
    this.setState({ filterImages: filtered })
  }

  onFullChoosed() {
    const { setCurNum } = this.props
    setCurNum(0)
    this.setState(state => ({
      filterImages: state.images,
    }))
  }
  onClose() {
    const { hideAssetView } = this.props
    hideAssetView()
  }

  showPreview(imageName, imageUrl) {
    this.setState(state => ({
      isShowPreview: true,
      curImageUrl: imageUrl,
      curImageName: imageName,
    }))
  }
  onClosePreview() {
    this.setState(state => ({
      isShowPreview: false,
    }))
  }

  render() {
    const { curNum } = this.props
    const keys = Object.keys(this.state.nums)
    const nums =
      keys.length > 0
        ? keys.map((num, index) => (
            <div
              className={
                curNum === num
                  ? 'viewer-header-item-active'
                  : 'viewer-header-item'
              }
              key={index}
              onClick={e => this.onNumChoosed(num, e)}
            >
              {num}
            </div>
          ))
        : null
    const images = this.state.filterImages.map((item, index) => (
      <div
        className="image-viewer-item"
        key={index}
        onClick={() => {
          this.showPreview(
            item.name,
            (window.imageRoot + item.url).replace('//', '/')
          )
        }}
      >
        <img src={window.imageRoot + item.url} alt="" />
        <span>{item.name}</span>
      </div>
    ))
    return (
      <div className="asset-container">
        <div className="asset-view-title">
          图片集
          <Button
            icon="close"
            type="link"
            ghost
            className="close-button"
            onClick={this.onClose}
          ></Button>
        </div>
        <div className="content">
          <div className="image-viewer-header">
            <label>按课程：</label>
            <div className="viewer-header-items">
              <div
                className={
                  curNum === 0
                    ? 'viewer-header-item-active'
                    : 'viewer-header-item'
                }
                onClick={this.onFullChoosed}
              >
                全部
              </div>
              {nums}
            </div>
          </div>
          <div className="image-viewer-box" id="imageViewer">
            {images}
          </div>
        </div>
        <Modal
          title={
            <span className="image-preview-title">
              {this.state.curImageName}
            </span>
          }
          visible={this.state.isShowPreview}
          footer={null}
          onCancel={this.onClosePreview}
        >
          {this.state.isShowPreview ? (
            <Preview
              imageUrl={this.state.curImageUrl}
              onCancel={this.onClosePreview}
              onCopy={this.onClosePreview}
            />
          ) : null}
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { curNum: state.asset.curNum }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setCurNum, hideAssetView }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Asset)

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import './preview.scss'

class Preview extends Component {
  constructor(props) {
    super(props)

    this.onCancel = this.onCancel.bind(this)
    this.onCopy = this.onCopy.bind(this)
  }
  componentDidMount() {}
  onCancel() {
    this.props.onCancel()
  }

  onCopy() {
    this.props.onCopy()
  }

  render() {
    const { imageUrl } = this.props
    const fullImageUrl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname.replace('index.html', '') +
      imageUrl
    return (
      <div className="preview-container">
        <div className="image-section">
          <img src={imageUrl} alt="" />
        </div>
        <div className="image-url">{fullImageUrl}</div>
        <div className="button-section">
          <Button onClick={this.onCancel}>取消</Button>
          <CopyToClipboard
            text={fullImageUrl}
            onCopy={() => this.setState({ copied: true })}
          >
            <Button type="primary" onClick={this.onCopy}>
              拷贝
            </Button>
          </CopyToClipboard>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { curNum: state.asset.curNum }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)

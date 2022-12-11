import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Input } from 'antd'
import { CloseOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import {
  hideSearch,
  setSearchText,
  setSearchNext,
  setSearchPrevious,
} from '../../redux/search'
import './search.scss'

const Draggabilly = require('draggabilly')

class Search extends Component {
  constructor(props) {
    super(props)

    this.onClose = this.onClose.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSearchPrevious = this.onSearchPrevious.bind(this)
    this.onSearchNext = this.onSearchNext.bind(this)
  }
  componentDidMount() {
    const draggie = new Draggabilly('.search-container', {
      // options
      containment: true,
    })
    draggie.on('dragStart', function(event, pointer) {
      const iframeWrap = document.getElementById('python-iframe-wrap')
      iframeWrap.style.pointerEvents = 'none'
    })
    draggie.on('dragEnd', function(event, pointer) {
      const iframeWrap = document.getElementById('python-iframe-wrap')
      iframeWrap.style.pointerEvents = 'auto'
    })
    document.getElementById('search-input').focus()
  }

  onClose() {
    const { hideSearch } = this.props
    hideSearch()
  }
  onChange = e => {
    const { setSearchText } = this.props
    const { value } = e.target
    // console.log('value', value)
    setSearchText(value)
  }
  onSearchPrevious() {
    const { setSearchPrevious } = this.props
    setSearchPrevious()
  }
  onSearchNext() {
    const { setSearchNext } = this.props
    setSearchNext()
  }

  render() {
    return (
      <div className="search-container">
        <Input
          id="search-input"
          placeholder="请输入搜索内容"
          className="search-input"
          onChange={this.onChange}
        />
        <div className="search-button" onClick={this.onSearchPrevious}>
            <CaretUpOutlined />
        </div>
        <div className="search-button" onClick={this.onSearchNext}>
            <CaretDownOutlined />
        </div>
        <div className="close-button" onClick={this.onClose}>
            <CloseOutlined />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { hideSearch, setSearchText, setSearchNext, setSearchPrevious },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)

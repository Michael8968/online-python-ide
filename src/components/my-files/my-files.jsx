import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { List, Icon, message, Button, Modal } from 'antd'
import CryptoJS from 'crypto-js'
import { hideMyFiles } from '../../redux/myfiles'
import { getWebideCode, deleteWebideCode } from '../../lib/api'
import { addPane, setActiveKey } from '../../redux/tabs'
import { setMyFiles } from '../../redux/myfiles'
import { getFileData } from '../../lib/api'

import './my-files.scss'

class MyFiles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // files: [],
    }
    // createTime: "2020-04-29T10:52:30.000+0000"
    // id: 3
    // status: 1
    // updateTime: null
    // userId: "010e4bf0040442089e677e6980fcf3fc"
    // webideCodeFile: "http://aomengassets.oss-cn-hangzhou.aliyuncs.com/user/idecompiler/7bec23789b3e44a12166f3f9c1fe6075"
    // webideCodeName: "T1_migong.py"

    this.onSelect = this.onSelect.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.getMyFiles = this.getMyFiles.bind(this)
  }
  componentDidMount() {
    this.getMyFiles()
  }
  getMyFiles() {
    const { userId, setMyFiles } = this.props
    getWebideCode(userId)
      .then(res => {
        // console.log('getWebideCode', res)
        setMyFiles(res.data || [])
      })
      .catch(err => {
        console.error('getWebideCode', err)
        err && message.error(err)
      })
  }
  onSelect(item) {
    // console.log('onSelect', item)
    // id: 4
    // status: 1
    // updateTime: null
    // userId: "010e4bf0040442089e677e6980fcf3fc"
    // webideCodeFile: "http://aomengassets.oss-cn-hangzhou.aliyuncs.com/user/idecompiler/7614e7b86904f2ff2c1dbd98ddd34507"
    // webideCodeName: "T1_migong.py"
    const { addPane, setActiveKey } = this.props
    getFileData(item.webideCodeFile)
      .then(res => {
        // console.log('loadPython res', res)
        const data = res.data
        const hash = CryptoJS.MD5(data).toString()
        // console.log('hash', hash)
        addPane(item.webideCodeName, data, hash)
        setActiveKey(hash)
      })
      .catch(error => {
        // console.log(error)
        message.error(`lesson.json 打开失败(${error})`)
      })
    // const myHeaders = new Headers({
    //   'Content-Type': 'text/plain',
    //   'X-Custom-Header': 'ProcessThisImmediately',
    //   'Accept-Ranges': 'bytes',
    // })
    // const myRequest = new Request(item.webideCodeFile, {
    //   method: 'GET',
    //   headers: myHeaders,
    //   mode: 'cors',
    //   cache: 'default',
    // })

    // fetch(myRequest)
    //   .then(response => response.text())
    //   .then(data => {
    //     // console.log(data)
    //     const hash = CryptoJS.MD5(data).toString()
    //     console.log('hash', hash)
    //     addPane(item.webideCodeName, data, hash)
    //     setActiveKey(hash)
    //   })
  }
  onClose() {
    const { hideMyFiles } = this.props
    hideMyFiles()
  }
  onRemove(item) {
    const THIS = this
    // console.log('onRemove', item)
    const information = (
      <div>
        <div className="file-delete-info">确定要删除云端的文件吗？</div>
        <div className="file-name-info">
          文件名 ：<span className="file-name-text">{item.webideCodeName}</span>
        </div>
      </div>
    )
    Modal.confirm({
      title: '删除云端文件',
      content: information,
      okText: '删除',
      cancelText: '取消',
      onOk() {
        deleteWebideCode(item.id)
          .then(res => {
            if (res.status === 200) {
              message.success('已成功删除')
              THIS.getMyFiles()
            } else {
              message.error(res.message || '未知错误')
            }
          })
          .catch(err => {
            console.error('deleteWebideCode', err)
            err && message.error(err)
          })
      },
    })
  }
  render() {
    const { myFiles } = this.props
    return (
      <div className="my-files-container">
        <div className="title">
          我的文件
          <div className="close-button" onClick={this.onClose}>
            <Icon type="close" />
          </div>
        </div>
        <div className="divide"></div>
        <List
          itemLayout="horizontal"
          dataSource={myFiles}
          renderItem={(item, index) => (
            <List.Item key={index} onClick={() => this.onSelect(item)}>
              <List.Item.Meta description={item.webideCodeName} />
              <Button
                type="link"
                ghost
                className="remove-button"
                key={item.id}
                onClick={() => this.onRemove(item)}
              >
                <Icon type="close" />
              </Button>
            </List.Item>
          )}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userId: state.app.userId,
    myFiles: state.myfiles.myFiles,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { hideMyFiles, addPane, setActiveKey, setMyFiles },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFiles)

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { message, Input, Button } from 'antd'
import { filter } from 'lodash-es'
import CryptoJS from 'crypto-js'
// import { addPane, setActiveKey } from '@/redux/tabs'
import { setMyFiles } from '@/redux/myfiles'
import { addPane, setActiveKey, updateTitle } from '@/redux/tabs'
import {
  addWebideCode,
  upload2oss,
  editWebideCode,
  getUploadVendor,
  upload2cos,
} from '../../lib/api'
import './upload-file.scss'

class UploadFile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      curFileName: '',
      isFileNameExist: false,
      changedFileName: '',
      changedValid: false,
      isBrokenRule: false,
      showChageeFile: false,
    }
    this.fileObject = {}
    this.curPane = {}

    this.onUpload = this.onUpload.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.onFileNameChange = this.onFileNameChange.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onCancelChangeFileName = this.onCancelChangeFileName.bind(this)
    this.onConfirmChangeFileName = this.onConfirmChangeFileName.bind(this)
  }

  componentDidMount() {
    const { activeKey, panes, myFiles } = this.props
    const pane = filter(panes, { key: activeKey })

    const file = filter(myFiles, { webideCodeName: pane[0].title })

    const found = file && file.length > 0 ? true : false
    this.curPane = pane[0] || {}
    this.fileObject = found ? file[0] : {}
    this.setState({
      curFileName: pane[0].title,
      isFileNameExist: found,
      changedFileName: pane[0].title,
    })
  }

  isValidFileName(filename) {
    return /^[a-zA-Z0-9][-_a-zA-Z0-9]+(.py|.txt)$/.test(filename)
  }

  onFileNameChange(evt) {
    const { myFiles } = this.props
    // console.log('onFileNameChange', evt.target.value)
    const file = filter(myFiles, { webideCodeName: evt.target.value })
    const found = file && file.length > 0 ? true : false
    this.setState({
      changedFileName: evt.target.value,
      changedValid: !found,
      isBrokenRule: this.isValidFileName(evt.target.value) ? false : true,
    })
  }

  uploadFile(content, title) {
    const { userId } = this.props
    const THIS = this
    return new Promise((resolve, reject) => {
      getUploadVendor()
        .then(res => {
          // console.log('getUploadVendor -> ', res)
          if (res.status === 200) {
            if (res.data.name === 'oss') {
              const hash = CryptoJS.MD5(content).toString()
              upload2oss(res.data.accessInfo, content, hash)
                .then(res => {
                  // console.log('upload2oss', res)
                  if (THIS.state.isFileNameExist) {
                    editWebideCode(res.url, userId, THIS.fileObject.id)
                      .then(res => {
                        if (res.status === 200) {
                          message.success('????????????')
                          return resolve()
                        } else {
                          message.error(res.message || '????????????')
                          return reject()
                        }
                      })
                      .catch(err => {
                        console.error('upload2oss', err)
                        err && message.error(err)
                        return reject()
                      })
                  } else {
                    addWebideCode(title, res.url, userId)
                      .then(res => {
                        if (res.status === 200) {
                          message.success('????????????')
                          return resolve()
                        } else {
                          message.error(res.message || '????????????')
                          return reject()
                        }
                      })
                      .catch(err => {
                        console.error('upload2oss', err)
                        err && message.error(err)
                        return reject()
                      })
                  }
                })
                .catch(err => {
                  console.error('upload2oss', err)
                  err && message.error(err)
                  return reject(err)
                })
            } else if (res.data.name === 'cos') {
              const hash = CryptoJS.MD5(content).toString()
              upload2cos(res.data.accessInfo, content, hash)
                .then(res => {
                  let url = 'https://' + res.Location
                  if (
                    res.Location.includes('https://') ||
                    res.Location.includes('http://')
                  ) {
                    url = res.Location
                  }
                  // console.log('upload2cos', url)
                  if (THIS.state.isFileNameExist) {
                    editWebideCode(url, userId, THIS.fileObject.id)
                      .then(res => {
                        if (res.status === 200) {
                          message.success('????????????')
                          return resolve()
                        } else {
                          message.error(res.message || '????????????')
                          return reject(res.message || '????????????')
                        }
                      })
                      .catch(err => {
                        console.error('upload2oss', err)
                        err && message.error(err)
                        return reject(err)
                      })
                  } else {
                    addWebideCode(title, url, userId)
                      .then(res => {
                        if (res.status === 200) {
                          message.success('????????????')
                          return resolve()
                        } else {
                          message.error(res.message || '????????????')
                          return reject(res.message || '????????????')
                        }
                      })
                      .catch(err => {
                        console.error('upload2oss', err)
                        err && message.error(err)
                        return reject(err)
                      })
                  }
                })
                .catch(err => {
                  console.error('upload2oss', err)
                  err && message.error(err)
                  return reject(err)
                })
            } else {
              console.error('getUploadVendor -> ', res.data)
            }
          }
        })
        .catch(err => {
          console.error('getUploadVendor', err)
          err && message.error(err)
          return reject(err)
        })
      // getAccessKey()
      //   .then(res => {
      //     if (res.status === 200) {
      //       const hash = CryptoJS.MD5(content).toString()
      //       upload2oss(res.data, content, hash)
      //         .then(res => {
      //           // console.log('upload2oss', res)
      //           if (THIS.state.isFileNameExist) {
      //             editWebideCode(res.url, userId, THIS.fileObject.id)
      //               .then(res => {
      //                 if (res.status === 200) {
      //                   message.success('????????????')
      //                   return resolve()
      //                 } else {
      //                   message.error(res.message || '????????????')
      //                   return reject()
      //                 }
      //               })
      //               .catch(err => {
      //                 console.error('upload2oss', err)
      //                 err && message.error(err)
      //                 return reject()
      //               })
      //           } else {
      //             addWebideCode(title, res.url, userId)
      //               .then(res => {
      //                 if (res.status === 200) {
      //                   message.success('????????????')
      //                   return resolve()
      //                 } else {
      //                   message.error(res.message || '????????????')
      //                   return reject()
      //                 }
      //               })
      //               .catch(err => {
      //                 console.error('upload2oss', err)
      //                 err && message.error(err)
      //                 return reject()
      //               })
      //           }
      //         })
      //         .catch(err => {
      //           console.error('upload2oss', err)
      //           err && message.error(err)
      //           return reject()
      //         })
      //     }
      //     // console.log('getAccessKey', res.data)
      //   })
      //   .catch(err => {
      //     console.error('getAccessKey', err)
      //     err && message.error(err)
      //     return reject()
      //   })
    })
  }

  onUpload() {
    const { updateTitle } = this.props
    const THIS = this
    this.uploadFile(THIS.curPane.content, THIS.state.curFileName)
      .then(() => {
        updateTitle(THIS.curPane.key, THIS.state.changedFileName)
        THIS.props.onSave()
      })
      .catch(err => {
        console.error('uploadFile', err)
      })
  }

  onCancel() {
    this.props.onCancel()
  }

  onCancelChangeFileName() {
    this.setState({ showChageeFile: false })
  }

  onConfirmChangeFileName() {
    const { myFiles } = this.props
    if (this.isValidFileName(this.state.changedFileName)) {
      const file = filter(myFiles, {
        webideCodeName: this.state.changedFileName,
      })

      const found = file && file.length > 0 ? true : false
      this.setState({
        curFileName: this.state.changedFileName,
        isFileNameExist: found,
      })
      this.setState({ showChageeFile: false })
    } else {
      message.error('?????????????????????????????????????????????')
    }
  }

  onChange() {
    this.setState({ showChageeFile: true })
  }

  render() {
    const found = this.state.isFileNameExist
    const filename = this.state.curFileName
    const information = found ? (
      <div>
        <div>
          <span className="file-name-text">{`${filename} `}</span>?????????
        </div>
        <div className="tool-tips-text">
          ?????????????????????????????????????????????????????????
        </div>
      </div>
    ) : (
      <div> {`???????????? ${filename} ??????`}</div>
    )
    const buttons = found ? (
      <div className="button-container">
        <Button onClick={this.onCancel}>??????</Button>
        <Button onClick={this.onUpload} type="primary">
          ??????
        </Button>
        <Button onClick={this.onChange} type="primary">
          ??????
        </Button>
      </div>
    ) : (
      <div className="button-container">
        <Button onClick={this.onCancel}>??????</Button>
        <Button onClick={this.onChange}>??????</Button>
        <Button onClick={this.onUpload} type="primary">
          ??????
        </Button>
      </div>
    )

    const information2 = (
      <div>
        <div className="file-name-old">{`???????????? ??? ${this.state.curFileName}`}</div>
        <div className="file-name-mod">?????????</div>
        <Input
          className="file-name-input"
          defaultValue={this.state.changedFileName}
          onChange={this.onFileNameChange}
        ></Input>
        {this.state.isBrokenRule ? (
          <div className="file-name-note">?????????????????????????????????????????????</div>
        ) : null}
      </div>
    )

    const buttons2 = (
      <div className="button-container">
        <Button onClick={this.onCancelChangeFileName}>??????</Button>
        <Button onClick={this.onConfirmChangeFileName} type="primary">
          ??????
        </Button>
      </div>
    )

    return (
      <div className="upload-file-container">
        {this.state.showChageeFile ? null : information}
        {this.state.showChageeFile ? null : buttons}
        {this.state.showChageeFile ? information2 : null}
        {this.state.showChageeFile ? buttons2 : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userId: state.app.userId,
    activeKey: state.tabs.activeKey,
    panes: state.tabs.panes,
    myFiles: state.myfiles.myFiles,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { setMyFiles, addPane, setActiveKey, updateTitle },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile)

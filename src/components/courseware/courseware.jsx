import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tree, Icon, message } from 'antd'
import CryptoJS from 'crypto-js'
import {
  setCurFile,
  setExpanedKeys,
  hideCourseware,
} from '../../redux/courseware'
import { addPane, setActiveKey } from '../../redux/tabs'
import { getFileData } from '../../lib/api'

import './courseware.scss'
const { TreeNode, DirectoryTree } = Tree

class Courseware extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lesson: [],
    }

    const THIS = this
    getFileData('./lesson/lesson.json')
      .then(res => {
        // console.log('loadPython res', res)
        const data = res.data
        THIS.setState({ lesson: data.lesson })
      })
      .catch(error => {
        // console.log(error)
        message.error(`lesson.json 打开失败(${error})`)
      })
    // fetch('./lesson/lesson.json')
    //   .then(r => r.json())
    //   .then(data => {
    //     THIS.setState({ lesson: data.lesson })
    //     // console.log('lesson', THIS.state.lesson)
    //   })

    this.onSelect = this.onSelect.bind(this)
    this.onExpand = this.onExpand.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  loadPython(filename, key) {
    const { addPane, setActiveKey } = this.props
    getFileData(filename)
      .then(res => {
        // console.log('loadPython res', res)
        const data = res.data
        const hash = CryptoJS.MD5(data).toString()
        // console.log('hash', hash)
        addPane(key, data, hash)
        setActiveKey(hash)
      })
      .catch(error => {
        // console.log(error)
        message.error(`${key}打开失败(${error})`)
      })
    //
    // const myHeaders = new Headers({
    //   'Content-Type': 'text/plain',
    //   'X-Custom-Header': 'ProcessThisImmediately',
    //   'Accept-Ranges': 'bytes',
    // })
    // const myRequest = new Request(filename, {
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
    //     // console.log('hash', hash)
    //     addPane(key, data, hash)
    //     setActiveKey(hash)
    //   })
    //   .catch(error => {
    //     console.error('Error:', error)
    //     message.error(`${key}打开失败(${error})`)
    //   })
  }

  onSelect(selectedKeys) {
    const { setCurFile } = this.props
    const indexs = selectedKeys[0].split('-')
    if (indexs && indexs.length === 3) {
      const level1 = this.state.lesson[indexs[0]]

      const level2 = level1.children[indexs[1]]
      const files = level2.children[indexs[2]].files

      if (files) {
        setCurFile(selectedKeys[0], files)
        const THIS = this
        files.map(file => {
          // `https://coursemate.cn/pythonWeb/pages/moodle/lesson/${file}`,
          THIS.loadPython(`./lesson/${file}`, file)
          return file
        })
      }
    } else if (indexs && indexs.length === 4) {
      const level1 = this.state.lesson[indexs[0]]

      const level2 = level1.children[indexs[1]]
      const level3 = level2.children[indexs[2]]
      const files = level3.children[indexs[3]].files

      if (files) {
        setCurFile(selectedKeys[0], files)
        const THIS = this
        files.map(file => {
          // `https://coursemate.cn/pythonWeb/pages/moodle/lesson/${file}`,
          THIS.loadPython(`./lesson/${file}`, file)
          return file
        })
      } else {
        console.error('level3.label', level3.label)
        message.error(`${level3.label}没有可用文件，请选择其他课程`)
      }
    }
  }
  onExpand = expandedKeys => {
    // console.log('onExpand', expandedKeys)
    const { setExpanedKeys } = this.props
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpanedKeys(expandedKeys)
  }
  onClose() {
    const { hideCourseware } = this.props
    hideCourseware()
  }

  render() {
    const { curFile, expandedKeys } = this.props
    let selectedKeys = []
    curFile.index &&
      curFile.index.length > 0 &&
      selectedKeys.push(curFile.index)
    const course =
      this.state.lesson.length > 0
        ? this.state.lesson.map((level1, index1) => (
            <TreeNode title={level1.label} key={index1}>
              {level1.children &&
                level1.children.map((level2, index2) => (
                  <TreeNode title={level2.label} key={index1 + '-' + index2}>
                    {level2.children &&
                      level2.children.map((level3, index3) => (
                        <TreeNode
                          title={level3.label}
                          key={index1 + '-' + index2 + '-' + index3}
                        >
                          {level3.children &&
                            level3.children.map((level4, index4) => (
                              <TreeNode
                                title={level4.label}
                                key={
                                  index1 +
                                  '-' +
                                  index2 +
                                  '-' +
                                  index3 +
                                  '-' +
                                  index4
                                }
                                isLeaf
                                showIcon={false}
                              ></TreeNode>
                            ))}
                        </TreeNode>
                      ))}
                  </TreeNode>
                ))}
            </TreeNode>
          ))
        : null
    const tree =
      this.state.lesson.length > 0 ? (
        <DirectoryTree
          showLine={true}
          showIcon={false}
          blockNode={true}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          autoExpandParent={false}
          defaultExpandParent={false}
          onSelect={this.onSelect}
          onExpand={this.onExpand}
        >
          {course}
        </DirectoryTree>
      ) : null
    return (
      <div className="courseware-container">
        <div className="title">
          课程代码
          <div className="close-button" onClick={this.onClose}>
            <Icon type="close" />
          </div>
        </div>
        <div className="divide"></div>
        {tree}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    curFile: state.courseware.curFile,
    expandedKeys: state.courseware.expandedKeys,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { setCurFile, setExpanedKeys, addPane, setActiveKey, hideCourseware },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Courseware)

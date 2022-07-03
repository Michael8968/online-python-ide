import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Hotkeys from 'react-hot-keys'
import queryString from 'query-string'
import EditorView from './editor'
import LeftMenu from '@/components/left-menu/left-menu'
import Courseware from '@/components/courseware/courseware'
import MyFiles from '@/components/my-files/my-files'
import Asset from '@/components/asset/asset'
import Search from '@/components/search/search'
import { showSearch } from '../redux/search'
import { setAppUser, setMobileMode } from '../redux/app'
import { fetchLessonMultiFiles } from '../lib/lesson'

import './content.scss'

const params = queryString.parse(window.location.search)
// 老师端 ： http://localhost:3000/?courseId=4e5925e81060b8a025c734838d673f63&sync=true&writable=true&teacher=17311111111&teacherId=17311111111&name=li&useRTM=true
// 学生端 ： http://localhost:3000/?courseId=4e5925e81060b8a025c734838d673f63&sync=false&writable=false&student=18616378968&name=wang&teacherId=17311111111&useRTM=true

const teacher = params.teacher
const student = params.student
const teacherId = params.teacherId || ''
const userName = params.name || ''
const sync = params.sync === 'true'
const writable = params.writable === 'true'
const courseId = params.courseId
const useRTM = params.useRTM === 'true'
const isMobile = params.mobile === 'true'

class Content extends Component {
  constructor(props) {
    super(props)

    this.parseParam()

    this.onKeyDown = this.onKeyDown.bind(this)

    fetchLessonMultiFiles()
  }
  componentDidMount() {}

  parseParam() {
    const { setAppUser, setMobileMode } = this.props
    // read localStorage
    const userId =
      localStorage.getItem('cuser_id') ||
      localStorage.getItem('userId') ||
      localStorage.getItem('userKey')
    const role = localStorage.getItem('cuser_type') || 'free'
    const name =
      role === 'student'
        ? localStorage.getItem('cuser_name') ||
          localStorage.getItem('studentname') + '同学'
        : localStorage.getItem('cuser_name') ||
          localStorage.getItem('teachertname') + '老师'
    // console.log('userId, role, name', userId, role, name)
    // appRole, userId, userName
    // test
    if (window.location.host.includes('localhost')) {
      userId
        ? setAppUser(role, userId, name) //: setAppUser(role, '', '')
        : setAppUser('teacher', 'test', 'dev')
    } else {
      userId ? setAppUser(role, userId, name) : setAppUser(role, '', '')
    }
    // 如果有传参，以参数为主
    if (teacher && teacher.length > 0) {
      setAppUser(
        'teacher',
        teacher,
        userName + '老师',
        sync,
        writable,
        courseId,
        useRTM,
        teacher
      )
    } else if (student && student.length > 0) {
      // console.log(' teacherId ', teacherId)
      setAppUser(
        'student',
        student,
        userName + '同学',
        sync,
        writable,
        courseId,
        useRTM,
        teacherId
      )
    }
    setMobileMode(isMobile)
  }

  onKeyDown(keyName, e, handle) {
    e.preventDefault()
    // console.log('test:onKeyDown', keyName, e, handle)
    const { showSearch } = this.props
    showSearch()
  }
  render() {
    const {
      isAssetVisible,
      isCoursewareVisible,
      isMyFilesVisible,
      isSearchVisible,
    } = this.props
    return (
      <Hotkeys keyName="Ctrl+f," onKeyDown={this.onKeyDown.bind(this)}>
        <div className="content-container">
          {/* <LeftMenu /> */}
          {isAssetVisible ? <Asset /> : null}
          {isCoursewareVisible ? <Courseware /> : null}
          {isMyFilesVisible ? <MyFiles /> : null}
          {isSearchVisible ? <Search /> : null}
          <EditorView />
        </div>
      </Hotkeys>
    )
  }
}

function mapStateToProps(state) {
  return {
    isCoursewareVisible: state.courseware.isCoursewareVisible,
    isMyFilesVisible: state.myfiles.isMyFilesVisible,
    isAssetVisible: state.asset.isAssetVisible,
    isSearchVisible: state.search.isSearchVisible,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      showSearch,
      setAppUser,
      setMobileMode,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Content)

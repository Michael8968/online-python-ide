import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tooltip } from 'antd'
import menuImage from '../../assets/img/mune.svg'
import searchImage from '../../assets/img/search.svg'
import assetImage from '../../assets/img/asset.svg'
import myFilesImage from '../../assets/img/my-files.svg'
import courseWareImage from '../../assets/img/course-ware.svg'
import { showAssetView, hideAssetView } from '../../redux/asset'
import { showCourseware, hideCourseware } from '../../redux/courseware'
import { showMyFiles, hideMyFiles } from '../../redux/myfiles'
import { showSearch, hideSearch } from '../../redux/search'

import './left-menu.scss'

class LeftMenu extends Component {
  constructor(props) {
    super(props)

    this.onSearch = this.onSearch.bind(this)
    this.onOpenAsset = this.onOpenAsset.bind(this)
    this.onOpenFileList = this.onOpenFileList.bind(this)
    this.onOpenCourseWare = this.onOpenCourseWare.bind(this)
  }

  hideAll() {
    const { hideMyFiles, hideAssetView, hideCourseware } = this.props
    hideMyFiles()
    hideAssetView()
    hideCourseware()
  }

  onSearch() {
    const { isSearchVisible, showSearch, hideSearch } = this.props
    // console.log('onSearch')
    isSearchVisible ? hideSearch() : showSearch()
  }
  onOpenAsset() {
    const { isAssetVisible, showAssetView, hideAssetView } = this.props
    // console.log('onOpenAsset', isAssetVisible)
    !isAssetVisible && this.hideAll()
    isAssetVisible ? hideAssetView() : showAssetView()
  }
  onOpenFileList() {
    // console.log('onOpenFileList')
    const { isMyFilesVisible, showMyFiles, hideMyFiles } = this.props
    !isMyFilesVisible && this.hideAll()
    isMyFilesVisible ? hideMyFiles() : showMyFiles()
  }
  onOpenCourseWare() {
    // console.log('onOpenCourseWare')
    const { isCoursewareVisible, showCourseware, hideCourseware } = this.props
    !isCoursewareVisible && this.hideAll()
    isCoursewareVisible ? hideCourseware() : showCourseware()
  }
  render() {
    const {
      isCoursewareVisible,
      // isMyFilesVisible,
      // isAssetVisible,
      // isLogon,
      appRole,
    } = this.props
    return (
      <div className="left-menu-container">
        <div className="menu-item">
          <img src={menuImage} alt="" />
        </div>

        {/* <div className="menu-item">
          <Tooltip placement="right" title="搜索">
            <span className="glow" key="search" onClick={this.onSearch}></span>
            <img src={searchImage} alt="" />
          </Tooltip>
        </div> */}

        {/* <div className="menu-item">
          <Tooltip placement="right" title="课程资源">
            <span
              className={isAssetVisible ? 'glow-active' : 'glow'}
              key="asset"
              onClick={this.onOpenAsset}
            ></span>
            <img src={assetImage} alt="" />
          </Tooltip>
        </div> */}

        {/* {isLogon ? (
          <div className="menu-item">
            <Tooltip placement="right" title="我的文件">
              <span
                className={isMyFilesVisible ? 'glow-active' : 'glow'}
                key="myfiles"
                onClick={this.onOpenFileList}
              ></span>
              <img src={myFilesImage} alt="" />
            </Tooltip>
          </div>
        ) : null} */}

        {appRole === 'teacher' ? (
          <div className="menu-item">
            <Tooltip placement="right" title="课件代码">
              <span
                className={isCoursewareVisible ? 'glow-active' : 'glow'}
                key="courseware"
                onClick={this.onOpenCourseWare}
              ></span>
              <img src={courseWareImage} alt="" />
            </Tooltip>
          </div>
        ) : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isCoursewareVisible: state.courseware.isCoursewareVisible,
    isMyFilesVisible: state.myfiles.isMyFilesVisible,
    isAssetVisible: state.asset.isAssetVisible,
    isSearchVisible: state.asset.isSearchVisible,
    isLogon: state.app.isLogon,
    appRole: state.app.appRole,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      showCourseware,
      hideCourseware,
      showAssetView,
      hideAssetView,
      showMyFiles,
      hideMyFiles,
      showSearch,
      hideSearch,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu)

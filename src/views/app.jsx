import React from 'react'
import { connect } from 'react-redux'
import TopMenu from './top-menu'
import Content from './content'

import './app.scss'

class App extends React.Component {
  componentDidMount() {
    document.body.style.height = document.documentElement.clientHeight + 'px';
  }
  render() {
    const { writable } = this.props
    const style = writable
      ? { pointerEvents: 'auto' }
      : { pointerEvents: 'none' }
    return (
      <div className="app-container" id="app-container" style={style}>
        <TopMenu />
        <Content />
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    writable: state.app.writable,
  }
}

export default connect(mapStateToProps)(App)

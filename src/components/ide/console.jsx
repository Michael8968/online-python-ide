import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { clearConsole } from '@/redux/console'
import './ide.scss'

class Console extends Component {
  constructor(props) {
    super(props)
    this.onClear = this.onClear.bind(this)
  }
  onClear() {
    const { clearConsole } = this.props
    clearConsole()
  }
  render() {
    const { consoles } = this.props
    return (
      <div className="console-bar">
        <div className="header">
          <div className="title">打印输出：</div>
          <Icon type="delete" className="btn-clear" onClick={this.onClear} />
        </div>
        <pre className="console">
          {consoles.map(item => {
            return (
              <span
                className={item.error ? 'console-items-error' : 'console-items'}
                key={item.timestamp}
              >
                {item.content}
              </span>
            )
          })}
        </pre>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    consoles: state.console.consoles,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ clearConsole }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Console)

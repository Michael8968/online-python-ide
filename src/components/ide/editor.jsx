import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AceEditor from 'react-ace'
// import md5 from 'blueimp-md5'
import CryptoJS from 'crypto-js'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-vibrant_ink'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/snippets/python'
import 'ace-builds/src-noconflict/ext-searchbox'
import 'ace-builds/src-noconflict/ext-emmet'
import { filter } from 'lodash-es'
import { updateContent } from '@/redux/tabs'
import { finishSearch, showSearch } from '@/redux/search'
import AceEventHandler from '../../lib/ace-event-handler'
import AceMessageHandler from '../../lib/ace-message-handler'
import IdeMessageHandler from '../../lib/ide-message-handler'
import RtmClient from '../../lib/peer'
import * as Y from 'yjs'
import { createMutex } from 'lib0/mutex.js'
import { WebrtcProvider } from 'y-webrtc'
import { AceBinding } from '../../lib/y-ace'

import './ide.scss'
const { Range } = require('ace-builds/src-noconflict/ace')

class Editor extends Component {
  constructor(props) {
    super(props)
    this.key = props.id
    this.markers = []

    this.aceEvent = new AceEventHandler(this.key)
    this.aceMessage = new AceMessageHandler(this)
    IdeMessageHandler.addAceMessageHandler(this.aceMessage, this.key)

    this.lastLocalHash = ''
    this.lastRemoteHash = ''

    this.state = {
      editorHeight: 'calc(100% - 30px)',
    }

    this.ydoc = new Y.Doc()
    this.type = this.ydoc.getText('ace')
    const mux = createMutex()
    this.mux = mux
    this.doc = this.type.doc
    this.provider = new WebrtcProvider('yjs-ace', this.ydoc)

    this.onChange = this.onChange.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.onSelectionChange = this.onSelectionChange.bind(this)
    this.onCursorChange = this.onCursorChange.bind(this)
    this.getEditorHeight = this.getEditorHeight.bind(this)
    this._typeObserver = this._typeObserver.bind(this)
  }

  componentDidMount() {
    const { showSearch } = this.props
    this.editor = this.editorComponent.editor
    // this.editor.commands.bindKey('Return', editor => editor.insert('\n'))
    this.editSession = this.editor.getSession()
    this.editor.commands.addCommand({
      name: 'search',
      bindKey: { win: 'Ctrl-f', mac: 'Command-f' },
      exec: function(editor) {
        // editor.removeLines()
        showSearch()
      },
      // scrollIntoView: 'cursor',
      // multiSelectAction: 'forEachLine',
    })
    this.getEditorHeight()
    // this.editSession.on('change', this.onChange)
    // this.type.observe(this._typeObserver)
    // const binding = new Y.AceBinding(ace, type)
    /*const binding = */ new AceBinding(
      this.type,
      this.editor,
      this.provider.awareness
    )
    let user = {
      name: Math.random()
        .toString(36)
        .substring(7),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    }

    // Define user name and user name
    this.provider.awareness.setLocalStateField('user', user)
    const self = this
    this.provider.awareness.on('change', function() {
      let userCount = self.provider.awareness.getStates().size
      console.warn('userCount : ', userCount)
    })
  }

  componentWillUnmount() {
    IdeMessageHandler.removeAceMessageHandler(this.key)
  }
  _typeObserver(event) {
    const aceDocument = this.editSession.getDocument()
    this.mux(() => {
      const delta = event.delta
      let currentPos = 0
      for (const op of delta) {
        if (op.retain) {
          currentPos += op.retain
        } else if (op.insert) {
          const start = aceDocument.indexToPosition(currentPos, 0)
          aceDocument.insert(start, op.insert)
          currentPos += op.insert.length
        } else if (op.delete) {
          const start = aceDocument.indexToPosition(currentPos, 0)
          const end = aceDocument.indexToPosition(currentPos + op.delete, 0)
          const range = new Range(start.row, start.column, end.row, end.column)
          aceDocument.remove(range)
        }
      }
      console.warn('_typeObserver : ', event)
      // this._cursorObserver()
    })
  }

  getEditorHeight() {
    // keyboardHeight
    const offset = this.props.keyboardHeight + 30
    let height = `calc(100% - ${offset}px)`
    // const container = document.getElementById('ace-editor-container')
    // if (container) {
    //   height = container.clientHeight - 30
    // }
    this.setState({ editorHeight: height + '' })
  }

  insert(row, column, text, hash) {
    console.warn('insert : ', row, column, text, hash)
    // const { writable } = this.props
    // if (writable) return
    // if (
    //   this.editSession &&
    //   this.editSession.getLength() > row &&
    //   this.editSession.getDocumentLastRowColumn(row, 0) >= column
    // ) {
    //   const aceDocument = this.editSession.getDocument()
    //   this.lastRemoteHash = hash
    //   aceDocument.insert({ row, column }, text)
    // } else {
    //   console.error('insert error : ', row, column, text, hash)
    //   // maybe error
    //   this.aceEvent.requestLatestContent()
    // }
  }

  remove(range, hash) {
    // const { writable } = this.props
    // if (writable) return
    if (
      this.editSession &&
      this.editSession.getLength() > range.end.row &&
      this.editSession.getDocumentLastRowColumn(range.end.row, 0) >=
        range.end.column
    ) {
      this.lastRemoteHash = hash
      this.editSession.getDocument().remove(range)
    } else {
      console.error('remove error : ', range, hash)
      this.aceEvent.requestLatestContent()
    }
  }

  moveCursorTo(row, column) {
    // const { writable } = this.props
    // if (writable) return
    if (
      this.editor &&
      this.editSession &&
      this.editSession.getLength() > row &&
      this.editSession.getDocumentLastRowColumn(row, 0) >= column
    ) {
      const folds = this.editSession.getAllFolds()
      if (this.editSession.getSelection() && folds && folds.length > 0) {
        // https://us-try.count.ly/dashboard#/5fc8532de088592357a5495d/crashes/298891d30c2c623e5a29b35390c1a6416b1a90c4
        try {
          this.editSession.getDocument().moveCursorTo(row, column)
        } catch (e) {
          console.error('ace moveCursorTo error : ', e)
        }
      }
      // else {
      //   console.error(false, 'ace: folds.length = ', folds.length)
      // }
    }
  }

  setSelectionRange(range) {
    // const { writable } = this.props
    // if (writable) return
    if (
      this.editor &&
      this.editSession &&
      this.editSession.getLength() > range.end.row &&
      this.editSession.getDocumentLastRowColumn(range.end.row, 0) >=
        range.end.column
    ) {
      this.editSession.getSelection().setSelectionRange(range, false)
    }
  }

  setScrollTop(scrollTop) {
    // const { writable } = this.props
    // if (writable) return
    if (this.editSession) {
      this.editSession.getDocument().setScrollTop(scrollTop)
    }
  }

  setContent(content, hash) {
    const { writable, updateContent, activeKey } = this.props
    if (writable) return
    if (this.key !== activeKey) return
    this.lastRemoteHash = hash
    this.lastLocalHash = CryptoJS.MD5(content).toString()
    updateContent(this.key, content, this.lastLocalHash)
    if (this.lastLocalHash !== this.lastRemoteHash) {
      console.error(
        'double miss command : ',
        this.lastLocalHash,
        this.lastRemoteHash
      )
    }
  }

  getLatestContent(userId) {
    const { writable, panes, activeKey } = this.props
    if (!writable) return
    if (userId !== this.props.userId) return
    if (this.key !== activeKey) return
    const pane = filter(panes, { key: this.key })
    if (pane && pane[0]) {
      this.lastLocalHash = pane[0].hash
      this.aceEvent.sendContent(userId, pane[0].content, this.lastLocalHash)
      // console.log(
      //   'getLatestContent : ',
      //   userId,
      //   pane[0].content,
      //   this.lastLocalHash
      // )
    }
  }

  find(skipCurrent, backwards, value) {
    this.editor.find(value, {
      skipCurrent: skipCurrent,
      backwards: backwards,
      wrap: true,
      regExp: false,
      caseSensitive: false,
      wholeWord: false,
      preventScroll: false,
    })
  }

  onChange(newValue, event) {
    // if (RtmClient.joined) return
    // const aceDocument = this.editSession.getDocument()
    // this.mux(() => {
    //   if (event.action === 'insert') {
    //     const start = aceDocument.positionToIndex(event.start, 0)
    //     this.type.insert(start, event.lines.join('\n'))
    //   } else if (event.action === 'remove') {
    //     const start = aceDocument.positionToIndex(event.start, 0)
    //     const length = event.lines.join('\n').length
    //     this.type.delete(start, length)
    //   }
    //   this.type.applyDelta(event)
    //   console.warn('onChange : ', newValue, event)
    // this._cursorObserver()
    // this.aceEvent.onChange('', this.type.toString(), this.lastLocalHash)
    // })
    // const { updateContent, activeKey, writable, sync } = this.props
    // this.lastLocalHash = CryptoJS.MD5(newValue).toString()
    // updateContent(activeKey, newValue, this.lastLocalHash)
    // this.aceEvent.onChange(newValue, event, this.lastLocalHash)
    // if (!sync) {
    //   if (!writable) {
    //     if (this.lastLocalHash !== this.lastRemoteHash) {
    //       console.warn(
    //         'maybe miss command : ',
    //         this.lastLocalHash,
    //         this.lastRemoteHash
    //       )
    //       this.aceEvent.requestLatestContent()
    //     }
    //   }
    //   return
    // }
    // if (writable) {
    //   // student send content to teacher
    //   this.aceEvent.onChange(newValue, event, this.lastLocalHash)
    // } else {
    //   if (this.lastLocalHash !== this.lastRemoteHash) {
    //     console.warn(
    //       'maybe miss command : ',
    //       this.lastLocalHash,
    //       this.lastRemoteHash
    //     )
    //     this.aceEvent.requestLatestContent()
    //   }
    // }
  }

  onScroll(event) {
    if (RtmClient.joined) return
    const { writable, sync } = this.props
    if (!sync) return
    if (!writable) return
    if (this.editSession.getLength() <= 20) return
    this.aceEvent.onScroll(event)
  }

  onSelectionChange(newValue, event) {
    if (RtmClient.joined) return
    const { writable, sync } = this.props
    if (!sync) return
    if (!writable) return
    this.aceEvent.onSelectionChange(newValue, event)
  }

  onCursorChange(newValue, event) {
    if (RtmClient.joined) return
    const { writable, sync } = this.props
    if (!sync) return
    if (!writable) return
    this.aceEvent.onCursorChange(newValue, event)
  }

  componentDidUpdate(prevProps) {
    const {
      activeKey,
      curSearchText,
      searchAction,
      finishSearch,
      errors,
    } = this.props
    // Typical usage (don't forget to compare props):
    if (activeKey !== prevProps.activeKey && this.key === activeKey) {
      // current tab page
      this.getEditorHeight()
      this.editor.resize()
    }
    if (curSearchText !== prevProps.curSearchText) {
      if (curSearchText && curSearchText.length > 0) {
        this.editor.findAll(curSearchText)
      } else {
        this.find(true, false, '')
      }
    }
    if (searchAction !== prevProps.searchAction) {
      if (searchAction === 'next') {
        this.find(true, false, curSearchText)
      } else if (searchAction === 'previous') {
        this.find(true, true, curSearchText)
      }
      finishSearch()
    }
    if (this.key === activeKey) {
      const curErrors = filter(errors, { key: activeKey })
      if (
        (!prevProps.errors || prevProps.errors.length <= 0) &&
        curErrors &&
        curErrors.length > 0
      ) {
        // console.log('error', curErrors[0])
        curErrors[0].error.map((item, index) => {
          // console.log('error', index, item)
          // new Range(Number startRow, Number startColumn, Number endRow, Number endColumn)
          const marker = this.editSession.addMarker(
            new Range(item.line - 1, 0, item.line - 1, item.column || 1),
            'errorMarker',
            'line',
            true
          )
          index === 0 && this.editor.scrollToLine(item.line)
          index === 0 && this.editor.gotoLine(item.line, item.column, true)
          this.markers.push(marker)
          return item
        })
      } else if (this.markers.length > 0) {
        this.markers.map(item => {
          this.editSession.removeMarker(item)
          return item
        })
        this.marker = []
      }
    }
  }

  render() {
    const { activeKey, panes, writable } = this.props
    const pane = filter(panes, { key: activeKey })
    // console.log('pane', pane)

    const editor =
      pane && pane[0] ? (
        <AceEditor
          className="ace-editor"
          mode="python"
          selectionStyle="text"
          theme="vibrant_ink"
          width={this.props.editorWidth.toString()}
          height={this.state.editorHeight}
          minLines={1}
          name={'mainEditor_' + this.key}
          tabSize={4}
          fontSize={18}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            autoScrollEditorIntoView: true,
            newLineMode: 'auto',
            enableEmmet: false,
            showPrintMargin: false,
            animatedScroll: true,
            behavioursEnabled: true,
            wrapBehavioursEnabled: false,
            useSoftTabs: true,
            navigateWithinSoftTabs: false,
          }}
          wrapEnabled={false}
          readOnly={!writable}
          // value={pane[0].content + ''}
          // onChange={this.onChange}
          // onScroll={this.onScroll}
          // onSelectionChange={this.onSelectionChange}
          // onCursorChange={this.onCursorChange}
          ref={ref => {
            this.editorComponent = ref
          }}
        />
      ) : null

    return <>{editor}</>
  }
}

function mapStateToProps(state) {
  return {
    activeKey: state.tabs.activeKey,
    panes: state.tabs.panes,
    curSearchText: state.search.curSearchText,
    searchAction: state.search.searchAction,
    errors: state.console.errors,
    userId: state.app.userId,
    sync: state.app.sync,
    writable: state.app.writable,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { updateContent, finishSearch, showSearch },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor)

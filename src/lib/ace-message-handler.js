import { store } from '../redux/store'
const { Range } = require('ace-builds/src-noconflict/ace')

// process message from parent
export default class AceMessageHandler {
  constructor(editor) {
    const state = store.getState()
    this.userId = state.app.userId
    this.editor = editor
  }

  handleMessage(data) {
    // sync ace editor ( curser / scroll / selection ) {... , userId: '', key: '', snyc: 'pythonAce'}
    const state = store.getState()
    this.userId = state.app.userId
    if (!data) return
    if (data.userId === this.userId) return
    if (data.sync !== 'pythonAce') return

    console.warn('handleMessage : ', data)

    // if (data.action === 'getLatestContent') {
    //   this.getLatestContent(data.to)
    // }

    // if (state.app.writable) return
    // if (state.app.sync) return
    // console.log('AceMessageHandler ', data)
    if (data.action === 'changeCursor') {
      // moveCursorTo(row, column) {
      this.moveCursorTo(data.end.row, data.end.column)
    } else if (data.action === 'changeSelection') {
      // setSelectionRange(startRow, startColumn, endRow, endColumn)
      this.setSelectionRange(
        data.start.row,
        data.start.column,
        data.end.row,
        data.end.column
      )
    } else if (data.action === 'insert') {
      // insert(row, column, text)
      this.insert(
        data.start.row,
        data.start.column,
        data.lines.join('\n'),
        data.hash
      )
    } else if (data.action === 'remove') {
      // remove(startRow, startColumn, endRow, endColumn) {
      this.remove(
        data.start.row,
        data.start.column,
        data.end.row,
        data.end.column,
        data.hash
      )
    } else if (data.action === 'scroll') {
      // EditSession.setScrollTop(Number scrollTop)
      this.setScrollTop(data.scrollTop)
    } else if (data.action === 'setContent') {
      this.setContent(data, data.content, data.hash)
    } else if (data.action === 'setOutput') {
      this.setOutput(data.key, data.content)
    } else {
      console.error('unhanlded ace message : ', data)
    }
  }

  insert(row, column, text, hash) {
    // console.log('[PYTHON IDE] insert -> ', row, column, text, hash)
    this.editor.insert(row, column, text, hash)
  }

  // remove(Range range)  Object
  // new Range(Number startRow, Number startColumn, Number endRow, Number endColumn)
  remove(startRow, startColumn, endRow, endColumn, hash) {
    // const range = new Range(startRow, startColumn, endRow, endColumn)
    // this.editor.remove(range, hash)
  }

  // moveCursorTo(Number row, Number column)
  moveCursorTo(row, column) {
    this.editor && this.editor.moveCursorTo(row, column)
  }

  // setSelectionRange(Range range, Boolean reverse)
  setSelectionRange(startRow, startColumn, endRow, endColumn) {
    const range = new Range(startRow, startColumn, endRow, endColumn)
    this.editor.setSelectionRange(range, false)
  }

  setScrollTop(scrollTop) {
    this.editor.setScrollTop(scrollTop)
  }

  getLatestContent(userId) {
    const state = store.getState()
    if (state.app.sync) {
      if (state.app.isMaster) {
        this.editor.getLatestContent(userId)
      } else {
        this.editor.getLatestContent(this.userId)
      }
    }
  }

  setContent(data, content, hash) {
    // userId: 0 表示是广播消息
    const state = store.getState()
    if (state.app.isMaster) {
      if (data.to === state.app.teacherId) {
        this.editor.setContent(content, hash)
      }
    } else {
      if (data.userId === state.app.teacherId) {
        this.editor.setContent(content, hash)
      }
    }
  }
}

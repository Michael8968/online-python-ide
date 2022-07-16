import { isMatch } from 'lodash-es'
import { store } from '../redux/store'
import IdeEventHandler from './ide-event-handler'
import RtmClient from './peer'

export default class AceEventHandler {
  constructor(aceKey) {
    const state = store.getState()
    this.userId = state.app.userId
    this.aceKey = aceKey
    this.lastCursor = {}
    this.lastSelection = {}
    this.lastScrollTop = 0
    this.lastTimestamp = new Date().getTime()
    this.source = window.parent
    this.origin = '*'
  }

  sendCommand(data, to, force = false) {
    const state = store.getState()
    if (!state.app.sync && !force) return
    const timestamp = new Date().getTime()
    // ace editor changed event {... , userId: '', key: '', snyc: 'pythonAce'}
    this.source = IdeEventHandler.source || window.parent
    this.origin = IdeEventHandler.origin || '*'
    const message = Object.assign(data, {
      timestamp: timestamp,
      userId: this.userId,
      key: this.aceKey,
      sync: 'pythonAce',
      to: state.app.isMaster ? '' : state.app.teacherId,
    })
    if (state.app.useRTM) {
      RtmClient.sendChannelMessage(message, state.app.courseId)
      console.warn('sendCommand : ', data, to, force)
    } else {
      this.source.postMessage(message, this.origin)
    }

    // console.log('sendCommand : ', message)
  }

  handleInsert(event, hash, to) {
    // action: "insert"
    // start: {row: 1, column: 7}
    // end: {row: 1, column: 8}
    // lines: ["e"]
    const data = Object.assign(event, { hash: hash })
    this.sendCommand(data, to)
  }

  handleRemove(event, hash, to) {
    // action: "remove"
    // start: {row: 1, column: 6}
    // end: {row: 1, column: 7}
    // lines: ["o"]
    if (
      event.start.row !== event.end.row ||
      event.start.column !== event.end.column
    ) {
      // send insert data
      const data = Object.assign(event, { hash: hash })
      this.sendCommand(data, to)
    }
  }

  onChange(value, event, hash, to = '') {
    const state = store.getState()
    if (!state.app.sync) return
    // console.log('onChange', value, event)
    // 1. calculate hash of value
    // var hash = md5(value)
    // 2. update database

    // 3. check event type :
    // action: "insert"
    // start: {row: 1, column: 7}
    // end: {row: 1, column: 8}
    // lines: ["e"]
    if (event.action === 'insert') {
      this.handleInsert(event, hash, to)
    } else if (event.action === 'remove') {
      this.handleRemove(event, hash, to)
    } else {
      console.error('unhandled ace onChnage event', event)
    }
    // 4. send cmmmand to chat room
  }

  onSelectionChange(value, event, to = '') {
    const state = store.getState()
    if (!state.app.sync) return
    // console.log('onSelectionChange', value, event)
    // type: "changeSelection"
    if (event.type === 'changeSelection') {
      // selectionAnchor.row column
      // selectionLead - row column

      // send selection data
      // action: "remove"
      // start: {row: 1, column: 6}
      // end: {row: 1, column: 7}
      // lines: ["o"]
      const data = {
        action: 'changeSelection',
        start: {
          row: value.anchor.row,
          column: value.anchor.column,
        },
        end: {
          row: value.lead.row,
          column: value.lead.column,
        },
      }
      if (!isMatch(this.lastSelection, data)) {
        // console.log('onSelectionChange', data, this.lastSelection)
        this.lastSelection = data
        this.sendCommand(data, to)
      }
    }
  }

  onCursorChange(value, event, to = '') {
    const state = store.getState()
    if (!state.app.sync) return
    // console.log('onCursorChange', value, event)
    if (event.type === 'changeCursor') {
      // moveCursorTo(Number row, Number column)

      // send cursor data
      // action: "remove"
      // start: {row: 1, column: 6}
      // end: {row: 1, column: 7}
      // lines: ["o"]
      const data = {
        action: 'changeCursor',
        end: {
          row: value.cursor ? value.cursor.row : 0,
          column: value.cursor ? value.cursor.column : 0,
        },
      }
      if (!isMatch(this.lastCursor, data)) {
        // console.log('onCursorChange', data, this.lastCursor)
        this.lastCursor = data
        this.sendCommand(data, to)
      }
    }
  }

  onScroll(event, to = '') {
    const state = store.getState()
    if (!state.app.sync) return
    // console.log('onScroll', event.renderer.scrollTop)
    const current = new Date().getTime()
    if (
      Math.abs(this.lastScrollTop - event.renderer.scrollTop) >= 1 &&
      current - this.lastTimestamp > 100
    ) {
      this.lastTimestamp = current
      this.lastScrollTop = event.renderer.scrollTop
      const data = {
        action: 'scroll',
        scrollTop: event.renderer.scrollTop,
      }
      this.sendCommand(data, to)
    }
  }

  requestLatestContent(to = '') {
    const state = store.getState()
    if (state.app.sync) return
    if (state.app.writable) return
    if (state.app.isMaster) return
    const data = {
      action: 'getLatestContent',
      userId: this.userId,
    }
    this.sendCommand(data, to, true)
  }

  sendContent(userId, text, hash, to = '') {
    const state = store.getState()
    if (!state.app.sync) return
    const data = {
      action: 'setContent',
      userId: userId,
      content: text,
      hash: hash,
    }
    this.sendCommand(data, to)
  }
}

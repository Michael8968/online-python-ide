// IDE
export const SET_EDITOR_WIDTH = 'editor/SET_EDITOR_WIDTH'
export const SET_CODE_HASH = 'editor/SET_CODE_HASH'
export const SET_TURTLE_PAGE_URL = 'editor/SET_TURTLE_PAGE_URL'
export const SET_LAST_SYC_DATA = 'editor/SET_LAST_SYC_DATA'
export const SET_LAST_LOCAL_DATA = 'editor/SET_LAST_LOCAL_DATA'
export const SET_KEYBOARD_HEIGHT = 'editor/SET_KEYBOARD_HEIGHT'

const defaultState = {
  editorWidth: ((document.body.clientWidth - 80) * 2) / 3,
  lastCodeHash: '',
  turtlePageUrl: '',
  lastSyncData: {},
  lastLocalData: {},
  keyboardHeight: 0,
}

export default (state = defaultState, action = {}) => {
  const { payload } = action
  switch (action.type) {
    case SET_KEYBOARD_HEIGHT: {
      return {
        ...state,
        keyboardHeight: payload,
      }
    }
    case SET_LAST_LOCAL_DATA: {
      return {
        ...state,
        lastLocalData: payload,
      }
    }
    case SET_LAST_SYC_DATA: {
      return {
        ...state,
        lastSyncData: payload,
      }
    }
    case SET_TURTLE_PAGE_URL: {
      return {
        ...state,
        turtlePageUrl: payload,
      }
    }
    case SET_CODE_HASH: {
      return {
        ...state,
        lastCodeHash: payload,
      }
    }
    case SET_EDITOR_WIDTH: {
      return {
        ...state,
        editorWidth: payload,
      }
    }
    default:
      return state
  }
}

export const setEditorWidth = size => ({
  type: SET_EDITOR_WIDTH,
  payload: size,
})
export const setCodeHash = hash => ({
  type: SET_CODE_HASH,
  payload: hash,
})
export const setTurtlePageUrl = url => ({
  type: SET_TURTLE_PAGE_URL,
  payload: url,
})
export const setLastSycData = data => ({
  type: SET_LAST_SYC_DATA,
  payload: data,
})
export const setLastLocalData = data => ({
  type: SET_LAST_LOCAL_DATA,
  payload: data,
})
export const setKeyboardHeight = height => ({
  type: SET_KEYBOARD_HEIGHT,
  payload: height,
})

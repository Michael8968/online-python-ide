// 控制台
export const START_RUN = 'console/START_RUN'
export const STOP_RUN = 'console/STOP_RUN'
export const CLEAR_CONSOLE = 'console/CLEAR_CONSOLE'
export const ADD_CONSOLE = 'console/ADD_CONSOLE'
export const SET_CONSOLE_HEIGHT = 'console/SET_CONSOLE_HEIGHT'
export const UPDATE_ERROR = 'console/UPDATE_ERROR'
export const SET_COMMAND = 'console/SET_COMMAND'
export const SHOW_POPUP_SCENE = 'console/SHOW_POPUP_SCENE'
export const HIDE_POPUP_SCENE = 'console/HIDE_POPUP_SCENE'
export const SET_CAPTION = 'console/SET_CAPTION'

const defaultState = {
  isRunning: false,
  consoles: [],
  errors: [],
  consoleHeight: 100,
  command: '',
  isShowPopupScene: false,
  caption: '',
}

export default (state = defaultState, action = {}) => {
  const { payload } = action
  switch (action.type) {
    case SET_CAPTION: {
      return {
        ...state,
        caption: payload || '未命名',
      }
    }
    case SHOW_POPUP_SCENE: {
      return {
        ...state,
        isShowPopupScene: true,
      }
    }
    case HIDE_POPUP_SCENE: {
      return {
        ...state,
        isShowPopupScene: false,
      }
    }
    case SET_COMMAND: {
      return {
        ...state,
        command: payload,
      }
    }
    case ADD_CONSOLE: {
      const { key, content, timestamp, error } = payload
      return {
        ...state,
        consoles: [...state.consoles, { key, content, timestamp, error }],
      }
    }
    case CLEAR_CONSOLE:
      return {
        ...state,
        consoles: [],
        errors: [],
      }
    case START_RUN:
      return {
        ...state,
        isRunning: true,
      }
    case STOP_RUN:
      return {
        ...state,
        isRunning: false,
      }
    case SET_CONSOLE_HEIGHT:
      return {
        ...state,
        consoleHeight: payload,
      }
    case UPDATE_ERROR: {
      const { key, error } = payload
      return {
        ...state,
        errors: [...state.errors, { key, error }],
      }
    }
    default:
      return state
  }
}

export const addConsole = (key, content, timestamp, error = false) => ({
  type: ADD_CONSOLE,
  payload: { key, content, timestamp, error },
})

export const clearConsole = () => ({
  type: CLEAR_CONSOLE,
})

export const startRun = () => ({
  type: START_RUN,
})

export const stopRun = () => ({
  type: STOP_RUN,
})
export const setConsoleHeight = height => ({
  type: SET_CONSOLE_HEIGHT,
  payload: height,
})
export const updateError = (key, error) => ({
  type: UPDATE_ERROR,
  payload: { key, error },
})
export const setCommand = command => ({
  type: SET_COMMAND,
  payload: command,
})
export const showPopupScene = command => ({
  type: SHOW_POPUP_SCENE,
})
export const hidePopupScene = command => ({
  type: HIDE_POPUP_SCENE,
})
export const setCaption = caption => ({
  type: SET_CAPTION,
  payload: caption,
})

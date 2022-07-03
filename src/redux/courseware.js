// 课件代码
export const SET_COURSEWARE_VIEW_VISIBLE =
  'courseware/SET_COURSEWARE_VIEW_VISIBLE'
export const SET_CURRENT_FILE = 'courseware/SET_CURRENT_FILE'
export const SET_EXPANDED_KEYS = 'courseware/SET_EXPANDED_KEYS'
export const SET_SCREENSHOT_INFO = 'courseware/SET_SCREENSHOT_INFO'

const defaultState = {
  isCoursewareVisible: false,
  curFile: {},
  expandedKeys: [],
  screenshots: [], // { hash: '', url: '', width: 0, height: 0 }
}

export default (state = defaultState, action = {}) => {
  const { payload } = action
  switch (action.type) {
    case SET_SCREENSHOT_INFO: {
      const filter = state.screenshots.filter(
        screenshot => screenshot.hash === payload.hash
      )

      if (!filter || filter.length <= 0) {
        return {
          ...state,
          screenshots: [...state.screenshots, payload],
        }
      } else {
        filter[0].url = payload.url
        filter[0].width = payload.width
        filter[0].height = payload.height
        return state
      }
    }
    case SET_COURSEWARE_VIEW_VISIBLE:
      return {
        ...state,
        isCoursewareVisible: payload,
      }

    case SET_CURRENT_FILE:
      return {
        ...state,
        curFile: payload,
      }
    case SET_EXPANDED_KEYS:
      return {
        ...state,
        expandedKeys: [...payload],
      }

    default:
      return state
  }
}

export const showCourseware = () => ({
  type: SET_COURSEWARE_VIEW_VISIBLE,
  payload: true,
})

export const hideCourseware = () => ({
  type: SET_COURSEWARE_VIEW_VISIBLE,
  payload: false,
})

export const setCurFile = (index, filenames) => ({
  type: SET_CURRENT_FILE,
  payload: { index, filenames },
})

export const setExpanedKeys = keys => ({
  type: SET_EXPANDED_KEYS,
  payload: keys,
})
export const setScreenshot = info => ({
  type: SET_SCREENSHOT_INFO,
  payload: info,
})

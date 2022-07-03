// 我的文件
export const SET_MY_FILES_VIEW_VISIBLE = 'myfiles/SET_MY_FILES_VIEW_VISIBLE'
export const SET_MY_FILES = 'myfiles/SET_MY_FILES'

const defaultState = {
  isMyFilesVisible: false,
  myFiles: [],
}

export default (state = defaultState, action = {}) => {
  const { payload } = action
  switch (action.type) {
    case SET_MY_FILES_VIEW_VISIBLE:
      return {
        ...state,
        isMyFilesVisible: payload,
      }
    case SET_MY_FILES:
      return {
        ...state,
        myFiles: payload,
      }

    default:
      return state
  }
}

export const showMyFiles = () => ({
  type: SET_MY_FILES_VIEW_VISIBLE,
  payload: true,
})

export const hideMyFiles = () => ({
  type: SET_MY_FILES_VIEW_VISIBLE,
  payload: false,
})

export const setMyFiles = files => ({
  type: SET_MY_FILES,
  payload: files,
})

// 课程资源
export const SET_ASSET_VIEW_VISIBLE = 'asset/SET_ASSET_VIEW_VISIBLE'
export const SET_CURRENT_NUM = 'asset/SET_CURRENT_NUM'

const defaultState = {
  isAssetVisible: false,
  curNum: 0,
}

export default (state = defaultState, action = {}) => {
  const { payload } = action
  switch (action.type) {
    case SET_ASSET_VIEW_VISIBLE:
      return {
        ...state,
        isAssetVisible: payload,
      }
    case SET_CURRENT_NUM:
      return {
        ...state,
        curNum: payload,
      }
    default:
      return state
  }
}

export const showAssetView = () => ({
  type: SET_ASSET_VIEW_VISIBLE,
  payload: true,
})

export const hideAssetView = () => ({
  type: SET_ASSET_VIEW_VISIBLE,
  payload: false,
})

export const setCurNum = num => ({
  type: SET_CURRENT_NUM,
  payload: num,
})

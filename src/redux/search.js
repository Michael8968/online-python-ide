// 我的文件
export const SET_SEARCH_VIEW_VISIBLE = 'search/SET_SEARCH_VIEW_VISIBLE'
export const SET_SEARCH_TEXT = 'search/SET_SEARCH_TEXT'
export const SET_SEARCH_NEXT = 'search/SET_SEARCH_NEXT'
export const SET_SEARCH_PREVIOUS = 'search/SET_SEARCH_PREVIOUS'
export const FINISH_SEARCH = 'search/FINISH_SEARCH'

const defaultState = {
  isSearchVisible: false,
  curSearchText: '',
  searchAction: '', // previous
}

export default (state = defaultState, action = {}) => {
  const { payload } = action
  switch (action.type) {
    case SET_SEARCH_VIEW_VISIBLE:
      return {
        ...state,
        isSearchVisible: payload,
      }
    case SET_SEARCH_TEXT:
      return {
        ...state,
        curSearchText: payload,
      }
    case SET_SEARCH_NEXT:
      return {
        ...state,
        searchAction: 'next',
      }
    case SET_SEARCH_PREVIOUS:
      return {
        ...state,
        searchAction: 'previous',
      }
    case FINISH_SEARCH:
      return {
        ...state,
        searchAction: '',
      }

    default:
      return state
  }
}

export const showSearch = () => ({
  type: SET_SEARCH_VIEW_VISIBLE,
  payload: true,
})

export const hideSearch = () => ({
  type: SET_SEARCH_VIEW_VISIBLE,
  payload: false,
})

export const setSearchText = text => ({
  type: SET_SEARCH_TEXT,
  payload: text,
})
export const setSearchNext = () => ({
  type: SET_SEARCH_NEXT,
})
export const setSearchPrevious = () => ({
  type: SET_SEARCH_PREVIOUS,
})
export const finishSearch = () => ({
  type: FINISH_SEARCH,
})

// 编辑区
export const UPDATE_CONTENT = 'tabs/UPDATE_CONTENT'
export const SET_ACTIVE_KEY = 'tabs/SET_ACTIVE_KEY'
export const ADD_PANE = 'tabs/ADD_PANE'
export const REMOVE_PANE = 'tabs/REMOVE_PANE'
export const UPDATE_PANE_NAME = 'tabs/UPDATE_PANE_NAME'
export const RESET_PANES = 'tabs/RESET_PANES'

const defaultState = {
  activeKey: '0',
  panes: [
    {
      title: 'main.py',
      content: '',
      key: '0',
      closable: false,
      hash: '',
    },
  ],
  timestamp: 0,
}

export default (state = defaultState, action = {}) => {
  const { payload } = action
  switch (action.type) {
    case UPDATE_CONTENT: {
      const panes = state.panes.filter(pane => pane.key === payload.key)
      panes[0].content = payload.content
      panes[0].hash = payload.hash
      return {
        ...state,
        panes: [...state.panes],
        timestamp: new Date().getTime(),
      }
    }
    case SET_ACTIVE_KEY:
      return {
        ...state,
        activeKey: payload,
      }
    case ADD_PANE: {
      const filter = state.panes.filter(pane => pane.key === payload.key)
      const found = filter && filter.length > 0
      if (found) {
        filter[0].title = payload.title
        filter[0].content = payload.content
      }

      return !found
        ? {
            ...state,
            panes: [...state.panes, payload],
          }
        : state
    }
    case REMOVE_PANE: {
      const filtered = state.panes.filter(pane => pane.key !== payload)
      return { ...state, panes: filtered }
    }
    case UPDATE_PANE_NAME: {
      const filter = state.panes.filter(pane => pane.key === payload.key)
      filter[0].title = payload.title
      return filter && filter.length > 0
        ? {
            ...state,
            panes: [...state.panes],
          }
        : state
    }
    case RESET_PANES:
      return {
        ...state,
        panes: payload,
      }
    default:
      return state
  }
}

export const updateContent = (key, content, hash = '') => ({
  type: UPDATE_CONTENT,
  payload: { key, content, hash },
})

export const setActiveKey = key => ({
  type: SET_ACTIVE_KEY,
  payload: key,
})

export const addPane = (title, content, key, closable = true) => ({
  type: ADD_PANE,
  payload: {
    title,
    content,
    key,
    closable: closable,
    output: [],
    error: [],
  },
})

export const removePane = key => ({
  type: REMOVE_PANE,
  payload: key,
})

export const updateTitle = (key, title) => ({
  type: UPDATE_PANE_NAME,
  payload: { key, title },
})

export const resetPanes = panes => ({
  type: RESET_PANES,
  payload: panes,
})

// 异步加载本地缓存的state
export const LOAD_STATE_START = 'LOAD_STATE_START'
export const LOAD_STATE_DONE = 'LOAD_STATE_DONE'
export const LOAD_STATE_FAILED = 'LOAD_STATE_FAILED'

const defaultState = {
  loading: false,
  loaded: false,
  error: null,
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case LOAD_STATE_START:
      return {
        loaded: false,
        error: null,
        loading: true,
      }
    case LOAD_STATE_DONE:
      return {
        loaded: true,
        error: null,
        loading: false,
      }
    case LOAD_STATE_FAILED:
      return {
        loaded: false,
        error: action.payload.error,
        loading: false,
      }
    default:
      return state
  }
}

export const loadStateStart = () => ({
  type: LOAD_STATE_START,
})

export const loadStateDone = state => ({
  type: LOAD_STATE_DONE,
  payload: state,
})

export const loadStateFailed = error => ({
  type: LOAD_STATE_FAILED,
  payload: error,
})

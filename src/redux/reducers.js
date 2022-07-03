import { combineReducers } from 'redux'
import _loader, { LOAD_STATE_DONE } from './_loader'
import app from './app'
import asset from './asset'
import courseware from './courseware'
import myfiles from './myfiles'
import tabs from './tabs'
import console from './console'
import search from './search'
import editor from './editor'

const appReducer = combineReducers({
  _loader,
  app,
  asset,
  courseware,
  myfiles,
  tabs,
  console,
  search,
  editor,
})

export default (state, action) => {
  // 替换state为异步获取的值
  if (action.type === LOAD_STATE_DONE && action.payload) {
    delete action.payload._loader
    state = { _loader: state._loader, ...action.payload }
  }
  return appReducer(state, action)
}

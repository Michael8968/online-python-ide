import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
// import { createBlacklistFilter } from 'redux-persist-transform-filter'
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import queryString from 'query-string'
import RootReducer from './reducers'
import tabs from './tabs'
import courseware from './courseware'

// Import the transformer creator
const expireReducer = require('redux-persist-expire')

const params = queryString.parse(window.location.search)
const courseId = params.courseId

const persistConfig = courseId
  ? {
      key: `python-web-${courseId}`,
      storage,
      throttle: 1000,
      whitelist: ['courseware', 'tabs'],
      // stateReconciler: autoMergeLevel2,
      transforms: [
        expireReducer('tabs', {
          expireSeconds: 7200,
          expiredState: tabs(),
          autoExpire: true,
        }),
        expireReducer('courseware', {
          expireSeconds: 7200,
          expiredState: courseware(),
          autoExpire: true,
        }),
      ],
    }
  : {
      key: 'python-web-root',
      storage,
      throttle: 1000,
      whitelist: ['courseware', 'tabs'],
    }

const persistedReducer = persistReducer(persistConfig, RootReducer)

// 启用Redux开发者工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
)

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./reducers', () => store.replaceReducer(RootReducer))
}

console.info('Store created:', store.getState())
const persistor = persistStore(store)
// export default store
export { store, persistor }

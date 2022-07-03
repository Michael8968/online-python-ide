import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import 'normalize.css'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/redux/store'
import APP from '@/views/app'

const renderApp = (
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <APP />
      </PersistGate>
    </Provider>
  </ConfigProvider>
)

ReactDOM.render(renderApp, document.getElementById('root'))

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('@/views/app', renderApp)
}

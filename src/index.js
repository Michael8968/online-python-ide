import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import 'normalize.css'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'redux/store'
import APP from 'views/app'

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
  module.hot.accept('views/app', renderApp)
}

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

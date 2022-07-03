import axios from 'axios'
// import { initCountly, catchEvent } from './countly'

const querystring = require('querystring')

// 初始化Countly
// initCountly('a3278475d93f7217405432f2845e9585bb539ef7')

axios.defaults.timeout = 15000
axios.defaults.headers.common['retry'] = 3
axios.defaults.headers.common['retryDelay'] = 1000

axios.interceptors.request.use(
  config => {
    // // // console.log('axios.request', config)
    return config
  },
  err => {
    // console.error('axios.request', err)
    // catchEvent('http_error', err.message)
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    if (
      response &&
      response.data &&
      (response.data.status === 0 || response.data.state === -1) &&
      response.data.msg &&
      response.data.msg.includes('未登')
    ) {
      // console.log('axios.response', response)
      alert('还未登录!')
      window.location.href = '/user'
      return Promise.reject('还未登录!')
    }

    return response
  },
  err => {
    const config = err.config
    let { headers } = config

    if (!config || !headers.retry) return Promise.reject(err)

    headers.__retryCount = headers.__retryCount || 0

    if (headers.__retryCount >= headers.retry) {
      if (err.message.includes('timeout')) {
        // alert('网络请求超时')
      } else if (err.message.includes('Network Error')) {
        // alert('网络异常，请检查网络')
      } else {
        // alert(err.message)
      }
      // catchEvent('http_error', err.message)
      return Promise.reject(err)
    }

    headers.__retryCount += 1
    return new Promise(resolve => {
      setTimeout(resolve, headers.retryDelay || 1)
    }).then(() => axios(config))
  }
)

export function get(url, params, config) {
  return new Promise((resolve, reject) => {
    axios.get(url, params, config).then(
      response => {
        resolve(response)
      },
      err => {
        reject(err)
      }
    )
  })
}

export function post(url, params, config) {
  return new Promise((resolve, reject) => {
    axios.post(url, querystring.stringify(params), config).then(
      response => {
        const data = response.data
        if (
          data.status === 200 ||
          data.status === '200' ||
          data.state === 200 ||
          data.state === '200' ||
          data.status === 1 ||
          data.status === '1' ||
          data.success === 1 ||
          data.code === 200 ||
          response.status === 200
        ) {
          return resolve(data)
        } else {
          console.error('post : ', url, response)
          return reject(data.msg || data.message || '未知错误')
        }
      },
      err => {
        console.error('post : ', url, err)
        if (err) return reject(err.msg || err.message || '未知错误')
      }
    )
  })
}

export let devHost =
  window.location.href.indexOf('localhost') >= 0 ? 'http://w.aomeng.com' : ''
export default axios

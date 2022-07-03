import querystring from 'querystring'
import Countly from 'countly-sdk-web'
import { version } from '../../package.json'

// 启用网页分析Countly
const initCountly = app_key => {
  Countly.app_key = app_key
  Countly.url = 'https://us-try.count.ly'
  Countly.app_version = version
  Countly.debug = false
  Countly.init()
  Countly.q.push(['track_sessions'])
  Countly.q.push(['track_errors'])
}

// 捕捉自定义事件
const catchEvent = (key, value) => {
  // console.log('Countly: catchEvent', key, value)
  Countly.q.push([
    'add_event',
    {
      key: key,
      segmentation: {
        value: querystring.stringify(value),
      },
    },
  ])
}
export { initCountly, catchEvent }

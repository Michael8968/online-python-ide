import queryString from 'query-string'
import { store } from '../redux/store'
// import { setTurtlePageUrl } from '../redux/editor'

const params = queryString.parse(window.location.search)
// let lastTurtlePageUrl = ''
function getTurtlePageUrl() {
  let src = ''
  if (params.sync) {
    const state = store.getState()
    const isMobile = state.app.isMobile
    const userId = state.app.userId
    const courseId = state.app.courseId
    const sync = state.app.sync // isMobile ? false : state.app.sync
    const writable = state.app.writable

    src =
      window.location.origin +
      window.location.pathname.replace('/index.html', '') +
      '/turtle.html' +
      `?courseId=${courseId}&userId=${userId}&sync=${sync}&writable=${writable}&mobile=${isMobile}`
    // console.log('getTurtlePageUrl : ', src)
    // store.dispatch(setTurtlePageUrl(src))
  } else {
    src =
      window.location.origin +
      window.location.pathname.replace('index.html', '') +
      'turtle.html'
    // store.dispatch(setTurtlePageUrl(src))
  }
  return src
}

// function isTurtlePageUrlChanged(url) {
//   if (lastTurtlePageUrl !== url) {
//     lastTurtlePageUrl = url
//     return true
//   }
//   return false
// }

// init
// lastTurtlePageUrl = getTurtlePageUrl()

export { getTurtlePageUrl }

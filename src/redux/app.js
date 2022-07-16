// APP主体状态
export const SET_APP_USER = 'app/SET_APP_USER'
export const START_SYNC = 'app/START_SYNC'
export const STOP_SYNC = 'app/STOP_SYNC'
export const SET_READ_ONLY = 'app/SET_READ_ONLY'
export const SET_MULTI_FILES = 'app/SET_MULTI_FILES'
export const SET_MOBILE_MODE = 'app/SET_MOBILE_MODE'

const defaultState = {
  userId: '',
  userName: '',
  isMaster: false,
  appRole: '',
  isLogon: false,
  sync: false,
  writable: true,
  courseId: '',
  useRTM: true,
  multiFiles: [],
  teacherId: '',
  isMobile: false,
}

export default (state = defaultState, action = {}) => {
  const { payload } = action
  switch (action.type) {
    case SET_MOBILE_MODE: {
      return {
        ...state,
        isMobile: payload,
      }
    }
    case SET_MULTI_FILES: {
      return {
        ...state,
        multiFiles: payload,
      }
    }
    case SET_APP_USER:
      const {
        appRole,
        userId,
        userName,
        sync,
        writable,
        courseId,
        useRTM,
        teacherId,
      } = payload
      return {
        ...state,
        isMaster: appRole === 'teacher',
        appRole,
        userId,
        userName,
        isLogon: !userId || userId.length <= 0 ? false : true,
        sync,
        writable,
        courseId,
        useRTM,
        teacherId: teacherId,
      }
    case START_SYNC:
      return {
        ...state,
        sync: true,
      }
    case STOP_SYNC:
      return {
        ...state,
        sync: false,
      }
    case SET_READ_ONLY:
      return {
        ...state,
        writable: !payload,
      }

    default:
      return state
  }
}

export const setAppUser = (
  appRole,
  userId,
  userName,
  sync = false,
  writable = true,
  courseId = '',
  useRTM = false,
  teacherId = ''
) => ({
  type: SET_APP_USER,
  payload: {
    appRole,
    userId,
    userName,
    sync,
    writable,
    courseId,
    useRTM,
    teacherId,
  },
})

export const startSync = () => ({
  type: START_SYNC,
})

export const stopSync = () => ({
  type: STOP_SYNC,
})

export const setReadOnly = readonly => ({
  type: SET_READ_ONLY,
  payload: !!readonly,
})
export const setMultiFiles = files => ({
  type: SET_MULTI_FILES,
  payload: files,
})
export const setMobileMode = isMobile => ({
  type: SET_MOBILE_MODE,
  payload: isMobile,
})

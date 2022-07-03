import { filter } from 'lodash-es'
import { getFileData } from './api'
import { store } from '../redux/store'
import { setMultiFiles } from '../redux/app'

const fetchLessonMultiFiles = () => {
  return new Promise((resolve, reject) => {
    getFileData('./lesson/lesson.json')
      .then(res => {
        // console.log('loadPython res', res)
        const data = res.data.lesson
        let files = []
        data.map(level1 => {
          level1.children &&
            level1.children.map(level2 => {
              level2.children &&
                level2.children.map(level3 => {
                  // console.log('level3', level3.files, index3)
                  if (level3.files && level3.files.length >= 2) {
                    files.push(level3.files)
                  }
                  level3.children &&
                    level3.children.map(level4 => {
                      // const files = level4.children[index4[3]].files
                      // console.log('level4', level4.files, index4)
                      if (level4.files && level4.files.length >= 2) {
                        files.push(level4.files)
                      }
                      return level4
                    })
                  return level3
                })
              return level2
            })
          return level1
        })
        // console.log('files', files)
        store.dispatch(setMultiFiles(files))
        return resolve(files)
      })
      .catch(error => {
        console.error(error)
        return reject(error)
      })
  })
}

const getCombindedCode = tab => {
  const state = store.getState()
  const panes = state.tabs.panes
  const multiFiles = state.app.multiFiles

  const files = filter(multiFiles, o => {
    return Object.values(o).includes(tab.title)
  })
  // console.log('files', files)
  if (files && files.length > 0) {
    let contents = []
    files[0].map(file => {
      // console.log('file', file)
      const pane = filter(panes, { title: file })
      // console.log('pane', pane)
      if (pane && pane[0]) {
        contents.push({ filename: file, content: pane[0].content }) // pane[0].content + contents
      }
      return file
    })
    // console.log('contents', contents)
    return contents
  } else {
    const pane = filter(panes, { key: tab.key })
    const content = pane[0].content
    return [{ content: content, filename: [tab.title] }]
  }
}

export { fetchLessonMultiFiles, getCombindedCode }

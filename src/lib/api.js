import { post, get } from './axios'
import OSS from 'ali-oss'
import COS from 'cos-js-sdk-v5'
import { toString } from 'lodash-es'

// /ossFile/accessKey 获取oss密钥接口
// http://w.aomeng.com/web-driver/teacher/get_access
// /idecompiler/ossFile/accessKey
const getAccessKey = () => {
  return post('/idecompiler/ossFile/accessKey', {})
}
const upload2oss = (sts, content, filename) => {
  // console.log('upload2oss', sts, filename)
  return new Promise((resolve, reject) => {
    try {
      const client = new OSS({
        region: sts.regionWeb,
        accessKeyId: sts.AccessKeyId,
        accessKeySecret: sts.AccessKeySecret,
        bucket: sts.bucketName,
        stsToken: sts.SecurityToken,
        secure: true,
      })
      client
        .put(`${sts.filePath}/${filename}`, new OSS.Buffer(content))
        .then(result => {
          return resolve(result)
        })
        .catch(err => {
          return reject(toString(err))
        })
    } catch (err) {
      return reject(toString(err))
    }
  })
}

// /webideCode/addWebideCode 添加webide代码编译器文件
const addWebideCode = (fileName, filePath, userId) => {
  return post('/idecompiler/webideCode/addWebideCode', {
    fileName: fileName,
    filePath: filePath,
    userId: userId,
  })
}

// /webideCode/deleteWebideCode 删除webide代码编译器文件
const deleteWebideCode = id => {
  return post('/idecompiler/webideCode/deleteWebideCode', {
    id: id,
  })
}
// /webideCode/getWebideCode 查询用户的webide代码编译器文件
const getWebideCode = userId => {
  return post('/idecompiler/webideCode/getWebideCode', {
    userId: userId,
  })
}
// /webideCode/editWebideCode 编辑webide代码编译器文件
const editWebideCode = (filePath, userId, id) => {
  return post('/idecompiler/webideCode/editWebideCode', {
    filePath: filePath,
    userId: userId,
    id: id,
  })
}
const getFileData = filePath => {
  return get(filePath, {}, {})
}
// /fileApi/openApi/getFileWeight
// rootFolder：根文件夹
// subFolder：子文件夹
// applicationName：boss
const getUploadVendor = (
  rootFolder = 'ide',
  subFolder = 'python',
  applicationName = 'pythonide'
) => {
  return post('/fileApi/openApi/getFileWeight', {
    rootFolder: rootFolder,
    subFolder: subFolder,
    applicationName: applicationName,
  })
}
const upload2cos = (config, content, filename) => {
  return new Promise((resolve, reject) => {
    try {
      var blob = new Blob([content], {
        type: 'text/plain;charset=utf-8',
      })
      // 调用方法
      var params = {
        Bucket: config.bucketName,
        Region: config.region,
        Key: `${config.filePath}/${filename}.py`,
        Body: blob, // content, // blob,
        // ContentLength: blob.size, // content.length, // blob.size,
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        },
      }
      const authorization = {
        TmpSecretId: config.credentials.tmpSecretId,
        TmpSecretKey: config.credentials.tmpSecretKey,
        XCosSecurityToken: config.credentials.sessionToken,
        StartTime: config.startTime,
        ExpiredTime: config.expiredTime, // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
      }
      const getAuthorization = (options, callback) => {
        callback(authorization)
      }
      const cos = new COS({
        // 必选参数
        getAuthorization: getAuthorization,
      })

      cos.putObject(params, function(err, data) {
        if (err) {
          console.error(err)
          reject(err.error.Message)
        } else {
          resolve(data)
        }
      })
    } catch (err) {
      return reject(toString(err))
    }
  })
}
// /fileApi/cosFile/getAccessKey
// rootFolder：根文件夹
// subFolder：子文件夹
// applicationName：boss
const getAccessKey4cos = (
  rootFolder = 'ide',
  subFolder = 'python',
  applicationName = 'pythonide'
) => {
  return post('/fileApi/cosFile/getAccessKey', {
    rootFolder: rootFolder,
    subFolder: subFolder,
    applicationName: applicationName,
  })
}
const uploadBlob2cos = (config, blob, filename) => {
  return new Promise((resolve, reject) => {
    try {
      // var blob = new Blob([content], {
      //   type: 'text/plain;charset=utf-8',
      // })
      // 调用方法
      var params = {
        Bucket: config.bucketName,
        Region: config.region,
        Key: `${config.filePath}/${filename}`,
        Body: blob, // content, // blob,
        // ContentLength: blob.size, // content.length, // blob.size,
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        },
      }
      const authorization = {
        TmpSecretId: config.credentials.tmpSecretId,
        TmpSecretKey: config.credentials.tmpSecretKey,
        XCosSecurityToken: config.credentials.sessionToken,
        StartTime: config.startTime,
        ExpiredTime: config.expiredTime, // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
      }
      const getAuthorization = (options, callback) => {
        callback(authorization)
      }
      const cos = new COS({
        // 必选参数
        getAuthorization: getAuthorization,
      })

      cos.putObject(params, function(err, data) {
        if (err) {
          console.error(err)
          reject(err.error.Message)
        } else {
          resolve(data)
        }
      })
    } catch (err) {
      return reject(toString(err))
    }
  })
}
const uploadBlob2oss = (sts, blob, filename) => {
  // console.log('upload2oss', sts, filename)
  return new Promise((resolve, reject) => {
    try {
      const client = new OSS({
        region: sts.regionWeb,
        accessKeyId: sts.AccessKeyId,
        accessKeySecret: sts.AccessKeySecret,
        bucket: sts.bucketName,
        stsToken: sts.SecurityToken,
        secure: true,
      })
      client
        .put(`${sts.filePath}/${filename}`, blob /* new OSS.Buffer(content)*/)
        .then(result => {
          return resolve(result)
        })
        .catch(err => {
          return reject(toString(err))
        })
    } catch (err) {
      return reject(toString(err))
    }
  })
}
export {
  getAccessKey,
  addWebideCode,
  deleteWebideCode,
  getWebideCode,
  upload2oss,
  editWebideCode,
  getFileData,
  getUploadVendor,
  upload2cos,
  getAccessKey4cos,
  uploadBlob2oss,
  uploadBlob2cos,
}

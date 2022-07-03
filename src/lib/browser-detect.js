const UAParser = require('ua-parser-js')

class DetectBrowser {
  constructor() {
    const parser = new UAParser()
    this.result = parser.getResult()
    // console.log(this.result)
  }

  osName() {
    return this.result.os.name
  }

  osVersion() {
    return this.result.os.version
  }

  browserName() {
    return this.result.browser.name
  }

  isSafari() {
    return (
      this.result.browser.name === 'Safari' ||
      this.result.browser.name === 'Mobile Safari'
    )
  }

  browserMajor() {
    return this.result.browser.major
  }

  deviceModel() {
    return this.result.device.model
  }

  deviceType() {
    return this.result.device.type
  }

  devicevVendor() {
    return this.result.device.vendor
  }

  chromeWindowsUrl() {
    return 'https://www.google.cn/chrome/index.html'
  }

  chromeMacUrl() {
    return 'https://www.google.cn/chrome/index.html'
  }

  isMobile() {
    return (
      this.result.os.name === 'iOS' ||
      this.result.os.name === 'Android' ||
      (window.navigator.maxTouchPoints > 1 && this.result.os.name !== 'Windows')
    )
  }
}

const browserDetect = new DetectBrowser()

export default browserDetect

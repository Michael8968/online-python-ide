
// console.log('agora sdk version: ' + AgoraRTC.VERSION + ' compatible: ' + AgoraRTC.checkSystemRequirements())

class RTCClient {
  constructor (isMobile = false) {
    this._isMobile = isMobile
    this._sync = false
    this._client = null
    this._joined = false
    this._published = false

    this._params = {}
    this._showProfile = false

    this._localStream = null
    this._agoraRTCStream = null
    this._canvasVideoStream = null
    this._mediaVideoStream = null
    this._remoteStreams = []

    this._currentStream = 'video'

    this._currentStreamIdx = 0

    // filePath is a mandatory parameter used to indicate an online URL of the mixing audio.
    // cycle is an optional parameter used to indicate the number of playback loops and it needs to be a positive integer. The web browser needs to be Google Chrome 65+.
    // replace is an optional parameter used to indicate if the audio mixing replaces the original audio.
    // playTime is a mandatory parameter used to set the starting position of mixing audio playback. 0 means playing the mixing file from the beginning.
    this.audioMixingOptions = {
      filePath: '',
      cycle: 1,
      replace: false,
      playTime: 0,
    }
  }

  handleEvents() {
    this._client.on('error', (err) => {
      console.error('error', err)
    })
    // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
    this._client.on('peer-leave', (evt) => {
      const id = evt.uid
      // console.log('peer-leave', id)
      const remoteStream = this._remoteStreams.filter((stream) => {
        return stream.getId() === id
      })
      if (remoteStream && remoteStream[0]) {
        remoteStream[0].stop();
      } else {
        console.error('peer-leave', this._remoteStreams);
      }
      this._remoteStreams = this._remoteStreams.filter((stream) => {
        return stream.getId() !== id
      })
    })
    // Occurs when the local stream is _published.
    this._client.on('stream-published', (evt) => {
      console.log('stream-published')
    })
    // Occurs when the remote stream is added.
    this._client.on('stream-added', (evt) => {
      const remoteStream = evt.stream
      const id = remoteStream.getId()
      if (id !== this._params.uid) {
        var audio = this._isMobile ? false : true
        this._client.subscribe(remoteStream, {video: true, audio: audio}, (err) => {
          console.log('stream subscribe failed', err)
        })
      }
      console.log('stream-added remote-uid: ', id)
    })
    // Occurs when a user subscribes to a remote stream.
    this._client.on('stream-subscribed', (evt) => {
      const remoteStream = evt.stream
      const id = remoteStream.getId()
      this._remoteStreams.push(remoteStream)
      remoteStream.play("remote_video", { fit: 'contain'}, function(errState){
          if (errState && errState.status !== "aborted"){
              // The playback fails, probably due to browser policy. You can resume the playback by user gesture.
          }

          const playerDiv = document.getElementById(`player_${id}`)
          playerDiv.style.backgroundColor = "white";
          playerDiv.style.display = "block";
          playerDiv.style.overflow = "hidden";
          const videoDiv = document.getElementById(`video${id}`)
          videoDiv.style.width = "fit-content";
          videoDiv.style.height = "fit-content";
          videoDiv.style.objectFit = "fill";
          videoDiv.style.display = "block";

          const pygameMainCanvasDiv = document.getElementById('pygame-main-canvas');
          const remoteVideoDiv = document.getElementById('remote_video')
          remoteVideoDiv.style.width = pygameMainCanvasDiv.clientWidth + 'px';
          console.log('stream-subscribed remote-uid: ', id, pygameMainCanvasDiv.clientWidth)
      });
    })
    // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
    this._client.on('stream-removed', (evt) => {
      const remoteStream = evt.stream
      const id = remoteStream.getId()
      remoteStream.stop()
      this._remoteStreams = this._remoteStreams.filter((stream) => {
        return stream.getId() !== id
      })
      // console.log('stream-removed remote-uid: ', id)
    })
    this._client.on('onTokenPrivilegeWillExpire', () => {
      console.log('onTokenPrivilegeWillExpire')
    })
    this._client.on('onTokenPrivilegeDidExpire', () => {
      console.log('onTokenPrivilegeDidExpire')
    })
    // Occurs when stream changed
    this._client.on('stream-updated', () => {
      console.log('stream-updated')
    })
    // this._client.on('first-video-frame-decode', function (evt) {
    //   console.log('first-video-frame-decode');
    // });
  }

  releaseStream(streamName) {
    const stream = this[streamName]
    if (stream) {
      if(stream.isPlaying()) {
        stream.stop()
        stream.close()
      }
      this[streamName] = null
    }
  }

  _createLocalStream(data, next) {
    this.releaseStream('_localStream')

    const streamConfig = {}

    streamConfig.audio = data.audioTrack ? true : false
    streamConfig.video = data.videoTrack ? true : false

    if (streamConfig.audio) {
      streamConfig.audioSource = data.audioTrack
    }

    if (streamConfig.video) {
      streamConfig.videoSource = data.videoTrack
    }

    // create local stream for publish
    this._localStream = AgoraRTC.createStream(streamConfig)

    if (data.cameraResolution && data.cameraResolution != 'default') {
      // set local video resolution
      this._localStream.setVideoProfile(data.cameraResolution)
    }
    // init local stream and passive audio video track for continuation
    this._localStream.init(() => {
      next()
    }, (err) =>  {
      console.error('init _localStream failed ', err)
    })
  }

  _createAgoraRTCStream(data, next) {
    this.releaseStream('_agoraRTCStream')
    // create local stream for replaceTrack
    this._agoraRTCStream = AgoraRTC.createStream({
      audio: true,
      video: true,
      screen: false,
      microphoneId: data.microphoneId,
      cameraId: data.cameraId
    })

    if (data.cameraResolution && data.cameraResolution != 'default') {
      // set local video resolution
      this._agoraRTCStream.setVideoProfile(data.cameraResolution)
    }
    // init local stream and passive audio video track for continuation
    this._agoraRTCStream.init(() => {
      next(this._agoraRTCStream.getVideoTrack(), this._agoraRTCStream.getAudioTrack())
    }, (err) =>  {
      console.error('init _agoraRTCStream failed ', err)
    })
  }

  _createCanvasVideoStream(callback) {
    this.releaseStream('_canvasVideoStream')
    const canvasDOM = document.getElementById('pygame-main-canvas')
    if (!canvasDOM) {
      return callback(undefined, undefined)
    }
    const canvasStream = canvasDOM.captureStream(25)

    // console.log('_createCanvasVideoStream', canvasDOM)

    const THIS = this

    this._canvasVideoStream = AgoraRTC.createStream({
      audio: THIS._sync ? true : false,
      video: true,
      videoSource: canvasStream.getVideoTracks()[0],
    })
    this._canvasVideoStream.init(() => {
      // console.log('_createCanvasVideoStream init success')
      callback(this._canvasVideoStream.getVideoTrack(), undefined)
    })
  }

  _createMediaVideoStream(callback) {
    this.releaseStream('_mediaVideoStream')
    const videoDOM = document.getElementById('sample_video')
    const videoStream = videoDOM.captureStream(25)
    this._mediaVideoStream = AgoraRTC.createStream({
      audio: true,
      video: true,
      videoSource: videoStream.getVideoTracks()[0],
      audioSource: videoStream.getAudioTracks()[0],
    })
    this._mediaVideoStream.init(() => {
      callback(this._mediaVideoStream.getVideoTrack(), this._mediaVideoStream.getAudioTrack())
    })
  }

  replaceTrack(data, callback) {
    const types = [ 'agora_rtc', 'canvas', 'video' ]
    const domIds = [ 'local_stream', 'local_canvas', 'local_video' ]
    const curerntIdx = this._currentStreamIdx
    const currentDomId = domIds[curerntIdx]
    const currentType = types[curerntIdx]

    const next = (videoTrack, audioTrack) => {
      videoTrack && this._localStream.replaceTrack(videoTrack)
      audioTrack && this._localStream.replaceTrack(audioTrack)

      this._currentStream = currentType
      if (this._currentStream === 'canvas') {
        // SketchPad.clearInterval()
      }
      if (callback) callback()
    }

    if (currentType == 'agora_rtc') {
      this._createAgoraRTCStream(data, next)
    } else if (currentType == 'video') {
      this._createMediaVideoStream(next)
    } else if (currentType == 'canvas') {
      this._createCanvasVideoStream(next)
    }
  }

  join (data) {
    return new Promise((resolve, reject) => {
      if (this._joined) {
        return resolve()
      }
      if (!AgoraRTC.checkSystemRequirements()) {
        return reject('当前使用的浏览器不适配')
      }

      /**
       * A class defining the properties of the config parameter in the createClient method.
       * Note:
       *    Ensure that you do not leave mode and codec as empty.
       *    Ensure that you set these properties before calling Client.join.
       *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
      **/
      this._client = AgoraRTC.createClient({mode: data.mode, codec: data.codec})

      this._params = data
      this._sync = data.sync

      // handle AgoraRTC client event
      this.handleEvents()

      // init client
      this._client.init(data.appID, () => {
        // console.log('init success')

        /**
         * Joins an AgoraRTC Channel
         * This method joins an AgoraRTC channel.
         * Parameters
         * tokenOrKey: string | null
         *    Low security requirements: Pass null as the parameter value.
         *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
         *  channel: string
         *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
         *    26 lowercase English letters a-z
         *    26 uppercase English letters A-Z
         *    10 numbers 0-9
         *    Space
         *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
         *  uid: number | null
         *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
         *   Note:
         *      All users in the same channel should have the same type (number) of uid.
         *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
        **/
        this._joined = true
        this._client.join(data.token ? data.token : null, data.channel, data.uid ? data.uid : null, (uid) => {
          this._params.uid = uid
          // console.log('join channel: ' + data.channel + ' success, uid: ' + uid)
          this._joined = true

          // start stream interval stats
          // if you don't need show stream profile you can comment this
          // if (!this._interval) {
          //   this._interval = setInterval(() => {
          //     this._updateVideoInfo()
          //   }, 0)
          // }

          if (!data.sync) return resolve()

          this._createCanvasVideoStream((videoSource, audioSource) => {
            this._localStream = this._canvasVideoStream
            return resolve()
            // this._createLocalStream({audioTrack: audioSource, videoTrack: videoSource}, () => {
            //   // create local stream for publish
            //   this._localStream = AgoraRTC.createStream({
            //     streamID: this._params.uid,
            //     audio: true,
            //     video: true,
            //     videoSource: videoSource,
            //     audioSource: audioSource
            //   })
            //
            //   // init local stream
            //   this._localStream.init(() => {
            //     console.log('init local stream success')
            //     // play stream with html element id "local_stream"
            //     // this._localStream.play('local_stream', {fit: 'cover'})
            //
            //     // $('#local_stream').removeClass('hide')
            //     // run callback
            //     return resolve()
            //   }, (err) =>  {
            //     console.error('init _localStream failed ', err)
            //     return reject(err)
            //   })
            // })
          })
        }, function(err) {
          this._joined = false
          console.error('client join failed', err)
          return reject(err)
        })
      }, (err) => {
        this._joined = false
        console.error(err)
        return reject(err)
      })
    })
  }

  publish () {
    // console.log('publish begin')
    if (!this._client) {
      console.error('publish : !this._client');
      return
    }
    if (!this._localStream) {
      console.error('publish : !this._localStream');
      return
    }
      // console.log('publish begin')
    if (this._published) {
      console.error('publish :this._published');
      return
    }
    const oldState = this._published

    // publish localStream
    this._client.publish(this._localStream, (err) => {
      this._published = oldState
      // console.log('publish failed')
      console.error(err)
    })
    this._published = true
    // console.log('publish seccess')
  }

  unpublish () {
    if (!this._client) {
      return
    }
    if (!this._published) {
      return
    }
    if (!this._localStream) {
      return
    }
    const oldState = this._published
    this._client.unpublish(this._localStream, (err) => {
      this._published = oldState
      // console.log('unpublish failed')
      console.error(err)
    })
    this._published = false
  }

  leave () {
    if (!this._client) {
      return
    }
    if (!this._joined) {
      return
    }
    // leave channel
    this._client.leave(() => {
      if (this._localStream) {
        // close stream
        this._localStream.close()

        // stop stream
        this._localStream.stop()
      }

      while (this._remoteStreams.length > 0) {
        const stream = this._remoteStreams.shift()
        stream.stop()
      }
      this._localStream = null
      this._remoteStreams = []
      this._client = null
      // console.log('client leaves channel success')
      this._published = false
      this._joined = false
    }, (err) => {
      // console.log('channel leave failed')
      console.error(err)
    })
  }

  _updateVideoInfo () {
    this._localStream && this._localStream.getStats((stats) => {
      // const localStreamProfile = [
      //   ['Uid: ', this._localStream.getId()].join(''),
      //   ['SDN access delay: ', stats.accessDelay, 'ms'].join(''),
      //   ['Video send: ', stats.videoSendFrameRate, 'fps ', stats.videoSendResolutionWidth + 'x' + stats.videoSendResolutionHeight].join(''),
      // ].join('<br/>')
      // $('#local_video_info')[0].innerHTML = localStreamProfile
    })

    if (this._remoteStreams.length > 0) {
      for (let remoteStream of this._remoteStreams) {
        remoteStream.getStats((stats) => {
          // const remoteStreamProfile = [
          //   ['Uid: ', remoteStream.getId()].join(''),
          //   ['SDN access delay: ', stats.accessDelay, 'ms'].join(''),
          //   ['End to end delay: ', stats.endToEndDelay, 'ms'].join(''),
          //   ['Video recv: ', stats.videoReceiveFrameRate, 'fps ', stats.videoReceiveResolutionWidth + 'x' + stats.videoReceiveResolutionHeight].join(''),
          // ].join('<br/>')
          // if ($('#remote_video_info_'+remoteStream.getId())[0]) {
          //   $('#remote_video_info_'+remoteStream.getId())[0].innerHTML = remoteStreamProfile
          // }
        })
      }
    }
  }

  setNetworkQualityAndStreamStats (enable) {
    this._showProfile = enable
    // this._showProfile ? $('.video-profile').removeClass('hide') : $('.video-profile').addClass('hide')
  }

  isJoined() {
    return this._joined;
  }

  startAudioMixing(filePath, position = 0, loops = 1) {
    if (!filePath) return

    const THIS = this

    if (!this._localStream) {
      setTimeout(() => {
        THIS.startAudioMixing(filePath, position + 1000, loops)
      }, 1000)
      return
    }

    this._localStream.stopAudioMixing()

    console.log('startAudioMixing -> ', filePath, position, loops);
    this._localStream.adjustAudioMixingVolume(50)

    this.audioMixingOptions.filePath = filePath
    this.audioMixingOptions.playTime = position
    this.audioMixingOptions.cycle = loops || 1
    // Starts audio mixing.
    this._localStream.startAudioMixing(this.audioMixingOptions, function(
      err
    ) {
      if (err) {
        console.error('Failed to start audio mixing. ' + err)
      }
    })
  }

  // Pauses audio mixing.
  pauseAudioMixing(filePath, position = 0) {
    if (!this._localStream) return
    this._localStream.pauseAudioMixing()
  }

  // Resumes audio mixing.
  resumeAudioMixing() {
    if (!this._localStream) return
    this._localStream.resumeAudioMixing()
  }

  // Stops audio mixing.
  stopAudioMixing() {
    if (!this._localStream) return
    this.audioMixingOptions.filePath = ''
    this.audioMixingOptions.playTime = 0
    this._localStream.stopAudioMixing()
  }

  // Adjusts the volume of audio mixing. The value of volume ranges between 1 and 100.
  adjustAudioMixingVolume(volume) {
    if (!this._localStream) return
    // console.log('adjustAudioMixingVolume -> ', volume);
    this._localStream.adjustAudioMixingVolume(volume)
  }

  // Gets the playback position (ms) of the mixed audio.
  getAudioMixingCurrentPosition() {
    if (!this._localStream) return 0
    return this._localStream.getAudioMixingCurrentPosition()
  }

  // Sets the playback position of the mixed audio.
  setAudioMixingPosition(filePath, position = 0) {
    if (!this._localStream) return
    if (this.audioMixingOptions.filePath !== filePath) {
      this.startAudioMixing(filePath, position)
    } else {
      this.audioMixingOptions.playTime = position
      this._localStream.setAudioMixingPosition(position)
    }
  }
}

// appID: "2071eeb90454440b9abfb992135a3403"
// cameraId: "cdaf78693e989823210f1e42d65b9773d69dc5cde38610bf2c23c3ef64713b2c"
// cameraResolution: "default"
// channel: "demo"
// codec: "h264"
// microphoneId: "default"
// mode: "live"
// stream: "canvas"
// token: ""
// uid: 3746832
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? false : decodeURIComponent(sParameterName[1]);
        }
    }
    return null;
};
// console.log('window.location.search.substring(1)', window.location.search.substring(1));
var courseId = getUrlParameter('courseId')
var userId = getUrlParameter('userId')
var sync = getUrlParameter('sync') === 'true' ? true : false
var writable = getUrlParameter('writable') === 'true' ? true : false
var syncMode = getUrlParameter('sync') ? true : false
var isMobile = getUrlParameter('mobile') === 'true' ? true : false

var rtcClient = null

if (syncMode) {
  rtcClient = new RTCClient(isMobile);
}
// global audio event handler
window.audioEventHandler = function(index, path, action, value) {
  if (window.audios && syncMode) {
    if (sync) {
      window.audios[index-1].muted = true;
      var fullPath = window.location.origin + window.location.pathname + '/' + path;
      fullPath = fullPath.replace('/turtle.html', '')
      // console.log('audioEventHandler -> ', index, fullPath, action, value);
      // use agora to play
      if (action === 'play') {
        rtcClient.startAudioMixing(fullPath, 0, value)
      } else if (action === 'pause') {
        rtcClient.pauseAudioMixing(fullPath)
      } else if (action === 'set_volume') {
        rtcClient.adjustAudioMixingVolume(parseInt(value*100))
      }
    } else {
      window.audios[index-1].muted = writable ? false : true;
    }

  }
}

var agoraParam = {}
window.addEventListener('load', function(event) {
  var aomeng = document.getElementById("aomeng")
  agoraParam = {
    appID: steg.decode(aomeng),
    channel: `canvas${courseId}`,
    codec: "h264", // "vp8", //
    mode: "live",
    stream: "canvas",
    uid: stringHash(`canvas-share-${userId}`),
    sync: sync
  }
})

function rtcJoin(sync = false) {
  if (!syncMode) return
  if (!rtcClient) return

  // console.log('rtcJoin', agoraParam, sync, rtcClient.isJoined());
  if (rtcClient.isJoined()) {
    if (sync && !isMobile) {
      rtcClient.publish()
    }
  } else {
    rtcClient.join(agoraParam).then(() => {
      if (sync && !isMobile) {
        rtcClient.publish()
      }
    })
  }
};

function rtcLeave() {
  if (!syncMode) return
  if (!rtcClient) return
  rtcClient.leave()
};

function rtcPublish() {
  if (!syncMode) return
  if (!rtcClient) return
  if (sync && !isMobile) {
    rtcClient.publish()
  }
};

function rtcUnpublish() {
  if (!syncMode) return
  if (!rtcClient) return
  rtcClient.unpublish()
};

function stopAudioMixing() {
  if (!syncMode) return
  if (!rtcClient) return
  rtcClient.stopAudioMixing()
};

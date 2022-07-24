import { Peer } from 'peerjs'
import EventEmitter from 'events'

class RTMClient extends EventEmitter {
  constructor() {
    super()
    this.channels = {}
    this._logined = false
    this.peer = null
    this.localId = ''
    this.remoteId = ''
    this.joined = false
  }

  init(localId, remoteId) {
    this.localId = localId
    this.remoteId = remoteId
    // const { uid, role /*peerHost, peerPort, peerPath*/ } = options
    this.peer = new Peer(localId, {
      host: '127.0.0.1',
      port: 8968,
      path: '/iturtle',
    })
    console.warn('init : ', localId, remoteId)
    // this.conn = this.peer.connect(remoteId)
    this.subscribeRemoteEvents()
  }

  // subscribe remote events
  subscribeRemoteEvents() {
    this.peer.on('open', function(id) {
      console.warn('My peer ID is: ' + id)
    })
    this.peer.on('connection', conn => {
      console.warn('connection : ', conn)
      this.conn = conn
      conn.on('open', () => {
        this.opened = true
        this.joined = true
        console.info('connection opened', Date.now())
      })
      conn.on('data', data => {
        this.emit('incoming-data', data)
      })
      conn.on('close', () => {
        console.info('connection closed')
        this.joined = false
        delete this.conn
      })
      conn.on('error', e => {
        console.error(e)
      })
    })
  }

  login() {
    return Promise.resolve(true)
  }

  connect() {
    return new Promise(resolve => {
      const targetId = this.remoteId
      const conn = this.peer.connect(targetId, {
        serialization: 'json',
      })
      conn.on('open', () => {
        console.info('connection opened', Date.now())
        this.conn = conn
        this.joined = true
        resolve()
      })
      conn.on('data', data => {
        this.emit('incoming-data', data)
      })
      conn.on('close', () => {
        console.info('connection closed')
        this.joined = false
        delete this.conn
      })
      conn.on('error', e => {
        console.error(e)
      })
    })
  }

  async sendChannelMessage(text, channelName) {
    if (!this.conn) return
    this.conn.send(text)
  }

  async sendPeerMessage(text, peerId) {
    if (!this.conn) return
    this.conn.send(text)
  }
}

const RtmClient = new RTMClient()
export default RtmClient

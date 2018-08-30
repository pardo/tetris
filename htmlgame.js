import {throttle, getElementSize} from './helpers'
import Tetris from './tetris'
import Drawable from './drawable'
import Peer from 'peerjs'

function HTMLTetrisGame (parent, options) {
  this.initialize = function () {
    this.options = {
      playable: false,
      anotherGame: null
    }
    Object.assign(this.options, options)
    this.sendGroundLoopInterval = null
    this.parent = parent
    this.createHtmlElements(parent)
    this.createDrawables()
    this.createTetrisGame()
    this.attachWindowEvents()
    if (this.options.playable) {
      this.startPieceMoveDownLoop()
      this.startDrawLoop()
    }
    this.handleResize()
    setTimeout(() => {
      this.handleResize()
    }, 1000)
  }

  this.addReplica = function (conn) {
    let replica = new HTMLTetrisGame(this.parent, { playable: false })
    // someone connected to us
    this.sendGroundLoop(conn)
    conn.on('data', (data) => {
      replica.tetris.loadSerializedData(data)
    })
    conn.on('close', () => {
      replica.destroy()
    })
    replica.handleResize()
  }

  this.destroy = function () {
    this.parent.removeChild(this.element)
  }

  this.attachWindowEvents = function () {
    window.addEventListener('load', () => { this.handleResize() })
    window.addEventListener('resize', () => { this.handleResize() })
    if (this.options.playable) {
      setTimeout(() => { this.createPeer() }, 1000)
      window.addEventListener('keydown', (e) => { this.handleKeyboardEvent(e) })
      window.addEventListener('keyup', (e) => { this.handleKeyboardEvent(e) })
    }
  }

  this.createTetrisGame = function () {
    this.tetris = new Tetris({
      drawableBackground: this.background,
      drawablePieces: this.pieces
    })
  }

  this.createHtmlElements = function () {
    let element = document.createElement('div')
    element.className = 'tetris-container'
    parent.appendChild(element)
    let elementInner = document.createElement('div')
    elementInner.className = 'tetris-container-inner'
    element.appendChild(elementInner)
    this.element = element
    this.elementInner = elementInner
  }

  this.createDrawables = function () {
    this.background = new Drawable()
    this.pieces = new Drawable()
    this.background.createAndAppend(this.elementInner)
    this.pieces.createAndAppend(this.elementInner)
  }

  this.handleResize = function () {
    let size = getElementSize(this.element)
    let blockSize = size.height / this.tetris.options.groundHeight
    if (blockSize * this.tetris.options.groundWidth > size.width) {
      // blocksize exceed width crop using width
      blockSize = size.width / this.tetris.options.groundWidth
    }
    blockSize = parseInt(blockSize)
    size = {
      width: this.tetris.options.groundWidth * blockSize,
      height: this.tetris.options.groundHeight * blockSize
    }
    // resize drawables
    this.background.resize(size)
    this.pieces.resize(size)
    // resize game
    this.tetris.resize(blockSize)
  }

  this.moveDown = throttle(function () { this.tetris.pieceMoveDown() }.bind(this), 40)
  this.moveLeft = throttle(function () { this.tetris.pieceMoveLeft() }.bind(this), 100)
  this.moveRight = throttle(function () { this.tetris.pieceMoveRight() }.bind(this), 100)

  this.handleKeyboardEvent = function (event) {
    switch (event.which) {
      case 80:
        // P
        if (event.type === 'keyup') {}
        break
      case 37:
        // left
        if (event.type === 'keydown') {
          this.moveLeft()
        }
        break
      case 38:
        // up
        if (event.type === 'keyup') {
          this.tetris.rotatePieceCounterClockwise()
        }
        break
      case 39:
        // right
        if (event.type === 'keydown') {
          this.moveRight()
        }
        break
      case 82:
        // R
        this.tetris.reset()
        break
      case 40:
        // down
        this.moveDown()
        break
      case 32:
        // space
        if (event.type === 'keyup') {
          this.tetris.rotatePieceCounterClockwise()
        }
        break
      case 78:
        // n
        if (event.type === 'keyup') {
          let name = window.prompt('I the other name')
          this.connect(name)
        }
        break
      default:
        console.log('which', event.which)
        break
    }
  }.bind(this)

  // networking
  this.sendGroundLoop = function (conn) {
    clearInterval(this.sendGroundLoopInterval)
    this.sendGroundLoopInterval = setInterval(() => {
      conn.send(
        this.tetris.serialize()
      )
    }, 1000)
  }

  this.connect = function (anotherName) {
    let conn = this.peer.connect('zIKosj1p' + anotherName)
    conn.on('open', () => {
      this.addReplica(conn)
    })
  }

  this.startPieceMoveDownLoop = function () {
    setInterval(() => {
      this.tetris.pieceMoveDown({ auto: true })
    }, 800)
  }

  this.startDrawLoop = function () {
    setInterval(() => {
      this.tetris.draw()
    }, 30) // 40fps
  }

  this.createPeer = function () {
    this.name = window.prompt('I need your name')
    this.peer = new Peer('zIKosj1p' + this.name)
    this.peer.on('connection', (conn) => {
      this.addReplica(conn)
    })
  }
  this.initialize()
}

export default HTMLTetrisGame

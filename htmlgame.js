import { throttle, getElementSize } from './helpers'
import Tetris from './tetris'
import Drawable from './drawable'

// Renders and drives a single Tetris board inside `parent`.
// `playable: true`  -> local player: game loops + keyboard/touch input.
// `playable: false` -> replica: only shows serialized state pushed via
//                      `game.tetris.loadSerializedData(...)`.
function HTMLTetrisGame (parent, options) {
  this.initialize = function () {
    this.options = {
      playable: false,
      half: false
    }
    Object.assign(this.options, options)
    this.parent = parent
    this.intervals = []
    this.createHtmlElements(parent)
    this.createDrawables()
    this.createTetrisGame()
    this.attachWindowEvents()
    if (this.options.playable) {
      this.startPieceMoveDownLoop()
      this.startDrawLoop()
    }
    this.handleResize()
    // Fonts / layout can settle a beat after first paint; re-measure once.
    this.intervals.push(setTimeout(() => { this.handleResize() }, 300))
  }

  this.destroy = function () {
    this.intervals.forEach((id) => { clearInterval(id); clearTimeout(id) })
    this.intervals = []
    window.removeEventListener('resize', this.boundResize)
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element)
    }
  }

  this.attachWindowEvents = function () {
    this.boundResize = () => { this.handleResize() }
    window.addEventListener('resize', this.boundResize)
    if (this.options.playable) {
      this.boundKey = (e) => { this.handleKeyboardEvent(e) }
      window.addEventListener('keydown', this.boundKey)
      window.addEventListener('keyup', this.boundKey)
    }
  }

  this.createTetrisGame = function () {
    this.tetris = new Tetris({
      drawableBackground: this.background,
      drawablePieces: this.pieces
    })
  }

  this.createHtmlElements = function () {
    const element = document.createElement('div')
    element.className = this.options.half ? 'tetris-container-half' : 'tetris-container'
    parent.appendChild(element)
    const elementInner = document.createElement('div')
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
    const size = getElementSize(this.element)
    if (!size.width || !size.height) { return }
    let blockSize = size.height / this.tetris.options.groundHeight
    if (blockSize * this.tetris.options.groundWidth > size.width) {
      // block size would overflow the width, constrain by width instead
      blockSize = size.width / this.tetris.options.groundWidth
    }
    blockSize = Math.max(1, parseInt(blockSize, 10))
    const drawSize = {
      width: this.tetris.options.groundWidth * blockSize,
      height: this.tetris.options.groundHeight * blockSize
    }
    this.background.resize(drawSize)
    this.pieces.resize(drawSize)
    this.tetris.resize(blockSize)
    this.tetris.draw()
  }

  // Throttled movement so key-repeat / held touch buttons stay smooth.
  this.moveDown = throttle(function () { this.tetris.pieceMoveDown() }.bind(this), 40)
  this.moveLeft = throttle(function () { this.tetris.pieceMoveLeft() }.bind(this), 100)
  this.moveRight = throttle(function () { this.tetris.pieceMoveRight() }.bind(this), 100)

  // Public input API — used by both keyboard handler and touch controls.
  this.input = {
    left: () => this.moveLeft(),
    right: () => this.moveRight(),
    down: () => this.moveDown(),
    rotate: () => this.tetris.rotatePieceCounterClockwise(),
    reset: () => this.tetris.reset()
  }

  this.handleKeyboardEvent = function (event) {
    switch (event.which) {
      case 37: // left
        if (event.type === 'keydown') { this.input.left() }
        break
      case 38: // up -> rotate
        if (event.type === 'keyup') { this.input.rotate() }
        break
      case 39: // right
        if (event.type === 'keydown') { this.input.right() }
        break
      case 40: // down
        this.input.down()
        break
      case 32: // space -> rotate
        if (event.type === 'keyup') { this.input.rotate() }
        break
      case 82: // R -> reset
        if (event.type === 'keyup') { this.input.reset() }
        break
    }
  }.bind(this)

  this.startPieceMoveDownLoop = function () {
    this.intervals.push(setInterval(() => {
      this.tetris.pieceMoveDown({ auto: true })
    }, 800))
  }

  this.startDrawLoop = function () {
    this.intervals.push(setInterval(() => {
      this.tetris.draw()
    }, 30)) // ~33fps
  }

  this.initialize()
}

export default HTMLTetrisGame

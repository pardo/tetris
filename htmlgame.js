import {throttle, getElementSize} from './helpers'
import Tetris from './tetris'
import Drawable from './drawable'

function HTMLTetrisGame (parent, options) {
  this.options = {
    playable: false
  }
  Object.assign(this.options, options)

  let element = document.createElement('div')
  element.className = 'tetris-container'
  parent.appendChild(element)

  let elementInner = document.createElement('div')
  elementInner.className = 'tetris-container-inner'
  element.appendChild(elementInner)

  var background = new Drawable()
  var pieces = new Drawable()
  background.createAndAppend(elementInner)
  pieces.createAndAppend(elementInner)

  var tetris = new Tetris({
    width: 300,
    height: 300,
    drawableBackground: background,
    drawablePieces: pieces
  })

  function resize () {
    let size = getElementSize(element)
    let blockSize = size.height / tetris.options.groundHeight
    if (blockSize * tetris.options.groundWidth > size.width) {
      // blocksize exceed width crop using width
      blockSize = size.width / tetris.options.groundWidth
    }
    blockSize = parseInt(blockSize)
    size = {
      width: tetris.options.groundWidth * blockSize,
      height: tetris.options.groundHeight * blockSize
    }
    background.resize(size)
    pieces.resize(size)
    tetris.resize(blockSize)
  }
  var moveDown = throttle(function () { tetris.pieceMoveDown() }, 40)
  var moveLeft = throttle(function () { tetris.pieceMoveLeft() }, 100)
  var moveRight = throttle(function () { tetris.pieceMoveRight() }, 100)
  var spaceKeyCanRotate = true

  function handleKeyboard (event) {
    switch (event.which) {
      case 80:
        // P
        if (event.type === 'keyup') {}
        break
      case 37:
        // left
        if (event.type === 'keydown') {
          moveLeft()
        }
        break
      case 38:
        // up
        if (event.type === 'keyup') {
          tetris.rotatePieceCounterClockwise()
        }
        break
      case 39:
        // right
        if (event.type === 'keydown') {
          moveRight()
        }
        break
      case 82:
        // R
        tetris.reset()
        break
      case 40:
        // down
        moveDown()
        break
      case 32:
        // space
        if (spaceKeyCanRotate) {
          tetris.rotatePieceCounterClockwise()
          spaceKeyCanRotate = false
        }
        if (event.type === 'keyup') {
          spaceKeyCanRotate = true
        }
        break
      case 78:
        // n
        if (event.type === 'keyup') {
        }
        break
      default:
        console.log('which', event.which)
        break
    }
  }
  function loop () {
    tetris.pieceMoveDown({ auto: true })
    setTimeout(loop, 800)
  }

  window.addEventListener('load', resize)
  window.addEventListener('resize', resize)

  if (this.options.playable) {
    window.addEventListener('keydown', handleKeyboard)
    window.addEventListener('keyup', handleKeyboard)
    loop()
    setInterval(() => {
      tetris.draw()
    }, 30) // 40fps
  } else {
    setInterval(() => {
      tetris.draw()
    }, 500) // 40fps
  }
  this.tetris = tetris
}

export default HTMLTetrisGame

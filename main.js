import './main.css'
import {getWindowSizePoint, throttle} from './helpers'
import Tetris from './tetris'
import Drawable from './drawable'

var parent = document.getElementById('main-tetris')
var background = new Drawable()
var pieces = new Drawable()
background.createAndAppend(parent)
pieces.createAndAppend(parent)

var tetris = new Tetris({
  width: getWindowSizePoint().width,
  height: getWindowSizePoint().height,
  drawableBackground: background,
  drawablePieces: pieces
})

function loop () {
  tetris.pieceMoveDown({ auto: true })
  setTimeout(loop, 800)
}
loop()

setInterval(function () {
  tetris.draw()
}, 30) // 40fps

function resize () {
  let size = getWindowSizePoint()
  let blockSize = size.height / tetris.options.groundHeight
  if (blockSize * tetris.options.groundWidth > size.width) {
    // blocksize exceed width crop using width
    blockSize = size.width / tetris.options.groundWidth
  }
  background.resize(size)
  pieces.resize(size)
  tetris.resize(blockSize)
}

window.addEventListener('load', resize)
window.addEventListener('resize', resize)

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

window.addEventListener('keydown', handleKeyboard)
window.addEventListener('keyup', handleKeyboard)

export default () => {
}

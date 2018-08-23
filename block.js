import {changeColorLuminance} from './helpers'

function Block (x, y, options) {
  // this represents a single pixel from the tetris
  this.draw = function (roughCanvas, drawEmpty) {
    // drawEmpty lets you know if the empty cell show be painted or not
    if (this.empty && !drawEmpty) { return }
    var x = this.x
    var y = this.y
    var w = this.size
    var h = this.size
    // strokeWidth
    var lw = this.size * 0.05
    var l = this.lines
    var hlw = lw / 2

    roughCanvas.rectangle(x, y, w, h, {
      roughness: 0.8,
      stroke: 'rgba(0,0,0,0)',
      fill: this.empty ? this.emptyColor : this.color,
      fillStyle: 'zigzag' // solid fill
    })

    if (this.empty) {
      return
    }

    if (l[0] === 1) {
      roughCanvas.line(x, y + hlw, x + w, y + hlw, {strokeWidth: lw})
    } else {
      roughCanvas.line(x, y + hlw, x + lw, y + hlw, {strokeWidth: lw})
    }
    if (l[1] === 1) {
      roughCanvas.line(x + w - hlw, y, x + w - hlw, y + h, {strokeWidth: lw})
    } else {
      roughCanvas.line(x + w - hlw, y, x + w - hlw, y + lw, {strokeWidth: lw})
    }
    if (l[2] === 1) {
      roughCanvas.line(x + w, y + h - hlw, x, y + h - hlw, {strokeWidth: lw})
    } else {
      roughCanvas.line(x + w, y + h - hlw, x + w - lw, y + h - hlw, {strokeWidth: lw})
    }
    if (l[3] === 1) {
      roughCanvas.line(x + hlw, y + h, x + hlw, y, {strokeWidth: lw})
    } else {
      roughCanvas.line(x + hlw, y + h, x + hlw, y + h - lw, {strokeWidth: lw})
    }
  }

  this.setColor = function (color) {
    this.color = color
    this.strokeColor = changeColorLuminance(this.color, -0.5)
  }

  this.copyFrom = function (block) {
    this.setColor(block.color)
    this.empty = block.empty
    this.lines[0] = block.lines[0]
    this.lines[1] = block.lines[1]
    this.lines[2] = block.lines[2]
    this.lines[3] = block.lines[3]
  }

  this.setPos = function (x, y) {
    this.x = x
    this.y = y
  }

  this.setSize = function (size) {
    this.size = size
  }

  // initialization
  this.options = {
    size: 15,
    emptyColor: '#1a1a1a',
    color: '#1a1a1a'
  }
  Object.assign(this.options, options)

  this.empty = true
  this.emptyColor = this.options.emptyColor
  this.setColor(this.options.color)
  this.setSize(this.options.size)
  this.setPos(x, y)
  this.x = x
  this.y = y
  // top right bottom left
  this.lines = [0, 0, 0, 0]
}

export default Block

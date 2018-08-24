import {changeColorLuminance} from './helpers'

function Block (x, y, options) {
  // this represents a single pixel from the tetris
  this.draw = function (drawable, drawEmpty) {
    let roughCanvas = drawable.roughCanvas
    // drawEmpty lets you know if the empty cell show be painted or not
    if (this.empty && !drawEmpty) { return }
    // draw the block
    roughCanvas.rectangle(this.x, this.y, this.size, this.size, {
      hachureGap: 4,
      roughness: 1.8,
      stroke: 'rgba(0,0,0,0.1)',
      fill: this.empty ? this.emptyColor : this.color,
      fillStyle: 'zigzag' // solid fill
    })
    if (this.empty) { return }
    // never draw lines on empty blocks
    this.drawBlockLines(drawable)
  }
  this.drawBlockLines = function (drawable) {
    var roughCanvas = drawable.roughCanvas
    var offset = this.size * 0.12 // this will draw lines outside the block
    var left = this.x
    var top = this.y
    var bottom = this.y + this.size
    var right = this.x + this.size
    // strokeWidth
    var lineOptions = {
      strokeWidth: this.size * 0.06,
      stroke: this.strokeColor
    }
    // top line
    if (this.lines[0] === 1) {
      roughCanvas.line(left - offset, top, right + offset, top, lineOptions)
    }
    // right line
    if (this.lines[1] === 1) {
      roughCanvas.line(right, top - offset, right, bottom + offset, lineOptions)
    }
    // bottom line
    if (this.lines[2] === 1) {
      roughCanvas.line(left - offset, bottom, right + offset, bottom, lineOptions)
    }
    // left line
    if (this.lines[3] === 1) {
      roughCanvas.line(left, top - offset, left, bottom + offset, lineOptions)
    }
  }
  this.setColor = function (color) {
    this.color = color
    // add transparency
    this.strokeColor = changeColorLuminance(this.color, -0.7) + '80'
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

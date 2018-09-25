import {changeColorLuminance} from './helpers'

const TOP_LINE = 1
const RIGHT_LINE = 2
const BOTTOM_LINE = 4
const LEFT_LINE = 8
const ALL_LINES = TOP_LINE + RIGHT_LINE + BOTTOM_LINE + LEFT_LINE

function toLines (points) {
  var lines = []
  for (let index = 0; index < points.length - 1; index++) {
    lines.push(
      [points[index], points[index + 1]]
    )
  }
  return lines
}

function drawBlock (drawable, data) {
  let roughCanvas = drawable.roughCanvas
  // draw the block
  var margin = data.size * 0.1
  var left = data.x
  var right = data.x + data.size
  var top = data.y
  var bottom = data.y + data.size
  /*
  Block diagram from drawing margins

  ##b##c##
  ##-##-##
  e-f##g-h
  ########
  ########
  i-j##k-l
  ##-##-##
  ##n##o##

  */
  var b = [left + margin, top]
  var c = [right - margin, top]

  var e = [left, top + margin]
  var f = [left + margin, top + margin]
  var g = [right - margin, top + margin]
  var h = [right, top + margin]

  var i = [left, bottom - margin]
  var j = [left + margin, bottom - margin]
  var k = [right - margin, bottom - margin]
  var l = [right, bottom - margin]

  var n = [left + margin, bottom]
  var o = [right - margin, bottom]

  var topLeftPoints = [e, f, b]
  var topRightPoints = [c, g, h]
  var bottomRightPoints = [l, k, o]
  var bottomLeftPoints = [n, j, i]

  var topPoints = [e, h]
  var rightPoints = [c, o]
  var bottomPoints = [l, i]
  var leftPoints = [n, b]

  var lines = []
  var points = []
  var hachureAngle = 45

  switch (data.lines) {
    case ALL_LINES:
      points = [f, g, k, j]
      lines = [
        [f, g], [g, k], [k, j], [j, f]
      ]
      hachureAngle = 0
      break
    case TOP_LINE + BOTTOM_LINE:
      points = [e, h, l, i]
      lines = [[e, h], [l, i]]
      hachureAngle = 90
      break
    case LEFT_LINE + RIGHT_LINE:
      points = [b, c, o, n]
      lines = [[b, n], [c, o]]
      hachureAngle = 0
      break
    case ALL_LINES - TOP_LINE:
      points = [b, c, k, j]
      lines = [
        [c, k], [k, j], [j, b]
      ]
      hachureAngle = 0
      break
    case ALL_LINES - RIGHT_LINE:
      points = [f, h, l, j]
      lines = [
        [f, h], [l, j], [j, f]
      ]
      hachureAngle = 90
      break
    case ALL_LINES - BOTTOM_LINE:
      points = [f, g, o, n]
      lines = [
        [f, g], [g, o], [n, f]
      ]
      hachureAngle = 0
      break
    case ALL_LINES - LEFT_LINE:
      points = [e, g, k, i]
      lines = [
        [e, g], [g, k], [k, i]
      ]
      hachureAngle = 90
      break
    case LEFT_LINE + BOTTOM_LINE:
      hachureAngle = 45
      points = [j, b, c, g, h, l]
      lines = [[c, g], [g, h], [l, j], [j, b]]
      break
    case LEFT_LINE + TOP_LINE:
      hachureAngle = -45
      points = [f, h, l, k, o, n]
      lines = [[f, h], [l, k], [k, o], [n, f]]
      break
    case RIGHT_LINE + BOTTOM_LINE:
      hachureAngle = -45
      points = [e, f, b, c, k, i]
      lines = [[e, f], [f, b], [c, k], [k, i]]
      break
    case RIGHT_LINE + TOP_LINE:
      hachureAngle = 45
      points = [e, g, o, n, j, i]
      lines = [[e, g], [g, o], [n, j], [j, i]]
      break
    case TOP_LINE:
      points = topPoints.concat(bottomRightPoints).concat(bottomLeftPoints)
      lines = [topPoints].concat(toLines(bottomRightPoints)).concat(toLines(bottomLeftPoints))
      hachureAngle = 90
      break
    case RIGHT_LINE:
      points = rightPoints.concat(bottomLeftPoints).concat(topLeftPoints)
      lines = [rightPoints].concat(toLines(bottomLeftPoints)).concat(toLines(topLeftPoints))
      hachureAngle = 0
      break
    case BOTTOM_LINE:
      points = bottomPoints.concat(topLeftPoints).concat(topRightPoints)
      lines = [bottomPoints].concat(toLines(topLeftPoints)).concat(toLines(topRightPoints))
      hachureAngle = 90
      break
    case LEFT_LINE:
      points = leftPoints.concat(topRightPoints).concat(bottomRightPoints)
      lines = [leftPoints].concat(toLines(topRightPoints)).concat(toLines(bottomRightPoints))
      hachureAngle = 0
      break
    case 0:
      points = topLeftPoints.concat(topRightPoints).concat(bottomRightPoints).concat(bottomLeftPoints)
      lines = [topLeftPoints].concat(toLines(topRightPoints)).concat(toLines(bottomRightPoints)).concat(toLines(bottomLeftPoints))
      hachureAngle = 0
      break
  }

  roughCanvas.polygon(points, {
    hachureAngle: hachureAngle,
    hachureGap: 4,
    roughness: 1.8,
    stroke: 'rgba(0,0,0,0.1)',
    fill: data.color,
    fillStyle: 'zigzag' // solid fill
  })

  var lineOptions = {
    strokeWidth: data.size * 0.06,
    stroke: data.strokeColor
  }

  lines.forEach(line => {
    roughCanvas.line(line[0][0], line[0][1], line[1][0], line[1][1], lineOptions)
  })
}

function Block (x, y, options) {
  // this represents a single pixel from the tetris
  this.draw = function (drawable, drawEmpty) {
    if (this.empty) { return }
    drawBlock(drawable, {
      x: this.x,
      y: this.y,
      size: this.size,
      color: this.color,
      strokeColor: this.strokeColor,
      lines: this.getLinesAsNumber()
    })
  }
  this.drawOriginal = function (drawable, drawEmpty) {
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
  this.getLinesAsNumber = function () {
    return this.lines[0] * 1 +
           this.lines[1] * 2 +
           this.lines[2] * 4 +
           this.lines[3] * 8
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

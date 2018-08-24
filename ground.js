import Block from './block'
import {range} from './helpers'

function Ground (groundWidth, groundHeight, blockSize) {
  this.addRandomBottom = function (lines) {
    // move the lines up so the random blocks don't endup
    // overriden user made blocks
    var w
    var h
    var b
    for (w = 0; w < this.groundWidth; w++) {
      for (h = 0; h < this.groundHeight; h++) {
        if (this.ground[w][h + lines] != null) {
          this.ground[w][h].copyFrom(this.ground[w][h + lines])
        }
      }
    }
    // add random bottom
    for (w = 0; w < this.groundWidth; w++) {
      for (h = this.groundHeight - lines; h < this.groundHeight; h++) {
        b = this.ground[w][h]
        b.setColor('#af5089')
        if (Math.random() < 0.7) {
          b.empty = false
          b.lines = [1, 1, 1, 1]
        } else {
          b.empty = true
        }
      }
    }
  }

  this.hide = function (options) {
    // mark all the blocks as empty
    this.mapGroundBlocks(function (w, h, block) {
      block.empty = true
    })
  }

  this.setBlockSize = function (size) {
    this.blockSize = size
    for (var w = 0; w < this.groundWidth; w++) {
      for (var h = 0; h < this.groundHeight; h++) {
        // change the size of the block
        this.ground[w][h].setSize(this.blockSize)
        // reposition the block inside the canvas
        this.ground[w][h].setPos(
          w * this.blockSize,
          h * this.blockSize
        )
      }
    }
  }

  this.meld = function (size) {
    // remove lines inside continous blocks
    function shouldDrawALine (ground, block, y, x) {
      if (ground[x] && ground[x][y]) {
        if (ground[x][y].empty) {
          return 1 // draw a line
        } else {
          // if the block is not empty
          // then check if is the same color
          // and draw a line if not the same
          return ground[x][y].color === block.color ? 0 : 1
        }
      } else {
        // outside the ground area, always draw a line
        return 1
      }
    }

    for (var w = 0; w < this.groundWidth; w++) {
      for (var h = 0; h < this.groundHeight; h++) {
        var block = this.ground[w][h]
        this.ground[w][h].lines = [
          shouldDrawALine(this.ground, block, h - 1, w), // top
          shouldDrawALine(this.ground, block, h, w + 1), // right
          shouldDrawALine(this.ground, block, h + 1, w), // bottom
          shouldDrawALine(this.ground, block, h, w - 1) // left
        ]
      }
    }
  }

  this.mapGroundBlocks = function (callback) {
    for (var w = 0; w < this.groundWidth; w++) {
      for (var h = 0; h < this.groundHeight; h++) {
        callback(w, h, this.ground[w][h], this.ground)
      }
    }
  }

  this.ended = function () {
    for (var w = 0; w < this.groundWidth; w++) {
      if (!this.ground[w][1].empty || !this.ground[w][1].empty) {
        return true
      }
    }
    return false
  }

  this.getCompletedLines = function () {
    // returns the line number of lines with non empty block from side to side
    var completedLines = []
    var complete = 0
    for (var h = 0; h < this.groundHeight; h++) {
      complete = 0
      for (var w = 0; w < this.groundWidth; w++) {
        if (!this.ground[w][h].empty) {
          complete += 1
        }
      }
      if (complete === this.groundWidth) {
        completedLines.push(h)
      }
    }
    return completedLines
  }

  this.removeLine = function (line) {
    for (var w = 0; w < this.groundWidth; w++) {
      for (var h = 0; h < this.groundHeight; h++) {
        if (h === line) {
          // remove line
          for (var ht = h; ht > 0; ht--) {
            this.ground[w][ht].copyFrom(this.ground[w][ht - 1])
          }
          this.ground[w][h].lines[2] = 1
          if (this.ground[w][h + 1]) {
            this.ground[w][h + 1].lines[0] = 1
          }
        }
      }
    }
  }

  this.removeLines = function (lines) {
    for (var i = 0; i < lines.length; i++) {
      this.removeLine(lines[i])
    }
  }
  this.drawGrid = function (drawable) {
    let roughCanvas = drawable.roughCanvas
    let options = {
      stroke: 'rgb(0, 0, 0, 0.5)',
      strokeWidth: this.blockSize / 10,
      bowing: 0.6
    }
    let gridOptions = {
      roughness: 0.6,
      stroke: 'rgb(203, 255, 241, 0.7)',
      strokeWidth: this.blockSize / 40
    }
    let top = 0
    let bottom = this.groundHeight * this.blockSize
    let left = 0
    let right = this.groundWidth * this.blockSize
    range(left, right, this.blockSize).map((position) => {
      // vertical lines
      roughCanvas.line(
        position, bottom,
        position, top,
        gridOptions
      )
    })
    range(top, bottom, this.blockSize).map((position) => {
      // horizontal lines
      roughCanvas.line(
        left, position,
        right, position,
        gridOptions
      )
    })
    // top left > top right
    roughCanvas.line(
      left, top,
      right, top,
      options
    )
    // top right > bottom right
    roughCanvas.line(
      right, top,
      right, bottom,
      options
    )
    // bottom right > bottom left
    roughCanvas.line(
      right, bottom,
      left, bottom,
      options
    )
    // bottom left > top left
    roughCanvas.line(
      left, bottom,
      left, top,
      options
    )
  }

  this.groundWidth = groundWidth
  this.groundHeight = groundHeight
  this.blockSize = blockSize
  this.blocks = []
  this.ground = []

  // Init
  var b
  var col = []
  for (var w = 0; w < this.groundWidth; w++) {
    col = []
    for (var h = 0; h < this.groundHeight; h++) {
      b = new Block(
        w * this.blockSize,
        h * this.blockSize,
        {
          size: blockSize
        }
      )
      col.push(b)
      this.blocks.push(b)
    }
    this.ground.push(col)
  }
}

export default Ground

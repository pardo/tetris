import Piece from './piece'
import Ground from './ground'

function Tetris (options) {
  // initialize
  this.initialize = function () {
    this.options = {
      width: 100,
      height: 100,
      groundWidth: 10,
      groundHeight: 22,
      drawableBackground: null,
      drawablePieces: null
    }
    Object.assign(this.options, options)
    this.blockSize = 20
    this.options.width = this.options.groundWidth * this.blockSize
    this.newPiecePosition = [
      parseInt(this.options.groundWidth / 2) - 1, 0
    ]
    this.ground = new Ground(
      this.options.groundWidth,
      this.options.groundHeight,
      this.blockSize
    )
    this.currentPieceGround = new Ground(
      this.options.groundWidth,
      this.options.groundHeight,
      this.blockSize
    )
    this.reset()
  }

  this.reset = function () {
    this.ground.hide()
    this.currentPieceGround.hide()
    this.ended = false
    this.count = {
      pieces: 0,
      lines: 0,
      linesCount: {
        1: 0,
        2: 0,
        3: 0,
        4: 0
      },
      speed: 0
    }
    this.piecePosition = [
      this.newPiecePosition[0],
      this.newPiecePosition[1]
    ]
    this.piece = new Piece()
    this.nextPiece = new Piece()
    this.groundDirty = true
    this.currentPieceGroundDirty = true
  }

  this.serialize = function (previousUpdate) {
    var serializedGround = []
    for (let w = 0; w < this.ground.groundWidth; w++) {
      for (let h = 0; h < this.ground.groundHeight; h++) {
        var cpb = this.currentPieceGround.ground[w][h]
        var b = this.ground.ground[w][h]
        var blockToPush = null
        if (b.empty && !cpb.empty) {
          blockToPush = cpb
        } else if (!b.empty && cpb.empty) {
          blockToPush = b
        }
        if (blockToPush) {
          serializedGround.push([
            (w << 6) + h,
            parseInt(blockToPush.color.replace('#', '0x')),
            blockToPush.lines[0] * 1 +
            blockToPush.lines[1] * 2 +
            blockToPush.lines[2] * 4 +
            blockToPush.lines[3] * 8
          ])
        } else {
          serializedGround.push([(w << 6) + h])
        }
      }
    }
    return serializedGround
  }

  this.loadSerializedData = function (data) {
    data.map((e) => {
      var h = e[0] & 63
      var w = e[0] >> 6 & 63
      if (!e[1]) {
        this.ground.ground[w][h].empty = true
      } else {
        this.ground.ground[w][h].empty = false
        this.ground.ground[w][h].setColor('#' + ('000000' + (e[1]).toString(16)).slice(-6))
        this.ground.ground[w][h].lines = [
          e[2] & 1,
          e[2] >> 1 & 1,
          e[2] >> 2 & 1,
          e[2] >> 3 & 1
        ]
      }
    })
    this.currentPieceGroundDirty = true
    this.groundDirty = true
    this.draw()
  }

  this.drawPieceGround = function () {
    this.options.drawablePieces.clear()
    this.currentPieceGround.mapGroundBlocks(function (x, y, block) {
      block.draw(this.options.drawablePieces)
    }.bind(this))
    this.currentPieceGroundDirty = false
  }

  this.drawGround = function () {
    this.options.drawableBackground.clear()
    this.ground.drawGrid(this.options.drawableBackground)
    this.ground.mapGroundBlocks(function (x, y, block) {
      block.draw(this.options.drawableBackground)
    }.bind(this))
    this.groundDirty = false
  }

  this.draw = function () {
    if (this.currentPieceGroundDirty) { this.drawPieceGround() }
    if (this.groundDirty) { this.drawGround() }
  }

  this.rotatePiece = function (action, reverseAction) {
    this.piece[action]()
    var tmpPos = [this.piecePosition[0], this.piecePosition[1]]
    if (this.piece.collide(this.ground, this.piecePosition) || this.piece.outside(this.ground, this.piecePosition)) {
      // test moving left
      tmpPos = [ this.piecePosition[0] - 1, this.piecePosition[1] ]
      if (this.piece.collide(this.ground, tmpPos) || this.piece.outside(this.ground, tmpPos)) {
        // test moving right
        tmpPos = [ this.piecePosition[0] + 1, this.piecePosition[1] ]
        if (this.piece.collide(this.ground, tmpPos) || this.piece.outside(this.ground, tmpPos)) {
        // un able to move , undo
          this.piece[reverseAction]()
          return
        }
      }
    }
    this.piecePosition = tmpPos
    this.currentPieceGroundDirty = true
    this.currentPieceGround.hide()
    this.piece.draw(this.currentPieceGround, this.piecePosition)
  }

  this.rotatePieceClockwise = function () {
    this.rotatePiece('rotateClockwise', 'rotateCounterClockwise')
  }

  this.rotatePieceCounterClockwise = function () {
    this.rotatePiece('rotateCounterClockwise', 'rotateClockwise')
  }

  this.pieceMove = function (offsetX) {
    var newPos = [
      this.piecePosition[0] + offsetX,
      this.piecePosition[1]
    ]
    if (this.piece.collide(this.ground, newPos) || this.piece.outside(this.ground, newPos)) {
      // collision nothing to do
    } else {
      this.piecePosition = newPos
      this.currentPieceGroundDirty = true
      this.currentPieceGround.hide()
      this.piece.draw(this.currentPieceGround, this.piecePosition)
    }
  }

  this.pieceMoveLeft = function () {
    this.pieceMove(-1)
  }

  this.pieceMoveRight = function () {
    this.pieceMove(1)
  }

  this.pieceMoveDown = function (options) {
    if (this.ended) { return }
    var args = {}
    Object.assign(args, {
      auto: false
    }, options)
    this.piecePosition[1] += 1
    if (this.piece.collide(this.ground, this.piecePosition) || this.piece.outside(this.ground, this.piecePosition)) {
      // after moving the piece down it collided so move it up and add a new one at the top
      this.piecePosition[1] -= 1
      this.piece.draw(this.ground, this.piecePosition)
      this.piecePosition = [this.newPiecePosition[0], this.newPiecePosition[1]]
      this.piece = this.nextPiece
      this.nextPiece = new Piece()
      var l = this.ground.getCompletedLines()
      if (l.length > 0) {
        this.count.linesCount[l.length] += 1
        this.linesRemovedCallback(this, l)
      }
      this.count.lines += l.length
      this.count.pieces += 1
      this.newPieceCallback(this, this.piece, this.nextPiece, l)
      this.ground.removeLines(l)
      if (this.ground.ended()) {
        this.ended = true
        // when the game ends grey out all the pieces
        this.ground.mapGroundBlocks(function (x, y, b) {
          b.setColor('#777777')
        })
        this.gameEndedCallback(this)
      }
      this.ground.meld()
      this.groundDirty = true
    }
    if (!args.auto) {
      this.count.speed += 1
    }
    this.currentPieceGround.hide()
    this.piece.draw(this.currentPieceGround, this.piecePosition)
    this.currentPieceGroundDirty = true
  }

  // Methods
  this.resize = function (blockSize) {
    this.blockSize = blockSize
    this.ground.setBlockSize(this.blockSize)
    this.currentPieceGround.setBlockSize(this.blockSize)
    this.groundDirty = true
    this.currentPieceGroundDirty = true
  }

  this.getPoints = function () {
    return (
      this.count.linesCount[1] * 10 +
      this.count.linesCount[2] * 20 +
      this.count.linesCount[3] * 45 +
      this.count.linesCount[4] * 70 +
      this.count.pieces * 3 +
      this.count.speed * 8
    )
  }

  // punishments
  this.makeNextPieceHardOne = function () {
    this.nextPiece = new Piece(null, {
      hard: true
    })
  }

  this.addRandomBottom = function (numberOfLines) {
    if (numberOfLines === undefined) {
      numberOfLines = Math.ceil(Math.random() * 4)
    }
    this.ground.addRandomBottom(numberOfLines)
    this.groundDirty = true
  }

  // callbacks
  this.linesRemovedCallback = function (tetris, lines) {
  }

  this.gameEndedCallback = function (tetris) {
  }

  this.newPieceCallback = function (tetris, currentPiece, nextPiece, lines) {
  }

  this.initialize()
}

export default Tetris

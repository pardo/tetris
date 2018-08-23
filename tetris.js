import Piece from './piece'
import Ground from './ground'

function Tetris (options) {
  this.options = {
    width: 100,
    height: 100,
    blocks_w: 10,
    blocks_h: 22,
    drawableBackground: null,
    drawablePieces: null
  }
  Object.assign(this.options, options)

  this.count = {
    pieces: 0,
    lines: 0,
    line1: 0,
    line2: 0,
    line3: 0,
    line4: 0,
    speed: 0
  }

  this.ended = false
  // this.block_size = parseInt((this.options.height) / this.options.blocks_h)
  this.block_size = 20
  this.options.width = this.options.blocks_w * this.block_size
  this.start_pos = [parseInt(this.options.blocks_w / 2) - 1, 0]
  this.pos = [parseInt(this.options.blocks_w / 2) - 1, 0]

  this.ground = new Ground(
    this.options.blocks_w,
    this.options.blocks_h,
    this.block_size
  )

  this.piece_ground = new Ground(
    this.options.blocks_w,
    this.options.blocks_h,
    this.block_size
  )

  this.ground.hide()
  this.piece_ground.hide()

  this.piece = new Piece()
  this.next_piece = new Piece()

  this.reset = function () {
    this.ground.mapGroundBlocks(function (w, h, b) {
      b.empty = true
    })
    this.ended = false
    this.count = {
      pieces: 0,
      lines: 0,
      line1: 0,
      line2: 0,
      line3: 0,
      line4: 0,
      speed: 0
    }
    this.pos = [
      this.start_pos[0],
      this.start_pos[1]
    ]
    this.piece = this.next_piece
    this.next_piece = new Piece()
    this.layer_dirt = true
    this.piece_layer_dirt = true
  }

  this.draw = function () {
    if (this.piece_layer_dirt) {
      this.options.drawablePieces.clear()
      this.piece_ground.mapGroundBlocks(function (x, y, block) {
        block.draw(this.options.drawablePieces.roughCanvas)
      }.bind(this))
      this.piece_layer_dirt = false
    }
    if (this.layer_dirt) {
      this.options.drawableBackground.clear()
      this.ground.mapGroundBlocks(function (x, y, block) {
        block.draw(this.options.drawableBackground.roughCanvas)
      }.bind(this))
      this.layer_dirt = false
    }
  }

  this.rotatePieceClockwise = function () {
    this.piece.rotateClockwise()
    var tmpPos = [this.pos[0], this.pos[1]]
    if (this.piece.collide(this.ground, this.pos) || this.piece.outside(this.ground, this.pos)) {
      // test moving left
      tmpPos = [ this.pos[0] - 1, this.pos[1] ]
      if (this.piece.collide(this.ground, tmpPos) || this.piece.outside(this.ground, tmpPos)) {
        // test moving right
        tmpPos = [ this.pos[0] + 1, this.pos[1] ]
        if (this.piece.collide(this.ground, tmpPos) || this.piece.outside(this.ground, tmpPos)) {
        // un able to move , undo
          this.piece.rotateCounterClockwise()
          return
        }
      }
    }
    this.pos = tmpPos
    this.piece_layer_dirt = true
    this.piece_ground.hide()
    this.piece.draw(this.piece_ground, this.pos)
  }

  this.rotatePieceCounterClockwise = function () {
    this.piece.rotateCounterClockwise()
    var tmpPos = [this.pos[0], this.pos[1]]
    if (this.piece.collide(this.ground, this.pos) || this.piece.outside(this.ground, this.pos)) {
      // test moving left
      tmpPos = [ this.pos[0] - 1, this.pos[1] ]
      if (this.piece.collide(this.ground, tmpPos) || this.piece.outside(this.ground, tmpPos)) {
        // test moving right
        tmpPos = [ this.pos[0] + 1, this.pos[1] ]
        if (this.piece.collide(this.ground, tmpPos) || this.piece.outside(this.ground, tmpPos)) {
        // un able to move , undo
          this.piece.rotateClockwise()
          return
        }
      }
    }
    this.pos = tmpPos
    this.piece_layer_dirt = true
    this.piece_ground.hide()
    this.piece.draw(this.piece_ground, this.pos)
  }

  this.pieceMoveLeft = function () {
    var tmpPos = [ this.pos[0] - 1, this.pos[1] ]
    if (this.piece.collide(this.ground, tmpPos) || this.piece.outside(this.ground, tmpPos)) {
    } else {
      this.pos = tmpPos
      this.piece_layer_dirt = true
      this.piece_ground.hide()
      this.piece.draw(this.piece_ground, this.pos)
    }
  }

  this.pieceMoveRight = function () {
    var tmpPos = [ this.pos[0] + 1, this.pos[1] ]
    if (this.piece.collide(this.ground, tmpPos) || this.piece.outside(this.ground, tmpPos)) {
    } else {
      this.pos = tmpPos
      this.piece_layer_dirt = true
      this.piece_ground.hide()
      this.piece.draw(this.piece_ground, this.pos)
    }
  }

  this.pieceMoveDown = function (options) {
    if (this.ended) {
      return
    }
    var args = {}
    Object.assign(args, {
      auto: false
    }, options)
    this.pos[1] += 1
    if (this.piece.collide(this.ground, this.pos) || this.piece.outside(this.ground, this.pos)) {
      this.pos[1] -= 1
      this.piece.draw(this.ground, this.pos)
      this.pos = [
        this.start_pos[0],
        this.start_pos[1]
      ]
      this.piece = this.next_piece
      this.next_piece = new Piece()
      var l = this.ground.getCompletedLines()
      switch (l.length) {
        case 1:
          this.count.line1 += 1
          break
        case 2:
          this.count.line2 += 1
          break
        case 3:
          this.count.line3 += 1
          break
        case 4:
          this.count.line4 += 1
          break
      }
      if (l.length > 0) {
        this.linesRemovedCallback(this, l)
      }
      this.count.lines += l.length
      this.count.pieces += 1
      this.newPieceCallback(this, this.piece, this.next_piece, l)
      this.ground.removeLines(l)
      if (this.ground.ended()) {
        this.ended = true
        // when the game ends grey out all the pieces
        this.ground.mapGroundBlocks(function (x, y, b) {
          b.setColor('#777777')
        })
        this.gameEndedCallback(this)
      }
      // this.ground.meld()

      this.layer_dirt = true
    }

    if (!args.auto) {
      this.count.speed += 1
    }

    this.piece_layer_dirt = true
    this.piece_ground.hide()
    this.piece.draw(this.piece_ground, this.pos)
  }

  // Methods
  this.resize = function () {
    this.block_size = 30
    this.ground.setBlockSize(this.block_size)
    this.piece_ground.setBlockSize(this.block_size)
    this.layer_dirt = true
    this.piece_layer_dirt = true
  }

  this.get_points = function () {
    return this.count.line1 * 5 +
        this.count.line2 * 20 +
        this.count.line3 * 45 +
        this.count.line4 * 80 +
        this.count.pieces * 3 +
        this.count.speed * 8
  }

  // punishments
  this.makeNextPieceHardOne = function () {
    this.next_piece = new Piece(null, {
      hard: true
    })
  }

  this.addRandomBottom = function (numberOfLines) {
    if (numberOfLines === undefined) {
      numberOfLines = Math.ceil(Math.random() * 4)
    }
    this.ground.addRandomBottom(numberOfLines)
    this.layer_dirt = true
  }

  // callbacks
  this.linesRemovedCallback = function (tetris, lines) {
  }

  this.gameEndedCallback = function (tetris) {
  }

  this.newPieceCallback = function (tetris, currentPiece, nextPiece, lines) {
  }
}

export default Tetris

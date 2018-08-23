import {FisherYatesShuffle} from './helpers'

var PiecesShapes = {}

PiecesShapes['is'] = {
  color: '#64b0ff',
  shapes: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['s'] = {
  color: '#008f32',
  shapes: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['il'] = {
  color: '#ea9e22',
  shapes: [
    [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [1, 1, 0],
      [1, 0, 0],
      [1, 0, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['l'] = {
  color: '#f26aff',
  shapes: [
    [
      [1, 1, 1],
      [1, 0, 0],
      [0, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['c'] = {
  color: '#4240ff',
  shapes: [
    [
      [1, 1],
      [1, 1]
    ]
  ],
  offset: [0, 0]
}

PiecesShapes['t'] = {
  // color: "#6b6d00",
  // color: "#afaf24",
  color: '#afcf30',
  shapes: [
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [1, 0, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['i'] = {
  color: '#b53120',
  shapes: [
    [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['w'] = {
  color: '#ffdd00',
  shapes: [
    [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 1]
    ],
    [
      [0, 0, 0, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [1, 1, 0, 0]
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 1]
    ],
    [
      [0, 0, 1, 1],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [1, 0, 0, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['o'] = {
  color: '#04a0fb',
  shapes: [
    [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [1, 0, 1, 0],
      [1, 0, 1, 0],
      [0, 1, 0, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['ii'] = {
  color: '#ec1346',
  shapes: [
    [
      [1, 0, 0, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 1]
    ],
    [
      [1, 0, 1, 0],
      [0, 0, 0, 0],
      [1, 0, 1, 0],
      [0, 0, 0, 0]
    ]
  ],
  offset: [1, 0]
}

PiecesShapes['ca'] = {
  color: '#ec1346',
  shapes: [
    [
      [1, 1, 0],
      [1, 0, 0],
      [1, 1, 0]
    ],
    [
      [1, 1, 1],
      [1, 0, 1],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [0, 0, 1],
      [0, 1, 1]
    ],
    [
      [0, 0, 0],
      [1, 0, 1],
      [1, 1, 1]
    ]
  ],
  offset: [1, 0]
}

function Piece (type, options) {
  this.rotateClockwise = function () {
    this.shapeIndex += 1
    this.shapeIndex = this.shapeIndex >= this.shapes.length ? 0 : this.shapeIndex
  }

  this.rotateCounterClockwise = function () {
    this.shapeIndex -= 1
    this.shapeIndex = this.shapeIndex < 0 ? this.shapes.length - 1 : this.shapeIndex
  }

  this.draw = function (groundObject, pos) {
    // this updates all the blocks on the groundObject to draw the piece
    return this.piece_test(groundObject, pos, 'draw')
  }
  this.collide = function (groundObject, pos) {
    // check if
    return this.piece_test(groundObject, pos, 'collide')
  }
  this.outside = function (groundObject, pos) {
    return this.piece_test(groundObject, pos, 'outside')
  }
  this.piece_test = function (groundObject, pos, method) {
    // method could be one of "draw", "collide", "outside"
    // draw will update the blocks on the ground based on the piece position
    // collide will check if the piece collides with the ground
    // outside will check if the piece if outside the ground area
    var ground = groundObject.ground
    // the shape of the piece
    var pattern = this.shapes[this.shapeIndex]
    var block = null
    function shouldDrawALine (p, y, x) {
      // this returns if a line should be painted on the side of the rectangle pixel
      if (p[y] && p[y][x]) {
        return 1 - p[y][x]
      }
      return 1
    }
    for (var y = 0; y < pattern.length; y++) {
      for (var x = 0; x < pattern[y].length; x++) {
        if (pattern[y][x] === 1) {
          try {
            let xground = x + pos[0] - this.offset[0]
            let yground = y + pos[1] - this.offset[1]
            block = ground[xground][yground]
          } catch (e) {
            block = null
          }

          // test collide
          if (method === 'collide' && block && !block.empty) {
            return true
          } else if (method === 'draw' && block) {
            block.setColor(this.color)
            block.empty = false
            block.lines = [
              shouldDrawALine(pattern, y - 1, x),
              shouldDrawALine(pattern, y, x + 1),
              shouldDrawALine(pattern, y + 1, x),
              shouldDrawALine(pattern, y, x - 1)
            ]
          } else if (method === 'outside' && block == null) {
            return true
          }
        }
      }
    }
    if (method === 'collide' || method === 'outside') {
      return false
    }
  }

  this.initialize = function (type) {
    var piece
    if (type) {
      piece = PiecesShapes[type]
    }
    if (!piece) {
      if (this.options.hard) {
        type = FisherYatesShuffle(['w', 'o', 'ii', 'ca'])[0]
      } else {
        type = FisherYatesShuffle(['c', 's', 'is', 'i', 'l', 'il', 't'])[0]
      }
      piece = PiecesShapes[type]
    }
    this.type = type
    this.color = piece.color
    this.shapes = piece.shapes
    this.offset = piece.offset
    this.shapeIndex = 0
  }

  this.options = {
    hard: false
  }
  Object.assign(this.options, options)
  this.initialize()
  // pieces first Y then X
}

export default Piece

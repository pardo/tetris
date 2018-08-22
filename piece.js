import {FisherYatesShuffle} from './helpers'

function Piece (type, options) {
  var tmp = {}
  Object.assign(tmp, {
    hard: false
  }, options)
  options = tmp
  // pieces first Y then X
  var pieces = {}

  pieces['is'] = {
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

  pieces['s'] = {
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

  pieces['il'] = {
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

  pieces['l'] = {
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

  pieces['c'] = {
    color: '#4240ff',
    shapes: [
      [
        [1, 1],
        [1, 1]
      ]
    ],
    offset: [0, 0]
  }

  pieces['t'] = {
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

  pieces['i'] = {
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

  pieces['w'] = {
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

  pieces['o'] = {
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

  pieces['ii'] = {
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

  var piece = null

  if (type) {
    piece = pieces[type]
  }

  if (piece == null) {
    if (options.hard) {
      type = FisherYatesShuffle([
        'w', 'o', 'ii'
      ])[0]
    } else {
      type = FisherYatesShuffle([
        'c', 's', 'is', 'i', 'l', 'il', 't'
      ])[0]
    }
    piece = pieces[type]
  }

  // TODO count[type] += 1

  this.type = type
  this.color = piece.color
  this.shapes = piece.shapes
  this.offset = piece.offset
  this.shape_idx = 0

  this.rotate_r = function () {
    this.shape_idx += 1
    this.shape_idx = this.shape_idx >= this.shapes.length ? 0 : this.shape_idx
  }

  this.rotate_l = function () {
    this.shape_idx -= 1
    this.shape_idx = this.shape_idx < 0 ? this.shapes.length - 1 : this.shape_idx
  }

  this.draw = function (groundObject, pos) {
    return this.piece_test(groundObject, pos, 'draw')
  }
  this.collide = function (groundObject, pos) {
    return this.piece_test(groundObject, pos, 'collide')
  }
  this.outside = function (groundObject, pos) {
    return this.piece_test(groundObject, pos, 'outside')
  }
  this.piece_test = function (groundObject, pos, method) {
    // method could be one of "draw", "collide", "outside"
    var ground = groundObject.ground
    var pattern = this.shapes[this.shape_idx]
    var block = null
    function get_p (p, y, x) {
      var r = 0
      if (p[y] && p[y][x]) {
        r = p[y][x]
      }
      return 1 - r
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
            block.set_color(this.color)
            block.empty = false
            block.lines = [
              get_p(pattern, y - 1, x),
              get_p(pattern, y, x + 1),
              get_p(pattern, y + 1, x),
              get_p(pattern, y, x - 1)
            ]
            // block.draw()
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
}

export default Piece

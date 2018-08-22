import Block from './block'

function Ground (blocks_w, blocks_h, block_size) {
  this.blocks_w = blocks_w
  this.blocks_h = blocks_h
  this.block_size = block_size
  this.blocks = []
  this.ground = []

  // Init
  var b = null
  var col = []

  for (var w = 0; w < this.blocks_w; w++) {
    col = []
    for (var h = 0; h < this.blocks_h; h++) {
      b = new Block(
        w * this.block_size,
        h * this.block_size,
        {
          size: block_size,
        }
      )
      col.push(b)
      this.blocks.push(b)
    }
    this.ground.push(col)
  }

  this.mirror_y = function (pos) {
    var dis = this.blocks_h - pos
    var end = pos + parseInt(dis / 2)
    var dis_from_end = 1
    var tmp_b = new Block(0, 0)
  
    for (var w = 0; w < this.blocks_w; w++) {
      for (var h = pos; h < end; h++) {
        tmp_b.copy_from(this.ground[w][h])
        this.ground[w][h].copy_from(this.ground[w][this.blocks_h - dis_from_end])
        this.ground[w][this.blocks_h - dis_from_end].copy_from(tmp_b)
      }
      dis_from_end += 1
    }
  }

  this.add_random_bottom = function (lines) {
    for (var w = 0; w < this.blocks_w; w++) {
      for (var h = 0; h < this.blocks_h; h++) {
        if (this.ground[w][h + lines] != null ) {
          this.ground[w][h].copy_from(this.ground[w][h + lines])
        }
      }
    }
    var b = null
    for (var w = 0; w < this.blocks_w; w++) {
      for (var h = this.blocks_h - lines; h < this.blocks_h; h++) {
        console.log(w, h)
        b = this.ground[w][h]
        b.set_color('#af5089')
        if (Math.random() < 0.7) {
          b.empty = false
          b.lines[0] = 1
          b.lines[1] = 1
          b.lines[2] = 1
          b.lines[3] = 1
        } else {
          b.empty = true
        }
      }
    }
  }

  this.hide = function (options) {
    this.mapGroundBlocks(function (w, h, block) {
      block.empty = true
    })
  }

  this.set_block_size = function (size) {
    this.block_size = size
    for (var w = 0; w < this.blocks_w; w++) {
      for (var h = 0; h < this.blocks_h; h++) {
        this.ground[w][h].setSize(this.block_size)
        this.ground[w][h].set_pos(
          w * this.block_size,
          h * this.block_size
        )
      }
    }
  }

  this.meld = function (size) {
    function get_p (p, y, x) {
      var r = 0
      if (p[x] && p[x][y]) {
        r = p[x][y].empty ? 0:1
      }
      return 1 - r
    }

    for (var w = 0; w < this.blocks_w; w++) {
      for (var h = 0; h < this.blocks_h; h++) {
        this.ground[w][h].lines = [
          get_p(this.ground, h - 1, w),
          get_p(this.ground, h, w + 1),
          get_p(this.ground, h + 1, w),
          get_p(this.ground, h, w - 1)
        ]
      }
    }
  }

  this.mapGroundBlocks = function (callback) {
    for (var w = 0; w < this.blocks_w; w++) {
      for (var h = 0; h < this.blocks_h; h++) {
        callback(w, h, this.ground[w][h], this.ground)
      }
    }
  }

  this.ended = function () {
    for (var w = 0; w < this.blocks_w; w++) {
      if (!this.ground[w][1].empty || !this.ground[w][1].empty) {
        return true
      }
    }
    return false
  }

  this.getCompletedLines = function () {
    var completedLines = []
    var complete = 0
    for (var h = 0; h < this.blocks_h; h++) {
      complete = 0
      for (var w = 0; w < this.blocks_w; w++) {
        if (!this.ground[w][h].empty) {
          complete += 1
        }
      }
      if (complete == this.blocks_w) {
        completedLines.push(h)
      }
    }
    return completedLines
  }

  this.removeLine = function (line) {
    for (var w = 0; w < this.blocks_w; w++) {
      for (var h = 0; h < this.blocks_h; h++) {
        if (h == line) {
        // remove line
          for (var ht = h; ht > 0; ht--) {
            this.ground[w][ht].copy_from(this.ground[w][ht - 1])
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
}

export default Ground
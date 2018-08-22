import rough from 'roughjs'

function Drawable () {
  this.element = null
  this.context2d = null
  this.roughCanvas = null
  this.createAndAppend = function (parent) {
    this.element = document.createElement('canvas')
    parent.appendChild(this.element)
    this.context2d = this.element.getContext('2d')
    this.roughCanvas = rough.canvas(this.element)
  }
  this.resize = function (size) {
    this.element.width = size.width
    this.element.height = size.height
  }
  this.clear = function () {
    this.context2d.clearRect(0, 0, this.element.width, this.element.height)
  }
}

export default Drawable

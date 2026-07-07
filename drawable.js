import rough from 'roughjs'

// A canvas wrapper that draws with rough.js in CSS pixels while backing the
// canvas at devicePixelRatio for crisp rendering on retina / mobile screens.
function Drawable () {
  this.createAndAppend = function (parent) {
    this.element = document.createElement('canvas')
    parent.appendChild(this.element)
    this.context2d = this.element.getContext('2d')
    this.roughCanvas = rough.canvas(this.element)
    this.cssWidth = 0
    this.cssHeight = 0
  }

  this.resize = function (size) {
    const dpr = window.devicePixelRatio || 1
    this.cssWidth = size.width
    this.cssHeight = size.height
    this.element.width = Math.round(size.width * dpr)
    this.element.height = Math.round(size.height * dpr)
    this.element.style.width = size.width + 'px'
    this.element.style.height = size.height + 'px'
    // Draw commands use CSS pixel coordinates; scale the backing store.
    this.context2d.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  this.getSize = function () {
    return { width: this.cssWidth, height: this.cssHeight }
  }

  this.clear = function () {
    // clearRect respects the current transform, so CSS-pixel dims are correct.
    this.context2d.clearRect(0, 0, this.cssWidth, this.cssHeight)
  }

  this.element = null
  this.context2d = null
  this.roughCanvas = null
}

export default Drawable

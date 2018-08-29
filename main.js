import './main.css'
import Game from './htmlgame'

var parent = document.getElementById('main-tetris')
var g1 = new Game(parent, { playable: true })
/*
var replica = new Game(parent, { playable: false })

setInterval(() => {
  replica.tetris.loadSerializedData(
    g1.tetris.serialize()
  )
}, 1000)
*/
export default () => {}

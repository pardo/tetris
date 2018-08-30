import './main.css'
import Game from './htmlgame'

var parent = document.getElementById('main-tetris')
let game = new Game(
  parent,
  {
    playable: true
  }
)

export default () => {}

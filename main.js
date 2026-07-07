import './main.css'
import HTMLTetrisGame from './htmlgame'
import Menu from './menu'
import { createRoom } from './network'

const boardEl = document.getElementById('board')
const opponentsEl = document.getElementById('opponents')
const controlsEl = document.getElementById('touch-controls')
const menuRoot = document.getElementById('menu-root')

// Local player's board.
const game = new HTMLTetrisGame(boardEl, { playable: true })

// Networking state.
let room = null
let broadcastInterval = null
const replicas = new Map() // peerId -> HTMLTetrisGame

function addReplica (peerId) {
  if (replicas.has(peerId)) return replicas.get(peerId)
  const replica = new HTMLTetrisGame(opponentsEl, { playable: false, half: true })
  replicas.set(peerId, replica)
  replica.handleResize()
  menu.setPeerCount(replicas.size)
  return replica
}

function removeReplica (peerId) {
  const replica = replicas.get(peerId)
  if (replica) {
    replica.destroy()
    replicas.delete(peerId)
  }
  menu.setPeerCount(replicas.size)
}

function broadcast () {
  if (room) room.sendBoard(game.tetris.serialize())
}

function startRoom (roomId) {
  leaveRoom()
  room = createRoom(roomId, {
    onPeerJoin: (id) => {
      addReplica(id)
      broadcast() // let the newcomer see us immediately
    },
    onPeerLeave: (id) => removeReplica(id),
    onBoard: (data, id) => {
      const replica = addReplica(id)
      replica.tetris.loadSerializedData(data)
    }
  })
  broadcastInterval = setInterval(broadcast, 400)
}

function leaveRoom () {
  if (broadcastInterval) { clearInterval(broadcastInterval); broadcastInterval = null }
  if (room) { room.leave(); room = null }
  replicas.forEach((r) => r.destroy())
  replicas.clear()
  menu.setPeerCount(0)
}

// --- Menu wiring ---
const menu = new Menu(menuRoot, {
  onSolo: () => { leaveRoom(); menu.close() },
  onHost: (code) => startRoom(code),
  onJoin: (code) => startRoom(code),
  onLeave: () => leaveRoom(),
  onClose: () => menu.close()
})

// HUD button to reopen the menu mid-game.
const menuToggle = document.createElement('button')
menuToggle.id = 'menu-toggle'
menuToggle.textContent = 'Menu'
menuToggle.addEventListener('click', () => menu.open(room ? 'home' : 'home'))
document.body.appendChild(menuToggle)

// --- Touch controls (hold-to-repeat for movement) ---
controlsEl.removeAttribute('hidden') // CSS hides it on fine-pointer devices
controlsEl.querySelectorAll('.tc-btn').forEach((btn) => {
  const action = btn.dataset.action
  let repeat = null
  const fire = () => game.input[action] && game.input[action]()
  const start = (e) => {
    e.preventDefault()
    fire()
    if (action !== 'rotate') {
      repeat = setInterval(fire, action === 'down' ? 50 : 120)
    }
  }
  const stop = () => { if (repeat) { clearInterval(repeat); repeat = null } }
  btn.addEventListener('pointerdown', start)
  btn.addEventListener('pointerup', stop)
  btn.addEventListener('pointerleave', stop)
  btn.addEventListener('pointercancel', stop)
})

// --- Auto-join from a shared link (?room=CODE) ---
const params = new URLSearchParams(location.search)
const roomParam = params.get('room')
if (roomParam) {
  const code = roomParam.trim().toUpperCase()
  startRoom(code)
  menu.close()
}

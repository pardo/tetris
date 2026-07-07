// Menu overlay for hosting / joining multiplayer rooms.
// Pure DOM, no framework. Communicates back through the `callbacks` object.

function makeRoomCode () {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars
  let code = ''
  for (let i = 0; i < 5; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return code
}

function Menu (root, callbacks) {
  this.root = root
  this.callbacks = callbacks
  this.roomId = null
  this.peerCount = 0

  this.el = document.createElement('div')
  this.el.className = 'menu-overlay'
  this.root.appendChild(this.el)

  this.render('home')
}

Menu.prototype.button = function (label, className, onClick) {
  const b = document.createElement('button')
  b.className = 'menu-btn ' + (className || '')
  b.textContent = label
  b.addEventListener('click', onClick)
  return b
}

Menu.prototype.clear = function () {
  this.el.innerHTML = ''
}

Menu.prototype.card = function () {
  const card = document.createElement('div')
  card.className = 'menu-card'
  this.el.appendChild(card)
  return card
}

Menu.prototype.render = function (view, data) {
  this.clear()
  if (view === 'home') this.renderHome()
  else if (view === 'host') this.renderHost(data)
  else if (view === 'join') this.renderJoin()
}

Menu.prototype.renderHome = function () {
  const card = this.card()
  card.innerHTML = '<h1>Rough Tetris</h1><p>Play solo, or battle friends over a serverless P2P connection.</p>'
  card.appendChild(this.button('Play solo', 'primary', () => this.callbacks.onSolo()))
  card.appendChild(this.button('Host a game', '', () => {
    const code = makeRoomCode()
    this.callbacks.onHost(code)
    this.render('host', code)
  }))
  card.appendChild(this.button('Join a game', '', () => this.render('join')))

  const hint = document.createElement('p')
  hint.className = 'menu-hint'
  hint.textContent = '← → move · ↑ / space rotate · ↓ drop · R reset'
  card.appendChild(hint)
}

Menu.prototype.renderHost = function (code) {
  const card = this.card()
  card.innerHTML = '<h1>Hosting</h1><p>Share this code. Anyone who joins appears above your board.</p>'

  const codeEl = document.createElement('div')
  codeEl.className = 'menu-code'
  codeEl.textContent = code
  card.appendChild(codeEl)

  const status = document.createElement('div')
  status.className = 'menu-status'
  card.appendChild(status)
  this.statusEl = status
  this.updateStatus()

  if (navigator.share || navigator.clipboard) {
    card.appendChild(this.button('Share / copy link', '', () => this.shareLink(code)))
  }
  card.appendChild(this.button('Start playing', 'primary', () => this.callbacks.onClose()))

  const back = this.button('Leave room', 'menu-back', () => {
    this.callbacks.onLeave()
    this.render('home')
  })
  card.appendChild(back)
}

Menu.prototype.renderJoin = function () {
  const card = this.card()
  card.innerHTML = '<h1>Join a game</h1><p>Enter the 5-letter room code.</p>'

  const input = document.createElement('input')
  input.className = 'menu-input'
  input.maxLength = 5
  input.autocapitalize = 'characters'
  input.placeholder = 'CODE'
  card.appendChild(input)
  setTimeout(() => input.focus(), 50)

  const join = () => {
    const code = input.value.trim().toUpperCase()
    if (code.length < 3) { input.focus(); return }
    this.callbacks.onJoin(code)
    this.render('host', code)
  }
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') join() })

  card.appendChild(this.button('Join', 'primary', join))
  card.appendChild(this.button('Back', 'menu-back', () => this.render('home')))
}

Menu.prototype.shareLink = function (code) {
  const url = location.origin + location.pathname + '?room=' + code
  if (navigator.share) {
    navigator.share({ title: 'Rough Tetris', text: 'Join my Tetris room: ' + code, url }).catch(() => {})
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      if (this.statusEl) this.statusEl.textContent = 'Link copied!'
    }).catch(() => {})
  }
}

Menu.prototype.setPeerCount = function (n) {
  this.peerCount = n
  this.updateStatus()
}

Menu.prototype.updateStatus = function () {
  if (!this.statusEl) return
  this.statusEl.textContent = this.peerCount === 0
    ? 'Waiting for players…'
    : this.peerCount + (this.peerCount === 1 ? ' player' : ' players') + ' connected'
}

Menu.prototype.open = function (view) {
  this.el.style.display = 'flex'
  this.render(view || 'home')
}

Menu.prototype.close = function () {
  this.el.style.display = 'none'
}

export default Menu
export { makeRoomCode }

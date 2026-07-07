import { joinRoom, selfId } from 'trystero'

// Namespace so we only ever discover peers of this game.
const APP_ID = 'pardo-rough-tetris'

// A serverless P2P room built on Trystero (nostr strategy — no signalling
// server required). Peers broadcast their serialized board; every peer keeps
// a replica board per remote peer.
export function createRoom (roomId, handlers) {
  const room = joinRoom({ appId: APP_ID }, roomId)

  // `board` is the only message type: the serialized ground of the sender.
  const [sendBoard, getBoard] = room.makeAction('board')

  room.onPeerJoin((peerId) => {
    handlers.onPeerJoin && handlers.onPeerJoin(peerId)
  })

  room.onPeerLeave((peerId) => {
    handlers.onPeerLeave && handlers.onPeerLeave(peerId)
  })

  getBoard((data, peerId) => {
    handlers.onBoard && handlers.onBoard(data, peerId)
  })

  return {
    selfId,
    // Trystero broadcasts to every connected peer when no target is given.
    sendBoard: (data) => sendBoard(data),
    leave: () => room.leave()
  }
}

export { selfId }

const socket = io({
  path: '/_api/socket.io',
  autoConnect: false,
  transports: ['websocket'],
})

export default socket
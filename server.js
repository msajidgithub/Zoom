const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
// var FileSaver = require('file-saver');
const { v4: uuidV4 } = require('uuid')
const  port = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

app.get('/', (req, res) => {
  res.render('login')
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(port)
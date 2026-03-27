const { Server } = require('socket.io')
const prisma = require('./prisma')

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('joinRoom', (orderId) => {
      socket.join(orderId)
      console.log(`User joined room: ${orderId}`)
    })

    socket.on('sendMessage', async (data) => {
      try {
        const { orderId, senderId, content } = data

        const message = await prisma.message.create({
          data: {
            content,
            senderId,
            orderId
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          }
        })

        io.to(orderId).emit('newMessage', message)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
    })
  })

  return io
}

module.exports = initSocket
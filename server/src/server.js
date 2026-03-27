const express = require('express')
const cors = require('cors')
const http = require('http')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')
const serviceRoutes = require('./routes/service.routes')
const orderRoutes = require('./routes/order.routes')
const messageRoutes = require('./routes/message.routes')
const initSocket = require('./config/socket')

const app = express()
const server = http.createServer(app)

initSocket(server)

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'SkillBridge API is running!' })
})

app.use('/auth', authRoutes)
app.use('/services', serviceRoutes)
app.use('/orders', orderRoutes)
app.use('/messages', messageRoutes)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
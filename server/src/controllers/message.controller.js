const prisma = require('../config/prisma')

const getMessages = async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const messages = await prisma.message.findMany({
      where: { orderId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return res.status(200).json(messages)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getMessages }
const prisma = require('../config/prisma')

const createOrder = async (req, res) => {
  try {
    if (req.userRole !== 'CLIENT') {
      return res.status(403).json({ error: 'Only clients can create orders' })
    }

    const { serviceId } = req.body

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    if (!service.active) {
      return res.status(400).json({ error: 'Service is not available' })
    }

    const order = await prisma.order.create({
      data: {
        clientId: req.userId,
        serviceId
      },
      include: {
        service: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return res.status(201).json({
      message: 'Order created successfully',
      order
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const listOrders = async (req, res) => {
  try {
    const isFreelancer = req.userRole === 'FREELANCER'

    const orders = await prisma.order.findMany({
      where: isFreelancer
        ? { service: { freelancerId: req.userId } }
        : { clientId: req.userId },
      include: {
        service: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return res.status(200).json(orders)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        service: true
      }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    if (order.service.freelancerId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    })

    return res.status(200).json({
      message: 'Order status updated successfully',
      order: updatedOrder
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createOrder, listOrders, updateOrderStatus }
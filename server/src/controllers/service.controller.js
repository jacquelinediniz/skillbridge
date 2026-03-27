const prisma = require('../config/prisma')

const createService = async (req, res) => {
  try {
    if (req.userRole !== 'FREELANCER') {
      return res.status(403).json({ error: 'Only freelancers can create services' })
    }

    const { title, description, price, category } = req.body

    const service = await prisma.service.create({
      data: {
        title,
        description,
        price,
        category,
        freelancerId: req.userId
      }
    })

    return res.status(201).json({
      message: 'Service created successfully',
      service
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const listServices = async (req, res) => {
  try {
    const { category } = req.query

    const services = await prisma.service.findMany({
      where: {
        active: true,
        ...(category && { category })
      },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return res.status(200).json(services)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    return res.status(200).json(service)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateService = async (req, res) => {
  try {
    const { id } = req.params

    const service = await prisma.service.findUnique({
      where: { id }
    })

    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    if (service.freelancerId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const { title, description, price, category, active } = req.body

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        price,
        category,
        active
      }
    })

    return res.status(200).json({
      message: 'Service updated successfully',
      service: updatedService
    })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const deleteService = async (req, res) => {
  try {
    const { id } = req.params

    const service = await prisma.service.findUnique({
      where: { id }
    })

    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    if (service.freelancerId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    await prisma.service.delete({
      where: { id }
    })

    return res.status(200).json({ message: 'Service deleted successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService
}
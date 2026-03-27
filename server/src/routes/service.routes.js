const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService
} = require('../controllers/service.controller')

router.get('/', listServices)
router.get('/:id', getServiceById)
router.post('/', authMiddleware, createService)
router.put('/:id', authMiddleware, updateService)
router.delete('/:id', authMiddleware, deleteService)

module.exports = router
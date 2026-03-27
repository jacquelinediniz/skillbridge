const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const {
  createOrder,
  listOrders,
  updateOrderStatus
} = require('../controllers/order.controller')

router.post('/', authMiddleware, createOrder)
router.get('/', authMiddleware, listOrders)
router.put('/:id/status', authMiddleware, updateOrderStatus)

module.exports = router
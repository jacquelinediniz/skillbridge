const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth.middleware')
const { getMessages } = require('../controllers/message.controller')

router.get('/:orderId', authMiddleware, getMessages)

module.exports = router
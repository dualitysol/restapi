const express = require('express');
var router = express.Router();
const checkAuth = require('../middleware/check_auth');
const OrderController = require('../controllers/orders');

router.get('/', checkAuth, OrderController.GetAllOrders);

router.post('/', checkAuth, OrderController.CreateNewOrder);

router.get('/:orderID', checkAuth, OrderController.GetOrderById);

router.delete('/:orderID', checkAuth, OrderController.DeleteOrderById);

module.exports = router

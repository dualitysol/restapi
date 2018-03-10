const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const orders_url = "http://localhost:3001/orders/";
const products_url = "http://localhost:3001/products/";

exports.GetAllOrders =  (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: orders_url + doc._id
            }
          }
        })
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
};

exports.CreateNewOrder = (req, res, next) => {
  Product.findById(req.body.productID)
    .then(product => {
      if (!product){
        return res.status(404).json({
          message: "Product not found!"
        });
      };
      const order = new Order ({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productID
      });
      return order.save()
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Order stored!",
        createdOreder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: orders_url + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.GetOrderById = (req, res, next) => {
  Order.findById(req.params.orderID)
    .populate('product')
    .exec()
    .then(order => {
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: products_url + order.product._id
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
};

exports.DeleteOrderById = (req, res, next) => {
  Order.remove({_id: req.params.orderID})
    .exec()
    .then( result => {
      res.status(200).json({
        message: "Order deleted!",
        orderID: req.params.orderID,
        request: {
          type: 'GET',
          url: products_url
        }
      });
    })
    .catch( err => {
      res.status(404).json({
        message: 'Cannot find the order.',
        error: err
      })
    })
};

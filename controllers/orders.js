const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const process = require('../config');

exports.GetAllOrders =  (req, res, next) => {
  Order.find({ customer: req.userData.userID})
    .select('product quantity _id status')
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
              url: process.env.URL + '/orders/' + doc._id
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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvcmRlbGV0ZUBnbWFpbC5jb20iLCJ1c2VySUQiOiI1YWE1OTUwMzQxNTg2NjFkZTgxZDg0MzAiLCJpYXQiOjE1MjA4MDEwMzMsImV4cCI6MTUyMDgwNDYzM30.n0zeIH5rSuhF2i0W7rJf5fLbLIeCGxPK2PKuJ61w5i4
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
        product: req.body.productID,
        customer: req.userData.userID
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
          quantity: result.quantity,
          customer: result.customer
        },
        request: {
          type: 'GET',
          url: process.env.URL + '/orders/' + result._id
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
      if (order.customer == req.userData.userID) {
        res.status(200).json({
          order: order,
          request: {
            type: 'GET',
            url: process.env.URL + '/products/' + order.product._id
          }
        })
      } else {
        res.status(500).json({
          error: "Auth fail!"
        });
      }
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
      if (result.customer == req.userData.userID){
        res.status(200).json({
          message: "Order deleted!",
          orderID: req.params.orderID,
          request: {
            type: 'GET',
            url: process.env.URL + '/products/'
          }
        });
      } else {
        res.status(500).json({
          error: 'Auth fail!'
        });
      }
    })
    .catch( err => {
      res.status(404).json({
        message: 'Cannot find the order.',
        error: err
      })
    })
};

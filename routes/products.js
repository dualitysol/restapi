const express = require('express');
var app = express();
var router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling a GET request on /products'
  });
});

router.post('/', (req, res, next) => {
  const product = new Product ({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then( result => {
      console.log(result);
    })
    .catch(err => console.log(err));
  res.status(200).json({
    message: 'Handling a POST request on /products',
    createdProduct: product
  });
});

router.get('/:productID', (req, res, next) => {
  var id = req.params.productID;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log('From DB: ' + doc);
      res.status(200).json(doc)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err})
    });
});

router.patch('/:productID', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product!'
  });
});

router.delete('/:productID', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted product!'
  });
});

module.exports = router;

const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt'); // не кроссплатформенный, по этому необходимо переустановить на Маке или Линуксе
const jwt = require('jsonwebtoken');
const process = require('../config');

exports.SignUp = (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Email is already in use!'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    })
};

exports.Login = (req, res, next) => {
  User.find({ email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1){
        return res.status(401).json({
          message: 'Auth failed!'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, hash_result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed!'
          });
        }
        /*
        const payload = {
          admin: user.admin
        };


        */
        if (hash_result) {
          const token = jwt.sign({
            email: user[0].email,
            userID: user[0]._id
          }, process.env.JWT_KEY , // тут должен быть process.env.JWT_KEY в деплое, но мы его забыдлокодили вверху
          {
            expiresIn: "1h"
          }
        );
          return res.status(200).json({
            message: 'Auth successful!',
            token: token
          });
        } else {
          return res.status(401).json({
            message: 'Auth failed!'
          });
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.AdminLogin = (req, res, next) => {
  User.find({ email: req.body.email, admin: true})
    .exec()
    .then(user => {
      if (user.length < 1){
        return res.status(401).json({
          message: 'Auth failed!'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, hash_result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed!'
          });
        }
        /*
        const payload = {
          admin: user.admin
        };


        */
        if (hash_result) {
          const token = jwt.sign({
            email: user[0].email,
            userID: user[0]._id,
            admin: "admin"
          }, process.env.JWT_KEY , // тут должен быть process.env.JWT_KEY в деплое, но мы его забыдлокодили вверху
          {
            expiresIn: "1h"
          }
        );
          return res.status(200).json({
            message: 'Auth successful!',
            token: token
          });
        } else {
          return res.status(401).json({
            message: 'Auth failed!'
          });
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.DeleteAccount = (req, res, next) => { //удаляем данные продукта
  const id = req.params.userID; // задаем ИД
  User.remove({ _id: id }) // удаляем документ по заданному ИД
    .exec() // типа промиса
    .then( result => {
      res.status(200).json({
        message: "User deleted!"
      }); // отдаем результат клиенту в json
    })
    .catch(err => { // ловим ошибку, если есть
      res.status(500).json({ // отдаем ошибку 500
        error: err // сообщение об ошибке из mongoose
      });
    });
};

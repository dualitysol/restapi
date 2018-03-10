const express = require('express');
var app = express();
var router = express.Router();
const multer = require('multer'); // подключаем модуль для загрузки изображений
const checkAuth = require('../middleware/check_auth');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads');
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); // тут мы добавили ".replace(/:/g, '-')"(есть еще один вариант ".replace(/\\/, '/')" ), для работы с Windows директориями, на MacOS добавлять конвертер не нужно
  }
});

const fileFilter = (req, file, cb) => {
  // reject file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // разрешаем загрузку изображений если они формата jpg/png
  } else {
    cb(null, false); // в противном случае запрещаем загрузку
  }
};
const upload = multer({storage: storage, fileFilter: fileFilter}); // создаем функцию загрузки и создаем каталог "uploads"( 'mploads/' - правильно, '/uploads/' - неправильно, т.к. передний слэш препятствует терминалу в созданию директории )

router.get('/', ProductController.GetAllProducts);

router.post('/', checkAuth, upload.single('productImage'), ProductController.CreateNewProduct);

router.get('/:productID', ProductController.GetProductById);

router.patch('/:productID', checkAuth, ProductController.UpdateProductById);

router.delete('/:productID', checkAuth, ProductController.CreateNewProduct);

module.exports = router; // экспортируем модуль нашего продукт-роутера для вызова

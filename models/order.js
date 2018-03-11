const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({ // Создаем модель(схему) продукта(фактически это документ)
  _id: mongoose.Schema.Types.ObjectId, // создаем уникальный ИД для каждого из продуктов, который храниться и готов к использованию
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // создаем поле имени(названия) продукта и задаем его как обязательное к заполнению при загрузке в БД
  quantity: { type: Number, default: 1 }, // тоже самое, что и с названием продукта, только численного типа
  customer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  status: { type: String}
});

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    _id : {type: String,required : true},
    symbol : {type :String},
    price : {type : String},
    ip : {type : String,default :(Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))},
    likes : {type : Number,default : 0}
},{versionKey : false})

const Stock = mongoose.model('Stock',StockSchema);

module.exports = Stock;
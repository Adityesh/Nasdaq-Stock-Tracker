/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const dotenv = require('dotenv').config()
const Stock = require('../model/Stock')
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const ObjectID = MongoClient.ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


const db = mongoose.connection;
mongoose.connect(CONNECTION_STRING,{useNewUrlParser : true, useUnifiedTopology : true})

db.once('open',()=> console.log("Connected to the database.."))
module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
        
      const stock = req.query.stock
      const like = req.query.like

      
      
      if(Array.isArray(stock) === true) {
        
        const response1 = await fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock[0]}/quote`)
        const data1 = await response1.json()
        let price1 = data1.latestPrice
        const ip1 = req.connection.remoteAddress
        var likes1 =0,likes2 =0

        const response2 = await fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock[1]}/quote`)
        const data2 = await response2.json()
        let price2 = data2.latestPrice
        const ip2 = req.connection.remoteAddress


        if(like) {
          Stock.findOne({symbol : stock[0],ip : ip1},(err,doc)=> {
            if(err) console.log(err)
            if(doc !== null) {
              doc.likes = 1;
              doc.price = price1
              doc.save((err,stock)=> {
                if(err) console.log(err)
                
                likes1 = stock.likes
                price1 = stock.price
                
                
              })
            } else {
              let newStock = new Stock({
                _id : ObjectID().toString(),
                stock : stock[0],
                price : price1,
                likes : 1,
                ip
              })
              newStock.save((err, doc) => {
                if(err) console.log(err)
                likes1 = doc.likes
                price1 = doc.price
                
              })
            }
          })


          Stock.findOne({symbol : stock[1],ip : ip2},(err,doc)=> {
            if(err) console.log(err)
            if(doc !== null) {
              doc.likes = 1;
              doc.price = price2
              doc.save((err,stock)=> {
                if(err) console.log(err)
                likes2 = stock.likes
                price2 = stock.price
                
              })
            } else {
              let newStock = new Stock({
                _id : ObjectID().toString(),
                stock : stock[1],
                price : price2,
                likes : 1,
                ip
              })
              newStock.save((err, doc) => {
                if(err) console.log(err)
                likes2 = doc.likes
                price2 = doc.price
                
              })
            }
          })
        } else {
          Stock.findOne({symbol : stock[0],ip : ip1},(err,doc)=> {
            if(err) console.log(err)
            if(doc !== null) {
              doc.price = price1
              doc.save((err,stock)=> {
                if(err) console.log(err)
                
              })
            } else {
              let newStock = new Stock({
                _id : ObjectID().toString(),
                stock : stock[0],
                price : price1,
                ip
              })
              newStock.save((err, doc) => {
                if(err) console.log(err)
                
              })
            }
          })

          Stock.findOne({symbol : stock[1],ip : ip2},(err,doc)=> {
            if(err) console.log(err)
            if(doc !== null) {
              doc.price = price2
              doc.save((err,stock)=> {
                if(err) console.log(err)
                
              })
            } else {
              let newStock = new Stock({
                _id : ObjectID().toString(),
                stock : stock[1],
                price : price2,
                ip
              })
              newStock.save((err, doc) => {
                if(err) console.log(err)
                
              })
            }
          })
        }
        
        Stock.findOne({symbol : stock[0]},(err,doc1) => {
          Stock.findOne({symbol : stock[1]},(err,doc2) => {
            let stockData = []
            stockData.push({
              stock : stock[0],
              price : price1,
              rel_likes : doc1.likes - doc2.likes
    
            })
            stockData.push({
              stock : stock[1],
              price : price2,
              rel_likes : doc2.likes - doc1.likes
            })
            res.status(200).json(stockData)

          })
        })

        
      } else if(Array.isArray(stock) === false) {
      
        const response = await fetch(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`)
        const data = await response.json()
        const price = data.latestPrice
        
        const ip = req.connection.remoteAddress
        if(like) {
          Stock.findOne({symbol : stock,ip : ip},(err,doc)=> {
            if(err) console.log(err)
            if(doc !== null) {
              doc.likes = 1;
              doc.price = price
              doc.save((err,stock)=> {
                if(err) console.log(err)
                res.status(200).json({
                  stock : stock.symbol,
                  price : parseFloat(stock.price),
                  likes : stock.likes
                })
              })
            } else {
              let newStock = new Stock({
                _id : ObjectID().toString(),
                stock : stock,
                price : price,
                likes : 1,
                ip
              })
              newStock.save((err, doc) => {
                if(err) console.log(err)
                res.status(200).json({
                  stock : doc.symbol,
                  price : parseFloat(doc.price),
                  likes : doc.likes
                })
              })
            }
          })
        } else {
          Stock.findOne({symbol : stock,ip : ip},(err,doc)=> {
            if(err) console.log(err)
            if(doc !== null) {
              doc.price = price
              doc.save((err,stock)=> {
                if(err) console.log(err)
                res.status(200).json({
                  stock : stock.symbol,
                  price : parseFloat(stock.price),
                  likes : stock.likes
                })
              })
            } else {
              let newStock = new Stock({
                _id : ObjectID().toString(),
                symbol : stock,
                price : price,
                ip
              })
              newStock.save((err, doc) => {
                if(err) console.log(err)
                res.status(200).json({
                  stock : doc.symbol,
                  price : parseFloat(doc.price),
                  likes : doc.likes
                })
              })
            }
          })
        }


      }
        




    });
    
};

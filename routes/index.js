var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var config = require('../config.js')
var url = config.mongo_url;


/* GET home page. */
router.get('/', async function (req, res, next) {
  var client = await MongoClient.connect(url, { useNewUrlParser: true });
  console.log("Connected correctly to server");

  // Get the collection
  var db = client.db('WebNotesDB');

  // Get documents
  var docs = await db.collection('Notes').find().toArray();
  client.close();

  res.render('index', { title: 'Web Notes', notes: docs });
});

module.exports = router;
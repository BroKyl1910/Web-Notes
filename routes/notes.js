var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = process.env.MONGODB_URI || 'mongodb://localhost/web-notes';

router.post("/", async (req, res) => {
  var client = await MongoClient.connect(url, { useNewUrlParser: true });
  console.log("Connected correctly to server");

  // Get the collection
  var db = client.db('WebNotesDB');

  // Get documents
  var newNote = await db.collection('Notes').insertOne({
    body: "",
    height: 300,
    width: 500,
    top: 0,
    left: 0
  });

  res.send({_id: newNote.insertedId.toHexString()});

});

/* PUT notes */
router.put('/', async function (req, res) {
  var note = req.body;
  var client = await MongoClient.connect(url, { useNewUrlParser: true });
  console.log("Connected correctly to server");

  // Get the collection
  var db = client.db('WebNotesDB');

  // Update note
  db.collection('Notes').updateOne({ '_id': ObjectID(note.id) }, {
    $set: {
      body: note.body,
      height: Number(note.height),
      width: Number(note.width),
      top: Number(note.top),
      left: Number(note.left)
    }
  }).then(() => {
    client.close();
    res.send("Note updated");
  });

});

/* DELETE notes */
router.delete("/", async (req, res) => {
  var id = req.query.id;
  console.log(req.query);
  var client = await MongoClient.connect(url, { useNewUrlParser: true });
  console.log("Connected correctly to server");

  // Get the collection
  var db = client.db('WebNotesDB');

  // Get documents
  var result = await db.collection('Notes').deleteOne({
    '_id': ObjectID(id) 
  });

  res.send(result);

});

module.exports = router;
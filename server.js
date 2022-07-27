// ========================
// Modules
// ========================
const express = require('express');
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();


// ========================
// Connection Parameters
// ========================
require('dotenv').config();
const PORT = process.env.PORT || 7000;
const CONNECTION_STR = process.env.CONNECTION_STR;
const DB_NAME = process.env.DB_NAME;
const CL_NAME = process.env.CL_NAME;


// ========================
// Storage configurations
// ========================
const storage = multer.diskStorage({
  destination: function(request, file, callback) {
    callback(null, 'public'); // destination folder
  },
  filename: function(request, file, callback) {
    callback(null, ('uploads/images/' + Date.now() + file.originalname).replace(/ /g, '')); // filenaming
  }
});
const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 } // 10MB
});


// ========================
// Database Connection
// ========================
let db;
let collection;
MongoClient.MongoClient.connect(CONNECTION_STR)
  .then(client => {
    console.log('Connected to database');
    db = client.db(DB_NAME);
    collection = db.collection(CL_NAME);
  })
  .catch(err => console.log(err));


// ========================
// Middlewares
// ========================
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


// ========================
// Routes
// ========================

// Initial render
app.get('/', async (_, res) => {
  try {
    const results = await collection.find().toArray();
    res.render('index.ejs', {items: results});
  } catch (err) {
    console.log(err);
  }
})

// Create new item
app.post('/addItem', upload.single('addImage'), async (req, res) => {
  try {
    const body = req.body;
    const item = {
      image:            req.file.filename,
      brand:            body.addBrand,
      price:            body.addPrice,
      dateAcquired:     body.addDateAcquired,
      locationAcquired: body.addLocationAcquired,
      condition:        body.addCondition,
      tags:             body.addTags.split(', '),
      notes:            body.addNotes,
    }
    await collection.insertOne(item)
    res.redirect('/')
  } catch (err) {
    console.log(err);
  }
})

// Delete item
app.delete('/deleteItem', async (req, res) => {
  try {
    const body = req.body;
    const imageOld = (await collection.find({_id: ObjectId(body.id)}).toArray())[0].image;
    fs.unlinkSync("./public/" + imageOld);
    await collection.deleteOne({_id: ObjectId(body.id)})
    res.json(`${body.id} is deleted`);
  } catch {
    console.log(err);
  }
})

// Update item
app.put('/updateItem', upload.single('updateImage'), async (req, res) => {
  try {
    const body = req.body;
    let updateObj =  {
      brand:            body.updateBrand,
      price:            body.updatePrice,
      dateAcquired:     body.updateDateAcquired,
      locationAcquired: body.updateLocationAcquired,
      condition:        body.updateCondition,
      tags:             body.updateTags.split(','),
      notes:            body.updateNotes,
    }
    if (req.file) {
      const imageOld = (await collection.find({_id: ObjectId(body.updateId)}).toArray())[0].image;
      fs.unlinkSync("./public/" + imageOld);
      updateObj.image = req.file.filename;
    };
    await collection.findOneAndUpdate(
      {_id: ObjectId(body.updateId)}, 
      {$set:  updateObj}
    )
    res.json(`${body.updateId} is updated`)
  } catch (err) {
    console.log(err);
  }
})

// API - Get item information
app.get('/item/:id', async (req, res) => {
  try {
    const results = await collection.find({_id: ObjectId(req.params.id)}).toArray()
    res.json(results)
  } catch {
    console.log(err);
  }
})


// ========================
// Listen to Port
// ========================
app.listen(PORT, () => console.log(`Server is running at ${PORT}`))
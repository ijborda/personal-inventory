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
    callback(null, 'public/uploads/images'); // destination folder
  },
  filename: function(request, file, callback) {
    callback(null, Date.now() + file.originalname); // filenaming
  }
});
const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 } // 10MB
});


// ========================
// Routes
// ========================
MongoClient.MongoClient.connect(CONNECTION_STR)
  .then(client => {
    const db = client.db(DB_NAME);
    const collection = db.collection(CL_NAME);
    console.log('Connected to database');

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
    app.get('/', (_, res) => {
      collection.find().toArray()
        .then(results => res.render('index.ejs', {items: results}))
        .catch(err => console.log(err));
    })

    // Create new item
    app.post('/addItem', upload.single('addImage'), (req, res) => {
      const body = req.body;
      const item = {
        image:            req.file.filename,
        name:             body.addName,
        brand:            body.addBrand,
        price:            body.addPrice,
        dateAcquired:     body.addDateAcquired,
        locationAcquired: body.addLocationAcquired,
        condition:        body.addCondition,
        tags:             body.addTags.split(', '),
      }
      collection.insertOne(item)
        .then(_ => res.redirect('/'))
        .catch(err => console.log(err))
    })

    // Delete item
    app.delete('/deleteItem', (req, res) => {
      collection.deleteOne({_id: ObjectId(req.body.id)})
        .then (_ => {
          fs.unlinkSync("./public/uploads/images/" + req.body.image);
          res.json(`${req.body.id} is deleted`);
        })
        .catch(err => console.log(err))
    })

    // Update item
    app.put('/updateItem', upload.single('imageNew'), (req, res) => {
      const body = req.body;
      let updateObj =  {
        name:             body.name,
        brand:            body.brand,
        price:            body.price,
        dateAcquired:     body.dateAcquired,
        locationAcquired: body.locationAcquired,
        condition:        body.condition,
        tags:             body.tags.split(', '),
      }
      if (req.file) {
        fs.unlinkSync("./public/uploads/images/" + req.body.imageDelete);
        updateObj.image = req.file.filename
      };
      collection.findOneAndUpdate(
        {_id: ObjectId(req.body.id)}, 
        {$set:  updateObj}
        )
        .then (_ => res.json(`${req.body.id} is updated`))
        .catch(err => console.log(err))
    })

    // API - Get item information
    app.get('/item/:id', (req, res) => {
      collection.find({_id: ObjectId(req.params.id)}).toArray()
        .then(results => res.json(results))
        .catch(err => console.log(err))
    })

  })
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))
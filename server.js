// ========================
// Modules
// ========================
const express = require('express');
const MongoClient = require('mongodb');
const bodyParser = require('body-parser');
const mutler = require('multer');
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
        .then(results => {
          res.render('index.ejs', {items: results});
        })
        .catch(err => console.log(err));
    })

    // Create new item

    // Delete item

    // Update item

    // API - Get item information

  })
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server is running at ${PORT}`))
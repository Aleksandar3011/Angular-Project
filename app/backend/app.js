const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Ad = require('./models/Ad');

const app = express();

mongoose.connect("mongodb+srv://aleks3011:ariesdani9@cluster0.iipjqgk.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log(`Conntected to database!`);
  })
  .catch(() => {
    console.log(`Connection failed!`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/ads', (req, res) => {
  const ad = new Ad({
    title: req.body.title,
    about: req.body.about
  });
  ad.save().then(createdAd => {
    res.status(201).json({
      message: 'Post added successfully!',
      adId: createdAd._id
    });
  });
  });

app.get('/api/ads', (req, res, next) => {
  Ad.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched succesfully!',
        ads: documents
      });
    });
});

app.delete('/api/ads/:id', (req, res, next) => {
  Ad.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.json({message: 'Post deleted!'})
  })
})

module.exports = app;

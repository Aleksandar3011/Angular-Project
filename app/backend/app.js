const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const adsRoutes = require("./routes/ads")

const app = express();

mongoose.connect("mongodb+srv://aleks3011:ariesdani9@cluster0.iipjqgk.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log(`Conntected to database!`);
  })
  .catch(() => {
    console.log(`Connection failed!`);
  });
//   XICZFJ3R0nMpDjM0E3zJBqBx5hdApMNvLwpyctJzOTuHVfSqPP91HMmrBlu1wWAk
// mongoose.connect("https://data.mongodb-api.com/app/data-pefwd/endpoint/data/v1")
//   .then(() => {
//     console.log(`Connected to database`);
//   })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//'GET, PUT, POST, PATCH,  DELETE'
app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH,  DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use("/api/ads", adsRoutes);

module.exports = app;

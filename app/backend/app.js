const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path')

const adsRoutes = require("./routes/ads")
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://aleks3011:" + process.env.MONGO_ATLAS_PASSWORD + "@cluster0.iipjqgk.mongodb.net/node-angular?retryWrites=true&w=majority")
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
app.use("/images", express.static(path.join("backend/images")))

//'GET, PUT, POST, PATCH,  DELETE'
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/ads", adsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;

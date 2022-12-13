const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path')
const cors = require('cors')

const adsRoutes = require("./routes/ads")
const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home')
const blogRoutes = require('./routes/blogs')

const app = express();

mongoose.connect("mongodb+srv://aleks3011:" + process.env.MONGO_ATLAS_PASSWORD + "@cluster0.iipjqgk.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log(`Conntected to database!`);
  })
  .catch(() => {
    console.log(`Connection failed!`);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")))

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

// app.use(cors({origin: 'http://localhost:4200'}));

app.use('/', homeRoutes)
app.use("/api/blogs", blogRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;

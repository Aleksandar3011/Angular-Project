const express = require('express');


const homeController = require("../controllers/home");

const router = express.Router();

router.get('/', homeController.getLastThree)
console.log(homeController.getLastThree);
module.exports = router;

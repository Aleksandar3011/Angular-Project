const express = require('express');

const AdController = require("../controllers/ads");

const checkAuth = require('../middleware/chech-auth');
const extractFile = require('../middleware/file');


const router = express.Router();

router.post("", checkAuth, extractFile, AdController.createAd);

router.put("/:id", checkAuth, extractFile, AdController.updateAd);

router.get('', AdController.getAllAd);

router.get("/:id", AdController.getAd)

router.delete('/:id', checkAuth, AdController.deleteAd);


module.exports = router;

const express = require('express');
const Ad = require('../models/Ad');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
      const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", multer({storage: storage}).single('image'), (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  const ad = new Ad({
    title: req.body.title,
    tech: req.body.tech,
    itField: req.body.itField,
    about: req.body.about,
    imagePath: url + '/images/' + req.file.filename
  });
  ad.save().then(createdAd => {
    res.status(201).json({
      message: 'Post added successfully!',
      ad: {
        ...createdAd,
        id: createdAd._id
      }
    });
  });
});


router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = + req.query.page;
  const adQuery = Ad.find();
  let fetchedAds;
  if(pageSize && currentPage) {
    adQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  adQuery.find()
  .then(documents => {
    fetchedAds = documents;
    return Ad.count();
  })
    .then(count => {
      res.status(200).json({
        message: 'Ads fetched successfully!',
        ads: fetchedAds,
        maxAds: count
      })
    })
});

//SOMETHING IS WRONG
router.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const ad = new Ad({
    _id: req.body.id,
    title: req.body.title,
    tech: req.body.tech,
    itField: req.body.itField,
    about: req.body.about,
    imagePath: imagePath
  })
  console.log(ad);
  Ad.updateOne({_id: req.params.id}, ad)
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Update successful!'
      })
    })
    .catch(error => {
      console.log(error);
    })
});

router.get("/:id", (req, res, next) => {
  Ad.findById(req.params.id).then(ad => {
    if(ad) {
      res.status(200).json(ad)
    }else{
      res.status(404).json({
        message: "Ad not found!"
      })
    }
  })
})

router.delete('/:id', (req, res, next) => {
  Ad.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.json({message: 'Post deleted!'})
  })
});


module.exports = router;

const express = require('express');
const Ad = require('../models/Ad');

const router = express.Router();


router.post("", (req, res) => {
  const ad = new Ad({
    title: req.body.title,
    tech: req.body.tech,
    itField: req.body.itField,
    about: req.body.about
  });
  ad.save().then(createdAd => {
    res.status(201).json({
      message: 'Post added successfully!',
      adId: createdAd._id
    });
  });
});


router.get('', (req, res, next) => {
  Ad.find()
  .then(documents => {
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      ads: documents
    });
  });
});

//SOMETHING IS WRONG
router.put("/:id", (req, res, next) => {
  const ad = new Ad({
    _id: req.body.id,
    title: req.body.title,
    tech: req.body.tech,
    itField: req.body.itField,
    about: req.body.about,
  })
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

const Ad = require('../models/Ad');


exports.createAd = (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  const ad = new Ad({
    title: req.body.title,
    tech: req.body.tech,
    itField: req.body.itField,
    about: req.body.about,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  ad.save().then(createdAd => {
    res.status(201).json({
      message: 'Post added successfully!',
      ad: {
        ...createdAd,
        id: createdAd._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a post faild!'
    })
  })
};

exports.updateAd = (req, res, next) => {
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
    imagePath: imagePath,
    creator: req.userData.userId
  })
  console.log(ad);
  Ad.updateOne({_id: req.params.id, creator: req.userData.userId}, ad)
  .then(result => {
    console.log(result);
    if(result.matchedCount > 0) {
      res.status(200).json({
        message: 'Update successful!'
      })
    }else{
      res.status(401).json({message: 'Not authorzied'})
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Couldn\'t update post!'
      })
    })
};

exports.getAllAd = (req, res, next) => {
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
};

exports.deleteAd = (req, res, next) => {
  Ad.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if(result.deletedCount > 0) {
      res.status(200).json({message: 'Deletion successful!'})
    }else{
      res.status(401).json({message: 'Not authorzied'})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching ads failed!'
    })
  })
};

exports.getAd = (req, res, next) => {
  Ad.findById(req.params.id).then(ad => {
    if(ad) {
      res.status(200).json(ad)
    }else{
      res.status(404).json({
        message: "Ad not found!"
      })
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching ads failed!'
    });
  })
};

const Ad = require('../models/Ad');

exports.getLastThree = (req, res) => {
    Ad.find().sort({ _id: -1 }).limit(3)
        .then(result => {
            res.status(200).json({
                message: 'Last three ads',
                lastThree: result
            })
        })
};

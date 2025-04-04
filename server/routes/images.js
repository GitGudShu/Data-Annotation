const express = require('express');
const path = require('path');
const router = express.Router();

const { getImagesDetails } = require('../controllers/imageController');

router.get('/getImagesDetails/:userId', getImagesDetails);

// You guys can test this route with something like: http://localhost:5000/api/images/munster/munster_000001_000019
router.get('/:city/:imageName', (req, res) => {
    const { city, imageName } = req.params;
    const imagePath = path.join(__dirname, '../data/val_images/', city, `${imageName}_leftImg8bit.png`);

    res.sendFile(imagePath, (err) => {
        if (err) res.status(404).json({ error: "Image not found" });
    });
});

router.get

module.exports = router;

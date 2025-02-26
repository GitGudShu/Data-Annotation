const express = require('express');
const path = require('path');
const router = express.Router();

// You guys can test this route with something like: http://localhost:5000/api/images/munster/munster_000001_000019_leftImg8bit.png
router.get('/:city/:imageName', (req, res) => {
    const { city, imageName } = req.params;
    const imagePath = path.join(__dirname, '../data/val_images/', city, imageName);

    res.sendFile(imagePath, (err) => {
        if (err) res.status(404).json({ error: "Image not found" });
    });
});

module.exports = router;

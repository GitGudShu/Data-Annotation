const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// test this route by going to http://localhost:5000/api/annotations/munster/munster_000001_000019
router.get('/:city/:imageName', (req, res) => {
    const { city, imageName } = req.params;
    
    const annotationDir = path.join(__dirname, '../data/val_annotations/', city);
    const jsonFile = `${annotationDir}/${imageName}_gtFine_polygons.json`;

    if (!fs.existsSync(jsonFile)) {
        return res.status(404).json({ error: "Annotation not found", path: jsonFile });
    }

    const annotationData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    
    res.json(annotationData);
});

module.exports = router;

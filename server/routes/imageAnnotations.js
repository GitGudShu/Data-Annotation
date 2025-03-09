const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Example: http://localhost:5000/api/image-annotations/frankfurt
router.get('/:city', (req, res) => {
    const { city } = req.params;
    
    const imageDir = path.join(__dirname, '../data/val_images/', city);
    const annotationDir = path.join(__dirname, '../data/val_annotations/', city);

    if (!fs.existsSync(imageDir) || !fs.existsSync(annotationDir)) {
        return res.status(404).json({ error: "City not found in dataset." });
    }

    const imageFiles = fs.readdirSync(imageDir)
        .filter(file => file.endsWith('_leftImg8bit.png'))
        .map(file => file.replace('_leftImg8bit.png', ''));

    const annotationFiles = fs.readdirSync(annotationDir)
        .filter(file => file.endsWith('_gtFine_polygons.json'))
        .map(file => file.replace('_gtFine_polygons.json', ''));

    // I have trust isses, so I'm fat-cheking if an image has a corresponding annotation
    const validImages = imageFiles.filter(name => annotationFiles.includes(name));

    const response = validImages.map(imageName => {
        const imagePath = `/api/images/${city}/${imageName}`;
        const annotationPath = `/api/image-annotations/${city}/${imageName}`;
        return {
            id: imageName,
            city: city,
            imagePath: imagePath,
            annotationsPath: annotationPath
        };
    });

    res.json(response);
});

// Example: http://localhost:5000/api/image-annotations/frankfurt/frankfurt_000000_000294
router.get('/:city/:imageId', (req, res) => {
    const { city, imageId } = req.params;
    const annotationPath = path.join(__dirname, '../data/val_annotations/', city, `${imageId}_gtFine_polygons.json`);

    if (!fs.existsSync(annotationPath)) {
        return res.status(404).json({ error: "Annotation not found" });
    }

    const annotationData = JSON.parse(fs.readFileSync(annotationPath, 'utf-8'));
    res.json({
        id: imageId,
        city: city,
        width: annotationData.imgWidth,
        height: annotationData.imgHeight,
        annotations: annotationData.objects.map(obj => ({
            label: obj.label,
            polygon: obj.polygon
        }))
    });
});

module.exports = router;

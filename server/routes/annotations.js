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

router.get('/all-labels', async (req, res) => {
    const annotationsRoot = path.join(__dirname, '../data/val_annotations');
    let labelSet = new Set();

    try {
        const cities = fs.readdirSync(annotationsRoot).filter(file => 
            fs.statSync(path.join(annotationsRoot, file)).isDirectory()
        );

        for (const city of cities) {
            const cityPath = path.join(annotationsRoot, city);
            const files = fs.readdirSync(cityPath).filter(file => file.endsWith('_gtFine_polygons.json'));

            for (const file of files) {
                const filePath = path.join(cityPath, file);
                try {
                    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                    if (Array.isArray(json.objects)) {
                        for (const obj of json.objects) {
                            if (obj.label) {
                                labelSet.add(obj.label);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error reading ${filePath}:`, error);
                }
            }
        }

        res.json({ classes: Array.from(labelSet).sort() });
    } catch (err) {
        console.error("Error processing annotation folders:", err);
        res.status(500).json({ error: "Server error while processing annotations." });
    }
});


module.exports = router;

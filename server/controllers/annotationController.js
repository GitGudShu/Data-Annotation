const fs = require('fs');
const path = require('path');

exports.getAnnotationByCityAndImage = (req, res) => {
  const { city, imageName } = req.params;
  const annotationDir = path.join(__dirname, '../data/val_annotations/', city);
  const jsonFile = `${annotationDir}/${imageName}_gtFine_polygons.json`;

  if (!fs.existsSync(jsonFile)) {
    return res.status(404).json({ error: "Annotation not found", path: jsonFile });
  }

  const annotationData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
  res.json(annotationData);
};

exports.getAllLabels = async (req, res) => {
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
            json.objects.forEach(obj => obj.label && labelSet.add(obj.label));
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
};

exports.createDataSample = (req, res) => {
  const { name, classes } = req.body;
  console.log('📩 Received sample:', { name, classes });

  if (!name || !Array.isArray(classes) || classes.length === 0) {
    return res.status(400).json({ error: "Missing or invalid name or classes." });
  }

  const safeName = name.replace(/\s+/g, '_').toLowerCase();
  const configDir = path.join(__dirname, '../data/data_samples');
  const configFilePath = path.join(configDir, `${safeName}.json`);
  const outputDir = path.join(configDir, safeName);
  const annotationsRoot = path.join(__dirname, '../data/val_annotations');

  try {
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const cities = fs.readdirSync(annotationsRoot).filter(city =>
      fs.statSync(path.join(annotationsRoot, city)).isDirectory()
    );

    let imageCount = 0;
    let annotedCount = 0;

    for (const city of cities) {
      const citySrc = path.join(annotationsRoot, city);
      const cityDst = path.join(outputDir, city);
      const files = fs.readdirSync(citySrc).filter(file => file.endsWith('_gtFine_polygons.json'));

      for (const file of files) {
        const filePath = path.join(citySrc, file);
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const json = JSON.parse(raw);

          const filtered = Array.isArray(json.objects)
            ? json.objects.filter(obj => classes.includes(obj.label))
            : [];

          if (filtered.length === 0) continue;

          imageCount++;
          if (!fs.existsSync(cityDst)) fs.mkdirSync(cityDst, { recursive: true });

          const result = { ...json, objects: filtered };
          fs.writeFileSync(path.join(cityDst, file), JSON.stringify(result, null, 2));
          annotedCount++;

        } catch (fileErr) {
          console.error(`❌ Error with file ${filePath}:`, fileErr.message);
        }
      }
    }

    const sampleMeta = {
      name,
      safeName,
      classes,
      createdAt: new Date().toISOString(),
      imageCount,
      annotedCount
    };

    fs.writeFileSync(configFilePath, JSON.stringify(sampleMeta, null, 2));
    console.log(`🎉 Saved sample config: ${name} (${annotedCount}/${imageCount} images)`);

    res.json({
      name: sampleMeta.name,
      classes: sampleMeta.classes,
      imageCount: sampleMeta.imageCount,
      annotedCount: sampleMeta.annotedCount
    });

  } catch (err) {
    console.error('🔥 Unexpected error during sample creation:', err);
    res.status(500).json({ error: 'Internal server error during sample creation.' });
  }
};

exports.getDataSamples = (req, res) => {
  const configDir = path.join(__dirname, '../data/data_samples');
  const samples = fs.readdirSync(configDir)
    .filter(f => f.endsWith('.json'))
    .map(file => {
      const content = JSON.parse(fs.readFileSync(path.join(configDir, file), 'utf-8'));
      return {
        name: content.name,
        classes: content.classes,
        imageCount: content.imageCount || 0,
        annotedCount: content.annotedCount || 0
      };
    });

  res.json({ samples });
};

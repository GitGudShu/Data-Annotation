const { time } = require('console');
const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../data/data_samples');
const activePath = path.join(configDir, '../active_sample.json');


/**
 * Function to calculate the area of a polygon 
 * using the shoelace formula.
 * @param {*} polygon 
 * @returns area of the polygon
 */
function calculatePolygonArea(polygon) {
  let area = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = polygon[i];
    const [x2, y2] = polygon[(i + 1) % n];
    area += (x1 * y2 - x2 * y1);
  }
  return Math.abs(area / 2);
}

exports.getAnnotationByCityAndImage = (req, res) => {
  const { city, imageName } = req.params;
  const source = req.query.source || 'original'; // default to original
  let jsonFile;

  if (source === 'active') {
    const activePath = path.join(__dirname, '../data/active_sample.json');

    if (!fs.existsSync(activePath)) {
      return res.status(400).json({ error: "No active sample set." });
    }

    const activeSample = JSON.parse(fs.readFileSync(activePath, 'utf-8'));
    const safeName = activeSample.safeName;

    if (!safeName) {
      return res.status(400).json({ error: "Active sample is not properly configured." });
    }

    const sampleDir = path.join(__dirname, '../data/data_samples', safeName, city);
    jsonFile = path.join(sampleDir, `${imageName}_gtFine_polygons.json`);
  } else {
    const annotationDir = path.join(__dirname, '../data/val_annotations/', city);
    jsonFile = path.join(annotationDir, `${imageName}_gtFine_polygons.json`);
  }

  if (!fs.existsSync(jsonFile)) {
    return res.status(404).json({ error: "Annotation not found", path: jsonFile });
  }

  try {
    const annotationData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    console.log(`Loaded annotation for ${city}/${imageName} from ${source}`);
    console.log(`Path -> ${jsonFile}`)
    res.json(annotationData);
  } catch (err) {
    console.error('Error parsing annotation JSON:', err);
    res.status(500).json({ error: "Failed to read annotation JSON." });
  }
};

exports.saveAnnotationForImage = (req, res) => {
  const { city, imageName } = req.params;
  const annotations = req.body.annotations;

  const activePath = path.join(__dirname, '../data/active_sample.json');
  if (!fs.existsSync(activePath)) {
    return res.status(400).json({ error: "No active sample set." });
  }

  const activeSample = JSON.parse(fs.readFileSync(activePath, 'utf-8'));
  const safeName = activeSample.safeName;

  if (!safeName) {
    return res.status(400).json({ error: "Active sample is not properly configured." });
  }

  const sampleDir = path.join(__dirname, '../data/data_samples', safeName, city);
  const jsonFile = path.join(sampleDir, `${imageName}_gtFine_polygons.json`);

  if (!fs.existsSync(jsonFile)) {
    return res.status(404).json({ error: "Annotation file not found." });
  }

  try {
    const existingData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    console.log(`Saving annotation for ${city}/${imageName} to active sample "${safeName}"`);
    console.log(`Path -> ${jsonFile}`)

    const updatedObjects = existingData.objects.map((obj) => {
      const match = annotations.find(ann =>
        ann.label === obj.label &&
        JSON.stringify(ann.polygon) === JSON.stringify(obj.polygon)
      );

      if (match) {
        console.log("===========================");
        console.log(`Updating object: ${obj.label} with polygon: ${JSON.stringify(obj.polygon)}`);
        console.log(`New priority: ${match.dangerLevel}`);
        console.log(`New description: ${match.description}`);
        return {
          ...obj,
          priority: match.dangerLevel,
          description: match.description
        };
      }
      return obj;
    });

    existingData.objects = updatedObjects;

    fs.writeFileSync(jsonFile, JSON.stringify(existingData, null, 2), 'utf-8');
    res.json({ message: "Annotation saved successfully." });
  } catch (err) {
    console.error("Error saving annotation:", err);
    res.status(500).json({ error: "Failed to save annotation." });
  }
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
  console.log('Received sample:', { name, classes });

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

    // list of classes to be filtered
    const filteredClasses = [
      "bicycle",
      "bicyclegroup",
      "bus",
      "car",
      "caravan",
      "cargroup",
      "person",
      "persongroup",
      "rider",
      "ridergroup",
      "train",
      "truck",
      "motorcycle"
    ]
    const minArea = 5000; // Minimum area threshold for polygons <- CHANGE HERE TO YOUR LIKING ;)

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
            ? json.objects.filter(obj => {
                if (!classes.includes(obj.label)) return false;
                if (filteredClasses.includes(obj.label)) {
                  const area = calculatePolygonArea(obj.polygon || []);
                  return area >= minArea;
                }
                return true;
              })
          : [];

          if (filtered.length === 0) continue;

          imageCount++;
          if (!fs.existsSync(cityDst)) fs.mkdirSync(cityDst, { recursive: true });

          const result = { ...json, objects: filtered };
          fs.writeFileSync(path.join(cityDst, file), JSON.stringify(result, null, 2));
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
    console.log(`Saved sample config: ${name} (${annotedCount}/${imageCount} images)`);

    res.json({
      name: sampleMeta.name,
      safeName: sampleMeta.safeName,
      classes: sampleMeta.classes,
      imageCount: sampleMeta.imageCount,
      annotedCount: sampleMeta.annotedCount
    });

  } catch (err) {
    console.error('Unexpected error during sample creation:', err);
    res.status(500).json({ error: 'Internal server error during sample creation.' });
  }
};

exports.getDataSamples = (req, res) => {
  const samples = fs.readdirSync(configDir)
    .filter(f => f.endsWith('.json'))
    .map(file => {
      const content = JSON.parse(fs.readFileSync(path.join(configDir, file), 'utf-8'));
      return {
        name: content.name,
        safeName: content.safeName,
        classes: content.classes,
        imageCount: content.imageCount || 0,
        annotedCount: content.annotedCount || 0
      };
    });

  res.json({ samples });
};

exports.setActiveSample = (req, res) => {
    const { safeName } = req.body;
    console.log('Request to set active sample:', safeName);
  
    if (!safeName) {
      console.warn("Missing 'safeName' in request body");
      return res.status(400).json({ error: "safeName is required." });
    }
  
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
      console.log('Created configDir at', configDir);
    }
  
    const samplePath = path.join(configDir, `${safeName}.json`);
    if (!fs.existsSync(samplePath)) {
      console.error(`Sample config not found: ${samplePath}`);
      return res.status(404).json({ error: "Sample not found." });
    }
  
    const activeData = {
      safeName,
      activatedAt: new Date().toISOString()
    };
  
    try {
      fs.writeFileSync(activePath, JSON.stringify(activeData, null, 2));
      console.log(`Active sample set to "${safeName}" → saved to ${activePath}`);
      res.json({ message: "Active sample set.", ...activeData });
    } catch (err) {
      console.error("Failed to write active sample:", err);
      res.status(500).json({ error: "Failed to set active sample." });
    }
  };
  
exports.getActiveSample = (req, res) => {
  console.log("🔍 Fetching active sample...");
  try {
    if (!fs.existsSync(activePath)) {
      const defaultActive = { safeName: null, activatedAt: null };
      fs.writeFileSync(activePath, JSON.stringify(defaultActive, null, 2));
      console.log("No active sample found. Created default:", defaultActive);
      return res.json(defaultActive);
    }

    const data = JSON.parse(fs.readFileSync(activePath, 'utf-8'));
    console.log("Active sample loaded:", data);
    res.json(data);
  } catch (err) {
    console.error("Error reading active sample:", err);
    res.status(500).json({ error: "Failed to read active sample." });
  }
};

exports.claimRandomImage = (req, res) => {
  const { userId } = req.body;
  console.log('Claiming random image for user:', userId);

  const activePath = path.join(__dirname, '../data/active_sample.json');
  if (!fs.existsSync(activePath)) {
    return res.status(400).json({ error: 'No active sample set.' });
  }

  const activeSample = JSON.parse(fs.readFileSync(activePath, 'utf-8'));
  const sampleDir = path.join(__dirname, '../data/data_samples', activeSample.safeName);

  const cities = fs.readdirSync(sampleDir).filter(city => {
    const cityPath = path.join(sampleDir, city);
    return fs.statSync(cityPath).isDirectory();
  });

  let availableImages = [];

  const timestamp = Date.now();
  console.log("Checking for unclaimed images in active sample...");
  for (const city of cities) {
    const cityPath = path.join(sampleDir, city);
    const files = fs.readdirSync(cityPath).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(cityPath, file);
      const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (!json.author) {
        const imageId = file.replace('_gtFine_polygons.json', '');
        availableImages.push({ city, imageId, path: filePath });
      }
    }
  }
  console.log(`Done in ${Date.now() - timestamp}ms`);

  if (availableImages.length === 0) {
    return res.status(404).json({ error: 'No unclaimed images available in active sample.' });
  }

  const selected = availableImages[Math.floor(Math.random() * availableImages.length)];
  const annotation = JSON.parse(fs.readFileSync(selected.path, 'utf-8'));

  annotation.author = userId;
  annotation.status = 0; // 0 = no ticket requested 

  fs.writeFileSync(selected.path, JSON.stringify(annotation, null, 2));
  console.log(`Claimed image ${selected.imageId} for user ${userId}`);

  res.json({ city: selected.city, imageId: selected.imageId });
};


exports.updateAnnotationStatus = (req, res) => {
  const { imageId } = req.params;
  const { status } = req.body;

  if (![1, 2, 3].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be 1, 2 or 3.' });
  }

  const activePath = path.join(__dirname, '../data/active_sample.json');
  if (!fs.existsSync(activePath)) {
    return res.status(400).json({ error: 'No active sample set.' });
  }

  const activeSample = JSON.parse(fs.readFileSync(activePath, 'utf-8'));
  const sampleDir = path.join(__dirname, '../data/data_samples', activeSample.safeName);
  const sampleMetadataPath = path.join(__dirname, '../data/data_samples', `${activeSample.safeName}.json`);

  const cities = fs.readdirSync(sampleDir).filter(city => {
    const cityPath = path.join(sampleDir, city);
    return fs.statSync(cityPath).isDirectory();
  });

  let found = false;
  for (const city of cities) {
    const filePath = path.join(sampleDir, city, `${imageId}_gtFine_polygons.json`);
    if (fs.existsSync(filePath)) {
      const annotation = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const wasAnnotated = [2, 3].includes(annotation.status);
      annotation.status = status;
      fs.writeFileSync(filePath, JSON.stringify(annotation, null, 2));

      // Increment annotedCount if new status is 2 or 3 and it wasn't already counted
      if ((status === 2 || status === 3) && !wasAnnotated) {
        if (fs.existsSync(sampleMetadataPath)) {
          const metadata = JSON.parse(fs.readFileSync(sampleMetadataPath, 'utf-8'));
          metadata.annotedCount = (metadata.annotedCount || 0) + 1;
          fs.writeFileSync(sampleMetadataPath, JSON.stringify(metadata, null, 2));
          console.log(`annotedCount updated to ${metadata.annotedCount} for sample ${activeSample.safeName}`);
        }
      }

      console.log(`Updated status of ${imageId} in city ${city} to ${status}`);
      found = true;

      return res.json({ message: 'Status updated successfully.', city, imageId, status });
    }
  }

  if (!found) {
    res.status(404).json({ error: `Image ${imageId} not found in active sample.` });
  }
};


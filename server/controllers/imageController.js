const fs = require('fs');
const path = require('path');

exports.getImagesForUser = (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    const baseSamplesPath = path.join(__dirname, '../data/data_samples');
    const baseImagesPath = path.join(__dirname, '../data/val_images');

    const testFolders = fs.readdirSync(baseSamplesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const results = [];

    testFolders.forEach((testFolder) => {
      const testFolderPath = path.join(baseSamplesPath, testFolder);

      const cityFolders = fs.readdirSync(testFolderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      cityFolders.forEach((cityFolder) => {
        const cityFolderPath = path.join(testFolderPath, cityFolder);

        const jsonFiles = fs.readdirSync(cityFolderPath)
          .filter(file => file.endsWith('_gtFine_polygons.json'));

        jsonFiles.forEach((jsonFile) => {
          const fullJsonPath = path.join(cityFolderPath, jsonFile);
          let rawData;
          try {
            rawData = fs.readFileSync(fullJsonPath, 'utf8');
            if (!rawData) {
              console.warn(`Empty file: ${fullJsonPath}`);
              return;
            }
          } catch (err) {
            console.error(`Error when reading the file ${fullJsonPath}: ${err.message}`);
            return;
          }

          let annotation;
          try {
            annotation = JSON.parse(rawData);
          } catch (err) {
            console.error(`Parse JSON Error. Path ${fullJsonPath}: ${err.message}`);
            return;
          }

          if (annotation.author === userId) {
            const baseName = jsonFile.replace('_gtFine_polygons.json', '');
            const imageFileName = `${baseName}_leftImg8bit.png`;
            const imageUrl = `http://localhost:5000/images/${cityFolder}/${imageFileName}`;
            const labelCount = annotation.objects ? annotation.objects.length : 0;
            
            const filledDescriptions = annotation.objects 
              ? annotation.objects.filter(obj => obj.description && obj.description.trim() !== '').length 
              : 0;

            results.push({
              testFolder: testFolder,
              cityFolder: cityFolder,
              fileName: baseName,
              labelCount: labelCount,
              descriptions: `${filledDescriptions}/${labelCount}`,
              imageUrl: imageUrl
            });
          }
        });
      });
    });

    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
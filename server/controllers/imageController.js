const fs = require('fs');
const path = require('path');

exports.getImagesDetails = (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    const baseSamplesPath = path.join(__dirname, '../data/data_samples');
    const baseImagesPath = path.join(__dirname, '../data/val_images');

    const testFolders = fs.readdirSync(baseSamplesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const editableImages = [];
    const archivedImages = [];
    const tickets = [];

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

            // Construction de l'objet image
            const imageDetail = {
              testFolder: testFolder,
              cityFolder: cityFolder,
              fileName: baseName,
              labelCount: labelCount,
              descriptions: `${filledDescriptions}/${labelCount}`,
              imageUrl: imageUrl,
              imgHeight: annotation.imgHeight || null,
              imgWidth: annotation.imgWidth || null,
              author: annotation.author,
              status: (annotation.status !== undefined) ? annotation.status : null
            };

            if (imageDetail.status === 0) {
              editableImages.push(imageDetail);
            } else if (imageDetail.status === 2) {
              archivedImages.push(imageDetail);
            } else if (imageDetail.status === 1) {
              let statusLabel = 'Sent to an administrator for review';
              let statusClass = 'text-yellow-500';
              const ticket = {
                id: `${testFolder}-${cityFolder}-${baseName}`,
                title: baseName,
                submittedAgo: 'N/A',
                polygonsCount: labelCount,
                status: statusLabel,
                statusClass: statusClass
              };
              tickets.push(ticket);
            } else if (imageDetail.status === 3) {
              archivedImages.push(imageDetail);
              let statusLabel = 'Processed by an administrator';
              let statusClass = 'text-green-500';
              const ticket = {
                id: `${testFolder}-${cityFolder}-${baseName}`,
                title: baseName,
                submittedAgo: 'N/A',
                polygonsCount: labelCount,
                status: statusLabel,
                statusClass: statusClass
              };
              tickets.push(ticket);
            }
            
          }
        });
      });
    });

    return res.json({ editableImages, archivedImages, tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
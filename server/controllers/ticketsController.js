const fs = require('fs');
const path = require('path');
const User = require('../models/user.model');

exports.getTicketsForAdmin = async (req, res) => {
  try {
    const baseSamplesPath = path.join(__dirname, '../data/data_samples');
    const testFolders = fs.readdirSync(baseSamplesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const tickets = [];

    for (const testFolder of testFolders) {
      const testFolderPath = path.join(baseSamplesPath, testFolder);

      const cityFolders = fs.readdirSync(testFolderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const cityFolder of cityFolders) {
        const cityFolderPath = path.join(testFolderPath, cityFolder);

        const jsonFiles = fs.readdirSync(cityFolderPath)
          .filter(file => file.endsWith('_gtFine_polygons.json'));

        for (const jsonFile of jsonFiles) {
          const fullJsonPath = path.join(cityFolderPath, jsonFile);
          let rawData;
          try {
            rawData = fs.readFileSync(fullJsonPath, 'utf8');
            if (!rawData) {
              console.warn(`Empty file: ${fullJsonPath}`);
              continue;
            }
          } catch (err) {
            console.error(`Error reading file ${fullJsonPath}: ${err.message}`);
            continue;
          }

          let annotation;
          try {
            annotation = JSON.parse(rawData);
          } catch (err) {
            console.error(`Error parsing JSON in ${fullJsonPath}: ${err.message}`);
            continue;
          }

          if (annotation.status === 1) {
            const baseName = jsonFile.replace('_gtFine_polygons.json', '');
            const imageFileName = `${baseName}_leftImg8bit.png`;
            const imageUrl = `http://localhost:5000/images/${cityFolder}/${imageFileName}`;
            const labelCount = annotation.objects ? annotation.objects.length : 0;

            let annotator = await User.findByPk(annotation.author);
            if (!annotator) {
              annotator = { nom: 'Unknown', prenom: '', email: 'Unknown' };
            }

            const ticket = {
              id: `${testFolder}-${cityFolder}-${baseName}`,
              title: baseName,
              submittedAgo: 'N/A',
              polygonsCount: labelCount,
              status: 'Sent to an administrator for review',
              statusClass: 'text-blue-500',
              annotatorName: `${annotator.prenom} ${annotator.nom}`,
              annotatorEmail: annotator.email,
              imageUrl: imageUrl,
              testFolder: testFolder,
              cityFolder: cityFolder,
              descriptions: annotation.objects ? `${annotation.objects.filter(obj => obj.description && obj.description.trim() !== '').length}/${labelCount}` : '0/0'
            };

            tickets.push(ticket);
          }
        }
      }
    }

    return res.json({ tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
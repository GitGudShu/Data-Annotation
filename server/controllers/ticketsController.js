const fs = require('fs');
const path = require('path');
const User = require('../models/user.model');

exports.getTicketsForAdmin = async (req, res) => {
  try {
    const baseSamplesPath = path.join(__dirname, '../data/data_samples');
    const activeSamplePath = path.join(__dirname, '../data/active_sample.json');

    let activeSampleData;
    try {
      const rawActiveData = fs.readFileSync(activeSamplePath, 'utf8');
      activeSampleData = JSON.parse(rawActiveData);
    } catch (err) {
      console.error(`Error reading or parsing active_sample.json: ${err.message}`);
      return res.status(500).json({ message: 'Error retrieving active sample.' });
    }

    const activeSampleName = activeSampleData.safeName;
    const testFolderPath = path.join(baseSamplesPath, activeSampleName);

    if (!fs.existsSync(testFolderPath)) {
      return res.status(404).json({ message: `The active sample folder "${activeSampleName}" is nowhere to be found.` });
    }

    const cityFolders = fs.readdirSync(testFolderPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const tickets = [];

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
            console.warn(`Fichier vide : ${fullJsonPath}`);
            continue;
          }
        } catch (err) {
          console.error(`File read error ${fullJsonPath}: ${err.message}`);
          continue;
        }

        let annotation;
        try {
          annotation = JSON.parse(rawData);
        } catch (err) {
          console.error(`JSON parsing error in ${fullJsonPath}: ${err.message}`);
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
            id: `${activeSampleName}-${cityFolder}-${baseName}`,
            title: baseName,
            submittedAgo: 'N/A',
            polygonsCount: labelCount,
            status: 'Sent to an administrator for review',
            statusClass: 'text-blue-500',
            annotatorName: `${annotator.prenom} ${annotator.nom}`,
            annotatorEmail: annotator.email,
            imageUrl: imageUrl,
            testFolder: activeSampleName,
            cityFolder: cityFolder,
            descriptions: annotation.objects ? `${annotation.objects.filter(obj => obj.description && obj.description.trim() !== '').length}/${labelCount}` : '0/0'
          };

          tickets.push(ticket);
        }
      }
    }

    return res.json({ tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
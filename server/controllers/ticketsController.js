const fs = require('fs');
const path = require('path');
const User = require('../models/user.model');

exports.getTicketsForAdmin = async (req, res) => {
  try {
    // Chemins de base
    const baseSamplesPath = path.join(__dirname, '../data/data_samples');
    // On liste les dossiers tests
    const testFolders = fs.readdirSync(baseSamplesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const tickets = [];

    // Parcours de chaque dossier test
    for (const testFolder of testFolders) {
      const testFolderPath = path.join(baseSamplesPath, testFolder);

      // Récupération des dossiers de ville
      const cityFolders = fs.readdirSync(testFolderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const cityFolder of cityFolders) {
        const cityFolderPath = path.join(testFolderPath, cityFolder);

        // On récupère tous les fichiers JSON concernés
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

          // On ne traite que les tickets (statut 1)
          if (annotation.status === 1) {
            const baseName = jsonFile.replace('_gtFine_polygons.json', '');
            const imageFileName = `${baseName}_leftImg8bit.png`;
            const imageUrl = `http://localhost:5000/images/${cityFolder}/${imageFileName}`;
            const labelCount = annotation.objects ? annotation.objects.length : 0;

            // Recherche de l'annotateur dans la base (en utilisant l'id présent dans annotation.author)
            let annotator = await User.findByPk(annotation.author);
            // Si aucun utilisateur n'est trouvé, on peut définir des valeurs par défaut
            if (!annotator) {
              annotator = { nom: 'Unknown', prenom: '', email: 'Unknown' };
            }

            // Création de l'objet ticket
            const ticket = {
              id: `${testFolder}-${cityFolder}-${baseName}`, // Génération d'un ID unique
              title: baseName,
              submittedAgo: 'N/A', // Vous pourrez y intégrer une date si vous en disposez
              polygonsCount: labelCount,
              status: 'Sent to an administrator for review',
              statusClass: 'text-blue-500',
              annotatorName: `${annotator.prenom} ${annotator.nom}`,
              annotatorEmail: annotator.email,
              imageUrl: imageUrl,
              testFolder: testFolder,
              cityFolder: cityFolder,
              // Optionnel : affichage du nombre de descriptions remplies
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
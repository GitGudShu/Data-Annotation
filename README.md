# Data-Annotation
This project aims to develop a state-of-the-art web platform for visualizing preloaded images from an existing dataset, analyzing segmented objects (pedestrians, vehicles, urban infrastructure), and assigning priority levels based on their importance in urban driving (e.g., a crossing pedestrian is prioritized over a parked vehicle).


Aller dans le dossier client :
npm install

aller dans le dossier serveur : 
npm install 

Créer un .env à la racine du dossier serveur : 
DB_NAME=annotation_appBDD
DB_USER=‘user_mysl’
DB_PASSWORD=‘mot_de_passe_mysql’
DB_HOST=localhost

Lancez mysql dans un terminal lancé dans server/database :
mysql -u root -p

Une fois connecté : SOURCE init.sql


Lancer le projet : 
npm start dans le client
npm run dev dans le server

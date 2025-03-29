const express = require('express');
const router = express.Router();
const {
  getAnnotationByCityAndImage,
  getAllLabels,
  createDataSample,
  getDataSamples
} = require('../controllers/annotationController');

router.get('/:city/:imageName', getAnnotationByCityAndImage);
router.get('/all-labels', getAllLabels);
router.post('/data-sample', createDataSample);
router.get('/data-samples', getDataSamples);

module.exports = router;

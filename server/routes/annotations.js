const express = require('express');
const router = express.Router();
const {
  getAnnotationByCityAndImage,
  getAllLabels,
  createDataSample,
  getDataSamples,
  setActiveSample,
  getActiveSample,
  saveAnnotationForImage,
  claimRandomImage
} = require('../controllers/annotationController');     
   
router.get('/all-labels', getAllLabels);
router.get('/data-samples', getDataSamples);
router.get('/data-samples/active-sample', getActiveSample);
router.post('/data-sample', createDataSample);
router.post('/data-samples/active-sample', setActiveSample);
router.post('/save/:city/:imageName', saveAnnotationForImage);
router.post('/claim-random', claimRandomImage);

router.get('/:city/:imageName', getAnnotationByCityAndImage);

module.exports = router;

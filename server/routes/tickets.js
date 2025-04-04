const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

router.get('/getAllTickets', ticketsController.getTicketsForAdmin);

module.exports = router;
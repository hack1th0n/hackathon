const express = require('express'); 
const { requireAuth } = require('../middleware'); 
const dashboardController = require('../controllers/dashboardController'); 
const router = express.Router(); 
router.get('/summary', requireAuth, dashboardController.summary); 
module.exports = router; 
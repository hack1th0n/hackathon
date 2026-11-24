const express = require('express'); 
const { requireAuth, validate } = require('../middleware'); 
const { createPaymentSchema } = require('../validators'); 
const paymentController = require('../controllers/paymentController'); 
const router = express.Router(); 
router.get('/', requireAuth, paymentController.list); 
router.post('/', requireAuth, validate(createPaymentSchema), paymentController.create); 
module.exports = router; 
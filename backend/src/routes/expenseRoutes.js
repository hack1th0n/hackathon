const express = require('express'); 
const { requireAuth, requireRole, validate } = require('../middleware'); 
const { createExpenseSchema } = require('../validators'); 
const expenseController = require('../controllers/expenseController'); 
const router = express.Router(); 
router.get('/', requireAuth, requireRole('admin', 'manager'), expenseController.list); 
router.post( 
'/', 
requireAuth, 
requireRole('admin', 'manager'), 
validate(createExpenseSchema), 
expenseController.create 
); 
module.exports = router;
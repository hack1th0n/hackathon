const express = require('express'); 
const { requireAuth, requireRole, validate } = require('../middleware'); 
const { createLeaseSchema, terminateLeaseSchema } = require('../validators'); 
const leaseController = require('../controllers/leaseController'); 
const router = express.Router(); 
router.get('/', requireAuth, leaseController.list); 
router.post( 
'/', 
requireAuth, 
requireRole('admin', 'manager'), 
validate(createLeaseSchema), 
leaseController.create 
); 
router.post( 
'/:id/activate', 
requireAuth, 
requireRole('admin', 'manager'), 
leaseController.activate 
); 
router.post( 
'/:id/terminate', 
requireAuth, 
requireRole('admin', 'manager'), 
validate(terminateLeaseSchema), 
leaseController.terminate 
); 
module.exports = router;
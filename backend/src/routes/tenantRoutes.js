const express = require('express'); 
const { requireAuth, requireRole, validate } = require('../middleware'); 
const { createTenantSchema, updateTenantSchema } = require('../validators'); 
const tenantController = require('../controllers/tenantController'); 
const router = express.Router(); 
router.get('/', requireAuth, tenantController.list); 
router.post( 
'/', 
requireAuth, 
requireRole('admin', 'manager'), 
validate(createTenantSchema), 
tenantController.create 
); 
router.patch( 
'/:id', 
requireAuth, 
requireRole('admin', 'manager'), 
validate(updateTenantSchema), 
tenantController.update 
); 
module.exports = router;
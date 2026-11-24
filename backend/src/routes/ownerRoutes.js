const express = require('express'); 
const { requireAuth, requireRole, validate } = require('../middleware'); 
const { createOwnerSchema, updateOwnerSchema } = require('../validators'); 
const ownerController = require('../controllers/ownerController'); 
const router = express.Router(); 
router.get('/', requireAuth, ownerController.list); 
router.post( 
'/', 
requireAuth, 
requireRole('admin', 'manager'), 
validate(createOwnerSchema), 
ownerController.create 
); 
router.patch( 
'/:id', 
requireAuth, 
requireRole('admin', 'manager'), 
validate(updateOwnerSchema), 
ownerController.update 
); 
module.exports = router;
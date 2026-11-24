const express = require('express'); 
const { requireAuth, requireRole, validate } = require('../middleware'); 
const { 
createPropertySchema, 
updatePropertySchema, 
createUnitSchema, 
updateUnitSchema, 
} = require('../validators'); 
const propertyController = require('../controllers/propertyController'); 
const router = express.Router(); 
router.get('/', requireAuth, propertyController.list); 
router.get('/:id', requireAuth, propertyController.get); 
router.post( 
  '/', 
  requireAuth, 
  requireRole('admin', 'manager'), 
  validate(createPropertySchema), 
  propertyController.create 
); 
router.patch( 
  '/:id', 
  requireAuth, 
  requireRole('admin', 'manager'), 
  validate(updatePropertySchema), 
  propertyController.update 
); 
router.post( 
  '/:id/archive', 
  requireAuth, 
  requireRole('admin', 'manager'), 
  propertyController.archive 
); 
 
// Units (nested) 
router.get('/:id/units', requireAuth, propertyController.listUnits); 
router.post( 
  '/:id/units', 
  requireAuth, 
  requireRole('admin', 'manager'), 
  validate(createUnitSchema), 
  propertyController.createUnit 
); 
router.patch( 
  '/:id/units/:unitId', 
  requireAuth, 
  requireRole('admin', 'manager'), 
  validate(updateUnitSchema), 
  propertyController.updateUnit 
); 
 
module.exports = router;
const { makeValidator, isPositiveInt } = require('./common'); 
 
const TYPES = ['residential', 'commercial', 'mixed']; 
 
const propertyFields = [ 
  { field: 'ownerId', required: true, check: isPositiveInt, message: 'Invalid ownerId', 
    transform: Number }, 
  { field: 'name', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 2, 
    message: 'Name is required' }, 
  { field: 'propertyType', required: true, 
    check: (v) => TYPES.includes(v), message: 'Invalid propertyType' }, 
  { field: 'address', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 2, 
    message: 'Address is required' }, 
  { field: 'city', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 1, 
    message: 'City is required' }, 
  { field: 'description', required: false, check: (v) => typeof v === 'string' }, 
]; 
 
const createPropertySchema = makeValidator(propertyFields); 
const updatePropertySchema = makeValidator( 
  propertyFields.map((r) => ({ ...r, required: false })) 
); 
 
module.exports = { createPropertySchema, updatePropertySchema };
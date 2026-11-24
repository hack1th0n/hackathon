const { makeValidator, isPositiveNumber } = require('./common'); 
 
const unitFields = [ 
  { field: 'unitCode', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 1, 
    message: 'unitCode is required' }, 
  { field: 'floorLabel', required: false, check: (v) => typeof v === 'string' }, 
  { field: 'bedrooms', required: false, 
    check: (v) => Number.isInteger(Number(v)) && Number(v) >= 0, 
    transform: (v) => Number(v) }, 
  { field: 'bathrooms', required: false, 
    check: (v) => Number.isInteger(Number(v)) && Number(v) >= 0, 
    transform: (v) => Number(v) }, 
  { field: 'monthlyRent', required: true, check: isPositiveNumber, 
    message: 'monthlyRent must be positive', transform: Number }, 
]; 
 
const createUnitSchema = makeValidator(unitFields); 
const updateUnitSchema = makeValidator( 
  unitFields.map((r) => ({ ...r, required: false })) 
); 
 
module.exports = { createUnitSchema, updateUnitSchema }; 
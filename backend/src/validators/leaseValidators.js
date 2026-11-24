const { makeValidator, isPositiveInt, isPositiveNumber, isDateOnly } = require('./common'); 
 
const createLeaseSchema = makeValidator([ 
  { field: 'unitId', required: true, check: isPositiveInt, transform: Number }, 
  { field: 'tenantId', required: true, check: isPositiveInt, transform: Number }, 
  { field: 'startDate', required: true, check: isDateOnly, message: 'YYYY-MM-DD' }, 
  { field: 'endDate', required: true, check: isDateOnly, message: 'YYYY-MM-DD' }, 
  { field: 'monthlyRent', required: true, check: isPositiveNumber, transform: Number }, 
  { field: 'depositAmount', required: false, 
    check: (v) => Number.isFinite(Number(v)) && Number(v) >= 0, transform: Number }, 
  { field: 'paymentDueDay', required: true, 
    check: (v) => Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 28, 
    message: 'Must be between 1 and 28', transform: Number }, 
  { field: 'status', required: false, 
    check: (v) => ['draft', 'active'].includes(v), message: 'Only draft or active' }, 
]); 
 
const terminateLeaseSchema = makeValidator([ 
  { field: 'terminationReason', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 2, 
    message: 'Reason is required' }, 
  { field: 'endDate', required: false, check: isDateOnly, message: 'YYYY-MM-DD' }, 
]); 
 
module.exports = { createLeaseSchema, terminateLeaseSchema }; 
 
const { makeValidator, isPositiveInt, isPositiveNumber, isDateOnly } = require('./common'); 
 
const METHODS = ['cash', 'bank_transfer', 'other']; 
 
const createPaymentSchema = makeValidator([ 
  { field: 'leaseId', required: true, check: isPositiveInt, transform: Number }, 
  { field: 'amount', required: true, check: isPositiveNumber, transform: Number }, 
  { field: 'paidOn', required: true, check: isDateOnly, message: 'YYYY-MM-DD' }, 
  { field: 'periodYear', required: true, 
    check: (v) => Number.isInteger(Number(v)) && Number(v) >= 2000 && Number(v) <= 2100, 
    transform: Number }, 
  { field: 'periodMonth', required: true, 
    check: (v) => Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 12, 
    transform: Number }, 
  { field: 'method', required: true, check: (v) => METHODS.includes(v) }, 
  { field: 'reference', required: false, check: (v) => typeof v === 'string' }, 
  { field: 'notes', required: false, check: (v) => typeof v === 'string' }, 
]); 
 
module.exports = { createPaymentSchema }; 
const { makeValidator, isPositiveInt, isPositiveNumber, isDateOnly } = require('./common'); 
 
const createExpenseSchema = makeValidator([ 
  { field: 'propertyId', required: true, check: isPositiveInt, transform: Number }, 
  { field: 'unitId', required: false, 
    check: (v) => v === null || isPositiveInt(v), transform: (v) => (v == null ? null : Number(v)) }, 
  { field: 'category', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 1 }, 
  { field: 'description', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 1 }, 
  { field: 'amount', required: true, check: isPositiveNumber, transform: Number }, 
  { field: 'expenseDate', required: true, check: isDateOnly, message: 'YYYY-MM-DD' }, 
]); 
 
module.exports = { createExpenseSchema };
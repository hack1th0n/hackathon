const { makeValidator, isEmail } = require('./common'); 
 
const ownerFields = [ 
  { field: 'fullName', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 2, 
    message: 'Full name is required' }, 
  { field: 'phone', required: true, 
    check: (v) => typeof v === 'string' && v.trim().length >= 5 && v.trim().length <= 32, 
    message: 'Phone is required' }, 
  { field: 'email', required: false, check: isEmail, message: 'Invalid email', 
    transform: (v) => String(v).toLowerCase().trim() }, 
  { field: 'address', required: false, check: (v) => typeof v === 'string' }, 
  { field: 'notes', required: false, check: (v) => typeof v === 'string' }, 
]; 
 
const createOwnerSchema = makeValidator(ownerFields); 
 
const updateOwnerSchema = makeValidator(ownerFields.map((r) => ({ ...r, required: false }))); 
 
module.exports = { createOwnerSchema, updateOwnerSchema };
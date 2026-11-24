 
const { makeValidator, isEmail } = require('./common'); 
 
const ROLES = ['admin', 'manager', 'staff']; 
 
const createUserSchema = makeValidator([ 
  { field: 'fullName', required: true, message: 'Full name is required', 
    check: (v) => typeof v === 'string' && v.trim().length >= 2 }, 
  { field: 'email', required: true, check: isEmail, message: 'Valid email is required', 
    transform: (v) => String(v).toLowerCase().trim() }, 
  { field: 'password', required: true, message: 'Password is required', 
    check: (v) => typeof v === 'string' && v.length >= 8 }, 
  { field: 'role', required: true, check: (v) => ROLES.includes(v), 
    message: 'Role must be admin, manager, or staff' }, 
  { field: 'isActive', required: false, check: (v) => typeof v === 'boolean' }, 
]); 
 
const updateUserSchema = makeValidator([ 
  { field: 'fullName', required: false, 
    check: (v) => typeof v === 'string' && v.trim().length >= 2 }, 
  { field: 'email', required: false, check: isEmail, 
    transform: (v) => String(v).toLowerCase().trim() }, 
  { field: 'password', required: false, 
    check: (v) => typeof v === 'string' && v.length >= 8 }, 
  { field: 'role', required: false, check: (v) => ROLES.includes(v) }, 
  { field: 'isActive', required: false, check: (v) => typeof v === 'boolean' }, 
]); 
 
module.exports = { createUserSchema, updateUserSchema }; 
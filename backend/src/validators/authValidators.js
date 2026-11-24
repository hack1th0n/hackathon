 
const { makeValidator, isEmail } = require('./common'); 
 
const loginSchema = makeValidator([ 
  { field: 'email', required: true, check: isEmail, message: 'Valid email is required', 
    transform: (v) => String(v).toLowerCase().trim() }, 
  { field: 'password', required: true, message: 'Password is required', 
    check: (v) => typeof v === 'string' && v.length >= 1 }, 
]); 
 
module.exports = { loginSchema }; 
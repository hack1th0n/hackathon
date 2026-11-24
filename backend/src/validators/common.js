const isEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
const isDateOnly = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !
isNaN(Date.parse(v)); 
const isPositiveInt = (v) => { const n = Number(v); return Number.isInteger(n) && n > 0; }; 
const isPositiveNumber = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0; }; 
const isNonNegativeNumber = (v) => { const n = Number(v); return Number.isFinite(n) && n >= 
0; }; 
const ok = (value) => ({ valid: true, value }); 
 
function makeValidator(rules) { 
  return { 
    validate(body = {}) { 
      const errors = []; 
      const out = {}; 
      for (const rule of rules) { 
        const { field, required, check, message, transform } = rule; 
        const raw = body[field]; 
        const present = raw !== undefined && raw !== null && raw !== ''; 
        if (!present) { 
          if (required) errors.push({ field, message: message || 'Required' }); 
          continue; 
        } 
        if (check && !check(raw)) { 
          errors.push({ field, message: message || 'Invalid' }); 
          continue; 
        } 
        out[field] = transform ? transform(raw) : raw; 
      } 
      if (errors.length) return { valid: false, errors }; 
      return ok(out); 
    }, 
  }; 
} 
 
module.exports = { 
  ok, makeValidator, 
  isEmail, isDateOnly, isPositiveInt, isPositiveNumber, isNonNegativeNumber, 
}; 
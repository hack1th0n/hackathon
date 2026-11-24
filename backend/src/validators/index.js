const { loginSchema } = require('./authValidators'); 
const { createUserSchema, updateUserSchema } = require('./userValidators'); 
const { createOwnerSchema, updateOwnerSchema } = require('./ownerValidators'); 
const { createTenantSchema, updateTenantSchema } = require('./tenantValidators'); 
const { createPropertySchema, updatePropertySchema } = require('./propertyValidators'); 
const { createUnitSchema, updateUnitSchema } = require('./unitValidators'); 
const { createLeaseSchema, terminateLeaseSchema } = require('./leaseValidators'); 
const { createPaymentSchema } = require('./paymentValidators'); 
const { createExpenseSchema } = require('./expenseValidators'); 
module.exports = { 
loginSchema, 
createUserSchema, updateUserSchema, 
createOwnerSchema, updateOwnerSchema, 
createTenantSchema, updateTenantSchema, 
createPropertySchema, updatePropertySchema, 
createUnitSchema, updateUnitSchema, 
createLeaseSchema, terminateLeaseSchema, 
createPaymentSchema, 
createExpenseSchema, 
}; 
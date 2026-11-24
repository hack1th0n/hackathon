const { ApiError } = require('../middleware'); 
const { expenseModel, propertyModel, unitModel } = require('../models'); 
const { 
  paginationParams, paginationMeta, isDateOnly, requireAdminOrManager, 
} = require('./_helpers'); 
 
async function createExpense(input, actor) { 
  requireAdminOrManager(actor); 
 
  const errors = []; 
  if (!(Number(input.amount) > 0)) { 
    errors.push({ field: 'amount', message: 'Must be positive' }); 
  } 
  if (!isDateOnly(input.expenseDate)) { 
    errors.push({ field: 'expenseDate', message: 'Must be YYYY-MM-DD' }); 
  } 
  if (errors.length) throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid expense', errors); 
 
  const property = await propertyModel.findById(input.propertyId); 
  if (!property || property.isArchived) { 
    throw new ApiError(400, 'PROPERTY_NOT_FOUND', 'Property does not exist', [ 
      { field: 'propertyId', message: 'Property does not exist' }, 
    ]); 
  } 
  if (input.unitId != null) { 
    const unit = await unitModel.findById(input.unitId); 
    if (!unit || unit.isArchived) { 
      throw new ApiError(400, 'UNIT_NOT_FOUND', 'Unit does not exist', [ 
        { field: 'unitId', message: 'Unit does not exist' }, 
      ]); 
    } 
    if (unit.propertyId !== input.propertyId) { 
      throw new ApiError(400, 'UNIT_PROPERTY_MISMATCH', 
        'Unit does not belong to the given property', [ 
          { field: 'unitId', message: 'Unit must belong to property' }, 
        ]); 
    } 
  } 
 
  const id = await expenseModel.create({ 
    propertyId: input.propertyId, 
    unitId: input.unitId || null, 
    category: input.category, 
    description: input.description, 
    amount: Number(input.amount), 
    expenseDate: input.expenseDate, 
    paidBy: actor.id, 
  }); 
  return { id, ...input }; 
} 
 
async function listExpenses(filters, actor) { 
  requireAdminOrManager(actor); 
  const { page, limit, offset } = paginationParams(filters); 
  const { rows, total } = await expenseModel.list({ 
    propertyId: filters.propertyId || null, 
    unitId: filters.unitId || null, 
    category: filters.category || null, 
    fromDate: filters.fromDate || null, 
    toDate: filters.toDate || null, 
    limit, 
    offset, 
  }); 
  return { items: rows, pagination: paginationMeta(page, limit, total) }; 
} 
 
module.exports = { createExpense, listExpenses };
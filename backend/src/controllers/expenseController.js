const { asyncHandler } = require('../middleware'); 
const { expenseService } = require('../services'); 
 
const sendSuccess = (res, data, meta) => { 
  const payload = { success: true, data }; 
  if (meta) payload.meta = meta; 
  return res.json(payload); 
}; 
const sendCreated = (res, data, meta) => { 
  const payload = { success: true, data }; 
  if (meta) payload.meta = meta; 
  return res.status(201).json(payload); 
}; 
 
exports.list = asyncHandler(async (req, res) => { 
  const { page, limit, propertyId, unitId, category, fromDate, toDate } = req.query; 
  const result = await expenseService.listExpenses( 
    { page, limit, propertyId, unitId, category, fromDate, toDate }, 
req.session.user 
); 
return sendSuccess(res, { items: result.items }, result.pagination); 
}); 
exports.create = asyncHandler(async (req, res) => { 
const expense = await expenseService.createExpense(req.body, req.session.user); 
return sendCreated(res, expense); 
}); 
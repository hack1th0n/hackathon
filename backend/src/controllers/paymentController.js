const { asyncHandler, ApiError } = require('../middleware'); 
const { paymentService } = require('../services'); 
 
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
  const { page, limit, leaseId, periodYear, periodMonth, method } = req.query; 
  const result = await paymentService.listPayments( 
    { page, limit, leaseId, periodYear, periodMonth, method }, 
    req.session.user 
  ); 
  return sendSuccess(res, { items: result.items }, result.pagination); 
}); 
 
exports.create = asyncHandler(async (req, res) => { 
  const payment = await paymentService.createPayment(req.body, req.session.user); 
  return sendCreated(res, payment); 
});
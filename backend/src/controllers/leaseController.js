const { asyncHandler, ApiError } = require('../middleware'); 
const { leaseService } = require('../services'); 
 
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
const parseId = (value) => { 
  const id = Number(value); 
  if (!Number.isInteger(id) || id <= 0) { 
    throw new ApiError(400, 'INVALID_ID', 'Invalid lease id'); 
  } 
  return id; 
}; 
 
exports.list = asyncHandler(async (req, res) => { 
  const { page, limit, status, unitId, tenantId } = req.query; 
  const result = await leaseService.listLeases( 
    { page, limit, status, unitId, tenantId }, 
    req.session.user 
  ); 
  return sendSuccess(res, { items: result.items }, result.pagination); 
}); 
 
exports.create = asyncHandler(async (req, res) => { 
  const lease = await leaseService.createLease(req.body, req.session.user); 
  return sendCreated(res, lease); 
}); 
 
exports.activate = asyncHandler(async (req, res) => { 
  const id = parseId(req.params.id); 
  const lease = await leaseService.activateLease(id, req.session.user); 
  return sendSuccess(res, lease); 
}); 
 
exports.terminate = asyncHandler(async (req, res) => { 
  const id = parseId(req.params.id); 
  const lease = await leaseService.terminateLease(id, req.body, req.session.user); 
  return sendSuccess(res, lease); 
});
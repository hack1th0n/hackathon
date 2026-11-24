const { asyncHandler, ApiError } = require('../middleware'); 
const { tenantService } = require('../services'); 
 
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
    throw new ApiError(400, 'INVALID_ID', 'Invalid tenant id'); 
  } 
  return id; 
}; 
 
exports.list = asyncHandler(async (req, res) => { 
  const { page, limit, search, isArchived } = req.query; 
  const result = await tenantService.listTenants( 
    { page, limit, search, isArchived }, 
    req.session.user 
  ); 
  return sendSuccess(res, { items: result.items }, result.pagination); 
}); 
 
exports.create = asyncHandler(async (req, res) => { 
  const tenant = await tenantService.createTenant(req.body, req.session.user); 
  return sendCreated(res, tenant); 
}); 
 
exports.update = asyncHandler(async (req, res) => { 
  const id = parseId(req.params.id); 
  const tenant = await tenantService.updateTenant(id, req.body, req.session.user); 
  return sendSuccess(res, tenant); 
});
const { asyncHandler, ApiError } = require('../middleware'); 
const { ownerService } = require('../services'); 
 
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
    throw new ApiError(400, 'INVALID_ID', 'Invalid owner id'); 
  } 
  return id; 
}; 
 
exports.list = asyncHandler(async (req, res) => { 
  const { page, limit, search, isArchived } = req.query; 
  const result = await ownerService.listOwners( 
    { page, limit, search, isArchived }, 
    req.session.user 
  ); 
  return sendSuccess(res, { items: result.items }, result.pagination); 
}); 
 
exports.create = asyncHandler(async (req, res) => { 
  const owner = await ownerService.createOwner(req.body, req.session.user); 
  return sendCreated(res, owner); 
}); 
 
exports.update = asyncHandler(async (req, res) => { 
  const id = parseId(req.params.id); 
  const owner = await ownerService.updateOwner(id, req.body, req.session.user); 
  return sendSuccess(res, owner); 
});
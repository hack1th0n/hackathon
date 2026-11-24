const { asyncHandler, ApiError } = require('../middleware'); 
const { userService } = require('../services'); 
 
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
    throw new ApiError(400, 'INVALID_ID', 'Invalid user id'); 
  } 
  return id; 
}; 
 
// HANDOFF: userService.listUsers / createUser / updateUser not enumerated in AI 5 services 
list. 
exports.list = asyncHandler(async (req, res) => { 
  const { page, limit, search, role, isActive } = req.query; 
  const result = await userService.listUsers( 
    { page, limit, search, role, isActive }, 
    req.session.user 
  ); 
  return sendSuccess(res, { items: result.items }, result.pagination); 
}); 
 
exports.create = asyncHandler(async (req, res) => { 
  const user = await userService.createUser(req.body, req.session.user); 
  return sendCreated(res, user); 
}); 
 
exports.update = asyncHandler(async (req, res) => { 
  const id = parseId(req.params.id); 
  const user = await userService.updateUser(id, req.body, req.session.user); 
  return sendSuccess(res, user); 
});
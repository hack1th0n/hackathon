const { asyncHandler, ApiError } = require('../middleware'); 
const { propertyService } = require('../services'); 
 
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
const parseId = (value, label = 'id') => { 
  const id = Number(value); 
  if (!Number.isInteger(id) || id <= 0) { 
    throw new ApiError(400, 'INVALID_ID', `Invalid ${label}`); 
  } 
  return id; 
}; 
 
exports.list = asyncHandler(async (req, res) => { 
  const { page, limit, search, ownerId, isArchived } = req.query; 
  const result = await propertyService.listProperties( 
    { page, limit, search, ownerId, isArchived }, 
    req.session.user 
  ); 
  return sendSuccess(res, { items: result.items }, result.pagination); 
}); 
 
exports.get = asyncHandler(async (req, res) => { 
  const id = parseId(req.params.id, 'property id'); 
  const property = await propertyService.getProperty(id, req.session.user); 
  return sendSuccess(res, property); 
}); 
 
exports.create = asyncHandler(async (req, res) => { 
  const property = await propertyService.createProperty(req.body, req.session.user); 
  return sendCreated(res, property); 
}); 
 
exports.update = asyncHandler(async (req, res) => { 
  const id = parseId(req.params.id, 'property id'); 
  const property = await propertyService.updateProperty(id, req.body, req.session.user); 
  return sendSuccess(res, property); 
}); 
 
exports.archive = asyncHandler(async (req, res) => { 
  const id = parseId(req.params.id, 'property id'); 
  const property = await propertyService.archiveProperty(id, req.session.user); 
  return sendSuccess(res, property); 
}); 
 
// HANDOFF: unit methods (createUnit / listUnits / updateUnit) not enumerated in AI 5 services 
list. 
exports.listUnits = asyncHandler(async (req, res) => { 
  const propertyId = parseId(req.params.id, 'property id'); 
  const { page, limit, status } = req.query; 
  const result = await propertyService.listUnits( 
    propertyId, 
    { page, limit, status }, 
    req.session.user 
  ); 
  return sendSuccess(res, { items: result.items }, result.pagination); 
}); 
 
exports.createUnit = asyncHandler(async (req, res) => { 
  const propertyId = parseId(req.params.id, 'property id'); 
  const unit = await propertyService.createUnit(propertyId, req.body, req.session.user); 
  return sendCreated(res, unit); 
}); 
 
exports.updateUnit = asyncHandler(async (req, res) => { 
  const propertyId = parseId(req.params.id, 'property id'); 
  const unitId = parseId(req.params.unitId, 'unit id'); 
  const unit = await propertyService.updateUnit( 
    propertyId, 
    unitId, 
    req.body, 
    req.session.user 
  ); 
  return sendSuccess(res, unit); 
});
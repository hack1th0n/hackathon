 
const { ApiError } = require('../middleware'); 
const { propertyModel, ownerModel, tenantModel, unitModel } = require('../models'); 
const { 
  paginationParams, paginationMeta, requireAdminOrManager, 
} = require('./_helpers'); 
 
/* ---------- Owners ---------- */ 
async function createOwner(input, actor) { 
  requireAdminOrManager(actor); 
  const id = await ownerModel.create({ 
    fullName: input.fullName, 
    phone: input.phone, 
    email: input.email || null, 
    address: input.address || null, 
    notes: input.notes || null, 
  }); 
  return ownerModel.findById(id); 
} 
 
async function updateOwner(id, input, actor) { 
  requireAdminOrManager(actor); 
  const existing = await ownerModel.findById(id); 
  if (!existing || existing.isArchived) { 
    throw new ApiError(404, 'OWNER_NOT_FOUND', 'Owner not found'); 
  } 
  const patch = {}; 
  if (input.fullName !== undefined) patch.fullName = input.fullName; 
  if (input.phone !== undefined) patch.phone = input.phone; 
  if (input.email !== undefined) patch.email = input.email; 
  if (input.address !== undefined) patch.address = input.address; 
  if (input.notes !== undefined) patch.notes = input.notes; 
  await ownerModel.update(id, patch); 
  return ownerModel.findById(id); 
} 
 
async function listOwners(filters, actor) { 
  const { page, limit, offset } = paginationParams(filters); 
  const { rows, total } = await ownerModel.list({ 
    search: filters.search || null, 
    isArchived: filters.isArchived === true || filters.isArchived === 'true', 
    limit, 
    offset, 
  }); 
  return { items: rows, pagination: paginationMeta(page, limit, total) }; 
} 
 
/* ---------- Tenants ---------- */ 
async function createTenant(input, actor) { 
  requireAdminOrManager(actor); 
  const id = await tenantModel.create({ 
    fullName: input.fullName, 
    phone: input.phone, 
    email: input.email || null, 
    address: input.address || null, 
    notes: input.notes || null, 
  }); 
  return tenantModel.findById(id); 
} 
 
async function updateTenant(id, input, actor) { 
  requireAdminOrManager(actor); 
  const existing = await tenantModel.findById(id); 
  if (!existing || existing.isArchived) { 
    throw new ApiError(404, 'TENANT_NOT_FOUND', 'Tenant not found'); 
  } 
  const patch = {}; 
  if (input.fullName !== undefined) patch.fullName = input.fullName; 
  if (input.phone !== undefined) patch.phone = input.phone; 
  if (input.email !== undefined) patch.email = input.email; 
  if (input.address !== undefined) patch.address = input.address; 
  if (input.notes !== undefined) patch.notes = input.notes; 
  await tenantModel.update(id, patch); 
  return tenantModel.findById(id); 
} 
 
async function listTenants(filters, actor) { 
  const { page, limit, offset } = paginationParams(filters); 
  const { rows, total } = await tenantModel.list({ 
    search: filters.search || null, 
    isArchived: filters.isArchived === true || filters.isArchived === 'true', 
    limit, 
    offset, 
  }); 
  return { items: rows, pagination: paginationMeta(page, limit, total) }; 
} 
 
/* ---------- Properties ---------- */ 
async function createProperty(input, actor) { 
  requireAdminOrManager(actor); 
  const owner = await ownerModel.findById(input.ownerId); 
  if (!owner || owner.isArchived) { 
    throw new ApiError(400, 'OWNER_NOT_FOUND', 'Owner does not exist', [ 
      { field: 'ownerId', message: 'Owner does not exist or is archived' }, 
    ]); 
  } 
  const id = await propertyModel.create({ 
    ownerId: input.ownerId, 
    name: input.name, 
    propertyType: input.propertyType, 
    address: input.address, 
    city: input.city, 
    description: input.description || null, 
  }); 
  return getProperty(id, actor); 
} 
 
async function updateProperty(id, input, actor) { 
  requireAdminOrManager(actor); 
  const existing = await propertyModel.findById(id); 
  if (!existing || existing.isArchived) { 
    throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found'); 
  } 
  const patch = {}; 
  if (input.ownerId !== undefined) { 
    const owner = await ownerModel.findById(input.ownerId); 
    if (!owner || owner.isArchived) { 
      throw new ApiError(400, 'OWNER_NOT_FOUND', 'Owner does not exist', [ 
        { field: 'ownerId', message: 'Owner does not exist or is archived' }, 
      ]); 
    } 
    patch.ownerId = input.ownerId; 
  } 
  if (input.name !== undefined) patch.name = input.name; 
  if (input.propertyType !== undefined) patch.propertyType = input.propertyType; 
  if (input.address !== undefined) patch.address = input.address; 
  if (input.city !== undefined) patch.city = input.city; 
  if (input.description !== undefined) patch.description = input.description; 
  await propertyModel.update(id, patch); 
  return getProperty(id, actor); 
} 
 
async function archiveProperty(id, actor) { 
  requireAdminOrManager(actor); 
  const existing = await propertyModel.findById(id); 
  if (!existing || existing.isArchived) { 
    throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found'); 
  } 
  await propertyModel.archive(id); 
  return propertyModel.findById(id); 
} 
 
async function listProperties(filters, actor) { 
  const { page, limit, offset } = paginationParams(filters); 
  const { rows, total } = await propertyModel.list({ 
    search: filters.search || null, 
    ownerId: filters.ownerId || null, 
    isArchived: filters.isArchived === true || filters.isArchived === 'true', 
    limit, 
    offset, 
  }); 
  return { items: rows, pagination: paginationMeta(page, limit, total) }; 
} 
 
async function getProperty(id, actor) { 
  const property = await propertyModel.findById(id); 
  if (!property || property.isArchived) { 
    throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'Property not found'); 
  } 
  const { rows: units } = await unitModel.list({ 
    propertyId: id, 
    limit: 1000, 
    offset: 0, 
  }); 
  return { ...property, units }; 
} 
 
module.exports = { 
  createProperty, updateProperty, archiveProperty, listProperties, getProperty, 
  createOwner, updateOwner, listOwners, 
  createTenant, updateTenant, listTenants, 
}; 
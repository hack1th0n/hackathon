const { ApiError } = require('../middleware'); 
const { leaseModel, unitModel, tenantModel } = require('../models'); 
const { 
  paginationParams, paginationMeta, requireAdminOrManager, 
  isDateOnly, withTransaction, 
} = require('./_helpers'); 
 
async function createLease(input, actor) { 
  requireAdminOrManager(actor); 
 
  const errors = []; 
  if (!isDateOnly(input.startDate)) { 
    errors.push({ field: 'startDate', message: 'Must be YYYY-MM-DD' }); 
  } 
  if (!isDateOnly(input.endDate)) { 
    errors.push({ field: 'endDate', message: 'Must be YYYY-MM-DD' }); 
  } 
  if (errors.length) { 
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid dates', errors); 
  } 
  if (input.startDate > input.endDate) { 
    throw new ApiError(400, 'VALIDATION_ERROR', 'Start must be before end', [ 
      { field: 'startDate', message: 'startDate must be <= endDate' }, 
    ]); 
  } 
  const dueDay = Number(input.paymentDueDay); 
  if (!Number.isInteger(dueDay) || dueDay < 1 || dueDay > 28) { 
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid paymentDueDay', [ 
      { field: 'paymentDueDay', message: 'Must be between 1 and 28' }, 
    ]); 
  } 
  if (!(Number(input.monthlyRent) > 0)) { 
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid rent', [ 
      { field: 'monthlyRent', message: 'Must be positive' }, 
    ]); 
  } 
  const unit = await unitModel.findById(input.unitId); 
  if (!unit || unit.isArchived) { 
    throw new ApiError(400, 'UNIT_NOT_FOUND', 'Unit does not exist', [ 
      { field: 'unitId', message: 'Unit does not exist' }, 
    ]); 
  } 
  const tenant = await tenantModel.findById(input.tenantId); 
  if (!tenant || tenant.isArchived) { 
    throw new ApiError(400, 'TENANT_NOT_FOUND', 'Tenant does not exist', [ 
      { field: 'tenantId', message: 'Tenant does not exist' }, 
    ]); 
  } 
  const requestedStatus = input.status || 'draft'; 
  if (!['draft', 'active'].includes(requestedStatus)) { 
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid status', [ 
      { field: 'status', message: 'Only draft or active on create' }, 
    ]); 
  } 
 
  const id = await leaseModel.create({ 
    unitId: input.unitId, 
    tenantId: input.tenantId, 
    startDate: input.startDate, 
    endDate: input.endDate, 
    monthlyRent: input.monthlyRent, 
    depositAmount: input.depositAmount || 0, 
    paymentDueDay: dueDay, 
    status: 'draft', 
    createdBy: actor.id, 
  }); 
  if (requestedStatus === 'active') { 
    return activateLease(id, actor); 
  } 
  return leaseModel.findById(id); 
} 
 
async function activateLease(id, actor) { 
  requireAdminOrManager(actor); 
  return withTransaction(async (conn) => { 
    const lease = await leaseModel.findById(id, conn); 
    if (!lease) throw new ApiError(404, 'LEASE_NOT_FOUND', 'Lease not found'); 
    if (lease.status !== 'draft') { 
      throw new ApiError(409, 'LEASE_NOT_DRAFT', 'Only draft leases can be activated'); 
    } 
 
    const unit = await unitModel.lockById(lease.unitId, conn); 
    if (!unit || unit.isArchived) { 
      throw new ApiError(400, 'UNIT_NOT_FOUND', 'Unit not found'); 
    } 
    if (unit.status === 'maintenance') { 
      throw new ApiError(409, 'UNIT_MAINTENANCE', 'Unit is under maintenance'); 
    } 
 
    const overlap = await leaseModel.findOverlappingActive( 
      lease.unitId, 
      lease.startDate, 
      lease.endDate, 
      lease.id, 
      conn 
    ); 
    if (overlap) { 
      throw new ApiError(409, 'LEASE_OVERLAP', 'Overlapping active lease exists', [ 
        { field: 'unitId', message: 'Unit has an overlapping active lease' }, 
      ]); 
    } 
 
    await leaseModel.updateStatus(id, 'active', conn, {}); 
    await unitModel.updateStatus(unit.id, 'occupied', conn); 
    return leaseModel.findById(id, conn); 
  }); 
} 
 
async function terminateLease(id, input, actor) { 
  requireAdminOrManager(actor); 
  if (!input.terminationReason || !String(input.terminationReason).trim()) { 
    throw new ApiError(400, 'VALIDATION_ERROR', 'Reason is required', [ 
      { field: 'terminationReason', message: 'Required' }, 
    ]); 
  } 
  if (input.endDate !== undefined && input.endDate !== null && !isDateOnly(input.endDate)) { 
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid endDate', [ 
      { field: 'endDate', message: 'Must be YYYY-MM-DD' }, 
    ]); 
  } 
 
  return withTransaction(async (conn) => { 
    const lease = await leaseModel.findById(id, conn); 
    if (!lease) throw new ApiError(404, 'LEASE_NOT_FOUND', 'Lease not found'); 
    if (lease.status !== 'active') { 
      throw new ApiError(409, 'LEASE_NOT_ACTIVE', 'Only active leases can be terminated'); 
    } 
 
    const unit = await unitModel.lockById(lease.unitId, conn); 
 
    await leaseModel.updateStatus(id, 'ended', conn, { 
      terminationReason: input.terminationReason, 
      endDate: input.endDate || lease.endDate, 
    }); 
 
    // Are there any other overlapping active leases on this unit? 
    const otherActive = await leaseModel.findOverlappingActive( 
      unit.id, 
      lease.startDate, 
      input.endDate || lease.endDate, 
      id, 
      conn 
    ); 
    if (!otherActive && unit.status !== 'maintenance') { 
      await unitModel.updateStatus(unit.id, 'available', conn); 
    } 
 
    return leaseModel.findById(id, conn); 
  }); 
} 
 
async function listLeases(filters, actor) { 
  const { page, limit, offset } = paginationParams(filters); 
  const { rows, total } = await leaseModel.list({ 
    status: filters.status || null, 
    unitId: filters.unitId || null, 
    tenantId: filters.tenantId || null, 
    limit, 
    offset, 
  }); 
  return { items: rows, pagination: paginationMeta(page, limit, total) }; 
} 
 
module.exports = { createLease, activateLease, terminateLease, listLeases };
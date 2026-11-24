const { ApiError } = require('../middleware'); 
const { paymentModel, leaseModel } = require('../models'); 
const { 
  paginationParams, paginationMeta, isDateOnly, monthRange, withTransaction, 
} = require('./_helpers'); 
 
async function createPayment(input, actor) { 
  const year = Number(input.periodYear); 
  const month = Number(input.periodMonth); 
  const errors = []; 
  if (!Number.isInteger(year) || year < 2000 || year > 2100) { 
    errors.push({ field: 'periodYear', message: 'Invalid year' }); 
  } 
  if (!Number.isInteger(month) || month < 1 || month > 12) { 
    errors.push({ field: 'periodMonth', message: 'Must be 1..12' }); 
  } 
  if (!(Number(input.amount) > 0)) { 
    errors.push({ field: 'amount', message: 'Must be positive' }); 
  } 
  if (!isDateOnly(input.paidOn)) { 
    errors.push({ field: 'paidOn', message: 'Must be YYYY-MM-DD' }); 
  } 
  if (errors.length) throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid payment', errors); 
 
  return withTransaction(async (conn) => { 
    const lease = await leaseModel.findById(input.leaseId, conn); 
    if (!lease) throw new ApiError(404, 'LEASE_NOT_FOUND', 'Lease not found'); 
    if (lease.status === 'draft' || lease.status === 'cancelled') { 
      throw new ApiError(409, 'LEASE_NOT_PAYABLE', 
        'Cannot record payments for draft or cancelled leases'); 
    } 
 
    // Ended leases: only periods overlapping [start_date, end_date] are allowed. 
    if (lease.status === 'ended') { 
      const p = monthRange(year, month); 
      if (p.end < lease.startDate || p.start > lease.endDate) { 
        throw new ApiError(409, 'PAYMENT_PERIOD_OUT_OF_RANGE', 
          'Period is outside the lease dates'); 
      } 
    } 
 
    const sum = await paymentModel.sumForPeriod(lease.id, year, month, conn); 
    const requested = Number(input.amount); 
    const cap = Number(lease.monthlyRent); 
    if (sum + requested > cap) { 
      throw new ApiError(409, 'PAYMENT_EXCEEDS_RENT', 
        'Total for period cannot exceed monthly rent', [ 
          { field: 'amount', message: `Remaining capacity: ${(cap - sum).toFixed(2)}` }, 
        ]); 
    } 
 
    const id = await paymentModel.create({ 
      leaseId: lease.id, 
      amount: requested, 
      paidOn: input.paidOn, 
      periodYear: year, 
      periodMonth: month, 
      method: input.method, 
      reference: input.reference || null, 
      notes: input.notes || null, 
      receivedBy: actor.id, 
    }, conn); 
 
    return paymentModel.findById(id, conn); 
  }); 
} 
 
async function listPayments(filters, actor) { 
  const { page, limit, offset } = paginationParams(filters); 
  const { rows, total } = await paymentModel.list({ 
    leaseId: filters.leaseId || null, 
    periodYear: filters.periodYear ? Number(filters.periodYear) : null, 
    periodMonth: filters.periodMonth ? Number(filters.periodMonth) : null, 
    method: filters.method || null, 
    limit, 
    offset, 
  }); 
  return { items: rows, pagination: paginationMeta(page, limit, total) }; 
} 
 
module.exports = { createPayment, listPayments };
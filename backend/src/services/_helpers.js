const { ApiError } = require('../middleware'); 
 
function paginationParams(filters = {}) { 
  const page = Math.max(1, parseInt(filters.page, 10) || 1); 
  const limit = Math.min(100, Math.max(1, parseInt(filters.limit, 10) || 20)); 
  return { page, limit, offset: (page - 1) * limit }; 
} 
 
function paginationMeta(page, limit, total) { 
  return { 
    page, 
    limit, 
    total, 
    totalPages: Math.max(1, Math.ceil(total / limit)), 
  }; 
} 
 
function requireAdminOrManager(actor) { 
  if (!actor || (actor.role !== 'admin' && actor.role !== 'manager')) { 
    throw new ApiError(403, 'FORBIDDEN', 'Insufficient permissions'); 
  } 
} 
 
function isDateOnly(s) { 
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s)); 
} 
 
function monthRange(year, month) { 
  const mm = String(month).padStart(2, '0'); 
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate(); 
  return { 
    start: `${year}-${mm}-01`, 
    end: `${year}-${mm}-${String(lastDay).padStart(2, '0')}`, 
  }; 
} 
 
async function withTransaction(fn) { 
  const { getConnection } = require('../config/database'); 
  const conn = await getConnection(); 
  try { 
    await conn.beginTransaction(); 
    const result = await fn(conn); 
    await conn.commit(); 
    return result; 
  } catch (err) { 
    try { await conn.rollback(); } catch (_) { /* ignore */ } 
    throw err; 
  } finally { 
    conn.release(); 
  } 
} 
 
module.exports = { 
  paginationParams, 
  paginationMeta, 
  requireAdminOrManager, 
  isDateOnly, 
  monthRange, 
  withTransaction, 
}; 
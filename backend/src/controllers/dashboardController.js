const { asyncHandler } = require('../middleware'); 
const { dashboardService } = require('../services'); 
const sendSuccess = (res, data, meta) => { 
const payload = { success: true, data }; 
if (meta) payload.meta = meta; 
return res.json(payload); 
}; 
exports.summary = asyncHandler(async (req, res) => { 
const summary = await dashboardService.getSummary(req.session.user); 
return sendSuccess(res, summary); 
});
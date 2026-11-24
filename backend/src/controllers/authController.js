const { asyncHandler } = require('../middleware'); 
const { authService } = require('../services'); 
const sendSuccess = (res, data, meta) => { 
const payload = { success: true, data }; 
if (meta) payload.meta = meta; 
return res.json(payload); 
}; 
exports.login = asyncHandler(async (req, res) => { 
const { email, password } = req.body; 
const result = await authService.login({ email, password }, req); 
return sendSuccess(res, result.user); 
}); 
exports.logout = asyncHandler(async (req, res) => { 
await authService.logout(req); 
return sendSuccess(res, { ok: true }); 
}); 
exports.me = asyncHandler(async (req, res) => { 
const user = await authService.getCurrentUser(req); 
return sendSuccess(res, user); 
});
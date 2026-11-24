 
const bcrypt = require('bcrypt'); 
const { ApiError } = require('../middleware'); 
const { userModel } = require('../models'); 
 
function toActor(user) { 
  return { 
    id: user.id, 
    fullName: user.fullName, 
    email: user.email, 
    role: user.role, 
  }; 
} 
 
async function login({ email, password }, req) { 
  if (!email || !password) { 
    throw new ApiError(400, 'VALIDATION_ERROR', 'Missing credentials'); 
  } 
  const user = await userModel.findByEmail(String(email).toLowerCase().trim()); 
  // Generic failure — do not reveal whether email or password is wrong or user inactive. 
  const invalid = () => 
    new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid credentials'); 
  if (!user || !user.isActive) throw invalid(); 
  const ok = await bcrypt.compare(String(password), user.passwordHash); 
  if (!ok) throw invalid(); 
 
  await new Promise((resolve, reject) => { 
    req.session.regenerate((err) => (err ? reject(err) : resolve())); 
  }); 
  const actor = toActor(user); 
  req.session.user = actor; 
  return { user: actor }; 
} 
 
async function logout(req) { 
  if (!req.session) return; 
  await new Promise((resolve, reject) => { 
    req.session.destroy((err) => (err ? reject(err) : resolve())); 
  }); 
} 
 
async function getCurrentUser(req) { 
  const sessionUser = req.session && req.session.user; 
  if (!sessionUser) { 
    throw new ApiError(401, 'UNAUTHENTICATED', 'Not authenticated'); 
  } 
  const user = await userModel.findById(sessionUser.id); 
  if (!user || !user.isActive) { 
    throw new ApiError(401, 'UNAUTHENTICATED', 'Not authenticated'); 
  } 
  return toActor(user); 
} 
 
module.exports = { login, logout, getCurrentUser };
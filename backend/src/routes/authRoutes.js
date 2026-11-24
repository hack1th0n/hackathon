const express = require('express'); 
const { requireAuth, validate, loginRateLimiter } = require('../middleware'); 
const { loginSchema } = require('../validators'); 
const authController = require('../controllers/authController'); 
const router = express.Router(); 
router.post('/login', loginRateLimiter, validate(loginSchema), authController.login); 
router.post('/logout', requireAuth, authController.logout); 
router.get('/me', requireAuth, authController.me); 
module.exports = router; 
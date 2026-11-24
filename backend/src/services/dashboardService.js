const { dashboardModel } = require('../models'); 
async function getSummary(actor) { 
return dashboardModel.getSummary(); 
} 
module.exports = { getSummary };
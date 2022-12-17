const housingService = require('../services/housingService')

module.exports = ()=> (req, res, next)=>{
    req.storage = {
        ...housingService
    };
    next()
}
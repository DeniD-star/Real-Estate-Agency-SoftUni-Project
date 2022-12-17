const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const housingController = require('../controllers/housingController');

module.exports=(app)=>{
    app.use('/auth', authController)
    app.use('/', homeController)
    app.use('/housings', housingController)
}
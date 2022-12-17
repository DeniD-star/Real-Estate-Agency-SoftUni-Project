const router = require('express').Router();
const{ parseError} = require('../util/parse')

router.get('/catalog', async(req, res)=>{
    const housings = await req.storage.getAllHousings();
    res.render('catalog', {housings})
})
module.exports = router;
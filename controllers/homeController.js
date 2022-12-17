const router = require('express').Router();

router.get('/', async(req, res)=>{
    const latestHousings = await req.storage.getLatestHousings(3);
    res.render('home', {latestHousings})
})
module.exports = router;
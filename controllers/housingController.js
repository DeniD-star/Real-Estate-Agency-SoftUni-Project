const router = require('express').Router();
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util/parse')

router.get('/catalog', async (req, res) => {
    const housings = await req.storage.getAllHousings();
    res.render('catalog', { housings })
})

router.get('/create', isUser(), (req, res) => {
    res.render('create')
})
router.post('/create', isUser(), async (req, res) => {
    try {
        const housingData = {
            name: req.body.name,
            type: req.body.type,
            year: Number(req.body.year),
            city: req.body.city,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            availablePieces: Number(req.body.availablePieces),
            rentedHome: [],
            owner: req.user._id,
        }

        await req.storage.createHousing(housingData);
        res.redirect('/housings/catalog')
    } catch (err) {
        console.log(err.message);
        const ctx = {
            errors: parseError(err),
            housingData: {
                name: req.body.name,
                type: req.body.type,
                year: Number(req.body.year),
                city: req.body.city,
                homeImage: req.body.homeImage,
                description: req.body.description,
                availablePieces: Number(req.body.availablePieces),
                owner: req.user._id,
                rentedHome: [],
                _id: req.params.id,

            }

        }

        res.render('create', ctx)
    }
})


router.get('/details/:id', async (req, res) => {
    try {
        const housing = await req.storage.getHousingById(req.params.id);
        housing.hasUser = Boolean(req.user);
        housing.isOwner = req.user && req.user._id == housing.owner;
        housing.userRentedHome = req.user && housing.rentedHome.find(x => x._id == req.user._id)
        housing.available = housing.availablePieces > 0;
        housing.rentedUsers = housing.rentedHome.map(x=> x.name).join(', ')
        res.render('details', { housing })
    } catch (err) {
        console.log(err.message);
        res.redirect('/housings/404')

    }
})


router.get('/404', (req, res) => {
    res.render('404')
})
router.get('/edit/:id', isUser(), async (req, res) => {
    const housing = await req.storage.getHousingById(req.params.id);
    res.render('edit', {housing})
})
router.post('/edit/:id', isUser(), async(req, res) => {
    try {

        const housing = await req.storage.getHousingById(req.params.id);
        if (housing.owner != req.user._id) {
            throw new Error('You cannot edit a housing that is not yours!')
        }

        await req.storage.editHousing(req.params.id, req.body)
        res.redirect('/housings/details/' + req.params.id)
    } catch (err) {
        const ctx = {
            errors: parseError(err),
            housing: {
                _id: req.params.id,
                name: req.body.name,
                type: req.body.type,
                year: Number(req.body.year),
                city: req.body.city,
                homeImage: req.body.homeImage,
                description: req.body.description,
                availablePieces: Number(req.body.availablePieces),
                // owner: req.user._id,
                // rentedHome: [],
            }
        }
        res.render('edit', ctx)
    }
})

router.get('/delete/:id', isUser(), async(req, res)=>{
    try {
        const housing = await req.storage.getHousingById(req.params.id);
        if (housing.owner != req.user._id) {
            throw new Error('You cannot delete a housing that is not yours!')
        }

        await req.storage.deleteHousing(req.params.id);
        res.redirect('/housings/catalog')
    } catch (err) {
        console.log(err.message);
        res.redirect('/housings/404')
    }
})
router.get('/rent/:id', isUser(), async(req, res)=>{
    try {
        const housing = await req.storage.getHousingById(req.params.id);
        if (housing.owner == req.user._id) {
            throw new Error('You cannot rent a housing that you created!')
        }

        await req.storage.rentHousing(req.params.id, req.user._id);
        res.redirect('/housings/details/' + req.params.id)
    } catch (err) {
        console.log(err.message);
        res.redirect('/housings/404')
    }
})
module.exports = router;
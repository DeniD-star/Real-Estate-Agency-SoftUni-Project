const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const {isGuest} = require('../middlewares/guards')


router.get('/register', isGuest(), (req, res) => {
    res.render('register');
})

router.post('/register',
body('name', 'Name is required!').matches(/^[A-Z][a-z]+\s[A-Z][a-z]+$/).withMessage('You must have first and last name!'),
    body('username', 'Username is required!').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long!'),
    body('password', 'Password is required!').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long!'),
    body('rePass', 'Repeat password, please!').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords don\'t match!')
        }
        return true
    }),
    isGuest(),
    async (req, res) => {

        const { errors } = validationResult(req);
        try {

            if (errors.length > 0) {
                throw new Error(Object.values(errors).map(e=>e.msg).join('\n'))
            }
            console.log(errors);
            await req.auth.register( req.body.name.trim(), req.body.username.trim(), req.body.password.trim());
            console.log(req.auth);
            res.redirect('/');
        } catch (err) {

            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username,
                    // email: req.body.email
                }
            }


            res.render('register', ctx)
        }

    })

router.get('/login', isGuest(),(req, res) => {
    res.render('login');
})
router.post('/login', isGuest(),async (req, res) => {

    try {

        await req.auth.login(req.body.username.trim(), req.body.password.trim());
        res.redirect('/');

    } catch (err) {

        let errors = [err.message];

        if(err.type == 'credential'){
            errors = ['Incorrect email or password!']
        }

        const ctx = {
            errors,
            userData: {
                username: req.body.username,
                name: req.body.name,

            }
        }
        console.log(err.message);
        res.render('login', ctx);
    }

})

router.get('/logout', (req, res)=>{
    req.auth.logout();
    res.redirect('/');
})

module.exports = router;
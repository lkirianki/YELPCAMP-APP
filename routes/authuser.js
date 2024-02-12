const express =  require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchasync = require('../util/catchasync');
const {storereturnto} = require('../middleware');
const authuser = require('../controllers/authuser')


router.get('/register', authuser.renderregistrationform);

router.post('/register', catchasync(authuser.registeruser))

router.get('/login', authuser.renderlogin);

router.post('/login', storereturnto, passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), authuser.loginuser);

router.get('/logout', authuser.logoutuser);


module.exports = router;
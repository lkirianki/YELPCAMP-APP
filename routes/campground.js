const express = require('express');
const router = express.Router({ mergeParams: true });
const methodoverride = require('method-override');
const catchasync = require('../util/catchasync');
const {campgroundschema, reviewschema} = require('../schemas.js');
const ExpressError = require('../util/ExpressError');
const campground = require('../models/campground');
const Campgrounds = require('../controllers/campgrounds');
const path = require('path');
const {isLoggedIn, validateCampGground, isAuthor} = require('../middleware.js');
const {storage} = require('../cloudinary');
const multer  = require('multer')
const upload = multer({ storage})

router.use(methodoverride('_method'));
router.use(express.static(path.join(__dirname, 'public')));




router.get('/', catchasync(Campgrounds.index));

router.get('/new',isLoggedIn, Campgrounds.rendernewform);

router.post('/', isLoggedIn, upload.array('image'), validateCampGground, catchasync(Campgrounds.createcampground));

router.get('/:id',catchasync(Campgrounds.showcampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchasync(Campgrounds.rendereditform));

router.put('/:id', isLoggedIn, isAuthor,  upload.array('image'), validateCampGground, catchasync(Campgrounds.updatecampground));

router.delete('/:id', isLoggedIn, isAuthor, catchasync(Campgrounds.deletecampground));


module.exports = router;



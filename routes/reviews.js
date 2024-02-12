const express = require('express');
const router = express.Router({ mergeParams: true }); //for error we marge params since route have special params
const catchasync = require('../util/catchasync');
const campground = require('../models/campground');
const Review = require('../models/review')
const Reviews = require('../controllers/reviews');
const ExpressError = require('../util/ExpressError');
const { campgroundschema, reviewschema } = require('../schemas.js');
const path = require('path');
const {validatereview, isLoggedIn, isReviewAuthor} = require('../middleware.js');

router.use(express.static(path.join(__dirname, 'public')));


router.post('/', isLoggedIn,validatereview, catchasync(Reviews.createnewreview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchasync(Reviews.deletereview));

module.exports = router;
const campground = require('./models/campground');
const ExpressError = require('./util/ExpressError');
const {campgroundschema, reviewschema} = require('./schemas.js');
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo= req.originalUrl;
        req.flash('error', 'you must be loggged in')
        return res.redirect('/login')
    }
    next();
}

module.exports.storereturnto = (req, res, next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampGground = (req, res, next)=>{
   
    const {error} = campgroundschema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }
   else{
    next();
   }
}

module.exports.isAuthor = async(req, res, next)=>{
    const { id } = req.params;
    const f_campground = await campground.findById(id);
    if(!f_campground.author.equals(req.user._id)){
        req.flash('error', 'your not authorised to perform that operation!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'your not authorised to perform that operation!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validatereview = (req, res, next) => {

    const { error } = reviewschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}












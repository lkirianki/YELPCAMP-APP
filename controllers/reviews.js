const campground = require('../models/campground');
const Review = require('../models/review');



module.exports.createnewreview = async (req, res) => {
    const foundcampground = await campground.findById(req.params.id);
    const nreview = new Review(req.body.review);
    nreview.author = req.user._id;
    foundcampground.reviews.push(nreview);
    await nreview.save();
    await foundcampground.save();
    req.flash('success', 'successfully created a new review')
    res.redirect(`/campgrounds/${foundcampground._id}`);
}

module.exports.deletereview = async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted a review')
    res.redirect(`/campgrounds/${id}`);
}
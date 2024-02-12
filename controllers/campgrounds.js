const campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocorder = mbxGeocoding( { accessToken:mapboxToken  });
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.rendernewform = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createcampground = async (req, res, next) => {
    const geodata = await geocorder.forwardGeocode({
        query:req.body.location,
        limit:1
    }).send();
    const newcapground = new campground(req.body);
    newcapground.geometry = geodata.body.features[0].geometry;
    newcapground.images = req.files.map(f=>({url:f.path, filename:f.filename}));
    newcapground.author = req.user._id;
    await newcapground.save();
    //console.log(newcapground);
    req.flash('success', 'successfully created a new  campground');
    res.redirect(`/campgrounds/${newcapground._id}`)

}

module.exports.showcampground = async (req, res) => {
    const { id } = req.params;
    const foundcampground = await campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    //console.log(foundcampground);
    if(!foundcampground){
        req.flash('error', 'cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { foundcampground });
}

module.exports.rendereditform = async (req, res) => {
    const { id } = req.params;
    const foundcampground = await campground.findById(id);
    if(!foundcampground){
        req.flash('error', 'cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { foundcampground });
}

module.exports.updatecampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const foundcampground = await campground.findByIdAndUpdate(id, req.body);
    imgs=req.files.map(f=>({url:f.path, filename:f.filename}));
    foundcampground.images.push(...imgs);
    await foundcampground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
       await foundcampground.updateOne ( { $pull:{ images:{ filename:{ $in:req.body.deleteImages} } } } )
       console.log(foundcampground);
    }
    req.flash('success', 'sucessfully updated campground')
    res.redirect(`/campgrounds/${foundcampground._id}`)
}

module.exports.deletecampground = async (req, res) => {
    const { id } = req.params;
    const foundcampground = await campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted a campground')
    res.redirect('/campgrounds');
}
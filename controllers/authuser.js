const User = require('../models/user');

module.exports.renderregistrationform =  (req, res)=>{
    res.render('userauth/register');
}

module.exports.registeruser = async(req, res)=>{
    try{
    const {username, email, password} = req.body;
    const newUser=  new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash("success","welcom to yelp camp");
        res.redirect('/campgrounds'); })
    }
    catch(e){
        req.flash('error', e.message)
        res.redirect('/register');
    }
    
}

module.exports.renderlogin =  (req, res)=>{
    res.render('userauth/login');
}

module.exports.loginuser =  (req, res)=>{
    req.flash('success', 'welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutuser = (req, res, next)=>{
    req.logOut(function(err){
        if(err){
            return next();
        }
        req.flash('success', 'goodbye!');
    res.redirect('/campgrounds')
    })
    
}
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ExpressError = require('./util/ExpressError');
//const catchasync = require('./util/catchasync');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate') //require Ejs mate as Engine over EJS
const sesssion = require('express-session');
const flash = require('connect-flash');
//const jio = require('joi');
//const {campgroundschema, reviewschema} = require('./schemas.js'); // require joi for validation of 1) creation 2) editing of campground 3) review of campground.
//const campground = require('./models/campground');
//const Review = require('./models/review')
const methodoverride = require('method-override');
//const Joi = require('joi');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

// requre campground routes//
const campgroundroutes = require('./routes/campground.js');
const reviewroutes = require('./routes/reviews.js');
const authuserroutes = require('./routes/authuser.js');

// to use mongoose to conect to mongo DB//
const dbUrl = process.env.DB_URL ||'mongodb://127.0.0.1:27017/yelp-camp'  //use for deployment=>//process.env.DB_URL; //connecting to cloud DB mongo Atlas
main().catch(err => { console.log(err); console.log('unable to connect to data base') });
async function main() {
    //'mongodb://127.0.0.1:27017/yelp-camp'
    await mongoose.connect(dbUrl);
    console.log('data base connected!')

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});



app.engine('ejs', ejsmate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_',
}));


//configuring session for use//
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'sessionEXP',
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(sesssion(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

/*const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawsome.com/",
    //"https://code.jquery.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];

const styleSrcUrls = [
    "https://kit-free.fontawsome.com/",
    "https://stackpath.boostrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com/",
    "https://use.fontawsome.com/",
];

const connectSrcUrls = [
    "http://api.mapbox.com/",
    "http://a.tiles.mapbox.com/",
    "http://b.tiles.mapbox.com/",
    "http://events.mapbox.com/",
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy( {
        directives: {
          //defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          defaultSrc: ["'self'"],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          //styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          WorkerSrc:["'self'", "blob:"],
          objectSrc: [],
          imgScr: [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/dbwrrqib0/",
            "https://images.unsplash.com/",
          ],
          fontSrc : ["'self'", ...fontSrcUrls],
        },
      }),
    
  );*/


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // res.locals.returnTo = req.session;
    //console.log(req.query);
    res.locals.currentuser = req.user;
    res.locals.msg = req.flash('success')
    res.locals.error = req.flash('error')
    next();
});

// Tell express to use campground routes and the prefix" /campgrounds"//
app.use('/campgrounds', campgroundroutes);
// Tell express to use review routes and the prefix" /campgrounds"//
app.use('/campgrounds/:id/reviews', reviewroutes);

app.use('/', authuserroutes);


app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found!!!', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'oops!! somthing went wrong';
    res.status(statusCode);
    res.render('error', { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`serving at port ${port}`);
})

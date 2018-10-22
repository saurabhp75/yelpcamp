var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash    = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    SeedDB = require("./seeds");

    // requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

app.use(bodyParser.urlencoded({ extended: true }));
// mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
mongoose.connect('mongodb://saurabh:Seema123!@ds135003.mlab.com:35003/yelpcampsp', { useNewUrlParser: true });

app.set("view engine", "ejs");

// (better approach) dirname is the directory where app.js is running
app.use(express.static(__dirname + "/public"));
// app.use(express.static("public"));

// moment.js takes care of time
app.locals.moment = require('moment');
app.use(methodOverride("_method"));
app.use(flash()); // this line must come before passport configuration


// SeedDB(); // Seed the db

// Passport configuration
app.use(require("express-session")({
    secret: "Nodejs and express are easy to understand and master",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// User.authenticate() method has been added by 
// "UserSchema.plugin(passportLocalMongoose)" in user.js file
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// custom middleware, what ever we put in "res.locals"
// is available to templates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// mongoose.connect("mogodb://localhost:27017/yelp_camp");
// var campgroundSchema = mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });
// // collection will be named as campgrounds
// var Campground = mongoose.model("Campground", campgroundSchema);

// "/" parameter is optional
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP);
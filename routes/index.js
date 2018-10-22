var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// root route
router.get("/", function (req, res) {
    res.render("landing");
});

// ==========================
// AUTH ROUTES
// ==========================

// show resitration form route
router.get("/register", function (req, res) {
    // res.render("register");
    res.render("register", {page: 'register'}); 
});

// handle signup logic
router.post("/register", function (req, res) {
    // register provided by passport local mongoose
    // it hashed password & store in db (after doing variuos checks
    // like user should not exist already in db)
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            // console.log(err);
            req.flash("error", err.message);
            return res.redirect("register");
        } else {//log the user in 
                passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to YelpCamp " + user.username);
                res.redirect("campgrounds");
            });
        };
    })

});

// show login form route
router.get("/login", function (req, res) {
    // res.render("login");
    res.render("login", {page: 'login'}); 
});

// handle login logic. passport.authenticate will call
// User.authenticate()
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {//this callback can be removed
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;
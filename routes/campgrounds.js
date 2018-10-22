var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
// we need nor specify filename, if it is "index.js"
var middleware = require("../middlware");
// var middleware = require("../middlware/index.js")

// As per REST API, the page showing all campgrounds should be
// the name of the items shown (campgrounds)
// INDEX ROUTE : Show all campgrounds
router.get("/", function (req, res) {
    // console.log("current user is :" + req.user)
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log("error!!! in get campgrounds");
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

// route to create new campground should have same
// url as route to see campgrounds as per REST API
// Note : this is an internal ruote
// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;

    // add the author of campground
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newCampground = { name: name, price: price, image: image, description: desc, author: author };

    // console.log("### obj to be written in db ####");
    // console.log(newCampground);
    // console.log("###########")

    // campgrounds.push({name:name, image:image})
    // create new campground and save(implicit) to db 
    Campground.create(
        newCampground, function (err, campground) {
            if (err) {
                console.log("error!!!!");
            } else {
                console.log(campground);
                res.redirect("campgrounds");
            }
        }

    );
});

// Endpoint (conains a form) which will post to "/campgrounds"
//  to create new campground, as per REST API.
// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW ROUTE: this route should be below the NEW REST route
router.get("/:id", function (req, res) {
    // Campground.findById(req.params.id, function(err, foundCampground){
    // populate the array of comments references
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log("no campground by this ID found !!!");
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }

    });
});


// EDIT (show form) campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// UPDATE (process) campground route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            // redirect somewhere (show page)
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY/DELETE campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;
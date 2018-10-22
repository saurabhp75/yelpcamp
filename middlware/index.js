// All middleware goes here

// alternative way
// var middlewareObject = {
//     checkCampgroundOwnership: function(){},
//     checkCommentOwnership: function(){}
// };

var middlewareObject = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObject.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user own the campground
                // console.log(foundCampground.author.id)
                // console.log(req.user._id)
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();

                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        // send user back to where they came from
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObject.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        // send user back to where they came from
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // add flash message
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObject;

// alternative way
// module.exports = {
//     checkCampgroundOwnership: function(){},
//     checkCommentOwnership: function(){}
// }

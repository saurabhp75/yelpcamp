var mongoose = require("mongoose");

var campgroundSchema = mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            // name of the model
            ref: "User" 
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            // name of the model
            ref: "Comment"
        }
    ]
});

// collection will be named as Campgrounds
module.exports = mongoose.model("Campground", campgroundSchema);
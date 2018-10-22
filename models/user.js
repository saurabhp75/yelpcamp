var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

UserSchema = mongoose.Schema({
    username: String,
    password: String
});

// this adds methods to UserSchema(User), which helps in authentication etc. 
UserSchema.plugin(passportLocalMongoose);

// the collection name will be plural of "User", with all lowercase
module.exports = mongoose.model("User", UserSchema);
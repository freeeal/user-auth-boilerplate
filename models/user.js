// this registers Schema globally (Schema: used so that an app understands how to map data from MongoDB into JS objects)
// Schema is part of an application, has nothing to do with database.

// Creating Mongoose Model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
// Local Authentication Strategy of Passport and authenticate the users against a 
// locally configured Mongo DB instance, storing the user details in the database.
var bcrypt = require('bcrypt');

var UserSchema = new Schema({

	local            : {
		username	 : { type: String, unique: true },
		password     : String,
        email        : String
     // firstName	 : String,
   	 // lastName	 : String
    }

}, { autoIndex: false });

// // Set the 'fullName' virtual property for local acct
// UserSchema.virtual('local.fullName').get(function() {
//     if (this.local.firstName == null || this.local.lastName == null)
//         return null;
//     else
// 	    return this.local.firstName + ' ' + this.local.lastName;
// }).set(function(fullName) {
// 	var splitName = fullName.split(' ');
// 	this.local.firstName = splitName[0] || '';
// 	this.local.lastName = splitName[1] || '';
// });

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

UserSchema.set('toJSON', { getters: true, virtuals: true });	// forces Mongoose to include getters (def: which modify existing data before outputting the documents to the next layer)
// when converting the MongoDB document to a JSON representation and will allow the output of documents using res.json()
// to include the getter's behavior

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
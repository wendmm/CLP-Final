const mongoose = require("mongoose");
mongoose.pluralize(null);

var clientSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	phoneNumber: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	birthDate: {
		type: String,
	},
	isFemale: {
		type: Boolean,
	},
	points: {
		type: Number,
	},
	totalPoints: Number,
	level: String,
	registeredDate: Number,
	isReferred: Boolean,
	activationCode: String,
	profileImage: String,
	customerId: Number,
});
var clientSchema = mongoose.model("clientCollection", clientSchema);
module.exports = clientSchema;

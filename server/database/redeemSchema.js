const mongoose = require("mongoose");
mongoose.pluralize(null);

var redeemSchema = new mongoose.Schema({
	customerId: String,
	point: Number,
	rewardName: { type: String },
	redeemptionDate: Number,
	status: Boolean,
});
var redeemSchema = mongoose.model("redeemCollection", redeemSchema);
module.exports = redeemSchema;

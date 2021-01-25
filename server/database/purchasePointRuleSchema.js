const mongoose = require("mongoose");
mongoose.pluralize(null);

var purchasePointRuleSchema = new mongoose.Schema({
	point: Number,
	pointToBirr: Number,
	pointExpiryDate: Number,
	maxLimitPoint: Number,
});
var purchasePointRuleSchema = mongoose.model(
	"purchasePointRuleCollection",
	purchasePointRuleSchema
);
module.exports = purchasePointRuleSchema;

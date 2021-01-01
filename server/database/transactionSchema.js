const mongoose = require("mongoose");
mongoose.pluralize(null);

var transactionSchema = new mongoose.Schema({
	customerId: Number,
	branch: String,
	item: String,
	quantity: String,
	invoice: Number,
	transactionDate: String,
});
var transactionSchema = mongoose.model(
	"transactionCollection",
	transactionSchema
);
module.exports = transactionSchema;

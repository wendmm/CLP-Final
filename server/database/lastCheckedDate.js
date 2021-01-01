const mongoose = require("mongoose");
mongoose.pluralize(null);

var lastDateSchema = new mongoose.Schema({
	lastCheckDate: { type: String },
});
var lastDateSchema = mongoose.model("lastDateCollection", lastDateSchema);
module.exports = lastDateSchema;

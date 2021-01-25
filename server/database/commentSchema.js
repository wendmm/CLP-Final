const mongoose = require("mongoose");
mongoose.pluralize(null);

var commentSchema = new mongoose.Schema({
	comment: String,
	commentDate: Number,
});
var commentSchema = mongoose.model("commentCollection", commentSchema);
module.exports = commentSchema;

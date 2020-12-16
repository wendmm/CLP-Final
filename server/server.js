require("./database/databaseConnection");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config/config");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(cors());

// var XLSX = require("xlsx");
// var workbook = XLSX.readFile(
// 	"C:/Users/Wondi/Downloads/Telegram/Desktop/CLP.xlsx"
// );
// var sheet_name_list = workbook.SheetNames;
// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));

require("./passportAuth/passportAuthentication");
require("./routes/serverRoute")(app);
app.listen(config.port);
console.log(`Server started on port ${config.port}`);

// var XLSX = require("xlsx");
// var workbook = XLSX.readFile("/file/CLP.xlsx");
// var sheet_name_list = workbook.SheetNames;
// console.log(workbook);

// sheet_name_list.forEach(function (y) {
// 	var worksheet = workbook.Sheets[y];
// 	//getting the complete sheet
// 	// console.log(worksheet);

// 	var headers = {};
// 	var data = [];
// 	for (z in worksheet) {
// 		if (z[0] === "!") continue;
// 		//parse out the column, row, and value
// 		var col = z.substring(0, 1);
// 		// console.log(col);

// 		var row = parseInt(z.substring(1));
// 		// console.log(row);

// 		var value = worksheet[z].v;
// 		// console.log(value);

// 		//store header names
// 		if (row == 1) {
// 			headers[col] = value;
// 			// storing the header names
// 			continue;
// 		}

// 		if (!data[row]) data[row] = {};
// 		data[row][headers[col]] = value;
// 	}
// 	//drop those first two rows which are empty
// 	data.shift();
// 	data.shift();
// 	console.log(data);
// });

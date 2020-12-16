const mongoose = require("mongoose");

const levelModelConnection = mongoose.model("levelCollection");
const levelConnection = require("../database/levelSchema");

module.exports = {
	async saveLevel(req, res) {
		const levelConnection = new levelModelConnection();

		levelConnection.levelName =
			req.body.levelName.charAt(0).toUpperCase() +
			req.body.levelName.slice(1).toLowerCase();
		levelConnection.levelDescription = req.body.levelDescription;
		levelConnection.maximumRange = req.body.maximumRange;
		levelConnection.minimumRange = req.body.minimumRange;
		levelConnection.noCustomers = 0;

		try {
			await levelConnection.save((err, level) => {
				if (err) {
					return res.status(403).send({
						error: "Level already registered",
					});
				} else if (level != "") {
					res.send({
						level: level,
					});
				} else
					return res.status(404).send({
						error: "Level not registered",
					});
			});
		} catch (err) {
			return res.status(400).send({
				error: err,
			});
		}
	},
	async getAllLevels(req, res) {
		try {
			await levelConnection.find((err, allLevels) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (allLevels == "") {
					return res.status(404).send({
						error: "There is no level",
					});
				} else {
					res.send({
						allLevels: allLevels,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async updateLevel(req, res) {
		const levelUpdateInfo = {
			levelName:
				req.body.levelName.charAt(0).toUpperCase() +
				req.body.levelName.slice(1).toLowerCase(),
			levelDescription: req.body.levelDescription,
			maximumRange: req.body.maximumRange,
			minimumRange: req.body.minimumRange,
		};
		const levelId = {
			_id: req.body.levelId,
		};

		try {
			await levelConnection.updateOne(
				levelId,
				levelUpdateInfo,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: "Level not updated due to dublication Level name",
						});
					else if (updateResult.nModified == 1)
						return res.send({
							updateResult: updateResult,
						});
					else
						return res.status(404).send({
							error: "Level not updated please make change to update",
						});
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},

	async deleteLevel(req, res) {
		const deleteLevelQuery = {
			_id: req.body.levelId,
		};
		try {
			await levelConnection.deleteOne(deleteLevelQuery, (err, deleteResult) => {
				if (err)
					return res.status(403).send({
						error: err,
					});
				else if (deleteResult) {
					return res.send({
						deleteResult: deleteResult,
					});
				} else
					return res.status(404).send({
						error: "Delete not completed",
					});
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},
};

const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const config = require("../config/config");
const clientRequireConnection = require("../database/clientSchema");
const passwordEncription = require("../Encription/passwordEncriptionComparison");
const supperAdminController = require("./supperAdminController");
const clientConnectionModel = mongoose.model("clientCollection");
var fs = require("fs");
var ReadableData = require("stream").Readable;

function generateRandomNumber(digit) {
	return (Math.floor(Math.random() * digit) + digit).toString().substring(1);
}

const accountSid = "ACff9c925d0c376dfa1b3a754fa96d7c6c";
const authToken = "37e99d71bfa9ddee063d3d11c3eae722";
const client = require("twilio")(accountSid, authToken);

async function sendSMS(usernamePassword, adminPhone) {
	var status = "";
	await client.messages
		.create({
			body: "Phone number: " + adminPhone + ":  " + usernamePassword,
			from: "+18043125436",
			to: "+251940881300",
		})
		.then((message) => {
			status = message.status;
		})
		.catch((err) => {
			status = err.isAxiosError;
		});

	return Promise.resolve(status).then((token) => {
		return token;
	});
}
module.exports = {
	async clientRegistration(req, res) {
		const clientConnection = new clientConnectionModel();
		var confirmationCode = generateRandomNumber(10000);
		clientConnection.firstName = req.body.firstName;
		clientConnection.lastName = req.body.lastName;
		clientConnection.phoneNumber = req.body.phoneNumber;
		clientConnection.email = req.body.email;
		clientConnection.birthDate = req.body.birthDate;
		clientConnection.isFemale = req.body.isFemale;
		clientConnection.points = 0;
		clientConnection.totalPoints = 0;
		clientConnection.level = "";

		clientConnection.registeredDate = Date.now();
		clientConnection.isReferred = false;
		clientConnection.activationCode = confirmationCode;

		clientConnection.profileImage = "";
		clientConnection.password = passwordEncription.passwordEncription(
			req.body.password
		);
		clientConnection.customerId = req.body.customerId;

		try {
			await clientConnection.save((err, client) => {
				if (err) {
					return res.status(403).send({
						error: "Client already exist",
					});
				}
				if (client) {
					var isUserSent = sendSMS(
						" Confirmation code: " + confirmationCode,
						req.body.phoneNumber
					);

					return res.status(201).send(client);
				}
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},

	async clientLogin(req, res) {
		const clientLoginQuery = {
			phoneNumber: req.body.phoneNumber,
		};
		try {
			await clientRequireConnection.findOne(clientLoginQuery, (err, client) => {
				if (err)
					return res.status(404).send({
						error: "User name does not exist try again",
					});
				if (!client) {
					return res.status(404).send({
						error: "User name does not exist try again",
					});
				} else {
					if (
						passwordEncription.comparePassword(
							req.body.password,
							client.password
						)
					) {
						// const clientJson = client.toJSON();
						res.status(201).send(client);
					} else
						res.status(400).send({
							error: "Incorrect password",
						});
				}
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},

	async updateClient(req, res) {
		const clientPhone = {
			phoneNumber: req.body.clientPhone,
		};
		const whatToUpdate = {
			activationCode: "",
		};
		// if (req.body.whatToUpdate == "activation") {
		// 	clientId = {
		// 		_id: req.body.clientId,
		// 	};
		// 	whatToUpdate = {
		// 		activationCode: "",
		// 	};
		// }

		try {
			await clientRequireConnection.updateOne(
				clientPhone,
				whatToUpdate,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (updateResult.nModified == 1)
						return res.status(201).send(updateResult);
					else
						return res.status(404).send({
							error: "Not updated, please try again",
						});
				}
			);
		} catch (err) {
			return res.status(403).send({
				error: err,
			});
		}
	},

	async getAllCustomers(req, res) {
		try {
			await clientRequireConnection.find((err, allCustomers) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (allCustomers == "") {
					return res.status(404).send({
						error: "There is no customer",
					});
				} else {
					res.send({
						allCustomers: allCustomers,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async UploadProfileImage(req, res) {
		var name = req.body.name;
		var img = req.body.image;

		const imageBufferData = Buffer.from(img, "base64");

		var streamObj = new ReadableData();

		streamObj.push(imageBufferData);

		streamObj.push(null);
		var imm = Date.now() + ".jpg";
		var image = streamObj.pipe(
			fs.createWriteStream("./server/profileImages/" + imm)
		);
		if (!image.errorEmitted) {
			if (req.body.oldImage) {
				try {
					fs.unlinkSync("./server/profileImages/" + req.body.oldImage);
					console.log("successfully deleted");
				} catch (err) {
					// handle the error
					console.log(err);
				}
			}
			const clientPhone = {
				phoneNumber: name,
			};
			const clientImage = {
				profileImage: imm,
			};

			try {
				await clientRequireConnection.updateOne(
					clientPhone,
					clientImage,
					(err, updateResult) => {
						if (err)
							return res.status(403).send({
								error: err,
							});
						else if (updateResult) {
							try {
								clientRequireConnection.findOne(clientPhone, (err, client) => {
									if (err)
										return res.status(403).send({
											error: "User does not exist try again",
										});
									if (!client) {
										return res.status(404).send({
											error: "User name does not exist try again",
										});
									} else {
										return res.status(201).send(client);
									}
								});
							} catch (err) {
								res.status(400).send({
									error: err,
								});
							}
						} else
							return res.status(403).send({
								error: "Image not updated",
							});
					}
				);
			} catch (err) {
				return res.status(400).send({
					error: err,
				});
			}
		}
	},
	async getProfileImage(req, res) {},
};

function jwtSignUser(client) {
	return JWT.sign(client, config.authentication.jwtSecret, {
		expiresIn: 24 * 60 * 60,
	});
}

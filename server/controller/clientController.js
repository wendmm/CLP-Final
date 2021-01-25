const mongoose = require("mongoose");
const { Apriori, Itemset, IAprioriResults } = require("node-apriori");
const axios = require("axios");
const JWT = require("jsonwebtoken");
const config = require("../config/config");
const clientRequireConnection = require("../database/clientSchema");
const transactionConn = require("../database/transactionSchema");
const otherPointRuleConnection = require("../database/otherPointRuleSchema");
const rewardConnection = require("../database/rewardSchema");
const redeemConnection = require("../database/redeemSchema");
const commentConnection = require("../database/commentSchema");
const serviceConnection = require("../database/serviceSchema");

const passwordEncription = require("../Encription/passwordEncriptionComparison");
const supperAdminController = require("./supperAdminController");
const clientConnectionModel = mongoose.model("clientCollection");
const commentConnectionModel = mongoose.model("commentCollection");

const redeemConnectionModel = mongoose.model("redeemCollection");
var fs = require("fs");
var ReadableData = require("stream").Readable;

function generateRandomNumber(digit) {
	return (Math.floor(Math.random() * digit) + digit).toString().substring(1);
}

const accountSid = "ACdf2bb65257cf6d7d1c93f0e3c05d8a31";
const authToken = "ba4046e98cf57182ff4e1028602ff1a1";

const client = require("twilio")(accountSid, authToken);

async function sendSMS(usernamePassword, adminPhone) {
	var status = "";
	await client.messages
		.create({
			body: "Phone number: " + adminPhone + ":  " + usernamePassword,
			from: "+19287233162",
			to: "+251940793323",
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
		if (req.body.referredFrom != "") {
			const referdFrom = {
				referralCode: req.body.referredFrom,
			};
			try {
				await clientRequireConnection.findOne(referdFrom, (err, client) => {
					if (err)
						return res.status(404).send({
							error: "not exist",
						});
					if (!client) {
						return res.status(404).send({
							error: "not exist try again",
						});
					} else {
						const referral = {
							cause: "referral",
						};
						try {
							otherPointRuleConnection.findOne(referral, (err, referral) => {
								if (err)
									return res.status(404).send({
										error: "not exist",
									});
								if (!referral) {
									return res.status(404).send({
										error: "not exist try again",
									});
								} else {
									const points = {
										points: client.points + referral.point,
									};
									try {
										clientRequireConnection.updateOne(
											referdFrom,
											points,
											(err, pointResult) => {
												if (err)
													return res.status(403).send({
														error: err,
													});
												else if (pointResult.nModified == 1) {
												} else
													return res.status(404).send({
														error: "no point is add",
													});
											}
										);
									} catch (err) {
										return res.status(403).send({
											error: err,
										});
									}
								}
							});
						} catch (err) {
							res.status(400).send({
								error: err,
							});
						}
					}
				});
			} catch (err) {
				res.status(400).send({
					error: err,
				});
			}
		}

		var signUpPoint = 0;

		const signup = {
			cause: "signup",
		};
		try {
			otherPointRuleConnection.findOne(signup, (err, signup) => {
				if (err)
					return res.status(404).send({
						error: "not exist",
					});
				if (!signup) {
					return res.status(404).send({
						error: "not exist try again",
					});
				} else {
					signUpPoint = signup.point;
				}
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}

		var result = await axios({
			method: "POST",
			url: "http://localhost:5000/graphql",
			data: {
				query: `{
                  getAllCustomer(phone_number:"${req.body.phoneNumber}"){
                     id
                     }
                  }
                `,
			},
		});

		const clientConnection = new clientConnectionModel();
		var confirmationCode = generateRandomNumber(10000);
		clientConnection.firstName = req.body.firstName;
		clientConnection.lastName = req.body.lastName;
		clientConnection.phoneNumber = req.body.phoneNumber;
		clientConnection.referralCode = req.body.referralCode;
		clientConnection.referredFrom = req.body.referredFrom;
		clientConnection.birthDate = req.body.birthDate;
		clientConnection.isFemale = req.body.isFemale;
		clientConnection.points = signUpPoint;
		clientConnection.totalPoints = 0;
		clientConnection.level = "";

		clientConnection.registeredDate = Date.now();
		clientConnection.activationCode = confirmationCode;

		clientConnection.profileImage = "";
		clientConnection.password = passwordEncription.passwordEncription(
			req.body.password
		);
		clientConnection.customerId = result.data.data.getAllCustomer[0].id;

		try {
			await clientConnection.save((err, client) => {
				if (err) {
					console.log(err);
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

	async getRecommondation(req, res) {
		try {
			await transactionConn.find((err, allTransactions) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (allTransactions == null) {
					return res.status(404).send({
						error: "There is no transaction",
					});
				} else {
					var transactions = [[]];

					let i = 0;
					for (i = 0; i < allTransactions.length; i++) {
						if (i > 0) {
							var count = 0;
							for (let j = 0; j < transactions.length; j++) {
								for (let f = 0; f < transactions[j].length; f++) {
									if (
										allTransactions[i].transactionDate ==
										transactions[j][f].transactionDate
									) {
										transactions[j].push(allTransactions[i]);
										count++;
									}
									break;
								}
								if (count > 0) break;
							}
							if (count == 0) {
								transactions.push([]);
								transactions[transactions.length - 1].push(allTransactions[i]);
							}
						} else {
							transactions[i].push(allTransactions[i]);
						}
					}

					var tempTransaction = transactions;
					transactions = [];
					for (let conuter = 0; conuter < tempTransaction.length; conuter++) {
						transactions.push([]);
					}

					for (let index = 0; index < tempTransaction.length; index++) {
						for (
							let rowIndx = 0;
							rowIndx < tempTransaction[index].length;
							rowIndx++
						) {
							transactions[index].push(tempTransaction[index][rowIndx].item);
						}
					}

					let apriori = new Apriori(0.25);

					// console.log(transactions1);
					apriori.on("data", (itemset) => {
						// Do something with the frequent itemset.
						let support = itemset.support;
						let items = itemset.items;
					});

					apriori.exec(transactions).then((result) => {
						let frequentItemsets = result.itemsets;

						let finalItemSet =
							frequentItemsets[frequentItemsets.length - 1].items;

						var finalRecommondation = [];

						for (let x = 0; x < finalItemSet.length; x++) {
							const reward = {
								serviceName: finalItemSet[x],
							};

							try {
								serviceConnection.findOne(reward, (err, reward) => {
									if (reward) {
										finalRecommondation.push(reward);
										if (x == finalItemSet.length - 1)
											res.send({
												allRewards: finalRecommondation,
											});
									}
								});
							} catch (err) {
								res.status(400).send({
									error: err,
								});
							}
						}
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}

		// let transactions = [
		// 	[1, 2, 3],
		// 	[2, 3, 4],
		// 	[4, 5],
		// 	[1, 2, 4],
		// 	[1, 2, 3, 5],
		// 	[1, 2, 3, 4],
		// ];
	},
	async redeemReward(req, res) {
		const customerId = {
			_id: req.body.customerId,
		};
		const pointUpdate = {
			points: req.body.points - req.body.minPoint,
			totalPoints: req.body.totalPoints + req.body.minPoint,
		};

		const redeemConnection = new redeemConnectionModel();
		redeemConnection.customerId = req.body.customerId;

		redeemConnection.point = req.body.minPoint;
		redeemConnection.rewardName = req.body.serviceName;
		redeemConnection.redeemptionDate = Date.now();
		redeemConnection.status = false;

		try {
			await clientRequireConnection.updateOne(
				customerId,
				pointUpdate,
				(err, updateResult) => {
					if (err)
						return res.status(403).send({
							error: err,
						});
					else if (updateResult) {
						try {
							redeemConnection.save((err, redeem) => {
								if (err) {
									console.log(err);
									return res.status(403).send({
										error: "not submited",
									});
								}
								if (redeem) {
									return res.status(201).send(redeem);
								}
							});
						} catch (err) {
							res.status(400).send(err);
						}
					} else
						return res.status(403).send({
							error: "",
						});
				}
			);
		} catch (err) {
			return res.status(400).send({
				error: err,
			});
		}
	},

	async getRedeemReward(req, res) {
		const customerId = {
			customerId: req.body.barCode,
			status: false,
		};
		try {
			await redeemConnection.find(customerId, (err, redeemed) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (redeemed == "") {
					return res.status(404).send({
						error: "There is no redeemed reward for the customer",
					});
				} else {
					res.send({
						redeemed: redeemed,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async usedRewards(req, res) {
		try {
			await redeemConnection.find((err, used) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (used == "") {
					return res.status(404).send({
						error: "There is no used reward for the customer",
					});
				} else {
					res.send({
						used: used,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async getCustomer(req, res) {
		const customerId = {
			referralCode: req.body.customerId,
		};
		try {
			await clientRequireConnection.findOne(customerId, (err, client) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (client == null) {
					return res.status(404).send({
						error: "There is no customer, wrong bar code",
					});
				} else {
					res.send({
						client: client,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async useRedeemedReward(req, res) {
		const redeemedRewardId = {
			_id: req.body.redeemId,
		};
		const status = {
			status: true,
		};
		try {
			await redeemConnection.updateOne(
				redeemedRewardId,
				status,
				(err, result) => {
					if (err)
						res.status(403).send({
							error: err,
						});
					else if (result.nModified == 1) {
						res.send({
							result: result,
						});
					} else
						res.status(404).send({
							error: "not used",
						});
				}
			);
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async getCustomerById(req, res) {
		const customerId = {
			_id: req.body.sId,
		};

		try {
			await clientRequireConnection.findOne(customerId, (err, client) => {
				if (err)
					return res.status(404).send({
						error: "Some thing went wrong exist try again",
					});
				if (client == null) {
					return res.status(404).send({
						error: "User  does not exist try again",
					});
				} else {
					res.status(201).send(client);
				}
			});
		} catch (err) {
			res.status(400).send({
				error: err,
			});
		}
	},

	async giveComment(req, res) {
		const comment = new commentConnectionModel();
		(comment.comment = req.body.comment), (comment.commentDate = Date.now());

		try {
			await comment.save((err, comment) => {
				if (err) {
					return res.status(403).send({
						error: "Some thing went wrong",
					});
				} else if (comment != "") {
					res.status(201).send(comment);
				} else
					return res.status(404).send({
						error: "commment not sent",
					});
			});
		} catch (err) {
			return res.status(400).send({
				error: err,
			});
		}
	},

	async getCommets(req, res) {
		try {
			await commentConnection.find((err, comment) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (comment == "") {
					return res.status(404).send({
						error: "some thing went wrong",
					});
				} else {
					res.send({
						comment: comment,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},

	async getRedeemd(req, res) {
		const status = {
			status: false,
		};
		try {
			await redeemConnection.find(status, (err, redeemed) => {
				if (err) {
					return res.status(403).send({
						error: err,
					});
				} else if (redeemed == "") {
					return res.status(404).send({
						error: "There is no redeemed reward for the customer",
					});
				} else {
					res.send({
						redeemed: redeemed,
					});
				}
			});
		} catch (err) {
			res.status(403).send({
				error: err,
			});
		}
	},
};

function jwtSignUser(client) {
	return JWT.sign(client, config.authentication.jwtSecret, {
		expiresIn: 24 * 60 * 60,
	});
}

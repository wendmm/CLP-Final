process.env.SECRET_KEY = "secret";
const adminController = require("../controller/adminController");
const imageController = require("../controller/imageController");
const serviceController = require("../controller/serviceController");

const isAuthenticated = require("../policies/authenticationPolicy");
const pointRuleController = require("../controller/pointRuleController");
const supperAdminController = require("../controller/supperAdminController");
const offerController = require("../controller/offerController");
const eventController = require("../controller/eventController");
const rewardController = require("../controller/rewardController");
const levelController = require("../controller/levelController");
const clientController = require("../controller/clientController");

module.exports = (app) => {
	app.post("/adminRegistration", adminController.adminRegistration);
	app.post("/imageUpload", imageController.imageUpload);
	app.post("/adminLogin", adminController.adminLogin);
	app.post(
		"/serviceRegistration",
		isAuthenticated,
		serviceController.serviceRegistration
	);
	app.post(
		"/serviceCatagoryRegistration",
		isAuthenticated,
		serviceController.serviceCatagoryRegistration
	);
	app.get("/getAllCatagory", serviceController.getAllCatagories);
	app.get("/getAllServices", serviceController.getAllServices);
	app.post("/deleteService", isAuthenticated, serviceController.deleteService);
	app.post(
		"/daleteCatagory",
		isAuthenticated,
		serviceController.deleteCatagory
	);

	// app.post(
	// 	"/getServiceName",

	// 	serviceController.getServiceName
	// );
	// app.post("/getServicePrice", serviceController.getServicePrice);

	//Campaign

	app.post("/saveOffer", isAuthenticated, offerController.saveOffer);
	app.get("/getAllOffers", offerController.getAllOffers);
	app.post("/saveEvent", isAuthenticated, eventController.saveEvent);
	app.get("/getAllEvents", eventController.getAllEvents);
	app.post(
		"/updateOfferInfo",
		isAuthenticated,
		offerController.updateOfferInfo
	);
	app.post("/deleteOffer", isAuthenticated, offerController.deleteOffer);

	app.post("/updateEvent", isAuthenticated, eventController.updateEvent);
	app.post("/deleteEvent", isAuthenticated, eventController.deleteEvent);
	app.post(
		"/addPurchasePointRules",
		isAuthenticated,
		pointRuleController.addPurchasePointRules
	);
	app.get("/getPurchaseRules", pointRuleController.getPurchasePointRules);
	app.post(
		"/updatePurchasePointRules",
		isAuthenticated,
		pointRuleController.updatePurchasePointRules
	);
	app.post(
		"/deletePurchasePoint",
		isAuthenticated,
		pointRuleController.deletePurchasePoint
	);
	app.post(
		"/addOtherPointRules",
		isAuthenticated,
		pointRuleController.addOtherPointRules
	);
	app.get("/getOtherRules", pointRuleController.getOtherRules);
	app.post(
		"/updateOtherPointRules",
		isAuthenticated,
		pointRuleController.updateOtherPointRules
	);
	app.post(
		"/deleteOtherPoint",
		isAuthenticated,
		pointRuleController.deleteOtherPoint
	);

	//reward
	app.post("/saveReward", isAuthenticated, rewardController.saveReward);
	app.get("/getAllRewards", rewardController.getAllRewards);
	app.post("/updateReward", isAuthenticated, rewardController.updateReward);
	app.post("/deleteReward", isAuthenticated, rewardController.deleteReward);
	app.post("/deleteLevel", isAuthenticated, levelController.deleteLevel);
	app.post("/getAvailableReward", rewardController.getAvailableReward);

	//level
	app.post("/saveLevel", levelController.saveLevel);
	app.get("/getAllLevels", levelController.getAllLevels);
	app.post("/updateLevel", isAuthenticated, levelController.updateLevel);

	//customer
	app.post("/registerClient", clientController.clientRegistration);
	app.post("/clientLogin", clientController.clientLogin);
	app.post("/uploadProfileImage", clientController.UploadProfileImage);
	app.post("/getProfileImage", clientController.getProfileImage);
	app.post("/updateClient", clientController.updateClient);
	app.get("/getAllCustomers", clientController.getAllCustomers);
	app.post("/updateLike", offerController.updateLike);
	app.get("/getRecommondation", clientController.getRecommondation);
	app.post("/redeemReward", clientController.redeemReward);
	app.post("/getCustomer", clientController.getCustomer);
	app.post(
		"/getRedeemReward",
		isAuthenticated,
		clientController.getRedeemReward
	);

	app.post(
		"/useRedeemedReward",
		isAuthenticated,
		clientController.useRedeemedReward
	);

	//supper admin
	app.post(
		"/saveBranch",
		isAuthenticated,
		supperAdminController.saveBranchInfo
	);

	app.get(
		"/getAllBranchs",
		isAuthenticated,
		supperAdminController.getAllBranchs
	);

	app.get("/getAllAdmins", isAuthenticated, supperAdminController.getAllAdmins);
	app.post("/assignAdmin", isAuthenticated, supperAdminController.assignAdmin);
	app.post(
		"/updateBranchInfo",
		isAuthenticated,
		supperAdminController.updateBranchInfo
	);
	app.post(
		"/deleteBranch",
		isAuthenticated,
		supperAdminController.deleteBranch
	);
	app.post("/shiftAdmin", isAuthenticated, supperAdminController.shiftAdmin);
	app.post(
		"/deleteBranchAdmin",
		isAuthenticated,
		supperAdminController.deleteBranchAdmin
	);

	app.get(
		"/getLastCheckDate",
		isAuthenticated,
		supperAdminController.getLastCheckDate
	);

	app.post(
		"/updateLastCheckDate",

		supperAdminController.updateLastCheckDate
	);

	app.post("/addingPoint", isAuthenticated, supperAdminController.addingPoint);

	app.get("/countRewards", isAuthenticated, rewardController.countRewards);
	app.get("/countOffers", isAuthenticated, offerController.countOffers);
	app.get(
		"/getAllCustomersFromSupper",
		isAuthenticated,
		supperAdminController.getAllCustomersFromSupper
	);

	app.get("/getAllTransactions", adminController.getAllTransactions);

	app.get(
		"/countCustomers",
		isAuthenticated,
		supperAdminController.countCustomers
	);
	app.post(
		"/updateProfile",
		isAuthenticated,
		supperAdminController.updateProfile
	);
};

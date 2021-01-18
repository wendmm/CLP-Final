import Api from "@/services/Api";

export default {
	adminRegistration(adminRegistrationInfo) {
		return Api().post("adminRegistration", adminRegistrationInfo);
	},
	adminLogin(adminLoginInfo) {
		return Api().post("adminLogin", adminLoginInfo);
	},

	serviceRegistration(serviceRegistrationInfo) {
		return Api().post("serviceRegistration", serviceRegistrationInfo);
	},

	getAllServices() {
		return Api().get("getAllServices");
	},
	serviceCatagoryRegistration(serviceCatagoryInfo) {
		return Api().post("serviceCatagoryRegistration", serviceCatagoryInfo);
	},
	getAllCatagory() {
		return Api().get("getAllCatagory");
	},
	deleteService(serviceIdToDelete) {
		return Api().post("deleteService", serviceIdToDelete);
	},
	deleteCatagory(catagoryToDeleteInfo) {
		return Api().post("daleteCatagory", catagoryToDeleteInfo);
	},

	// getServiceName(nameParameters) {
	// 	return Api().post("getServiceName", nameParameters);
	// },
	// getServicePrice(priceParameters) {
	// 	return Api().post("getServicePrice", priceParameters);
	// },

	//Campaign

	saveOffer(offerInfo) {
		return Api().post("saveOffer", offerInfo);
	},
	getAllOffers() {
		return Api().get("getAllOffers");
	},
	saveEvent(eventInfo) {
		return Api().post("saveEvent", eventInfo);
	},
	getAllEvents() {
		return Api().get("getAllEvents");
	},
	updateOfferInfo(offerUpdatInfo) {
		return Api().post("updateOfferInfo", offerUpdatInfo);
	},
	deleteOffer(offerId) {
		return Api().post("deleteOffer", offerId);
	},
	updateEvent(eventUpdateInfo) {
		return Api().post("updateEvent", eventUpdateInfo);
	},
	deleteEvent(eventId) {
		return Api().post("deleteEvent", eventId);
	},

	addPurchasePointRules(purchaasePointInfo) {
		return Api().post("addPurchasePointRules", purchaasePointInfo);
	},
	getPurchaseRules() {
		return Api().get("getPurchaseRules");
	},
	updatePurchasePointRules(purchasePointUpdateInfo) {
		return Api().post("updatePurchasePointRules", purchasePointUpdateInfo);
	},

	deletePurchasePoint(purchasePointId) {
		return Api().post("deletePurchasePoint", purchasePointId);
	},
	addOtherPointRules(otherRuleInfo) {
		return Api().post("addOtherPointRules", otherRuleInfo);
	},
	getOtherRules() {
		return Api().get("getOtherRules");
	},
	updateOtherPointRules(otherPointRuleUpdateInfo) {
		return Api().post("updateOtherPointRules", otherPointRuleUpdateInfo);
	},
	deleteOtherPoint(otherPointId) {
		return Api().post("deleteOtherPoint", otherPointId);
	},

	//reward
	saveReward(rewardInfo) {
		return Api().post("saveReward", rewardInfo);
	},
	getAllRewards() {
		return Api().get("getAllRewards");
	},
	updateReward(rewardUpdateInfo) {
		return Api().post("updateReward", rewardUpdateInfo);
	},
	deleteReward(rewardId) {
		return Api().post("deleteReward", rewardId);
	},
	//level
	saveLevel(levelInfo) {
		return Api().post("saveLevel", levelInfo);
	},
	getAllLevels() {
		return Api().get("getAllLevels");
	},
	updateLevel(levelUpdateInfo) {
		return Api().post("updateLevel", levelUpdateInfo);
	},
	deleteLevel(levelId) {
		return Api().post("/deleteLevel", levelId);
	},
	//Customer
	getAllCustomers() {
		return Api().get("getAllCustomers");
	},
	//Supper admin

	saveBranchInfo(branchInfo) {
		return Api().post("saveBranch", branchInfo);
	},
	getAllBranchs() {
		return Api().get("getAllBranchs");
	},
	getAllAdmins() {
		return Api().get("getAllAdmins");
	},
	assignAdmin(adminAssignInfo) {
		return Api().post("assignAdmin", adminAssignInfo);
	},
	updateBranchInfo(branchUpdateInfo) {
		return Api().post("updateBranchInfo", branchUpdateInfo);
	},
	deleteBranch(branchId) {
		return Api().post("deleteBranch", branchId);
	},
	shiftAdmin(shiftAdminInfo) {
		return Api().post("shiftAdmin", shiftAdminInfo);
	},
	deleteBranchAdmin(admindeleteIds) {
		return Api().post("deleteBranchAdmin", admindeleteIds);
	},
	getLastCheckDate() {
		return Api().get("getLastCheckDate");
	},
	updateLastCheckDate(dateInfo) {
		return Api().post("/updateLastCheckDate", dateInfo);
	},
	addingPoint(transactionInfo) {
		return Api().post("addingPoint", transactionInfo);
	},

	countCustomers() {
		return Api().get("countCustomers");
	},
	countRewards() {
		return Api().get("countRewards");
	},

	countOffers() {
		return Api().get("countOffers");
	},

	getAllCustomersFromSupper() {
		return Api().get("getAllCustomersFromSupper");
	},
	getAllTransactions() {
		return Api().get("getAllTransactions");
	},
	uploadImage(adminPicture) {
		return Api().post("imageUpload", adminPicture);
	},

	updateProfile(updateInfo) {
		return Api().post("updateProfile", updateInfo);
	},
	getRedeemedReward(barcode) {
		return Api().post("getRedeemReward", barcode);
	},
	getCustomer(customerId) {
		return Api().post("getCustomer", customerId);
	},
	useRedeemedReward(redeemId) {
		return Api().post("useRedeemedReward", redeemId);
	},
};

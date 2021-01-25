export default {
	computed: {
		filteredCustomers: function() {
			return this.allCustomers.filter((customer) => {
				return customer.level.toLowerCase().match(this.level.toLowerCase());
			});
		},
		filteredRewards: function() {
			return this.allRewards.filter((reward) => {
				return reward.status == this.selectedStatus;
			});
		},
	},
};

<template>
  <div>
    <p class="headline">Redeemption</p>
    <div id="redeem" class="text-center">
      <v-layout row wrap justify-space-around>
        <v-flex xs6 class="text-center">
          <v-img
            src="../../assets/Barcode.jpg"
            height="200"
            width="200"
            contain
          ></v-img>
        </v-flex>
        <br />
        <v-flex xs6 class="pt-10">
          <p class="grey--text">Read your bar code to get the reward</p>

          <v-text-field
            label="Please read your bar code"
            v-model="barCode"
            outlined
            @change="getRedeemReward"
            :autofocus="true"
          ></v-text-field>
          <p class="red--text">{{ barCodeError }}</p>
        </v-flex>
      </v-layout>
      <v-btn text :loading="redeemLoading" v-if="redeemLoading"></v-btn>
      <v-layout row wrap v-if="redeemInfo.length > 0">
        <v-flex
          class="white text-center pa-10"
          xs12
          v-for="(redeem, index) in redeemInfo"
          :key="index"
        >
          <div v-if="redeem.status == false">
            <p>Reward name {{ redeem.rewardName }}</p>
            <p>Points spent {{ redeem.point }}</p>
            <br />
            <v-btn
              dark
              text
              class="primary"
              @click="useReward(redeem)"
              :loading="useLoading"
            >
              <span class="text-capitalize">Use</span>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
<script>
import apiService from "../../services/apiService";
export default {
  data() {
    return {
      barCode: "",
      redeemInfo: [],
      customerInfo: [],
      barCodeError: "",
      redeemLoading: false,
      useLoading: false,
    };
  },
  methods: {
    async getRedeemReward() {
      if (this.barCode != "") {
        this.redeemLoading = true;
        try {
          const response = await apiService.getRedeemedReward({
            barCode: this.barCode,
          });
          this.redeemInfo = response.data.redeemed;
          // const customerInfo = await apiService.getCustomer({
          //   customerId: this.barCode,
          // });
          // this.customerInfo = customerInfo.data.client;
          this.redeemLoading = false;
          this.barCodeError = "";
          this.barCode = "";
        } catch (error) {
          this.redeemLoading = false;
          if (error.response) {
            if (error.response.data.error == 0) {
              this.$store.dispatch("setAdmin", "");
              this.$store.dispatch("setAdminToken", "");
              this.$store.dispatch("setSession", false);
              this.$router.push({ name: "adminLoginPage" });
            } else this.barCodeError = error.response.data.error;
          } else this.barCodeError = "Connection to server failed";
        }
      } else this.barCodeError = "please read the barcode";
    },

    async useReward(redeem) {
      try {
        this.useLoading = true;
        await apiService.useRedeemedReward({
          redeemId: redeem._id,
        });

        this.redeemInfo.splice(this.redeemInfo.indexOf(redeem), 1);
        this.useLoading = false;
      } catch (error) {
        this.useLoading = false;
        if (error.response) {
          if (error.response.data.error == 0) {
            this.$store.dispatch("setAdmin", "");
            this.$store.dispatch("setAdminToken", "");
            this.$store.dispatch("setSession", false);
            this.$router.push({ name: "adminLoginPage" });
          } else this.barCodeError = error.response.data.error;
        } else this.barCodeError = "Connection to server failed";
      }
    },
  },
};
</script>
<style  scoped>
#redeem {
  max-width: 600px;
  margin: auto;
}
</style>
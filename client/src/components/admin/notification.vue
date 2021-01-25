<template>
  <div id="notification" class="grey lighten-3">
    <p class="text-center headline">Notifications</p>
    <v-layout row wrap>
      <v-flex
        xs12
        v-for="(redeemed, index) in allRedeemed"
        :key="index"
        class="ma-1 white pa-10"
      >
        <span class="mr-10"> Reward name: {{ redeemed.rewardName }}</span>
        <span class="mr-10"> Points: {{ Math.round(redeemed.point) }}</span>
        <span class="mr-10">
          Date: {{ new Date(redeemed.redeemptionDate) }}</span
        >
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import apiService from "../../services/apiService";
export default {
  data() {
    return {
      allRedeemed: [],
    };
  },
  async created() {
    try {
      const response = await apiService.getRedeemd();

      this.allRedeemed = response.data.redeemed;
    } catch (error) {
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        }
      }
    }
  },
};
</script>

<style  scoped>
#comment {
  max-width: 600px;
  margin: auto;
}
</style>
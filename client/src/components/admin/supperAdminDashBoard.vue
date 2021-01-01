<template>
  <div>
    <div
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'supper'
      "
      class=""
    >
      <p class="headline ml-10 pl-10">Dashboard</p>
      <div class="white pt-3" id="dashBoard">
        <v-layout row wrap justify-space-around class="pa-10 pt-3">
          <v-flex xs12 md2 id="numericalStastics" class="mt-2">
            <p class="text-center"><v-icon large>group</v-icon></p>
            <p class="text-center headline">{{ totalCustomers }}</p>
            <p class="text-center pa-1 mb-0 white--text orange">
              Total Customers
            </p>
          </v-flex>
          <v-flex xs12 md2 id="numericalStastics" class="mt-2">
            <p class="text-center"><v-icon large>emoji_events</v-icon></p>
            <p class="text-center headline">{{ totalRewards }}</p>
            <p class="text-center pa-1 mb-0 white--text orange">
              Available Rewards
            </p>
          </v-flex>
          <v-flex xs12 md2 id="numericalStastics" class="mt-2">
            <p class="text-center"><v-icon large>free_breakfast</v-icon></p>
            <p class="text-center headline">{{ totalOffers }}</p>
            <p class="text-center pa-1 mb-0 white--text orange">
              Available Offers
            </p>
          </v-flex>
          <v-flex xs12 md2 id="numericalStastics" class="mt-2">
            <p class="text-center"><v-icon large>mood_bad</v-icon></p>
            <p class="text-center headline">7</p>
            <p class="text-center pa-1 mb-0 white--text orange">
              Churn Customers
            </p>
          </v-flex>
        </v-layout>
        <br />

        <br />
        <v-layout raw wrap justify-space-around>
          <v-flex xs12 md4 class="pt-3 ma-2">
            <apexchart
              type="bar"
              :options="options"
              :series="series"
              width="100%"
            ></apexchart>
          </v-flex>
          <v-flex xs12 md4 class="pt-3 ma-2">
            <apexchart
              type="line"
              :options="options"
              :series="series"
              width="100%"
            ></apexchart>
          </v-flex>
          <v-flex xs12 md4 class="pt-3 ma-2">
            <apexchart
              width="100%"
              type="pie"
              :options="chartOptions"
              :series="series2"
            ></apexchart>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <div v-else class="text-center red--text headline mt-10">
      <p>
        You do not have access, please login first or supper admin has the only
        access to this resource
      </p>
    </div>
  </div>
</template>

<script>
// import apiService from "./services/apiService";
import apiService from "../../services/apiService";
import axios from "axios";

export default {
  data() {
    return {
      totalCustomers: 0,
      totalRewards: 0,
      totalOffers: 0,
      error: "",
      options: {
        chart: {
          id: "clp-chart",
        },
        xaxis: {
          categories: [
            "New customers",
            "Active customers",
            "Lapsed customers",
            "Dormant customers",
          ],
        },
      },
      series: [],

      series2: [204, 55],
      chartOptions: {
        labels: ["Male", "Female"],
        colors: ["#00ff00", "#ff4000"],
      },
    };
  },
  methods: {
    async addingPoints() {
      var foundTransaction = [{}];
      var lastCkeckDateId = "";

      var currentdate = new Date();
      var datetime =
        currentdate.getFullYear() +
        "-" +
        (currentdate.getMonth() + 1) +
        "-" +
        currentdate.getDate() +
        " " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        (currentdate.getSeconds() + 1);

      try {
        const lastCkeckDate = await apiService.getLastCheckDate();
        lastCkeckDateId = lastCkeckDate.data.result[0]._id;

        //Api to get transaction from HMS
        var result = await axios({
          method: "POST",
          url: "http://localhost:5000/graphql",
          data: {
            query: `{
                  getAllTransaction(lastCheckDated:"${lastCkeckDate.data.result[0].lastCheckDate}",
                  dateNow:"${datetime}"){
                    id
                    customer_id
                    quantity
                    branch_name
                    date
                    
                     service{
                       serviceName,
                       servicePrice
                       }
    
                     }
                  }
                `,
          },
        });
        // alert(result.data.data.getAllTransaction.length);
        foundTransaction = result.data.data.getAllTransaction;
      } catch (err) {
        this.error = err;
      }

      let i = 0;
      let isFound = false;
      for (i = 0; i < foundTransaction.length; i++) {
        try {
          await apiService.addingPoint({
            customerId: result.data.data.getAllTransaction[i].customer_id,

            item: result.data.data.getAllTransaction[i].service[0].serviceName,
            quantity: result.data.data.getAllTransaction[i].quantity,
            invoice:
              result.data.data.getAllTransaction[i].quantity *
              result.data.data.getAllTransaction[i].service[0].servicePrice,
            branch: result.data.data.getAllTransaction[i].branch_name,
            transactionDate: result.data.data.getAllTransaction[i].date,
          });
          isFound = true;
        } catch (err) {
          this.error = err;
        }
      }

      //updating last check date
      if (isFound) {
        try {
          await apiService.updateLastCheckDate({
            dateNow: datetime,
            lastCkeckDateId: lastCkeckDateId,
          });
        } catch (err) {
          this.error = err;
        }
      }
    },
    async countCustomers() {
      this.totalCustomers = await apiService.countCustomers();
      this.totalCustomers = this.totalCustomers.data.result;
    },
    async countRewards() {
      this.totalRewards = await apiService.countRewards();
      this.totalRewards = this.totalRewards.data.result;
    },

    async countOffers() {
      this.totalOffers = await apiService.countOffers();
      this.totalOffers = this.totalOffers.data.result;
    },
    async getAllCustomers() {
      this.allCustomers = await apiService.getAllCustomers();
      this.allCustomers = this.allCustomers.data.allCustomers;
      var newCustomers = 0;
      const dateNow = Date.now();

      for (let i = 0; i < this.allCustomers.length; i++) {
        if (
          (dateNow - this.allCustomers[i].registeredDate) / (3600 * 1000) <=
          24
        ) {
          newCustomers = newCustomers + 1;
        }
      }

      this.series = [
        {
          name: "bar",
          data: [newCustomers, 35, 25, 30],
        },
      ];
    },
  },
  created() {
    setInterval(() => {
      this.addingPoints();
      this.countCustomers();
      this.countRewards();
      this.countOffers();
      this.getAllCustomers();
    }, 10000);
  },
};
</script>
<style scoped>
#numericalStastics {
  border-radius: 5px;
  border-bottom: 0;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
#numericalStasticsWraper {
  max-width: 1000px;
  border: solid 1px rgb(226, 225, 225);
  margin: auto;
}
</style>
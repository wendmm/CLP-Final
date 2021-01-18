<template>
  <div>
    <div
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'branch'
      "
      class=""
    >
      <p class="headline ml-10 pl-10">Dashboard</p>
      <div class="white pt-3" id="dashBoard">
        <span class="ml-10">Direct signed customers {{ totalDirect }}</span>
        <span class="ml-10">Referred customers {{ totalRefferd }}</span>
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
              width="90%"
              type="pie"
              :options="chartOptions"
              :series="series2"
            ></apexchart>
          </v-flex>
          <v-flex xs12 md3 class="pt-3 ma-2">
            <apexchart
              type="line"
              :options="optionsTransaction"
              :series="seriesTransaction"
              width="100%"
            ></apexchart>
          </v-flex>
        </v-layout>
        <br /><br />
        <v-layout row wrap justify-space-around>
          <v-flex xs12 md5>
            <p class="headline">Top 5 loyal customers</p>
            <v-data-table
              ref="printTable"
              :headers="headers"
              :items="topCustomers"
              class="elevation-0"
            ></v-data-table>
          </v-flex>
          <v-flex xs12 md5>
            <p class="headline">Top 5 services used by customers</p>

            <table
              class="display nowrap"
              style="width: 100%"
              ref="printTable"
              border="1"
              id="toPrint"
            >
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tibs</td>
                  <td>55</td>
                </tr>
                <tr>
                  <td>Buna</td>
                  <td>5</td>
                </tr>
              </tbody>
            </table>
            <v-btn @click="printData"><span>Print</span></v-btn>
            <button id="pdf">Export</button>
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
// import { jsPDF } from "jspdf";

import $ from "jquery";
require("jspdf-autotable");
import "tableexport";

$(document).ready(function () {
  $("#pdf").on("click", function () {
    $("#toPrint").tableExport({
      type: "pdf",
      filename: "sample",
      dom: "Bfrtip",
    });
  });
});

export default {
  data() {
    return {
      totalCustomers: 0,
      totalRewards: 0,
      totalOffers: 0,
      totalMals: 0,
      totalFemales: 0,
      totalRefferd: 0,
      totalDirect: 0,
      topCustomers: [],
      allTransactions: [],
      activeCustomers: 0,
      lapsedCustomers: 0,
      dormantCustomers: 0,

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

      series2: [],
      chartOptions: {
        labels: ["Male", "Female"],
        colors: ["#00ff00", "#0000ff"],
      },

      seriesTransaction: [
        {
          name: "line",
          data: [12, 35, 25, 30, 23, 50],
        },
      ],
      optionsTransaction: {
        chart: {
          id: "transaction",
        },
        xaxis: {
          categories: [
            "monday",
            "Tuesday",
            "Wednsday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
      },
      headers: [
        {
          text: "First Name",
          align: "start",
          value: "firstName",
        },
        {
          text: "Last Name",

          value: "lastName",
        },
        {
          text: "Phone No",

          value: "phoneNumber",
        },
        {
          text: "Points",

          value: "totalPoints",
        },

        {
          text: "Level",

          value: "level",
        },

        // {
        //   text: "Actions",

        //   value: "actions",
        // },
      ],
    };
  },
  methods: {
    printData() {
      var divToPrint = this.$refs.printTable;
      var newWin = window.open("");
      newWin.document.write(divToPrint.outerHTML);
      newWin.print();

      newWin.close();
    },

    // createPDF() {
    //   let pdfName = "mes-enfants";
    //   var doc = new jsPDF();

    //   doc.html(this.$refs.printTable.outerHTML, {
    //     x: 15,
    //     y: 15,
    //     width: 170,
    //   });

    //   doc.save(pdfName + ".pdf");
    // },

    async addingPoints() {
      var foundTransaction = [];
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

      for (i = 0; i < foundTransaction.length; i++) {
        try {
          await apiService.addingPoint({
            customerId: foundTransaction[i].customer_id,

            item: foundTransaction[i].service[0].serviceName,
            quantity: foundTransaction[i].quantity,
            invoice:
              foundTransaction[i].quantity *
              foundTransaction[i].service[0].servicePrice,
            branch: foundTransaction[i].branch_name,
            transactionDate: foundTransaction[i].date,
          });
        } catch (err) {
          this.error = err;
        }
      }

      //updating last check date
      if (foundTransaction.length > 0) {
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
    async getAllTransactions() {
      this.allTransactions = await apiService.getAllTransactions();

      this.allTransactions = this.allTransactions.data.results;
    },
    async getAllCustomers() {
      this.totalFemales = 0;
      this.totalMals = 0;
      this.totalRefferd = 0;
      this.totalDirect = 0;
      this.activeCustomers = 0;
      this.lapsedCustomers = 0;
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
        if (this.allCustomers[i].isFemale == true) {
          this.totalFemales++;
        } else this.totalMals++;
        if (this.allCustomers[i].referredFrom != "") this.totalRefferd++;
        else this.totalDirect++;
        var eyekotereNew = 0;
        var lapsedCounter = 0;
        for (let index = 0; index < this.allTransactions.length; index++) {
          if (
            this.allCustomers[i].customerId ==
            this.allTransactions[index].customerId
          ) {
            var finalDate = Date.now() - 60 * 60 * 24 * 30 * 1000;
            if (
              finalDate <= this.allTransactions[index].transactionDate &&
              this.allTransactions[index].transactionDate <= Date.now()
            ) {
              this.activeCustomers++;
              eyekotereNew++;
            }
            finalDate = Date.now() - 60 * 60 * 24 * 30 * 1000 * 2;

            if (
              finalDate <= this.allTransactions[index].transactionDate &&
              this.allTransactions[index].transactionDate <= Date.now()
            ) {
              lapsedCounter++;
            }
          }

          if (eyekotereNew > 0) break;
        }
        if (lapsedCounter == 0) this.lapsedCustomers++;
      }

      this.series = [
        {
          name: "bar",
          data: [
            newCustomers,
            this.activeCustomers,
            this.lapsedCustomers,
            this.totalCustomers - this.activeCustomers - this.lapsedCustomers,
          ],
        },
      ];
      this.series2 = [this.totalMals, this.totalFemales];

      this.allCustomers.sort((a, b) =>
        a["totalPoints"] > b["totalPoints"] ? -1 : 1
      );
      this.topCustomers = [];
      for (let k = 0; k < 5; k++) {
        this.topCustomers.push(this.allCustomers[k]);
      }
    },
  },
  created() {
    setInterval(() => {
      this.addingPoints();
      this.countCustomers();

      this.countRewards();
      this.countOffers();
      this.getAllTransactions();
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
.v-data-table {
  border: 1px solid rgb(226, 217, 217);
}
</style>
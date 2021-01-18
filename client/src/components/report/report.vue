<template>
  <div class="white">
    <v-toolbar class="pl-10" flat>
      <v-toolbar-title>CLP Report</v-toolbar-title>

      <template v-slot:extension>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="blue"></v-tabs-slider>

          <v-tab
            v-for="item in items"
            :key="item"
            class="orange darken-4 ma-2"
            style="border-radius: 4px"
            :id="`${item}`"
            @click="clickTab($event)"
          >
            <span class="white--text text-capitalize"> {{ item }}</span>
          </v-tab>
          <button id="pdf">PDF</button>
        </v-tabs>
      </template>
    </v-toolbar>
    <br />
    <hr />
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card flat>
          <v-data-table
            v-if="chooser == 'Services'"
            ref="printTable"
            :headers="serviceHeaders"
            :items="getAllServices"
            item-key="serviceImage"
            class="elevation-0"
            id="dataTable"
          ></v-data-table>
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
          </v-flex>

          <v-data-table
            v-if="chooser == 'Customer'"
            :headers="customerHeaders"
            :items="allCustomers"
            item-key="serviceImage"
            class="elevation-0"
            id="dataTable"
          ></v-data-table>
          <v-card-text
            v-text="campaign"
            v-if="chooser == 'Campaign'"
          ></v-card-text>
          <v-card-text v-text="reward" v-if="chooser == 'Reward'"></v-card-text>
          <v-card-text v-text="event" v-if="chooser == 'Events'"></v-card-text>
          <v-card-text v-text="offer" v-if="chooser == 'Offers'"></v-card-text>
          <v-card-text
            v-text="transaction"
            v-if="chooser == 'Transaction'"
          ></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>


<script>
import apiService from "../../services/apiService";
import { jsPDF } from "jspdf";
import $ from "jquery";
require("jspdf-autotable");
import "tableexport";

$(document).ready(function () {
  $("#pdf").on("click", function () {
    $("#toPrint").tableExport({
      type: "pdf",
      filename: "sample.pdf",
    });
  });
});

export default {
  data() {
    return {
      tab: null,
      items: [
        "Services",
        "Customer",
        "Campaign",
        "Reward",
        "Events",
        "Offers",
        "Transaction",
      ],
      getAllServices: [],
      allCustomers: [],
      serviceHeaders: [
        {
          text: "Service Catagory",
          align: "start",
          value: "selectedServiceCatagory",
        },
        { text: "Sub Catagory", value: "selectedServiceSubCatagory" },
        { text: "Service Name", value: "serviceName" },
        { text: "Price", value: "servicePrice" },
        { text: "Description", value: "serviceDescription", sortable: false },
        { text: "Picture", value: "serviceImage", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      customerHeaders: [
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
          text: "Age",

          value: "birthDate",
        },
        {
          text: "Sex",

          value: "isFemale",
        },

        {
          text: "Referral Code",

          value: "_id",
        },
        {
          text: "Level",

          value: "level",
        },

        {
          text: "Is Refered",

          value: "isReferred",
        },
        {
          text: "Actions",

          value: "actions",
        },
      ],
      customer: "Customer list",
      campaign: "campain list",
      reward: "reward list",
      event: "event list",
      offer: "offer list",
      transaction: "transaction list",
      chooser: "Services",
    };
  },
  methods: {
    createPDF() {},
    printData() {
      var divToPrint = this.$refs.printTable;
      var newWin = window.open("");
      newWin.document.write(divToPrint.outerHTML);
      newWin.print();

      newWin.close();
    },
    clickTab(event) {
      if (event.currentTarget.id == "Services") this.chooser = "Services";
      if (event.currentTarget.id == "Customer") this.chooser = "Customer";
      if (event.currentTarget.id == "Campaign") this.chooser = "Campaign";
      if (event.currentTarget.id == "Reward") this.chooser = "Reward";
      if (event.currentTarget.id == "Events") this.chooser = "Events";
      if (event.currentTarget.id == "Offers") this.chooser = "Offers";
      if (event.currentTarget.id == "Transaction") this.chooser = "Transaction";
    },
  },
  async created() {
    try {
      const response = await apiService.getAllServices();

      var allServices = response.data.allServices;
      for (let i = 0; i < allServices.length; i++) {
        if (this.$store.state.admin.assignedTo == allServices[i].branchName) {
          this.getAllServices.push(allServices[i]);
        }
      }
    } catch (error) {
      this.serviceLoading = false;
      if (error.response) {
        if (error.response.data.error == 0) {
          this.$store.dispatch("setAdmin", "");
          this.$store.dispatch("setAdminToken", "");
          this.$store.dispatch("setSession", false);
          this.$router.push({ name: "adminLoginPage" });
        }
      }
    }

    try {
      const response = await apiService.getAllCustomers();

      this.allCustomers = response.data.allCustomers;
      this.allCustomers.sort((a, b) =>
        a["registeredDate"] > b["registeredDate"] ? -1 : 1
      );
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
<style scoped>
#tab {
  border-radius: 4px;
}
</style>
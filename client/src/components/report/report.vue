<template>
  <div class="white pb-10">
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
        </v-tabs>
      </template>
    </v-toolbar>
    <br />
    <hr />

    <v-layout row wrap id="tables" class="mt-10">
      <v-flex xs12 v-if="chooser == 'Services'">
        <table
          v-if="getAllServices.length > 0"
          class="display nowrap"
          style="width: 100%"
          ref="printTable"
          id="serviceReport"
          border="1"
        >
          <caption class="mb-3" id="captionId">
            <span class="headline mr-10">Service list</span>
            <span>
              Report generated by:
              {{
                $store.state.admin.firstName +
                " " +
                $store.state.admin.middleName
              }}
            </span>
          </caption>

          <thead>
            <tr>
              <th>Service Category</th>
              <th>Sub Category</th>
              <th>Service Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(service, index) in getAllServices" :key="index">
              <td>{{ service.selectedServiceCatagory }}</td>
              <td>{{ service.selectedServiceSubCatagory }}</td>
              <td>{{ service.serviceName }}</td>
              <td>{{ service.servicePrice }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="red--text text-center">There is no service</p>
        <div class="text-right">
          <v-btn text class="mt-10 mr-10 primary" @click="printData"
            ><span class="text-capitalize">Print</span></v-btn
          >

          <!--  <button id="toExport">Export</button>-->
        </div>
      </v-flex>

      <v-flex xs2 class="mr-10" v-if="chooser == 'Customer'">
        <v-select
          outlined
          max-height="10"
          denses
          placeholder="By Level"
          v-model="level"
          :items="levels"
        ></v-select>
      </v-flex>
      <v-flex xs2 v-if="chooser == 'Customer'" class="mr-10">
        <v-select
          outlined
          max-height="10"
          denses
          placeholder="Referred or not"
          v-model="isReferred"
          :items="referalLevel"
          @change="referOrNot"
        ></v-select>
      </v-flex>
      <v-flex xs2 v-if="chooser == 'Customer'">
        <v-select
          outlined
          max-height="10"
          denses
          placeholder="By Gender"
          v-model="selectedGender"
          :items="gender"
          @change="getGender"
        ></v-select>
      </v-flex>

      <v-flex xs12 v-if="chooser == 'Customer'">
        <div v-if="filteredCustomers.length > 0">
          <table
            class="display nowrap"
            style="width: 100%"
            ref="printTable"
            id="customerEx"
            border="1"
          >
            <caption class="mb-3 pa-0">
              <span class="headline mr-10">Customer list</span>
              <span>
                Report generated by:
                {{
                  $store.state.admin.firstName +
                  " " +
                  $store.state.admin.middleName
                }}
              </span>
            </caption>

            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Level</th>
                <th>Is reffered</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(customer, index) in filteredCustomers" :key="index">
                <td>{{ customer.firstName }}</td>
                <td>{{ customer.lastName }}</td>
                <td>{{ customer.phoneNumber }}</td>
                <td>
                  {{
                    parseInt(new Date().toISOString().substr(0, 4)) -
                    parseInt(customer.birthDate.substr(0, 4))
                  }}
                </td>
                <td>
                  <p v-if="customer.isFemale">Female</p>
                  <p v-else>Male</p>
                </td>
                <td>{{ customer.level }}</td>
                <td>
                  <p v-if="customer.referredFrom != ''">Yes</p>
                  <p v-else>No</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-right">
          <v-btn text class="mt-10 mr-10 primary" @click="printData"
            ><span class="text-capitalize">Print</span></v-btn
          >

          <!--  <button id="toExport">Export</button>-->
        </div>
      </v-flex>

      <v-flex xs12 v-if="chooser == 'Reward'">
        <div v-if="allRewards.length > 0">
          <div class="text-right">
            <v-flex xs2 class="mr-10">
              <v-select
                outlined
                max-height="10"
                denses
                placeholder="Choose status"
                v-model="selectedStatus"
                :items="rewardStatus"
                @change="chooseRewardStatus"
              ></v-select>
            </v-flex>
          </div>
          <table
            class="display nowrap"
            style="width: 100%"
            ref="printTable"
            id="rewardEx"
            border="1"
          >
            <caption class="mb-3 pa-0">
              <span class="headline mr-10">Redeemed and used rewards</span>
              <span>
                Report generated by:
                {{
                  $store.state.admin.firstName +
                  " " +
                  $store.state.admin.middleName
                }}
              </span>
            </caption>

            <thead>
              <tr>
                <th>Reward Name</th>
                <th>Reward Points</th>
                <th>Redemption Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(reward, index) in filteredRewards" :key="index">
                <td>{{ reward.rewardName }}</td>
                <td>{{ Math.round(reward.point) }}</td>
                <td>{{ new Date(reward.redeemptionDate) }}</td>
                <td>
                  <p class="red-text" v-if="reward.status">Used</p>
                  <p v-else>Redeemed</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-right">
          <v-btn text class="mt-10 mr-10 primary" @click="printData"
            ><span class="text-capitalize">Print</span></v-btn
          >

          <!--  <button id="toExport">Export</button>-->
        </div>
      </v-flex>

      <v-flex xs12 v-if="chooser == 'Events'">
        <div v-if="getAllEvents.length > 0">
          <div class="text-right"></div>
          <table
            class="display nowrap"
            style="width: 100%"
            ref="printTable"
            id="rewardEx"
            border="1"
          >
            <caption class="mb-3 pa-0">
              <span class="headline mr-10">Available Events</span>
              <span>
                Report generated by:
                {{
                  $store.state.admin.firstName +
                  " " +
                  $store.state.admin.middleName
                }}
              </span>
            </caption>

            <thead>
              <tr>
                <th>Event Title</th>
                <th>Event Date</th>
                <th>Event Start Time</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(event, index) in getAllEvents" :key="index">
                <td>{{ event.eventTitle }}</td>
                <td>{{ event.eventDate }}</td>
                <td>{{ event.eventStartTime }}</td>
                <td>
                  {{ event.eventBranch }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-right">
          <v-btn text class="mt-10 mr-10 primary" @click="printData"
            ><span class="text-capitalize">Print</span></v-btn
          >

          <!--  <button id="toExport">Export</button>-->
        </div>
      </v-flex>
      <v-flex xs12 v-if="chooser == 'Offers'">
        <div v-if="getAllOffers.length > 0">
          <div class="text-right"></div>
          <table
            class="display nowrap"
            style="width: 100%"
            ref="printTable"
            id="rewardEx"
            border="1"
          >
            <caption class="mb-3 pa-0">
              <span class="headline mr-10">Available Offers</span>
              <span>
                Report generated by:
                {{
                  $store.state.admin.firstName +
                  " " +
                  $store.state.admin.middleName
                }}
              </span>
            </caption>

            <thead>
              <tr>
                <th>Offer Title</th>
                <th>Service Name</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Service price</th>
                <th>Discount rate</th>
                <th>Price after discount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(offer, index) in getAllOffers" :key="index">
                <td>{{ offer.offerTitle }}</td>
                <td>{{ offer.serviceName }}</td>
                <td>{{ offer.startDate }}</td>
                <td>{{ offer.endDate }}</td>
                <td>{{ offer.servicePrice }}</td>
                <td>{{ offer.discountPercent }}</td>
                <td>{{ offer.discountPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-right">
          <v-btn text class="mt-10 mr-10 primary" @click="printData"
            ><span class="text-capitalize">Print</span></v-btn
          >

          <!--  <button id="toExport">Export</button>-->
        </div>
      </v-flex>

      <v-flex xs12 v-if="chooser == 'Transaction'">
        <div v-if="allTransactions.length > 0">
          <div class="text-right"></div>
          <table
            class="display nowrap"
            style="width: 100%"
            ref="printTable"
            id="rewardEx"
            border="1"
          >
            <caption class="mb-3 pa-0">
              <span class="headline mr-10">Transaction list</span>
              <span>
                Report generated by:
                {{
                  $store.state.admin.firstName +
                  " " +
                  $store.state.admin.middleName
                }}
              </span>
            </caption>

            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Total price</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(transaction, index) in allTransactions" :key="index">
                <td>{{ transaction.customerId }}</td>
                <td>{{ transaction.item }}</td>
                <td>{{ transaction.quantity }}</td>
                <td>{{ transaction.invoice }}</td>
                <td>{{ transaction.transactionDate }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-right">
          <v-btn text class="mt-10 mr-10 primary" @click="printData"
            ><span class="text-capitalize">Print</span></v-btn
          >

          <!--  <button id="toExport">Export</button>-->
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>


<script>
import searchMixins from "../../mixins/searchMixins";
import apiService from "../../services/apiService";
// import axios from "axios";
// import { jsPDF } from "jspdf";
import $ from "jquery";
require("jspdf-autotable");
import "tableexport";

$(document).ready(function () {
  $("#toExport").on("click", function () {
    $("#customerEx").tableexport({
      type: "pdf",
      filename: "customer",
      dom: "Bfrtip",
    });
  });
});

$(document).ready(function () {
  $("#pdf").on("click", function () {
    $("#toPrint").tableexport({
      type: "pdf",
      filename: "sample",
      dom: "Bfrtip",
    });
  });
});

export default {
  mixins: [searchMixins],
  data() {
    return {
      tab: null,

      items: [
        "Services",
        "Customer",

        "Reward",
        "Events",
        "Offers",
        "Transaction",
      ],
      getAllServices: [],
      allCustomers: [],
      allRewards: [],
      allCustomersTemp: [],
      getAllEvents: [],
      getAllOffers: [],
      allTransactions: [],

      level: "",
      levels: [],
      selectedGender: "",
      selectedStatus: "",
      gender: ["Male", "Female"],
      rewardStatus: ["Used", "Not used"],

      referalLevel: ["Direct", "Referred"],
      isReferred: "",
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
    chooseRewardStatus() {
      if (this.selectedStatus == "Used") this.selectedStatus = true;
      else if (this.selectedStatus == "Not used") this.selectedStatus = false;
    },
    referOrNot() {
      this.allCustomers = [];
      if (this.isReferred == "Direct") {
        for (let i = 0; i < this.allCustomersTemp.length; i++) {
          if (this.allCustomersTemp[i].referredFrom == "") {
            this.allCustomers.push(this.allCustomersTemp[i]);
          }
        }
      } else if (this.isReferred == "Referred") {
        for (let i = 0; i < this.allCustomersTemp.length; i++) {
          if (this.allCustomersTemp[i].referredFrom != "") {
            this.allCustomers.push(this.allCustomersTemp[i]);
          }
        }
      }
    },

    getGender() {
      this.allCustomers = [];
      if (this.selectedGender == "Male") {
        for (let i = 0; i < this.allCustomersTemp.length; i++) {
          if (this.allCustomersTemp[i].isFemale == false) {
            this.allCustomers.push(this.allCustomersTemp[i]);
          }
        }
      } else if (this.selectedGender == "Female") {
        for (let i = 0; i < this.allCustomersTemp.length; i++) {
          if (this.allCustomersTemp[i].isFemale == true) {
            this.allCustomers.push(this.allCustomersTemp[i]);
          }
        }
      }
    },
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
      this.allCustomersTemp = this.allCustomers;
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

    try {
      const response = await apiService.redeemedRewards();

      this.allRewards = response.data.used;
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

    try {
      const response = await apiService.getAllEvents();

      this.getAllEvents = response.data.allEvents;
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

    try {
      const response = await apiService.getAllOffers();

      this.getAllOffers = response.data.allOffers;
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

    try {
      this.allTransactions = await apiService.getAllTransactions();

      this.allTransactions = this.allTransactions.data.results;
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

    try {
      const response = await apiService.getAllLevels();

      const allLevels = response.data.allLevels;
      for (let i = 0; i < allLevels.length; i++) {
        this.levels.push(allLevels[i].levelName);
      }
    } catch (error) {
      throw error;
    }
  },
};
</script>
<style scoped>
#tab {
  border-radius: 4px;
}
table,
th,
td {
  border: 1px solid rgb(223, 215, 215);
  border-collapse: collapse;
}
th,
td {
  padding: 5px;
}
th {
  text-align: left;
}

#tables {
  max-width: 1000px;
  margin: auto;
}
#captionId {
  align-items: left;
}
</style>




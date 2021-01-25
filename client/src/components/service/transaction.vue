<template>
  <div>
    <div v-if="$store.state.isAdminLoggedIn">
      <span class="headline">Transaction/</span>
      <span class="grey--text">&nbsp;List of transactions</span>
      <div>
        <v-data-table
          ref="printTable"
          :headers="headers"
          :items="allTransactions"
          class="elevation-0"
        >
          <template v-slot:[`item.transactionDate`]="{ item }">
            <p>
              {{ Date(item.transactionDate).substr(0, 25) }}
            </p>
          </template>
        </v-data-table>
      </div>
      <br />
    </div>
    <p class="text-center red--text" v-else>You don't have access'</p>
  </div>
</template>
<script>
import apiService from "../../services/apiService";
export default {
  data() {
    return {
      allTransactions: [],
      headers: [
        {
          text: "Customer ID",
          align: "start",
          value: "customerId",
        },
        {
          text: "Item",

          value: "item",
        },
        {
          text: "Quantity",

          value: "quantity",
        },
        {
          text: "Total price",

          value: "invoice",
        },

        {
          text: "Date",

          value: "transactionDate",
        },

        // {
        //   text: "Actions",

        //   value: "actions",
        // },
      ],
    };
  },

  methods: {
    async getAllTransactions() {
      this.allTransactions = await apiService.getAllTransactions();

      this.allTransactions = this.allTransactions.data.results;
    },
  },
  created() {
    this.getAllTransactions();
  },
};
</script>
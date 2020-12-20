<template>
  <div>
    <div
      v-if="
        $store.state.isAdminLoggedIn && $store.state.admin.actor == 'supper'
      "
      class=""
    >
      <p class="headline ml-10 pl-10">Dashboard</p>
      <div class="white pa-3" id="dashBoard">
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
export default {
  data() {
    return {
      options: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
      },
      series: [
        {
          name: "bar",
          data: [120, 40, 45, 50, 49, 60, 70, 91],
        },
      ],

      series2: [204, 55],
      chartOptions: {
        labels: ["Male", "Female"],
        colors: ["#00ff00", "#ff4000"],
      },
    };
  },
};
</script>
<style scoped>
</style>
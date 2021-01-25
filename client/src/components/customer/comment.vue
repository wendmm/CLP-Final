<template>
  <div id="comment" class="grey lighten-3">
    <p class="text-center headline">Comments are listed bellow</p>
    <v-layout row wrap>
      <v-flex
        xs12
        v-for="(comment, index) in allComments"
        :key="index"
        class="ma-10 white pa-10"
      >
        <span class="mr-10">Comment: {{ comment.comment }}</span>
        <span> Date: {{ new Date(comment.commentDate) }}</span>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import apiService from "../../services/apiService";
export default {
  data() {
    return {
      allComments: [],
    };
  },
  async created() {
    try {
      const response = await apiService.getComments();

      this.allComments = response.data.comment;
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
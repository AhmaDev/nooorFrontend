<template>
  <div class="pa-10" id="profile">
    <v-card v-if="id != null" class="pa-10">
      <center>
        <v-progress-circular
          v-if="userInfo == null"
          indeterminate
          size="40"
          color="primary"
        ></v-progress-circular>
      </center>

      {{ this.userInfo }}
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    id: null,
    userInfo: null,
  }),
  created: function () {
    this.id = this.$route.params.id;
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios.get("student/" + this.id).then((res) => {
        this.userInfo = res.data;
      });
    },
  },
};
</script>

<style>
</style>
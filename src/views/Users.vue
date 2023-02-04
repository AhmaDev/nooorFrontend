<template>
  <div :class="isMobile() ? 'pa-0' : 'pa-10'" id="usersPage">
    <v-card :class="isMobile() ? 'rounded-0' : ''">
      <v-tabs
        v-model="tab"
        background-color="primary accent-4"
        centered
        slider-size="3"
        dark
        icons-and-text
        show-arrows
        @change="changeTab()"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#students">
          الطلاب
          <v-icon>la-user</v-icon>
        </v-tab>

        <v-tab href="#teachers">
          الاساتذة
          <v-icon>la-user-tie</v-icon>
        </v-tab>

        <v-tab href="#delegates">
          الموزعين
          <v-icon>la-user-check</v-icon>
        </v-tab>
        <v-tab href="#assistances">
          المساعدين
          <v-icon>la-headset</v-icon>
        </v-tab>
        <v-tab href="#admins">
          المسؤولين
          <v-icon>la-user-cog</v-icon>
        </v-tab>
      </v-tabs>

      <div>
        <Admins v-if="tab == 'admins'" />
        <Students v-if="tab == 'students'" />
        <Teachers v-if="tab == 'teachers'" />
      </div>
    </v-card>
  </div>
</template>

<script>
import isMobile from "@/plugins/helper";
import Admins from "../components/users/Admins.users.vue";
import Teachers from "../components/users/Teachers.users.vue";
import Students from "../components/users/Stundets.users.vue";
export default {
  components: { Admins, Teachers, Students },
  data: () => ({
    users: [],
    tab: "students",
  }),
  created: function () {
    if (this.$route.params.role != undefined) {
      this.tab = this.$route.params.role;
    }
  },
  methods: {
    changeTab() {
      this.$router.replace("/users/" + this.tab);
    },
    isMobile() {
      return isMobile();
    },
  },
};
</script>

<style>
</style>
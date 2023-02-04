<template>
  <v-app>
    <v-btn
      v-if="isLoggedIn"
      @click="navDrawer = true"
      fixed
      color="primary"
      elevation="2"
      fab
      bottom
      right
    >
      <v-icon>la-bars</v-icon>
    </v-btn>
    <v-navigation-drawer
      v-if="$store.getters.isLoggedIn"
      fixed
      app
      right
      v-model="navDrawer"
      :mini-variant="isCollapsed"
      mini-variant-width="90"
      light
      width="300"
    >
      <template v-slot:prepend>
        <div class="pa-0" style="position: absolute">
          <v-btn icon @click="collapse()">
            <v-icon>la-bars</v-icon>
          </v-btn>
        </div>
        <center>
          <br />
          <br />
          <v-img
            v-if="!isCollapsed"
            src="@/assets/logo.png"
            width="50%"
          ></v-img>
          <img v-if="isCollapsed" src="@/assets/logo.png" width="70%" />
          <br />
          <v-chip v-if="!isCollapsed" outlined color="light">
            <v-icon left>la-user-circle</v-icon>
            <span> {{ userInfo.username }}</span>
          </v-chip>
          <br />
          <br v-if="!isCollapsed" />
        </center>
      </template>
      <v-divider></v-divider>
      <br />
      <v-list rounded :dense="!isCollapsed">
        <v-list-item
          color="primary"
          :to="item.route"
          v-for="item in items"
          :key="item.title"
          :content="item.title"
          v-tippy="{
            arrow: true,
            arrowType: 'round',
            placement: 'right',
            followCursor: true,
            animateFill: true,
            animation: 'scale',
          }"
        >
          <v-list-item-icon>
            <v-icon color="black">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="!isCollapsed">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          color="red"
          content="خروج"
          @click="logout()"
          v-tippy="{
            arrow: true,
            arrowType: 'round',
            placement: 'right',
            followCursor: true,
            animateFill: true,
          }"
        >
          <v-list-item-icon>
            <v-icon color="red">la-power-off</v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="!isCollapsed">
            <v-list-item-title>تسجيل خروج</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view v-if="$store.getters.isLoggedIn" />
      <LoginPage v-else />
    </v-main>
  </v-app>
</template>

<script>
import LoginPage from "./components/Login.vue";
export default {
  name: "App",
  components: { LoginPage },
  data: () => ({
    isCollapsed: false,
    navDrawer: false,
    items: [
      { title: "الرئيسية", icon: "la-home", route: "/" },
      { title: "المتسخدمين", icon: "la-user-cog", route: "/users" },
      { title: "الكورسات", icon: "la-book-open", route: "/courses" },
      { title: "الاشعارات", icon: "la-bell", route: "/notifications" },
      { title: "الصفوف والمواد", icon: "la-stream", route: "/categories" },
      { title: "الصور الرمزية", icon: "la-user-circle", route: "/avatars" },
      { title: "الاعدادات", icon: "la-cog", route: "/settings" },
    ],
  }),
  mounted: function () {
    this.isCollapsed =
      localStorage.getItem("isCollapsed") == "false" ? false : true;
    this.navDrawer = !this.isMobile();
    this.isCollapsed = !this.isMobile();
  },
  methods: {
    logout() {
      this.$axios
        .post("logout", {
          sessionKey: this.$store.state.sessionKey,
        })
        .then(() => {
          localStorage.clear();
          location.reload();
        });
    },
    collapse() {
      this.isCollapsed = !this.isCollapsed;
      localStorage.setItem("isCollapsed", this.isCollapsed);
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
};
</script>
<style src="./style.css"></style>

<template>
  <div id="login">
    <center>
      <v-card max-width="500" class="pa-10" style="margin-top: 200px">
        <center>
          <v-img src="@/assets/logo.png" width="100"></v-img>
          <br />
          <h3>المنصة التعليمية</h3>
          <br />
        </center>
        <v-text-field
          outlined
          append-icon="la-user"
          v-model="username"
          @keypress.enter="login()"
          label="اسم المستخدم"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="password"
          append-icon="la-key"
          type="password"
          @keypress.enter="login()"
          label="كلمة المرور"
        ></v-text-field>
        <v-btn
          :loading="isLoading"
          x-large
          block
          color="primary"
          @click="login()"
          >دخول</v-btn
        >
        <br /><br />
        <small v-if="version != '...'">v {{ version }}</small>
        <small v-if="version == '...'">
          <v-progress-circular
            indeterminate
            color="primary"
            size="14"
            width="2"
          ></v-progress-circular>
        </small>
      </v-card>
    </center>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: "LoginPage",
  data: () => ({
    isLoading: false,
    username: "",
    password: "",
    version: "...",
  }),
  created: function () {
    this.$axios.get("version").then((res) => {
      this.version = res.data["version"];
    });
  },
  methods: {
    login() {
      this.isLoading = true;
      this.$axios
        .post("login", {
          phone: this.username,
          password: this.password,
        })
        .then((res) => {
          var token = res.data.token;
          var decoded = jwt_decode(token);
          if (decoded.roleId != 1) {
            this.$toast.error("المعلومات غير صحيحة");
            return;
          }
          localStorage.setItem("token", token);
          localStorage.setItem("userinfo", JSON.stringify(decoded));
          this.$store.commit("setLoginInfo", decoded);
          this.$store.commit("setSessionKey", res.data);
          this.$toast.success("اهلاً بك , " + this.username);
          location.reload();
        })
        .catch((err) => {
          if (err.response.status == 404) {
            this.$toast.error("المعلومات غير صحيحة");
          }
          if (err.response.status == 423) {
            this.$toast.error("تجاوزت عدد الجلسات المسموح بها", {
              icon: "lock",
            });
          }
          if (err.response.status == 403) {
            this.$toast.error("تم حظر حسابك", {
              icon: "ban",
            });
          }
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style>
#login {
  width: 100%;
  height: 100%;
  position: fixed;
  background-image: url("../assets/cool-background.svg");
  background-size: cover;
}
</style>
<template>
  <div id="home" class="pa-10">
    <v-card class="pa-5">
      <h2>اهلاً بك يا , {{ $store.state.loginInfo.username }} 👋</h2>
    </v-card>
    <br />
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-10">
          <v-row align="center" justify="center">
            <v-col align="center">
              <v-icon size="100" color="warning">la-book</v-icon>
            </v-col>
            <v-col align="right">
              <h3>عدد الكورسات</h3>
              <h1 class="warning--text">0</h1>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-10">
          <v-row align="center" justify="center">
            <v-col align="center">
              <v-icon size="100" color="success">la-user</v-icon>
            </v-col>
            <v-col align="right">
              <h3>عدد الطلاب</h3>
              <h1 class="success--text">0</h1>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-10">
          <v-row align="center" justify="center">
            <v-col align="center">
              <v-icon size="100" color="error">la-user-tie</v-icon>
            </v-col>
            <v-col align="right">
              <h3>عدد الاساتذة</h3>
              <h1 class="error--text">0</h1>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="pa-10">
          <v-row align="center" justify="center">
            <v-col align="center">
              <v-icon size="100" color="info">la-user-check</v-icon>
            </v-col>
            <v-col align="right">
              <h3>عدد الموزعين</h3>
              <h1 class="info--text">0</h1>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Home",

  components: {},
};
</script>

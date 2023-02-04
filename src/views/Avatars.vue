<template>
  <div class="pa-10" id="avatars">
    <center v-if="avatars.length == 0">
      <lottie-animation
        style="width: 400px"
        loop
        :animationData="require('@/assets/noImages.json')"
      />
      <h2>لا يوجد صور رمزية</h2>
      <br />
      <v-btn @click="addNewImage()" x-large outlined color="primary">
        <v-icon left>la-upload</v-icon>
        <span>اضافة صورة رمزية جديدة</span>
      </v-btn>
    </center>
    <v-row>
      <v-col v-for="avatar in avatars" :key="avatar.idAvatar" cols="12" md="3">
        <v-card class="pa-10">
          <center>
            <img
              height="150"
              width="150"
              :src="axios.defaults.baseURL + avatar.image"
            />
          </center>
          <v-btn
            @click="deleteAvatar(avatar.idAvatar)"
            block
            color="error"
            elevation="0"
          >
            <v-icon left>la-trash</v-icon>
            <span>حذف الصورة</span>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      color="primary"
      content="اضافة صورة رمزية جديدة"
      v-tippy
      fab
      fixed
      bottom
      left
      @click="addNewImage()"
    >
      <v-icon>la-plus</v-icon>
    </v-btn>
    <input
      @change="uploadFile($event)"
      type="file"
      accept="image/*"
      name="file"
      id="file"
      style="display: none"
    />
  </div>
</template>

<script>
import LottieAnimation from "lottie-web-vue";

export default {
  components: { LottieAnimation },
  data: () => ({
    avatars: [],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios.get("avatars").then((res) => {
        this.avatars = res.data;
      });
    },
    deleteAvatar(id) {
      this.$axios.delete("avatar/" + id).finally(() => this.fetch());
    },
    addNewImage() {
      document.getElementById("file").click();
    },
    uploadFile(e) {
      var formData = new FormData();
      var imagefile = document.querySelector("#file");
      formData.append("file", imagefile.files[0]);
      this.$axios
        .post("addAvatar?destination=avatars", formData)
        .then(() => this.fetch());
    },
  },
};
</script>

<style>
</style>
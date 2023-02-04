<template>
  <div id="courses" class="pa-10">
    <v-row>
      <v-col cols="12" md="3" v-for="course in courses" :key="course.idCourse">
        <v-card class="">
          <template slot="progress">
            <v-progress-linear
              color="deep-purple"
              height="10"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-img
            v-if="course.courseImage == 'none'"
            class="primary"
            src="@/assets/course.png"
            :aspect-ratio="16 / 9"
          >
            <div
              dir="ltr"
              class="pa-3 white--text"
              style="font-size: 14px; font-weight: bold"
            >
              1920 × 1080
            </div>
          </v-img>
          <v-img
            v-if="course.courseImage != 'none'"
            class="primary"
            :aspect-ratio="16 / 9"
            :src="$axios.defaults.baseURL + course.courseImage"
          ></v-img>

          <v-card-title class="text-truncate">
            <div>{{ course.title }}</div>
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-title class="text-truncate">
            <v-icon right>la-user-tie</v-icon>
            <small>{{ course.createdByName }}</small>
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-text class="text-truncate">
            <center>
              <v-chip content="سعر المنصة" v-tippy color="error"
                >IQD {{ course.platformPrice.toLocaleString() }}</v-chip
              >
              &nbsp; &nbsp;
              <v-chip content="سعر الكورس" v-tippy color="success"
                >IQD {{ course.price.toLocaleString() }}</v-chip
              >
              &nbsp; &nbsp;
              <v-chip
                content="عدد المشتركين"
                v-tippy
                color="warning"
                class="black--text"
              >
                {{ course.enrolled.toLocaleString() }}
                <v-icon right>la-user-circle</v-icon>
              </v-chip>
            </center>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <v-card-actions>
            <v-btn
              color="primary lighten-2"
              text
              :to="'/course/' + course.idCourse"
              target="_BLANK"
            >
              <v-icon left>la-info-circle</v-icon>
              <span>التفاصيل</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-btn
      color="primary"
      content="اضافة كورس جديد"
      v-tippy
      fab
      fixed
      bottom
      left
      @click="newCourseDialog = true"
    >
      <v-icon>la-plus</v-icon>
    </v-btn>
    <v-dialog persistent v-model="newCourseDialog" max-width="800">
      <v-card>
        <div class="pa-10">
          <v-alert icon="la-book" prominent>
            <h2>اضافة كورس جديد</h2>
          </v-alert>
          <v-text-field
            outlined
            label="عنوان الكورس"
            v-model="newCourse.title"
          ></v-text-field>
          <v-textarea
            outlined
            label="الوصف"
            v-model="newCourse.description"
          ></v-textarea>
          <v-autocomplete
            outlined
            label="الاستاذ"
            v-model="newCourse.createdBy"
            :items="teachers"
            item-text="username"
            item-value="idUser"
          ></v-autocomplete>
          <v-autocomplete
            outlined
            label="الصف"
            v-model="newCourse.categoryId"
            :items="categories"
            item-text="categoryTitle"
            item-value="idCategory"
          ></v-autocomplete>
          <v-autocomplete
            outlined
            label="المادة"
            v-model="newCourse.subCategoryId"
            :disabled="newCourse.categoryId == 0"
            :items="
              subCategories.filter((e) => e.categoryId == newCourse.categoryId)
            "
            item-text="subCategoryTitle"
            item-value="idSubCategory"
          ></v-autocomplete>
          <v-text-field
            type="number"
            outlined
            label="سعر الكورس"
            v-model="newCourse.price"
          ></v-text-field>
          <v-text-field
            type="number"
            outlined
            label="سعر المنصة"
            v-model="newCourse.platformPrice"
          ></v-text-field>
          <br />
          <hr />
          <br />
          <v-btn @click="addCourse()" large block color="primary">
            <v-icon left>la-plus</v-icon>
            <span>اضافة الكورس</span>
          </v-btn>
          <br />
          <v-btn
            @click="newCourseDialog = false"
            large
            block
            color="error"
            outlined
          >
            <v-icon left>la-close</v-icon>
            <span>الغاء</span>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    courses: [],
    isLoading: true,
    newCourseDialog: false,
    teachers: [],
    categories: [],
    subCategories: [],
    newCourse: {
      title: "",
      description: "",
      createdBy: 0,
      price: null,
      categoryId: 0,
      subCategoryId: 0,
      platformPrice: null,
      iapId: "",
      isHidden: 0,
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios
        .get("courses?showHidden=1")
        .then((res) => {
          this.courses = res.data;
        })
        .finally(() => (this.isLoading = false));
      this.$axios
        .get("usersByRole/3")
        .then((res) => (this.teachers = res.data));
      this.$axios.get("categories").then((res) => (this.categories = res.data));
      this.$axios
        .get("subCategories")
        .then((res) => (this.subCategories = res.data));
    },
    addCourse() {
      this.$axios.post("addCourse", this.newCourse).then(() => {
        this.newCourse = {
          title: "",
          description: "",
          createdBy: 0,
          price: null,
          categoryId: 0,
          subCategoryId: 0,
          platformPrice: null,
          iapId: "",
          isHidden: 0,
        };
        this.newCourseDialog = false;
        this.$toast.success("تم اضافة الكورس بنجاح");
        this.fetch();
      });
    },
  },
};
</script>

<style>
</style>
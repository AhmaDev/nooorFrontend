<template>
  <div id="categories" :class="isMobile() ? '' : 'pa-10'">
    <v-card :class="isMobile() ? 'pa-5' : 'pa-10'">
      <!-- <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            outlined
            rounded
            label="اضافة صف جديد"
            append-icon="la-plus"
            hint="اضغط ENTER للاضافة"
            v-model="newCat.categoryTitle"
            @keypress.enter="addNewCat()"
          ></v-text-field>
          <v-list rounded v-model="selectedCategory">
            <v-list-item
              @click="selectCat(cat.idCategory)"
              v-for="cat in categories"
              :key="cat.idCategory"
              :value="cat.idCategory"
              :class="cat.idCategory == selectedCategory ? 'primary' : ''"
              :dark="cat.idCategory == selectedCategory"
            >
              {{ cat.categoryTitle }}
            </v-list-item>
          </v-list>
        </v-col>
        <v-divider vertical class="primary"></v-divider>
        <v-col v-if="selectedCategory != 0" cols="12" md="9">
          <v-text-field
            outlined
            rounded
            label="اضافة مادة جديدة"
            append-icon="la-plus"
            hint="اضغط ENTER للاضافة"
            v-model="newSubCat.subCategoryTitle"
            @keypress.enter="addNewCat()"
          ></v-text-field>
          <v-list rounded>
            <v-list-item v-for="cat in subCategories" :key="cat.idSubCategory">
              {{ cat.subCategoryTitle }}
            </v-list-item>
          </v-list>
        </v-col>
      </v-row> -->
      <br />

      <v-text-field
        outlined
        rounded
        label="اضافة صف جديد"
        append-icon="la-plus"
        hint="اضغط ENTER للاضافة"
        v-model="newCat.categoryTitle"
        @keypress.enter="addNewCat()"
      ></v-text-field>
      <v-data-table
        :items="categories"
        :headers="categoriesHeader"
        show-expand
        item-key="idCategory"
        :items-per-page="-1"
        ref="dTable"
        class="elevation-0"
      >
        <template v-slot:[`item.lessonsCount`]="{ item }">
          <v-chip color="primary" dark>
            {{
              subCategories.filter((e) => e.categoryId == item.idCategory)
                .length
            }}
          </v-chip>
        </template>
        <template v-slot:[`item.categoryTitle`]="{ item }">
          <b>{{ item.categoryTitle }}</b>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td class="elevation-0" :colspan="headers.length">
            <div>
              <div
                v-if="
                  subCategories.filter((e) => e.categoryId == item.idCategory)
                    .length == 0
                "
              >
                <v-alert
                  color="warning"
                  dense
                  rounded
                  icon="la-warning"
                  class="mt-10"
                  >لا يوجد مواد</v-alert
                >
              </div>
              <v-list
                v-if="
                  subCategories.filter((e) => e.categoryId == item.idCategory)
                    .length > 0
                "
                color="transparent"
              >
                <v-list-item
                  v-for="subCategory in subCategories.filter(
                    (e) => e.categoryId == item.idCategory
                  )"
                  :key="subCategory.idSubCategory"
                >
                  <v-list-item-icon>
                    <img
                      v-tippy
                      content="تغيير صورة المادة"
                      height="42"
                      style="cursor: pointer"
                      :src="$axios.defaults.baseURL + subCategory.icon"
                      @click="updateImage(subCategory.idSubCategory)"
                    />
                  </v-list-item-icon>
                  <v-list-item-title>
                    <v-text-field
                      :value="subCategory.subCategoryTitle"
                      hide-details
                      filled
                      dense
                      @change="
                        changeSubCategoryTitle(
                          subCategory.idSubCategory,
                          $event
                        )
                      "
                    ></v-text-field>
                  </v-list-item-title>
                  <v-list-item-action>
                    <v-btn color="error" icon content="حذف" v-tippy>
                      <v-icon>la-trash</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-text-field
                outlined
                rounded
                dense
                label="اضافة مادة جديدة"
                append-icon="la-plus"
                hint="اضغط ENTER للاضافة"
                @keypress.enter="addNewSubCat(item.idCategory, $event)"
              ></v-text-field>
            </div>
          </td> </template
      ></v-data-table>
    </v-card>
    <input
      type="file"
      name="file"
      id="file"
      style="display: none"
      @change="uploadImage($event)"
      accept="image/*"
    />
  </div>
</template>

<script>
import isMobile from "@/plugins/helper";

export default {
  data: () => ({
    categories: [],
    selectedSubCategory: 0,
    categoriesHeader: [
      { text: "اسم الصف", value: "categoryTitle" },
      { text: "عدد المواد", value: "lessonsCount" },
    ],
    subCategories: [],
    newCat: {
      categoryTitle: "",
    },
    newSubCat: {
      subCategoryTitle: "",
      categoryId: 0,
    },
    selectedCategory: 0,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios.get("categories").then((res) => {
        this.categories = res.data;
        // setTimeout(() => {
        //   let buttons = document.getElementsByClassName("mdi-chevron-down");
        //   for (let i = 0; i < 1; i++) {
        //     console.log(buttons[i]);
        //     buttons[i].click();
        //   }
        // });
      }, 1000);
      this.$axios.get("subCategories").then((res) => {
        this.subCategories = res.data;
      });
    },
    selectCat(id) {
      this.selectedCategory = id;
    },
    addNewCat() {
      this.$axios.post("addCategory", this.newCat).then(() => this.fetch());
    },
    addNewSubCat(catId, e) {
      this.$axios
        .post("addSubCategory", {
          subCategoryTitle: e.target.value,
          categoryId: catId,
        })
        .then(() => this.fetch());
    },
    changeSubCategoryTitle(id, e) {
      this.$axios.put("subCategory/" + id, {
        subCategoryTitle: e,
      });
    },
    updateImage(id) {
      this.selectedSubCategory = id;
      document.getElementById("file").click();
    },
    uploadImage(e) {
      var formData = new FormData();
      var imagefile = document.querySelector("#file");
      formData.append("file", imagefile.files[0]);
      this.$axios
        .put(
          "subCategoryIcon/" + this.selectedSubCategory + "?destination=images",
          formData
        )
        .then(() => {
          this.fetch();
        });
    },
    deleteSubCategory(id) {},
    isMobile() {
      return isMobile();
    },
  },
};
</script>

<style>
</style>
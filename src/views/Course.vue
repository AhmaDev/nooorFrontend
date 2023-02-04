<template>
  <div v-if="course != null" id="course" class="pa-10">
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="pa-10">
          <iframe
            v-if="player.otp != ''"
            :src="
              'https://player.vdocipher.com/v2/?otp=' +
              player.otp +
              '&playbackInfo=' +
              player.playbackInfo
            "
            style="border: 0; width: 100%; height: 320px"
            allow="encrypted-media"
            allowfullscreen
          ></iframe>

          <div id="coverImage">
            <v-img
              v-if="course.courseImage == 'none'"
              class="primary rounded"
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
              height="250"
              :aspect-ratio="16 / 9"
              :src="$axios.defaults.baseURL + course.courseImage"
            ></v-img>
            <br />
            <v-btn @click="selectCourseImage()" block color="primary" outlined>
              <v-icon left>la-image</v-icon>
              <span>تغيير صورة الكورس</span>
            </v-btn>
            <input
              type="file"
              name="imageCourse"
              id="imageCourse"
              style="display: none"
              accept="image/*"
              @change="uploadImageCourse()"
            />
            <input
              type="file"
              name="lessonImage"
              id="lessonImage"
              style="display: none"
              accept="image/*"
              @change="changeLessonImage()"
            />
            <input
              type="file"
              name="lessonFile"
              id="lessonFile"
              style="display: none"
              ref="lessonFile"
              accept="application/pdf"
              @change="uploadFile()"
            />
          </div>
          <v-divider class="my-10"></v-divider>
          <v-text-field
            outlined
            label="عنوان الكورس"
            v-model="course.title"
            @change="editCourse({ title: $event }, course.idCourse)"
          ></v-text-field>
          <v-textarea
            outlined
            label=" الوصف"
            v-model="course.description"
            @change="editCourse({ description: $event }, course.idCourse)"
          ></v-textarea>
          <v-autocomplete
            outlined
            label="الاستاذ"
            v-model="course.createdBy"
            :items="teachers"
            @change="editCourse({ createdBy: $event }, course.idCourse)"
            item-text="username"
            item-value="idUser"
          ></v-autocomplete>
          <v-autocomplete
            outlined
            label="الصف"
            v-model="course.categoryId"
            :items="categories"
            item-text="categoryTitle"
            @change="editCourse({ categoryId: $event }, course.idCourse)"
            item-value="idCategory"
          ></v-autocomplete>
          <v-autocomplete
            outlined
            label="المادة"
            v-model="course.subCategoryId"
            @change="editCourse({ subCategoryId: $event }, course.idCourse)"
            :disabled="course.categoryId == 0"
            :items="
              subCategories.filter((e) => e.categoryId == course.categoryId)
            "
            item-text="subCategoryTitle"
            item-value="idSubCategory"
          ></v-autocomplete>
          <v-text-field
            type="number"
            outlined
            label="سعر الكورس"
            @change="editCourse({ price: $event }, course.idCourse)"
            v-model="course.price"
          ></v-text-field>
          <v-text-field
            type="number"
            outlined
            label="سعر المنصة"
            @change="editCourse({ platformPrice: $event }, course.idCourse)"
            v-model="course.platformPrice"
          ></v-text-field>
          <v-switch
            :value="course.isHidden"
            inset
            :true-value="1"
            :false-value="0"
            v-model="course.isHidden"
            @change="editCourse({ isHidden: $event }, course.idCourse)"
            :label="`اخفاء الكورس `"
          ></v-switch>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card class="pa-10">
          <v-alert
            prominent
            icon="la-info-circle"
            outlined
            color="info"
            v-if="courseChapters.length == 0"
          >
            <v-row>
              <v-col class="grow">
                <h3>لا يوجد فصول , قم باضافة فصل جديد للمتابعة</h3>
              </v-col>
            </v-row>
          </v-alert>
          <input
            @change="startUpload($event)"
            type="file"
            name="video"
            id="video"
            style="display: none"
            accept="video/mp4"
          />
          <div v-if="isUploading || isAnylizing" class="uploadBar">
            <div
              v-if="isUploading && !isAnylizing"
              style="direction: ltr"
              dir="ltr"
            >
              <v-progress-linear
                color="primary"
                buffer-value="0"
                :value="uploadPercentage"
                stream
                reverse
              >
              </v-progress-linear>
              <b>Uploading ( {{ uploadPercentage }}% )</b>
            </div>
            <div
              v-if="!isUploading && isAnylizing"
              style="direction: ltr"
              dir="ltr"
            >
              <v-progress-linear
                color="success"
                :buffer-value="0"
                :value="0"
                stream
                reverse
              >
              </v-progress-linear>
              <b>Processing Video...</b>
            </div>
          </div>
          <template v-for="chapter in courseChapters">
            <div :key="'chapter_' + chapter.idCourseChapter">
              <v-card color="primary" dark class="pa-2">
                <v-row>
                  <v-col>
                    <v-text-field
                      outlined
                      :value="chapter.chapterTitle"
                      hide-details
                      dense
                      @change="
                        changeChapterName($event, chapter.idCourseChapter)
                      "
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      outlined
                      :disabled="isUploading || isAnylizing"
                      @click="
                        selectedChapter = chapter.idCourseChapter;
                        videoTitleDialog = true;
                      "
                    >
                      <v-icon left>la-video</v-icon>
                      <span>اضافة درس جديد</span>
                    </v-btn>
                  </v-col>
                  <v-col
                    v-if="
                      lessons.filter(
                        (e) => e.courseChapterId == chapter.idCourseChapter
                      ).length == 0
                    "
                    cols="1"
                  >
                    <v-btn
                      @click="deleteChapter(chapter.idCourseChapter)"
                      color="error"
                    >
                      <v-icon>la-trash</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </div>
            <div
              v-for="(lesson, index) in lessons.filter(
                (e) => e.courseChapterId == chapter.idCourseChapter
              )"
              :key="'video_' + lesson.idLesson"
            >
              <v-row align="center">
                <v-col cols="1">
                  <v-card
                    style="text-align: center; vertical-align: middle"
                    color="primary"
                    width="72"
                    height="48"
                  >
                    <img
                      v-tippy
                      content="تغيير صورة الدرس"
                      :src="$axios.defaults.baseURL + lesson.image"
                      style="max-height: 48px; max-width: 72px; cursor: pointer"
                      alt=""
                      @click="
                        selectedLesson = lesson.idLesson;
                        selectLessonImage();
                      "
                    />
                  </v-card>
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    :value="lesson.lessonTitle"
                    dense
                    @change="
                      editLesson({ lessonTitle: $event }, lesson.idLesson)
                    "
                    label="عنوان الدرس"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    type="date"
                    outlined
                    :disabled="lesson.isFree == 1"
                    :value="parseDate(lesson.unlockDate)"
                    dense
                    @change="
                      editLesson({ unlockDate: $event }, lesson.idLesson)
                    "
                    label="تاريخ الفتح"
                    :prefix="getUnlockDays(lesson.unlockDate)"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="shrink">
                  <v-switch
                    :value="lesson.isFree"
                    inset
                    :true-value="1"
                    :false-value="0"
                    v-model="
                      lessons.filter(
                        (e) => e.courseChapterId == chapter.idCourseChapter
                      )[index].isFree
                    "
                    @change="editLesson({ isFree: $event }, lesson.idLesson)"
                    :label="`متاح `"
                  ></v-switch>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    @click="playVideo(lesson.file)"
                    v-tippy
                    icon
                    :loading="iframeLoading"
                    content="PLAY VIDEO"
                    color="primary"
                  >
                    <v-icon>la-play</v-icon>
                  </v-btn>

                  <v-btn
                    @click="deleteVideo(lesson.idLesson, lesson.file)"
                    icon
                    v-tippy
                    content="حذف"
                    color="error"
                  >
                    <v-icon>la-trash</v-icon>
                  </v-btn>
                  <v-badge
                    :content="lesson.totalComments.toString()"
                    overlap
                    color="blue"
                  >
                    <v-btn
                      @click="deleteVideo(lesson.idLesson, lesson.file)"
                      icon
                      v-tippy
                      content="التعليقات"
                      color="blue"
                    >
                      <v-icon>la-sms</v-icon>
                    </v-btn>
                  </v-badge>

                  <v-btn
                    @click="
                      selectedLesson = lesson.idLesson;
                      $refs.lessonFile.click();
                    "
                    icon
                    v-tippy
                    content="اضافة واجب"
                    color="orange"
                  >
                    <v-icon>la-file-medical</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <div
                v-for="file in courseFiles.filter(
                  (e) => e.lessonId == lesson.idLesson
                )"
                :key="file.idLessonFile"
                class="pa-2"
              >
                <v-row class="mb-1" align="center" justify="center">
                  <v-col class="shrink">
                    <img
                      src="@/assets/arrow.png"
                      style="opacity: 0.2"
                      height="30px"
                      alt=""
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      filled
                      rounded
                      dense
                      hide-details
                      :value="file.title"
                      @change="editFile({ title: $event }, file.idLessonFile)"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      type="date"
                      filled
                      rounded
                      :value="parseDate(file.expireDate)"
                      dense
                      @change="
                        editFile({ expireDate: $event }, file.idLessonFile)
                      "
                      :prefix="`تاريخ القفل`"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn
                      :href="$axios.defaults.baseURL + file.filePath"
                      target="_BLANK"
                      icon
                      v-tippy
                      content="مشاهدة الواجب"
                    >
                      <v-icon>la-external-link-alt</v-icon>
                    </v-btn>
                    <v-btn v-tippy content="حذف الواجب" icon color="error">
                      <v-icon>la-trash</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </div>
              <v-divider
                v-if="
                  courseFiles.filter((e) => e.lessonId == lesson.idLesson)
                    .length > 0
                "
              ></v-divider>
            </div>
          </template>
        </v-card>
      </v-col>
    </v-row>
    <!-- 
    <v-btn
      color="primary"
      content="اضافة فصل جديد"
      v-tippy
      fab
      fixed
      bottom
      left
      @click="addNewChapter()"
    >
      <v-icon>la-folder-plus</v-icon>
    </v-btn> -->
    <v-btn
      color="primary"
      bottom
      left
      fixed
      content="اضافة فصل جديد"
      v-tippy="{
        arrow: true,
        arrowType: 'round',
        placement: 'right',
        followCursor: true,
        animateFill: true,
      }"
      fab
      @click="addNewChapter()"
    >
      <v-icon>la-folder-plus</v-icon>
    </v-btn>
    <v-dialog v-model="videoTitleDialog" persistent max-width="500">
      <v-card class="pa-10">
        <v-text-field
          outlined
          v-model="uploadVideoTitle"
          label="عنوان الدرس"
        ></v-text-field>

        <v-btn
          :loading="isUploading"
          large
          block
          color="primary"
          @click="selectFile()"
          >SELECT FILE</v-btn
        >
        <br />
        <v-btn
          outlined
          large
          block
          color="error"
          @click="videoTitleDialog = false"
          >CANCLE</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as moment from "moment";
export default {
  data: () => ({
    course: null,
    courseStudents: [],
    courseGroups: [],
    courseDelegates: [],
    courseChapters: [],
    courseQuizes: [],
    courseFiles: [],
    lessons: [],
    isLoading: true,
    teachers: [],
    categories: [],
    subCategories: [],
    uploadPercentage: 0,
    isUploading: false,
    isAnylizing: false,
    selectedChapter: 1,
    uploadVideoTitle: "",
    selectedLesson: 0,
    videoTitleDialog: false,
    player: {
      otp: "",
      playbackInfo: "",
    },
    iframeLoading: false,
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios.get("course/" + this.$route.params.id).then((res) => {
        this.course = res.data;
      });
      this.$axios.get("courseGroup/" + this.$route.params.id).then((res) => {
        this.courseGroups = res.data;
      });
      this.$axios.get("courseDelegate/" + this.$route.params.id).then((res) => {
        this.courseDelegates = res.data;
      });
      this.$axios.get("courseChapter/" + this.$route.params.id).then((res) => {
        this.courseChapters = res.data;
      });
      this.$axios.get("courseQuiz/" + this.$route.params.id).then((res) => {
        this.courseQuizes = res.data;
      });
      this.$axios.get("courseFiles/" + this.$route.params.id).then((res) => {
        this.courseFiles = res.data;
      });
      this.$axios.get("courseLessons/" + this.$route.params.id).then((res) => {
        this.lessons = res.data;
      });
      this.$axios
        .get("usersByRole/3")
        .then((res) => (this.teachers = res.data));
      this.$axios.get("categories").then((res) => (this.categories = res.data));
      this.$axios
        .get("subCategories")
        .then((res) => (this.subCategories = res.data));
    },
    selectFile() {
      if (this.uploadVideoTitle.length == 0) {
        this.$toast.error("يرجى كتابة عنوان الدرس");
        return;
      }
      document.getElementById("video").click();
    },
    startUpload() {
      this.isUploading = true;
      this.$axios
        .get("vdo/credentials?title=" + this.uploadVideoTitle)
        .then((res) => {
          console.log(res.data);
          let videoId = res.data.videoId;
          let clientPayload = res.data.clientPayload;
          this.videoTitleDialog = false;
          var formData = new FormData();
          var videoFile = document.querySelector("#video");
          formData.append("video", videoFile.files[0]);
          formData.append("clientPayload", JSON.stringify(clientPayload));
          this.$axios
            .post("vdo/upload", formData, {
              onUploadProgress: (progressEvent) => {
                let percentComplete =
                  progressEvent.loaded / progressEvent.total;
                percentComplete = parseInt(percentComplete * 100);
                this.uploadPercentage = percentComplete;
                if (this.uploadPercentage > 99) {
                  this.isUploading = false;
                  this.isAnylizing = true;
                }
              },
            })
            .then((res) => {
              let today = new Date();
              console.log(res.data);
              this.$axios
                .post("addLesson", {
                  lessonTitle: this.uploadVideoTitle,
                  lessonDescription: "...",
                  image: "files/images/video.png",
                  file: videoId,
                  createdBy: this.userInfo.idUser,
                  unlockDate:
                    today.getFullYear() +
                    "-" +
                    (today.getMonth() + 1) +
                    "-" +
                    today.getDate(),
                  courseId: this.$route.params.id,
                  courseChapterId: this.selectedChapter,
                  isFree: 0,
                })
                .then(() => {
                  this.fetch();
                  this.isAnylizing = false;
                  this.uploadVideoTitle = "";

                  this.$toast.success("Video Uploaded Successfully");
                });
            });
        });
    },
    addNewChapter() {
      this.$axios
        .post("addCourseChapter", {
          chapterTitle: "فصل جديد",
          ordering:
            this.courseChapters.length == 0
              ? 1
              : this.courseChapters[this.courseChapters.length - 1].ordering +
                1,
          courseId: this.$route.params.id,
        })
        .then(() => {
          this.fetch();
        });
    },
    changeChapterName(e, id) {
      this.$axios.put("courseChapter/" + id, {
        chapterTitle: e,
      });
    },
    parseDate(d) {
      let dx = new Date(d);
      return moment(dx).format("YYYY-MM-DD");
    },
    getUnlockDays(d) {
      let dx = new Date(d);
      let now = new Date();

      return moment(dx).locale("ar").from(now);
    },
    playVideo(videoId) {
      this.iframeLoading = true;
      this.$axios.get("vdo/play/" + videoId).then((res) => {
        this.player.otp = res.data.otp;
        this.player.playbackInfo = res.data.playbackInfo;
        setTimeout(() => {
          this.iframeLoading = false;
        }, 2000);
      });
    },
    deleteVideo(videoId, vdoCipherVideoId) {
      let ask = confirm(
        "هل انت متأكد من حذف الدرس ؟ .. سيتم حذف الملف من vdoCipher وجميع التعليقات والواجبات المتعلقة بهذا الدرس"
      );
      if (!ask) {
        return;
      }
      this.isLoading = true;
      this.$axios.delete("vdo/video/" + vdoCipherVideoId).then((res) => {
        this.$axios.delete("lesson/" + videoId).then(() => {
          this.fetch();
        });
      });
    },
    deleteChapter(id) {
      this.isLoading = true;
      this.$axios.delete("courseChapter/" + id).then((res) => {
        this.fetch();
      });
    },
    editCourse(params, id) {
      console.log(params);
      this.$axios.put("course/" + id, params);
      this.fetch();
      this.$toast.success("تم التعديل");
    },
    editLesson(params, id) {
      console.log(params);
      this.$axios.put("lesson/" + id, params);
      this.fetch();
      this.$toast.success("تم التعديل");
    },
    editFile(params, id) {
      console.log(params);
      this.$axios.put("lessonFile/" + id, params);
      this.fetch();
      this.$toast.success("تم التعديل");
    },
    selectCourseImage() {
      document.getElementById("imageCourse").click();
    },
    uploadImageCourse() {
      var formData = new FormData();
      var imagefile = document.querySelector("#imageCourse");
      formData.append("file", imagefile.files[0]);
      this.$axios
        .put(
          "courseImage/" + this.$route.params.id + "?destination=images",
          formData
        )
        .then(() => this.fetch());
    },
    selectLessonImage() {
      document.getElementById("lessonImage").click();
    },
    changeLessonImage() {
      var formData = new FormData();
      var imagefile = document.querySelector("#lessonImage");
      formData.append("file", imagefile.files[0]);
      this.$axios
        .put(
          "lessonImage/" + this.selectedLesson + "?destination=images",
          formData
        )
        .then(() => this.fetch());
    },
    uploadFile() {
      var formData = new FormData();
      var imagefile = document.querySelector("#lessonFile");
      formData.append("file", imagefile.files[0]);
      formData.append(
        "lessonFileInfo",
        JSON.stringify({
          title: "واجب",
          createdBy: this.course.createdBy,
          courseId: this.$route.params.id,
          lessonId: this.selectedLesson,
        })
      );
      this.$axios
        .post("addLessonFile" + "?destination=documents", formData)
        .then(() => this.fetch());
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
  beforeRouteLeave(to, from, next) {
    if (this.isUploading || this.isAnylizing) {
      const answer = window.confirm(
        "هل انت متأكد من الخروج , لن يتم رفع الدرس !"
      );
      if (!answer) return false;
    } else {
      next();
    }
  },
};
</script>

<style scoped>
.uploadBar {
  position: fixed;
  bottom: 0px;
  width: 100%;
  left: 0px;
  padding: 10px;
  background: #fff;
  z-index: 1000000;
  height: 100px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.322);
}
</style>
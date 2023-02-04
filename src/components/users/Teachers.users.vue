<template>
  <div class="pa-10">
    <v-simple-table fixed-header :height="isLoading ? 0 : 500">
      <thead>
        <tr>
          <th>ID</th>
          <th>IMAGE</th>
          <th>اسم المستخدم</th>
          <th>تاريخ التسجيل</th>
          <th>الحالة</th>
          <th>رقم الهاتف</th>
          <th>التخصص</th>
          <th>اسم المدرسة</th>
          <th>الاجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.idUser">
          <td>{{ user.idUser }}</td>
          <td>
            <v-img
              height="42px"
              width="42px"
              v-if="user.image != '0'"
              :src="$axios.defaults.baseURL + user.image"
              alt=""
            />
            <v-img
              height="42px"
              width="42px"
              v-if="user.image == '0'"
              :src="$axios.defaults.baseURL + 'files/avatars/default.png'"
              alt=""
            />
          </td>
          <td>
            <b>{{ user.username }}</b>
          </td>
          <td>{{ fixDate(user.createdAt) }}</td>
          <td>
            <v-chip small color="success" v-if="user.isActive == 1"
              >Active</v-chip
            >
            <v-chip small color="error" v-if="user.isActive == 0"
              >Banned</v-chip
            >
          </td>
          <td>{{ user.phone }}</td>
          <td>{{ user.specialty }}</td>
          <td>{{ user.schoolName }}</td>
          <td>
            <v-btn
              :to="'/profile/teacher/' + user.idTeacher"
              content="الملف الشخصي"
              v-tippy
              icon
              color="black"
            >
              <v-icon> la-user-circle </v-icon>
            </v-btn>
            <v-btn
              @click="
                selectedUser = user.idUser;
                sessionsDialog = true;
                getUserSessions();
              "
              content="الجلسات النشطة"
              v-tippy
              icon
              color="info"
            >
              <v-icon> la-clock </v-icon>
            </v-btn>
            <v-btn
              @click="
                selectedUser = user.idUser;
                changePasswordDialog = true;
              "
              content="تغيير كلمة المرور"
              v-tippy
              icon
              color="warning"
            >
              <v-icon> la-key </v-icon>
            </v-btn>
            <v-btn
              @click="
                changeStatus(user.idUser, 0);
                users[index].isActive = 0;
              "
              content="حظر"
              v-tippy
              icon
              color="error"
              v-if="user.isActive == 1"
            >
              <v-icon> la-ban </v-icon>
            </v-btn>
            <v-btn
              @click="
                changeStatus(user.idUser, 1);
                users[index].isActive = 1;
              "
              content="رفع الحظر"
              v-tippy
              icon
              color="success"
              v-if="user.isActive == 0"
            >
              <v-icon> la-check-circle </v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <div v-if="isLoading">
      <center>
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </center>
    </div>

    <v-dialog
      :fullscreen="isMobile()"
      :class="isMobile() ? 'pa-10' : 'pa-0'"
      v-model="sessionsDialog"
      max-width="800"
    >
      <v-card>
        <div class="pa-10">
          <v-row>
            <v-col>
              <v-alert icon="la-clock" prominent>
                <h2>الجلسات النشطة</h2>
              </v-alert>
            </v-col>
            <v-col align="left">
              <v-btn @click="sessionsDialog = false" icon x-large>
                <v-icon>la-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <center>
            <v-progress-circular
              indeterminate
              color="primary"
              v-if="sessionLoading"
            ></v-progress-circular>
          </center>
          <v-alert
            color="orange"
            icon="la-info-circle"
            dark
            v-if="!sessionLoading && sessions.length == 0"
            >لا يوجد</v-alert
          >
          <v-simple-table v-if="!sessionLoading && sessions.length != 0">
            <thead>
              <tr>
                <th>SOURCE</th>
                <th>OS</th>
                <th>IP ADDRESS</th>
                <th>تاريخ الدخول</th>
                <th>الاجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="session in sessions" :key="session.idSession">
                <td>
                  {{
                    ua(session.userAgent, "browser").name +
                    " " +
                    ua(session.userAgent, "browser").version
                  }}
                </td>
                <td>
                  {{
                    ua(session.userAgent, "os").name +
                    " " +
                    ua(session.userAgent, "os").version
                  }}
                </td>
                <td>{{ session.ipAddress }}</td>
                <td>{{ fixDate(session.createdAt) }}</td>
                <td>
                  <v-btn
                    @click="deleteSession(session.idSession)"
                    content="حذف وتسجيل الخروج"
                    v-tippy
                    icon
                    color="error"
                  >
                    <v-icon> la-trash </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <br />
          <br />
          <v-btn
            @click="deleteAllSessions(selectedUser)"
            color="error"
            elevation="0"
            v-if="!sessionLoading && sessions.length != 0"
            block
          >
            <v-icon left> la-trash </v-icon>
            <span>حذف جميع الجلسات النشطة </span>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="changePasswordDialog"
      :fullscreen="isMobile()"
      :class="isMobile() ? 'pa-10' : 'pa-0'"
      width="600"
    >
      <v-card class="pa-10">
        <v-alert icon="la-key" prominent>
          <h2>تغيير كلمة المرور</h2>
        </v-alert>
        <v-text-field
          outlined
          label="اكتب كلمة المرور الجديدة"
          v-model="changePasswordForm.newPassword"
        ></v-text-field>

        <v-btn
          :loading="isLoading"
          @click="changePassword()"
          large
          block
          color="primary"
          >تغيير
        </v-btn>
        <br />
        <v-btn
          large
          @click="changePasswordDialog = false"
          block
          outlined
          color="error"
          >الغاء</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as moment from "moment";
import * as parser from "ua-parser-js";

import isMobile from "@/plugins/helper";
export default {
  data: () => ({
    users: [],
    isLoading: true,
    addUserDialog: false,
    sessions: [],
    sessionsDialog: false,
    selectedUser: 1,
    sessionLoading: true,
    changePasswordDialog: false,
    newUser: {
      username: "",
      roleId: 1,
      password: "",
      phone: "",
      isActive: 1,
    },
    changePasswordForm: {
      newPassword: "",
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios
        .get("usersByRole/3")
        .then((res) => {
          this.users = res.data;
        })
        .finally(() => (this.isLoading = false));
      this.getUserSessions();
    },
    fixDate(date) {
      return moment(date).format("YYYY-MM-DD , hh:mm:ss A");
    },
    addUser() {
      this.isLoading = true;
      this.$axios.post("addUser", this.newUser).then(() => {
        this.newUser = {
          username: "",
          roleId: 1,
          password: "",
          phone: "",
          isActive: 1,
        };
        this.fetch();
        this.addUserDialog = false;
      });
    },
    isMobile() {
      return isMobile();
    },
    changeStatus(userId, status) {
      this.$axios.put("user/" + userId, {
        isActive: status,
      });
    },
    getUserSessions() {
      this.sessionLoading = true;
      this.$axios
        .get("userSessions/" + this.selectedUser)
        .then((res) => {
          this.sessions = res.data;
        })
        .finally(() => (this.sessionLoading = false));
    },
    ua(userAgent, prop) {
      var ua = parser(userAgent);
      return ua[prop];
    },
    deleteSession(id) {
      this.sessionLoading = true;
      this.$axios.delete("session/" + id).then(() => {
        this.getUserSessions();
      });
    },
    deleteAllSessions(id) {
      this.sessionLoading = true;
      this.$axios.delete("userSessions/" + id).then(() => {
        this.getUserSessions();
      });
    },
    changePassword() {
      this.isLoading = true;
      this.$axios
        .put("updateUserPassword/" + this.selectedUser, {
          password: this.changePasswordForm.newPassword,
        })
        .then(() => {
          this.$toast.success("تم تغيير كلمة المرور");
          this.changePasswordDialog = false;
          this.changePasswordForm.newPassword = "";
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style scoped>
.td {
  vertical-align: middle !important;
}
</style>
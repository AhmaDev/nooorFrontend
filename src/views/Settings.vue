<template>
  <div id="settings" class="pa-10">
    <v-card class="pa-10">
      <v-simple-table>
        <thead>
          <tr>
            <th>الاعداد</th>
            <th>القيمة</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(setting, index) in settings" :key="setting.idSetting">
            <td>{{ setting.title }}</td>
            <td>
              <div v-if="setting.settingType == 'text'">
                <v-text-field
                  outlined
                  hide-details
                  dense
                  :value="setting.value"
                  @change="editSetting({ value: $event }, setting.idSetting)"
                ></v-text-field>
              </div>
              <div v-if="setting.settingType == 'boolean'">
                <v-switch
                  inset
                  :true-value="`true`"
                  :false-value="`false`"
                  v-model="settings[index].value"
                  :value="setting.value"
                  @change="editSetting({ value: $event }, setting.idSetting)"
                ></v-switch>
              </div>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    settings: [],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios.get("settings").then((res) => {
        this.settings = res.data;
      });
    },
    editSetting(params, id) {
      console.log(params);
      this.$axios.put("setting/" + id, params);
      this.fetch();
      this.$toast.success("تم التعديل");
    },
  },
};
</script>

<style>
</style>
<template>
  <div id="profilePage">
    <student v-if="profileType == 'student'" />
  </div>
</template>

<script>
import Student from "../components/profiles/Student.profiles.vue";
export default {
  components: {
    Student,
  },
  data: () => ({
    profileType: null,
  }),
  created: function () {
    this.profileType = this.$route.params.type;
  },
};
</script>

<style>
</style>
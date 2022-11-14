<template>
  <router-view />
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["isLogin"]),
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path && to.path != "/login") {
        if (!this.isLogin) {
          alert("로그인 후 이용 가능합니다");
          this.$router.push("/login");
        }
      }
    },
  },
};
</script>

<style>
.selector-for-some-widget {
  box-sizing: content-box;
}
</style>

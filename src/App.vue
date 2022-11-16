<template>
  <router-view />
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  created() {
    this.setArticleType()
  },
  methods: {
    ...mapActions("board", ["setArticleType"])
  },
  computed: {
    ...mapState("auth", ["isLogin"]),
  },
  watch: {
    $route(to, from) {
      if (
        to.path != from.path &&
        to.path != "/login" &&
        to.path != "/sign-up"
      ) {
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

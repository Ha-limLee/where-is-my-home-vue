<template>
  <router-view />
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  created() {
    if (!Object.keys(this.articleType).length)
      this.setArticleType();
  },
  methods: {
    ...mapActions("board", ["setArticleType"])
  },
  computed: {
    ...mapState("auth", ["isLogin"]),
    ...mapState("board", ["articleType"]),
  },
};
</script>

<style>
.selector-for-some-widget {
  box-sizing: content-box;
}
</style>

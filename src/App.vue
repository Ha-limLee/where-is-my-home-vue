<template>
  <router-view />
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  created() {
    this.setArticleType();
  },
  methods: {
    ...mapActions("board", ["setArticleType"])
  },
  computed: {
    ...mapState("auth", ["isLogin"]),
  },
};
</script>

<style>
.selector-for-some-widget {
  box-sizing: content-box;
}
</style>

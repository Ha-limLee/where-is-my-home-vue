<template>
  <div>
    <MainHeaderVue></MainHeaderVue>
    <router-view />
  </div>
</template>

<script>
import MainHeaderVue from "./components/MainHeader.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    MainHeaderVue
  },
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
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');
</style>

<template>
  <img :src="`${publicPath}image/main.jpg`" alt="main image" />
</template>

<script>
// @ is an alias to /src
import MainHeaderVue from "@/components/MainHeader.vue";

export default {
  name: "HomeView",
  components: {
    MainHeaderVue,
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
    }
  }
};
</script>

<style scoped>
img {
  position: fixed;
  right: 0;
  width: 100%;
  height: 80%;
  object-fit: contain;
}
</style>
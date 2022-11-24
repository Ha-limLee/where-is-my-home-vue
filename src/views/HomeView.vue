<template>
  <div class="home">
    <MainHeaderVue />
    <b-img :src="require('../assets/image/main.jpg')" fluid-grow/>
  </div>
</template>

<script>
// @ is an alias to /src
import MainHeaderVue from "@/components/MainHeader.vue";

export default {
  name: "HomeView",
  components: {
    MainHeaderVue,
  },
};
</script>

<style scoped>
  #main-img {
    width: 100%;
    height: calc(100% - 80px);
  }
</style>
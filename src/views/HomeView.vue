<template>
  <div class="home">
    <MainHeaderVue />
    <b-img :src="require('../assets/image/main.png')" fluid-grow />
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

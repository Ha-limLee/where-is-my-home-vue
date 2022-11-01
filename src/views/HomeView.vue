<template>
  <div class="home">
    <MainHeaderVue />
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

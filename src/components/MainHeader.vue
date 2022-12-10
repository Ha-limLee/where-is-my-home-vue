<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-navbar-brand to="/"><b-img width="50" :src="require('@/assets/image/logo.png')"/></b-navbar-brand>
    <b-navbar-brand to="/" style="font-family: 'Source Code Pro'">Take Me Home</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse ref="" id="nav-collapse" is-nav>
      <b-navbar-nav>
        <MainNavItem to="/board">게시판</MainNavItem>
        <MainNavItem to="/deal-board">아파트 매매 정보</MainNavItem>
        <MainNavItem v-if="user?.userName" to="/interest-board">관심지역</MainNavItem>
        <MainNavItem to="/building-board">건물검색</MainNavItem>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-navbar-nav v-if="$store.state.auth.user?.userName">
          <MainNavItem id="item-my-page" to="/my-page"
            >안녕하세요 {{ $store.state.auth.user.userName }} 님</MainNavItem
          >
          <b-nav-item href="#" @click="onLogout">로그아웃</b-nav-item>
          <template v-if="$store.state.auth.user.authority == 'admin'">
            <b-nav-item href="/user-list">회원목록</b-nav-item>
          </template>
        </b-navbar-nav>
        <b-navbar-nav v-else>
          <MainNavItem to="/sign-up">회원가입</MainNavItem>
          <MainNavItem to="/login">로그인</MainNavItem>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import MainNavItem from "./MainNavItem.vue";

export default {
  components: {
    MainNavItem
  },
  computed: {
    ...mapState("auth", ["isLogin", "user"]),
  },
  methods: {
    ...mapMutations("auth", ["SET_IS_LOGIN", "SET_USER"]),
    onLogout(event) {
      event.preventDefault();
      this.$store.dispatch("auth/userLogout")
        .then(res => {
          if (this.$route.path != "/") {
            this.$router.push("/");
          }
        });
    },
  },
};
</script>

<style scoped>
.navbar.navbar-light.bg-light {
  background-color: aliceblue !important;
}
</style>
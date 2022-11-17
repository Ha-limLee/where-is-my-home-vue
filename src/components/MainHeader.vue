<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand to="/">구해줘 홈즈</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/board">게시판</b-nav-item>
        <b-nav-item href="/deal-board">아파트매매정보</b-nav-item>
        <b-nav-item href="#">관심지역 정보 조회</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-navbar-nav v-if="$store.state.auth.user?.userName">
          <b-nav-item to="/my-page"
            >안녕하세요 {{ $store.state.auth.user.userName }} 님</b-nav-item
          >
          <b-nav-item href="#" @click="onLogout">로그아웃</b-nav-item>
          <template v-if="$store.state.auth.user.authority == 'admin'">
            <b-nav-item href="/user-list">회원목록</b-nav-item>
          </template>
        </b-navbar-nav>
        <b-navbar-nav v-else>
          <b-nav-item href="/sign-up">회원가입</b-nav-item>
          <b-nav-item href="/login">로그인</b-nav-item>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  computed: {
    ...mapState("auth", ["isLogin", "user"]),
  },
  methods: {
    ...mapMutations("auth", ["SET_IS_LOGIN", "SET_USER"]),
    onLogout(event) {
      event.preventDefault();
      this.$store.dispatch("auth/userLogout", this.user.userId);
      sessionStorage.removeItem("access-token");
      sessionStorage.removeItem("refresh-token");
      try {
        this.$router.push("/");
      } catch (e) {}
    },
  },
};
</script>

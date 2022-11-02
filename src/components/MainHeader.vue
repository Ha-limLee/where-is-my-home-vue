<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/">구해줘 홈즈</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="#">공지사항</b-nav-item>
        <b-nav-item href="#">아파트매매정보</b-nav-item>
        <b-nav-item href="#">관심지역 정보 조회</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-navbar-nav v-if="$store.state.user?.userName">
          <b-nav-item href="#">안녕하세요 {{ $store.state.user.userName }} 님</b-nav-item>
          <b-nav-item href="#" @click="onLogout">로그아웃</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav v-else>
          <b-nav-item href="#">회원가입</b-nav-item>
          <b-nav-item href="/login">로그인</b-nav-item>
        </b-navbar-nav>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  methods: {
    onLogout(event) {
      event.preventDefault();
      this.$store.commit("setUser", {});
    },
  },
};
</script>

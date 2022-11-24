<template>
  <div>
    <main-header></main-header>
    <b-container class="mt-4">
      <b-row align-h="center">
        <h3>로그인</h3>
      </b-row>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-1"
          label="아이디"
          label-for="input-1"
          description=""
        >
          <b-form-input
            id="input-1"
            v-model="form.userId"
            type="text"
            placeholder="아이디를 입력해주세요"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="비밀번호" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.userPassword"
            placeholder="비밀번호를 입력해주세요"
            type="password"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
          <b-form-checkbox-group
            v-model="form.checked"
            id="checkboxes-4"
            :aria-describedby="ariaDescribedby"
          >
            <b-form-checkbox value="saveId">아이디 저장</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>

        <b-button type="submit" variant="primary" class="mr-2">로그인</b-button>
        <b-button type="reset" variant="secondary">취소</b-button>
      </b-form>
      <b-card class="mt-3" header="Form Data Result">
        <pre class="m-0">{{ form }}</pre>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader.vue";
import { auth as api } from "@/api";
import jwt_decode from 'jwt-decode';

export default {
  components: { MainHeader },
  data() {
    return {
      form: {
        userId: "",
        userPassword: "",
      },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      api.loginUser(this.form).then((res) => {
        const accessToken = res.headers["access-token"];
        const refreshToken = res.headers["refresh-token"];
        /**
         * @type { {exp: number, id: string, role: string, sub: string, username: string} }
         */
        const decoded = jwt_decode(accessToken);

        this.$store.commit("auth/SET_IS_LOGIN", true);
        this.$store.commit("auth/SET_IS_LOGIN_ERROR", false);
        this.$store.commit("auth/SET_USER", {
          userId: decoded.id,
          userName: decoded.username,
          role: decoded.role,
        });
        sessionStorage.setItem("access-token", accessToken);
        sessionStorage.setItem("refresh-token", refreshToken);
        this.$router.push("/");
      }).catch(err => {
        alert("아이디 또는 비밀번호가 다릅니다");
        this.$store.commit("auth/SET_IS_LOGIN", false);
        this.$store.commit("auth/SET_IS_LOGIN_ERROR", true);
      });
    },

    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.userId = "";
      this.form.userPassword = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

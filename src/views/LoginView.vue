<template>
  <div>
    <main-header></main-header>
    <b-container class="mt-4">
      <b-row align-h="center">
        <h3>로그인</h3>
      </b-row>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-1" label="아이디" label-for="input-1" description="">
          <b-form-input
            id="input-1"
            v-model="form.userid"
            type="text"
            placeholder="아이디를 입력해주세요"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="비밀번호" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.userpwd"
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

export default {
  components: { MainHeader },
  data() {
    return {
      form: {
        userid: "",
        userpwd: "",
      },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      const option = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.form),
      };

      fetch(`${process.env.VUE_APP_SERVER_URL}/users/login`, option)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return null;
          }
        })
        .then((user) => {
          if (user) {
            // 로그인 성공
            this.$store.commit("setUser", user);
            this.$router.push("/");
          } else {
            // 로그인 실패
            alert("아이디 또는 비밀번호가 다릅니다");
          }
        });
    },

    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form.userid = "";
      this.form.userpwd = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

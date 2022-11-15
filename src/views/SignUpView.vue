<template>
  <div>
    <MainHeaderVue />
    <b-container class="mt-4">
      <b-row align-h="center">
        <h3>회원가입</h3>
      </b-row>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-id" label="아이디" label-for="input-id" description="">
          <b-form-input
            id="input-id"
            v-model="form.userId"
            type="text"
            placeholder="아이디를 입력해주세요"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-name" label="이름" label-for="input-name" description="">
          <b-form-input
            id="input-name"
            v-model="form.userName"
            type="text"
            placeholder="이름을 입력해주세요"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-pwd" label="비밀번호" label-for="input-pwd">
          <b-form-input
            id="input-pwd"
            v-model="form.userPassword"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-addr" label="주소" label-for="input-addr" description="">
          <b-form-input
            id="input-addr"
            v-model="form.address"
            type="text"
            placeholder="주소를 입력해주세요"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-phone"
          label="핸드폰 번호"
          label-for="input-phone"
          description=""
        >
          <b-form-input
            id="input-phone"
            v-model="form.phoneNumber"
            type="text"
            placeholder="핸드폰 번호를 입력해주세요"
            required
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" class="mr-2" variant="primary">회원가입</b-button>
        <b-button type="reset" variant="secondary">초기화</b-button>
      </b-form>
      <b-card class="mt-3" header="Form Data Result">
        <pre class="m-0">{{ form }}</pre>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import MainHeaderVue from "@/components/MainHeader.vue";
import { auth as api } from "@/api";

export default {
  components: {
    MainHeaderVue,
  },
  data() {
    return {
      form: {
        userId: "",
        userName: "",
        userPassword: "",
        address: "",
        phoneNumber: "",
      },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();

      api.joinUser(this.form)
        .then(res => {
          alert("회원가입 완료");
          this.$router.push("/login");
        }).catch(reason => {
          alert("중복된 아이디입니다.");
        });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form = {
        userId: "",
        userName: "",
        userPassword: "",
        address: "",
        phoneNumber: "",
      };
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

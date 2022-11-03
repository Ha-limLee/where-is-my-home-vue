<template>
  <div>
    <MainHeaderVue />
    <b-container class="mt-4">
      <b-row align-h="center">
        <h3>내 정보</h3>
      </b-row>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-id" label="아이디" label-for="input-id" description="">
          <b-form-input
            id="input-id"
            v-model="form.userId"
            type="text"
            placeholder="아이디를 입력해주세요"
            required
            disabled
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

        <b-button type="submit" class="mr-2" variant="primary">수정</b-button>
        <b-button type="reset" variant="danger">초기화</b-button>
      </b-form>
      <b-card class="mt-3" header="Form Data Result">
        <pre class="m-0">{{ form }}</pre>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import MainHeaderVue from "@/components/MainHeader.vue";

export default {
  components: {
    MainHeaderVue,
  },
  created() {
    fetch(`${process.env.VUE_APP_SERVER_URL}/users/user/${this.form.userId}`)
      .then((res) => res.json())
      .then((val) => (this.$store.state.user = {...val}));
  },
  data() {
    return {
      form: { ...this.$store.state.user },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      const option = {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.form),
      };

      fetch(`${process.env.VUE_APP_SERVER_URL}/users/join`, option).then((res) => {
        if (res.ok) {
          this.$store.state.user = { ...this.form };
        } else {
          alert("회원정보 수정 오류");
        }
      });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form = { ...this.$store.state.user };
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

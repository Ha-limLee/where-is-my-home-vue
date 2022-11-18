<template>
  <div>
    <MainHeaderVue />
    <b-container class="mt-4">
      <b-row align-h="center">
        <h3>내 정보</h3>
      </b-row>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-id"
          label="아이디"
          label-for="input-id"
          description=""
        >
          <b-form-input
            id="input-id"
            v-model="form.userId"
            type="text"
            placeholder="아이디를 입력해주세요"
            required
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-name"
          label="이름"
          label-for="input-name"
          description=""
        >
          <b-form-input
            id="input-name"
            v-model="form.userName"
            type="text"
            placeholder="이름을 입력해주세요"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-addr"
          label="주소"
          label-for="input-addr"
          description=""
        >
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
        <b-row>
          <b-button type="submit" class="mr-2 ml-3" variant="primary"
            >수정</b-button
          >
          <b-button type="reset" variant="secondary">초기화</b-button>
          <b-button class="ml-auto mr-3" v-b-modal.modal-1 variant="danger"
            >회원탈퇴</b-button
          >
          <b-modal id="modal-1" title="회원탈퇴" hide-footer>
            <b-form @submit="onResign">
              <b-form-group
                id="input-group-id"
                label="비밀번호 확인"
                label-for="input-id"
                description=""
              >
                <b-form-input
                  id="input-id"
                  v-model="passwordCheck"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  required
                ></b-form-input>
              </b-form-group>
              <b-row align-h="end">
                <b-button type="reset" class="mr-3">취소</b-button>
                <b-button class="mr-3" variant="danger" @click="onResign"
                  >회원탈퇴</b-button
                >
              </b-row>
            </b-form>
          </b-modal>
        </b-row>
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
import { mapMutations } from "vuex";

export default {
  components: {
    MainHeaderVue,
  },
  created() {
    api
      .getUser()
      .then((res) => res.data)
      .then((val) => {
        this.SET_USER(val);
        this.form = { ...val };
      });
  },
  data() {
    return {
      form: this.$store.state.auth.user,
      passwordCheck: "",
      show: true,
    };
  },
  methods: {
    ...mapMutations("auth", ["SET_USER"]),
    onSubmit(event) {
      event.preventDefault();

      api
        .modifyUser(this.form)
        .then((res) => {
          this.SET_USER(this.form);
          alert("수정 완료");
        })
        .catch((reason) => {
          alert("회원정보 수정 오류");
        });
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values
      this.form = { ...this.$store.state.auth.user };
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    onResign(event) {
      event.preventDefault();
      if (this.$store.state.auth.user.userPassword === this.passwordCheck) {
        api
          .resignUser(this.$store.state.auth.user.userId)
          .then((res) => {
            alert("회원탈퇴 완료");
            this.SET_USER({});
            this.$router.push("/");
          })
          .catch((reason) => {
            alert("회원탈퇴 중 오류가 발생했습니다.");
          });
      } else {
        alert("비밀번호가 다릅니다");
      }
    },
  },
};
</script>

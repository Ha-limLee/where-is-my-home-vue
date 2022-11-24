<template>
        <b-container class="mt-4">
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group id="input-group-3" label="종류" label-for="input-3">
                    <b-form-select
                        id="input-3"
                        v-model="form.articleProp"
                        :options="types"
                        required
                        style="background-color: white"
                    ></b-form-select>
                </b-form-group>

                <b-form-group
                    id="input-group-1"
                    label="제목"
                    label-for="input-1"
                    description=""
                >
                    <b-form-input
                        id="input-1"
                        v-model="form.subject"
                        type="text"
                        placeholder="제목을 입력해주세요"
                        style="background-color: white"
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="내용" label-for="input-2">
                    <b-form-textarea
                        id="textarea"
                        v-model="form.content"
                        placeholder="내용을 입력해주세요"
                        rows="3"
                        max-rows="6"
                        style="background-color: white"
                    ></b-form-textarea>
                </b-form-group>

                <b-button
                    v-if="userId === $store.state.auth.user.userId"
                    type="submit" variant="primary" class="mr-2">
                    완료
                </b-button>
            </b-form>
        </b-container>
</template>

<script>
import { board as boardApi } from '@/api';

export default {
    created() {
        this.types = this.$store.state.board.articleType
            .map(val => {
                return {
                    text: val.propName,
                    value: val.id
                }
            });
        boardApi.getArticleDetail(this.articleNo)
            .then(res => {
                // articleNo: 10
                // articleProp: 0
                // content: "포스트맨으로 글 삽입 되나 테스트 중입니다 ㅎㅎ"
                // hit: 17
                // registerTime: "2022-11-02T02:15:42.000+00:00"
                // subject: "포스트맨으로 삽입 테스트"
                // userId: "ssafy"
                console.log(res.data);

                this.userId = res.data.userId;

                this.form.subject = res.data.subject;
                this.form.content = res.data.content;
                this.form.articleProp = res.data.articlePropId;
            });
    },
    data() {
        return {
            articleNo: this.$route.params.articleNo,
            userId: "",
            form: {
                subject: "",
                content: "",
                articleProp: 0
            },
            types: [],
            show: true,
        }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            boardApi.editArticle(this.articleNo, this.form)
                .then(res => {
                    this.$router.push(`/article/${this.articleNo}`);
                }).catch(err => {
                    alert("글 수정 오류!");
                });
        },
        onReset(event) {
            event.preventDefault()
            // Reset our form values
            this.form.subject = '';
            this.form.content = '';
            this.form.type = "default";
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
            this.show = true
            })
        }
    }
}
</script>

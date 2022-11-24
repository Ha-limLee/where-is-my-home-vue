<template>
        <b-container class="mt-4">
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group id="input-group-4" label="작성자" label-for="input-3">
                    <b-form-input
                        id="input-4"
                        v-model="form.userId"
                        type="text"
                        disabled
                        style="background-color: white"
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-3" label="종류" label-for="input-3">
                    <b-form-select
                        id="input-3"
                        v-model="form.type"
                        :options="types"
                        disabled
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
                        disabled
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
                        disabled
                        style="background-color: white"
                    ></b-form-textarea>
                </b-form-group>

                <b-button
                    v-if="form.userId === $store.state.auth.user.userId"
                    type="submit" variant="primary" class="mr-2">
                    수정
                </b-button>
                <b-button
                    v-if="form.userId === $store.state.auth.user.userId"
                    variant="danger" class="mr-2"
                    @click="onDelete">
                    삭제
                </b-button>
            </b-form>

            <div class="mt-3" v-for="(comment, index) in comments" :key="index">
                <ArticleCommentVue :comment="comment"></ArticleCommentVue>
            </div>

            <hr/>
            
            <b-form @submit="onWriteComment">
                <b-form-textarea
                    placeholder="댓글을 입력해주세요"
                    v-model="myComment"
                ></b-form-textarea>
                <b-container class="mt-2 mb-2">
                    <b-row align-h="end">
                        <b-button :disabled="myComment ? false : true" type="submit" variant="outline-primary">댓글 쓰기</b-button>
                    </b-row>
                </b-container>
            </b-form>
        </b-container>
</template>

<script>
import ArticleCommentVue from "@/components/ArticleComment.vue";
import { board as boardApi } from '@/api';
import { mapState } from "vuex";

export default {
    components: {
        ArticleCommentVue
    },
    computed: {
        ...mapState("auth", ["user"]),
    },
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
                // res.data 예시
                // articleNo: 10
                // articleProp: 0
                // content: "포스트맨으로 글 삽입 되나 테스트 중입니다 ㅎㅎ"
                // hit: 17
                // registerTime: "2022-11-02T02:15:42.000+00:00"
                // subject: "포스트맨으로 삽입 테스트"
                // userId: "ssafy"

                this.form.subject = res.data.subject;
                this.form.content = res.data.content;
                this.form.userId = res.data.userId;
                this.form.articleNo = res.data.articleNo;
                this.form.type = res.data.articlePropId;
            }).then(() => {
                boardApi.getComment(this.form.articleNo)
                    .then(res => {
                        this.comments = res.data;
                    });
            });
    },
    data() {
        return {
            articleNo: this.$route.params.articleNo,
            form: {
                articleNo: -1,
                userId: "",
                subject: "",
                content: "",
                type: 0
            },
            myComment: "",
            comments: [],
            types: [],
            show: true,
        }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            this.$router.push(`/article-edit/${this.form.articleNo}`);
        },
        onReset(event) {
            event.preventDefault();
            // Reset our form values
            this.form.subject = '';
            this.form.content = '';
            this.form.type = "default";
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        },
        onDelete(event) {
            event.preventDefault();
            const ok = confirm("정말 삭제하시겠습니까?");
            if (ok) {
                boardApi.deleteArticle(this.articleNo)
                    .then(res => {
                        alert("삭제 완료");
                        this.$router.push("/board");
                    }).catch(err => {
                        alert("삭제 중 오류 발생!");
                    });
            }
        },
        onWriteComment(event) {
            event.preventDefault();
            boardApi.writeComment(this.articleNo, {
                content: this.myComment,
                userId: this.user.userId,
                articleId: this.articleNo
            }).then(res => {
                this.$router.go(); // refresh
            }).catch(err => {
                alert("댓글 작성 중 오류 발생!");
            });
        }
    }
}
</script>

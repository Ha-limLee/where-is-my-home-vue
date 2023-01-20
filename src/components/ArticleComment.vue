<template>
    <div>
        <div>
            {{comment.userId}} <span v-if="comment.userRole === 'admin'">({{comment.userRole}})</span>
        </div>
        <b-form-textarea
            v-model="text"
            :plaintext="disabled"
        ></b-form-textarea>
        <b-row>
            <b-col>
                {{ comment.modifyDate || comment.registerDate }}
            </b-col>
            <b-col sm="auto" v-if="comment.userId === $store.state.auth.user.userId">
                <span v-if="disabled" @click="disabled = !disabled">수정</span>
                <span v-if="!disabled" @click="onConfirm">완료</span>
                <span v-if="!disabled" @click="disabled = !disabled"> | 취소</span>
                <span @click="onDelete"> | 삭제</span>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { board as boardApi } from "@/api";

export default {
    props: ["comment"],
    data() {
        return {
            disabled: true,
            text: this.comment.content
        }
    },
    methods: {
        onConfirm(e) {
            e.preventDefault();
            const form = {
                id: this.comment.id,
                content: this.text,
                userId: this.comment.userId,
                articleId: this.comment.articleId,
            };
            boardApi.editComment(this.comment.id, form)
                .catch(err => {
                    alert("댓글 편집 중 오류 발생!");
                });
            this.disabled = !this.disabled;
        },
        onDelete(e) {
            e.preventDefault();
            boardApi.deleteComment(this.comment.id)
                .then(res => {
                    this.$router.go(); // refresh
                }).catch(err => {
                    alert("댓글 삭제 중 오류 발생!");
                });
        }
    }
}
</script>
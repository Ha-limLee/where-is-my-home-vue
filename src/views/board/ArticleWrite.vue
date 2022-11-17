<template>
    <div>
        <MainHeaderVue></MainHeaderVue>
        <b-container class="mt-4">
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group id="input-group-3" label="종류" label-for="input-3">
                    <b-form-select
                        id="input-3"
                        v-model="form.articleProp"
                        :options="types"
                        required
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
                        required
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="내용" label-for="input-2">
                    <b-form-textarea
                        id="textarea"
                        v-model="form.content"
                        placeholder="내용을 입력해주세요"
                        rows="3"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>

                <b-button type="submit" variant="primary" class="mr-2">등록</b-button>
                <b-button type="reset" variant="danger">취소</b-button>
            </b-form>
            <b-card class="mt-3" header="Form Data Result">
                <pre class="m-0">{{ form }}</pre>
            </b-card>
        </b-container>
    </div>
</template>

<script>
import MainHeaderVue from '@/components/MainHeader.vue';
import { board as boardApi } from '@/api';

export default {
    components: {
        MainHeaderVue
    },
    created() {
        this.form.userId = this.$store.state.auth.user.userId;
        this.types = this.$store.state.board.articleType
            .map(val => {
                return {
                    text: val.propName,
                    value: val.id
                }
            });
    },
    data() {
        return {
            form: {
                userId: '',
                subject: '',
                content: '',
                articleProp: 3,
            },
            types: [],
            show: true
        }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault()
            const form = {...this.form};
            boardApi.writeArticle(form)
                .then(res => {
                    console.log(res);
                    this.$router.push("/board");
                })
                .catch(err => alert("글 등록 실패"));
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
<template>
  <div>
    <MainHeaderVue></MainHeaderVue>
    <b-container class="mt-3">
      <b-row align-h="end">
        <b-button @click="$router.push('/write-article')">글쓰기</b-button>
      </b-row>
      <b-row align-h="center">
        <h3>게시글</h3>
      </b-row>
      <b-table stripted hover :items="articles"></b-table>
    </b-container>
  </div>
</template>
<script>
import MainHeaderVue from "@/components/MainHeader.vue";
import {board as boardApi} from '@/api';

function select(data) {
  const {articleTypeName, articleNo, userId, subject, hit, registerTime} = data;
  return {
    articleTypeName,
    articleNo,
    userId,
    subject,
    hit,
    registerTime
  }
}

export default {
  components: {
    MainHeaderVue,
  },
  created() {
    boardApi.getArticle("")
      .then(res => {
        console.log(res);
        const selected = res.data.map(select);
        const notice = selected.filter(x => x.articleTypeName === "notice").map(x => {x._rowVariant = "danger"; return x;});
        console.log(notice);
        const general = selected.filter(x => x.articleTypeName !== "notice");
        this.articles = [...notice, ...general];
      })
  },
  data() {
    return {
      articles: [],
    };
  },
};
</script>
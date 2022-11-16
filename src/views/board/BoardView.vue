<template>
  <div>
    <MainHeaderVue></MainHeaderVue>
    <b-container class="mt-3">
      <b-row align-h="end">
        <b-button @click="$router.push('/article-write')">글쓰기</b-button>
      </b-row>
      <b-row align-h="center">
        <h3>게시글</h3>
      </b-row>
      <b-table selectable select-mode="single" @row-selected="onRowSelected" stripted hover :items="articles"></b-table>
    </b-container>
  </div>
</template>

<script>
import MainHeaderVue from "@/components/MainHeader.vue";
import {board as boardApi} from '@/api';

function select(data) {
  console.log(data);
  const {articlePropName, articleNo, userId, subject, hit, registerTime} = data;
  return {
    articlePropName,
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
        const selected = res.data.map(select);
        const notice = selected.filter(x => x.articlePropName === "공지사항").map(x => { x._rowVariant = "danger"; return x; }).sort((a, b) => -(a.articleNo - b.articleNo));
        const general = selected.filter(x => x.articlePropName !== "공지사항").sort((a, b) => -(a.articleNo - b.articleNo));
        this.articles = [...notice, ...general];
      })
  },
  data() {
    return {
      articles: [],
    };
  },
  methods: {
    onRowSelected(items) {
      const item = items[0];
      this.$router.push(`/article/${item.articleNo}`);
      console.log(item);
    }
  }
};
</script>
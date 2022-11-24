<template>
    <b-container class="mt-3">
      <b-row align-h="end">
        <b-button variant="outline-primary" @click="$router.push('/article-write')">글쓰기</b-button>
      </b-row>
      <b-row align-h="center">
        <h3>게시글</h3>
      </b-row>
      <b-row>
        <b-col>
          <b-form-select v-model="selected" @change="onOptionChange" :options="options" size="sm" class="mt-3"></b-form-select>
        </b-col>
        <b-col>
        </b-col>
        <b-col>
        </b-col>
      </b-row>
      <b-table selectable select-mode="single" @row-selected="onRowSelected" stripted hover :items="articles" :fields="articleFields"></b-table>
      <b-row align-h="center">
        <PaginationVue :next-step="10" :prev-step="10" :max-visible-buttons="10" :total-pages="totalPages" :current-page="currentPage" :per-page="10" @pagechanged="onPageChanged"></PaginationVue>
      </b-row>
    </b-container>
</template>

<script>
import PaginationVue from "@/components/Pagination.vue";
import {board as boardApi} from '@/api';

function select(data) {
  const {articlePropName, articleNo, userId, userRole, subject, hit, registerTime} = data;
  return {
    articlePropName,
    articleNo,
    userId : (userRole === "admin") ? (userId + ` (${userRole})`) : userId,
    subject,
    hit,
    registerTime
  }
}

export default {
  components: {
    PaginationVue,
  },
  created() {
    boardApi.getArticle("", 0)
      .then(res => {
        this.totalPages = res.data.maxPage;
        const selected = res.data.articleList.map(select);
        const notice = selected.filter(x => x.articlePropName === "공지사항").map(x => { x._rowVariant = "danger"; return x; }).sort((a, b) => -(a.articleNo - b.articleNo));
        const general = selected.filter(x => x.articlePropName !== "공지사항").sort((a, b) => -(a.articleNo - b.articleNo));
        this.articles = [...notice, ...general];
      });
  },
  data() {
    return {
      totalPages: 0,
      articles: [],
      articleFields: [
        {
          key: "articlePropName",
          label: "종류",
        },
        {
          key: "articleNo",
          label: "번호",
        },
        {
          key: "userId",
          label: "작성자"
        },
        {
          key: "userRole",
          label: ""
        },
        {
          key: "subject",
          label: "제목",
        },
        {
          key: "hit",
          label: "조회수",
        },
        {
          key: "registerTime",
          label: "등록일",
        }
      ],
      currentPage: 1,
      options: [
        {value: "", text: "전체"},
        {value: "공지사항", text: "공지사항"},
        {value: "질문", text: "질문"},
        {value: "일반", text: "일반"}],
      selected: "",
    };
  },
  methods: {
    onRowSelected(items) {
      const item = items[0];
      this.$router.push(`/article/${item.articleNo}`);
    },
    onPageChanged(page) {
      this.currentPage = page;
      boardApi.getArticle(this.selected, page - 1)
        .then(res => {
          this.totalPages = res.data.maxPage;
          const selected = res.data.articleList.map(select);
          const notice = selected.filter(x => x.articlePropName === "공지사항").map(x => { x._rowVariant = "danger"; return x; }).sort((a, b) => -(a.articleNo - b.articleNo));
          const general = selected.filter(x => x.articlePropName !== "공지사항").sort((a, b) => -(a.articleNo - b.articleNo));
          this.articles = [...notice, ...general];
        });
    },
    onOptionChange(val) {
      boardApi.getArticle(val, 0)
        .then(res => {
          this.currentPage = 1;
          this.totalPages = res.data.maxPage;
          const selected = res.data.articleList.map(select);
          const notice = selected.filter(x => x.articlePropName === "공지사항").map(x => { x._rowVariant = "danger"; return x; }).sort((a, b) => -(a.articleNo - b.articleNo));
          const general = selected.filter(x => x.articlePropName !== "공지사항").sort((a, b) => -(a.articleNo - b.articleNo));
          this.articles = [...notice, ...general];
        });
    }
  }
};
</script>
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
      
      <b-table class="article-table" selectable select-mode="single" @row-selected="onRowSelected" stripted hover :items="articles" :fields="articleFields"></b-table>

      <b-row align-h="center">
        <PaginationVue :next-step="10" :prev-step="10" :max-visible-buttons="10" :total-pages="totalPages" :current-page="currentPage" :per-page="10" @pagechanged="onPageChanged"></PaginationVue>
      </b-row>
    </b-container>
</template>

<script>
import PaginationVue from "@/components/Pagination.vue";
import {board as boardApi} from '@/api';

/**
 * @typedef {Object} Article
 * @property {number} articleNo
 * @property {number} articlePropId
 * @property {string} articlePropName
 * @property {number} hit
 * @property {string} registerTime
 * @property {string} subject
 * @property {string} userId
 * @property {string} userRole
 */

/**
 * @typedef {Object} ArticleData
 * @property {Article[]} articleList
 * @property {number} maxPage
 * @property {number} maxSize
 * @property {string} page
 * @property {string} size
 */

/**
 * @param {Article} data
 */
function select(data) {
  const {articlePropName, articleNo, userId, userRole, subject, hit, registerTime} = data;
  return {
    articlePropName: (articlePropName === "공지사항") ? "🔴" + articlePropName : articlePropName,
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
    this.setArticles("", 1);
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
    async setArticles(selectedType, page) {
      if (selectedType === "공지사항") {
        const articleData = (await boardApi.getArticle(selectedType, page - 1)).data;
        this.articles = articleData.articleList.map(select);
        this.currentPage = page;
        this.totalPages = articleData.maxPage;
      } else {
        const noticeData = (await boardApi.getArticle("공지사항", 0)).data;
        const notices = noticeData.articleList.map(select);
        const articleData = (await boardApi.getArticleNotNotice(selectedType, page - 1)).data;
        const articles = articleData.articleList.map(select);
        this.articles = [...notices, ...articles];
        this.currentPage = page;
        this.totalPages = articleData.maxPage;
      }
    },
    onRowSelected(items) {
      const item = items[0];
      this.$router.push(`/article/${item.articleNo}`);
    },
    onPageChanged(page) {
      this.setArticles(this.selected, page);
    },
    onOptionChange(val) {
      this.setArticles(val, 1);
    }
  }
};
</script>
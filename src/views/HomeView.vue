<template>
  <div>
    <img :src="`${publicPath}image/main.jpg`" alt="main image" />
    <b-row align-h="center">
      <b-card id="tab-group" no-body>
        <b-tabs @input="onTabChanged" card v-if="newses.length">
          <div v-for="(subject, i) in subjects" :key="i">
            <b-tab :title="subject" :active="i === 0 ? true : false">
              <b-card-text
                :class="{ 'news-card': animation }"
                style="overflow: auto; height: 40px"
                v-html="headline"
              ></b-card-text>
            </b-tab>
          </div>
        </b-tabs>
      </b-card>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import MainHeaderVue from "@/components/MainHeader.vue";
import { news as newsApi } from "@/api";

/**
 * @typedef News
 * @property {string} title
 * @property {string} description
 * @property {string} pubDate
 * @property {string} link
 * @property {string} originallink
 */

const duration = 4000;

export default {
  name: "HomeView",
  components: {
    MainHeaderVue,
  },
  computed: {
    headline() {
      return `<a href="${this.newses[this.currentIndex]?.link}">${
        this.newses[this.currentIndex]?.title
      }</a>`;
    },
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      subjects: ["부동산", "금리", "경제", "주식", "아파트"],
      /** @type {News[]} */
      newses: [],
      currentIndex: 0,
      currentTab: 0,
      interval: null,
      animation: false,
    };
  },
  created() {
    fetch('/login', {method: 'post'})
    .then(val => {
      console.log("여기 로그인");
      console.log(val);
    });

    const keyword = this.subjects[this.currentTab];
    newsApi.getNews(keyword).then(({ data }) => {
      this.newses = data;
      this.interval = setInterval(() => {
        this.animation = true;
        setTimeout(() => {
          this.animation = false;
        }, 1000);
        this.currentIndex = (this.currentIndex + 1) % this.newses.length;
      }, duration);
    });
  },
  methods: {
    onTabChanged(selectedTab) {
      if (this.currentTab === selectedTab) return;
      this.currentTab = selectedTab;
      const keyword = this.subjects[this.currentTab];
      newsApi.getNews(keyword).then(({ data }) => {
        this.currentIndex = 0;
        this.newses = data;
      });
    },
  },
};
</script>

<style scoped>
img {
  position: absolute;
  right: 0;
  width: 100%;
  height: 70%;
  object-fit: contain;
}
#tab-group {
  position: fixed;
  bottom: 8px;
  width: 100%;
  height: 20%;
}
.news-card {
  animation: up 4000ms ease-in-out infinite;
}

@keyframes up {
  0% {
    transform: translatey(20px);
    opacity: 0;
  }
  10% {
    transform: translatey(0px);
    opacity: 1;
  }
}
</style>
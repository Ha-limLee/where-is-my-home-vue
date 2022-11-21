import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: () => import(/* webpackChunkName: "sign-up" */ "../views/SignUpView.vue"),
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/my-page",
    name: "my-page",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "my-page" */ "../views/MyPage.vue"),
    meta: {
      authRequired: true
    },
  },
  {
    path: "/user-list",
    name: "user-list",
    component: () => import(/* webpackChunkName: "user-list" */ "../views/UserList.vue"),
  },
  {
    path: "/board",
    name: "board",
    component: () => import(/* webpackChunkName: "board" */ "../views/board/BoardView.vue"),
  },
  {
    path: "/article-write",
    name: "article-write",
    component: () => import(/* webpackChunkName: "article-write" */ "../views/board/ArticleWrite.vue"),
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/article/:articleNo",
    name: "article",
    component: () => import(/* webpackChunkName: "article" */ "../views/board/ArticleView.vue"),
  },
  {
    path: "/article-edit/:articleNo",
    name: "article-edit",
    component: () => import(/* webpackChunkName: "article-edit" */ "../views/board/ArticleEdit.vue"),
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/deal-board",
    name: "deal-board",
    component: () => import(/* webpackChunkName: "deal-board" */ "../views/deal-board/DealBoard.vue"),
  },
  {
    path: "/interest-board",
    name: "interest-board",
    component: () => import(/* webpackChunkName: "interest-board" */ "../views/interest-board/InterestBoard.vue"),
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(function (to, from, next) {
  if (to.matched.some(function (routeInfo) {
    return routeInfo.meta.authRequired && !store.state.auth.isLogin;
  })) {
    alert("로그인이 필요합니다");
    next("/login");
  } else {
    next();
  }
});

export default router;

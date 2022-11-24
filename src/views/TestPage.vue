<template>
    <div id="app">
      <pagination
        :totalPages="10"
        :perPage="10"
        :currentPage="currentPage"
        @pagechanged="onPageChange"
      />
    </div>
  </template>
  
  <script>
  import Pagination from './components/Pagination.vue'
  
  export default {
    name: 'App',
    components: {
      Pagination
    },
    data () {
      return {
        currentPage: 1,
      };
    },
    methods: {
      onPageChange(page) {
        console.log(page)
        this.currentPage = page;
      }
    }
  }
  </script>
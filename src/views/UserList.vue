<template>
    <div>
        <MainHeaderVue></MainHeaderVue>
        <b-table striped hover :items="users"></b-table>
    </div>
</template>

<script>
import MainHeaderVue from "@/components/MainHeader.vue";

export default {
    components: {
        MainHeaderVue
    },
    data() {
        return {
            users: []
        }
    },
    created() {
        
    },
}

</script>
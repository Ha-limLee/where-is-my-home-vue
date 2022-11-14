<template>
    <div>
        <MainHeaderVue></MainHeaderVue>
        <b-table striped hover :items="users"></b-table>
    </div>
</template>

<script>
import MainHeaderVue from "@/components/MainHeader.vue";
import { auth as api } from "@/api";

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
        api.getUserList()
            .then(res => (this.users = res.data));
    },
}

</script>
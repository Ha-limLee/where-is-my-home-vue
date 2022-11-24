<template>
    <b-table striped hover :items="users"></b-table>
</template>

<script>
import { auth as api } from "@/api";

export default {
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
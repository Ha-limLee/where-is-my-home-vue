<template>
    <b-nav-item :class="classOnSelect" :to="to" @click="onNavItemClick">
        <slot></slot>
    </b-nav-item>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    props: {
        to: String,
    },
    computed: {
        ...mapState("curr-router", ["path"]),
    },
    created() {
        console.log(this.path);
        if (this.to === this.path) {
            this.classOnSelect = "item-selected";
        } else {
            this.classOnSelect = "";
        }
    },
    data() {
        return {
            classOnSelect: "",
        }
    },
    watch: {
        path() {
            if (this.to === this.path) {
                this.classOnSelect = "item-selected";
            } else {
                this.classOnSelect = "";
            }
        }
    },
    methods: {
        ...mapMutations("curr-router", ["SET_PATH"]),
        onNavItemClick() {
            this.SET_PATH(this.to);
        }
    },
};
</script>

<style scoped>
.item-selected {
    text-decoration-line: underline;
    text-underline-position: under;
    -ms-text-underline-position: under;
}
</style>
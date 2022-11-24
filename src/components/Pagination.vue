<template>
    <ul class="pagination">
        <li class="pagination-item">
            <button
                type="button"
                @click="onClickFirstPage"
                :disabled="isInFirstPage"
            >
                {{firstText}}
            </button>
        </li>

        <li class="pagination-item">
            <button
                type="button"
                @click="onClickPreviousPage"
                :disabled="isInFirstPage"
            >
                {{prevText}}
            </button>
        </li>

        <!-- Visible Buttons Start -->

        <li
            v-for="page in pages"
            :key="page.name"
            class="pagination-item"
        >
            <button
                type="button"
                @click="onClickPage(page.name)"
                :disabled="page.isDisabled"
                :class="{ active: isPageActive(page.name) }"
            >
                {{ page.name }}
            </button>
        </li>

        <!-- Visible Buttons End -->

        <li class="pagination-item">
            <button
                type="button"
                @click="onClickNextPage"
                :disabled="isInLastPage"
            >
                {{nextText}}
            </button>
        </li>

        <li class="pagination-item">
            <button
                type="button"
                @click="onClickLastPage"
                :disabled="isInLastPage"
            >
                {{lastText}}
            </button>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        maxVisibleButtons: {
            type: Number,
            required: false,
            default: 3
        },    
        totalPages: {
            type: Number,
            required: true
        },
        perPage: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        },
        nextStep: {
            type: Number,
            required: false,
            default: 1,
        },
        prevStep: {
            type: Number,
            required: false,
            default: 1,
        },
        firstText: {
            type: String,
            required: false,
            default: "<<",
        },
        prevText: {
            type: String,
            required: false,
            default: "<",
        },
        nextText: {
            type: String,
            required: false,
            default: ">",
        },
        lastText: {
            type: String,
            required: false,
            default: ">>",
        },
    },
    computed: {
        startPage() {
            // When on the first page
            if (this.currentPage === 1) {
                return 1;
            }

            // When on the last page
            if (this.currentPage === this.totalPages) {
                const sPage = this.totalPages - this.maxVisibleButtons + 1;
                return (sPage > 0) ? sPage : 1;
            }

            // When inbetween
            const remains = this.totalPages - this.currentPage;
            if (remains < this.maxVisibleButtons) {
                const padding = this.maxVisibleButtons - remains;
                const sPage = this.currentPage - padding + 1;
                return (sPage > 0) ? sPage : 1;
            }

            return this.currentPage - 1;
        },
        pages() {
            const range = [];

            for (
                let i = this.startPage;
                i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
                i++
            ) {
                range.push({
                    name: i,
                    isDisabled: i === this.currentPage
                });
            }

            return range;
        },
        isInFirstPage() {
            return this.currentPage === 1;
        },
        isInLastPage() {
            return this.currentPage === this.totalPages;
        },
    },
    methods: {
        onClickFirstPage() {
            this.$emit('pagechanged', 1);
        },
        onClickPreviousPage() {
            this.$emit('pagechanged', Math.max(this.currentPage - this.prevStep, 1));
        },
        onClickPage(page) {
            this.$emit('pagechanged', page);
        },
        onClickNextPage() {
            this.$emit('pagechanged', Math.min(this.currentPage + this.nextStep, this.totalPages));
        },
        onClickLastPage() {
            this.$emit('pagechanged', this.totalPages);
        },
        isPageActive(page) {
            return this.currentPage === page;
        }
    }
};
</script>

<style scoped>
.pagination {
    list-style-type: none;
}

.pagination-item {
    display: inline-block;
}

.active {
    background-color: #4AAE9B;
    color: #ffffff;
}

button {
    border: 1px solid gainsboro;
    background-color: white;
}
</style>
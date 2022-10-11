<template>
    <div>

        <ul v-for="book in books" :key="book.id">

            <Card :price="book.attributes.price" :name="book.attributes.name" :id="book.id" :image="book.attributes.image" />


        </ul>

    </div>
</template>
<script>
import { mapActions } from "vuex";
import Card from "./Card.vue";
export default {
    name: "HomeComponent",
    methods: {
        ...mapActions(["listBooks"]),
    },
    computed: {
        books() {
            return this.$store.getters.getBooks || [];
        }
    },
    created() {
        this.listBooks();
    },
    components: { Card }
}
</script>
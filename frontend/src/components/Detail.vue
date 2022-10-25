<template>
    <div>
        <h2 class="display-2">{{book.attributes.name}}</h2>

        <img :src="'http://localhost:1337' +  book.attributes.image.data.attributes.formats.large.url" :alt="book.attributes.image.data.attributes.alternativeText" />
        <p>{{book.attributes.description}}</p>
        <p>KES {{book.attributes.price}}</p>
        
        <Modal>
            <template #title>
                Billing Details
            </template>
            <template #body>
                <Checkout :book_id="book.id" :book="book.attributes" />
            </template>
        </Modal>


        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#checkoutModal">
            Buy Now
        </button>

    </div>
</template>
<script>


import { mapActions } from "vuex";
import Modal from "./Modal.vue";
import Checkout from "./Checkout.vue";
export default {
    name: "DetailComponent",
    components: { Modal, Checkout },
    computed: {
        book() {
            return this.$store.getters.getBook || {};
        }
    },
    created() {
        this.listBook(this.$route.params.id);
    },
    methods: {
        ...mapActions(["listBook"]),
    }
}

</script>
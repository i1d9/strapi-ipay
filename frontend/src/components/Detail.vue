<template>
    <div>
        Detail


        <Modal>
            <template #title>
                Billing Address
            </template>
            <template #body>
                <Checkout :book="this.book"/>
            </template>
        </Modal>


        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#checkoutModal">
            Buy Now
        </button>

    </div>
</template>
    <script>
    
    
    
    import Modal from "./Modal.vue";
    import Checkout from "./Checkout.vue";
    export default {
        name: "DetailComponent",
        components: { Modal, Checkout },
        data() {
            return {
                book: null
            }
        },
        created() {
            this.loadBook(this.$route.params.id);
        },
        methods: {
            async loadBook(id) {
                try {
                    this.book = "Hello";
                    console.log(id);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    
    </script>
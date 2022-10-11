<template>
    <div>
        <div>
            <h3>{{this.book.name}} </h3>
        </div>
        <div>
            <h3>Price: KES {{this.book.price}} </h3>
        </div>

        <div>
            <span>The Digital book will be sent to {{this.auth.email}}.</span>
        </div>
        <div class="col-md-8 order-md-1">
            <form @submit.prevent="submit">


                <div class="mb-3">
                    <label for="address">Phone Number</label>
                    <input type="text" class="form-control" id="address" placeholder="2547XXXXXXXX" v-model="form.phone"
                        required="">
                    <div class="invalid-feedback">
                        Please enter your shipping address.
                    </div>
                </div>

                <button class="btn btn-primary btn-lg btn-block" type="submit">Complete Payment</button>
            </form>


        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
    name: "CheckoutComponent",
    props: ['book', 'book_id'],
    data() {
        return {
            form: {
                
                phone: "",
                book: this.book_id,
            }
        }
    },
    methods: {
        ...mapActions(["makePurchase"]),
        async submit() {
            console.log(this.form);
            try {
                let result = await this.makePurchase(this.form);

                this.$router.push(`/sale/${result.id}`) 
            } catch (error) {
                console.log(error);
            }
        }
    },
    computed: {
        auth() {
            return this.$store.getters.getAuth;
        }
    }


}

</script>
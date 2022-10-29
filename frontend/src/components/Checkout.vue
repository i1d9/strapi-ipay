<template>
    <div>
        <div>
            <h3>{{this.book.name}} </h3>
        </div>
        <div>
            <h3>Price: KES {{this.book.price}} </h3>
        </div>
        <div class="col-md-8 order-md-1">
            <form autocomplete="off"  @submit.prevent="submit">

                <input autocomplete="false" name="hidden" type="text" style="display:none;">

                <div class="mb-3">
                    <label for="address">Phone Number</label>
                    <input type="text" class="form-control" id="address" placeholder="2547XXXXXXXX" v-model="form.phone"
                        required>
                   
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
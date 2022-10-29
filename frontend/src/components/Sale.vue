<template>
    <div>
        <div>
            <h1>{{book.name}}</h1>
            <h2>{{sale.status}}</h2>
            <img :src="'http://localhost:1337' +  book.image.formats.large.url" :alt="book.image.alternativeText" />
            <p>{{book.description}}</p>       
            <span v-if="sale.status == 'confirmed'">
                <a :href="'http://localhost:1337' + book.file.url">Download</a>
            </span>
            <button @click="refreshStatus" class="btn btn-primary" type="button" v-else>
                Check Status
            </button>
            
        </div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
    name: "SaleComponent",
    computed: {
        book() {
            return this.$store.getters.getBook || {};
        },
        sale() {
            return this.$store.getters.getSale || {};
        },

    },
    created() {
        this.myPurchase(this.$route.params.id);
    },
    methods: {
        ...mapActions(["myPurchase", "myPurchaseStatus"]),
        refreshStatus(){
            this.myPurchaseStatus(this.$route.params.id);
        }
        
    }





}
</script>
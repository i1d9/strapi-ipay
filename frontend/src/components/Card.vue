<template>
    <div class="card" style="width: 18rem;">
        <img :src="'http://localhost:1337' +  this.image.data.attributes.formats.thumbnail.url"
            :alt="this.image.data.attributes.alternativeText" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">
                <router-link class="card-link" :to="'/' + this.id">{{this.name}} </router-link>
            </h5>            
        </div>
    </div>
</template>
<script>
export default {
    name: "CardComponent",
    props: ['price', 'name', 'id', 'description', 'image'],

}

</script>
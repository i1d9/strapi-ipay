<template>

<NavBar/>
<div class="container">
  <router-view :key="$route.fullPath"></router-view>
</div>

</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
    name: "App",
    components: { NavBar }
}
</script>
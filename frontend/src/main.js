
import { createApp, h } from 'vue'
//Bootstrap CSS Framework
import "bootstrap/dist/css/bootstrap.min.css"

import App from './App.vue'
import { createRouter, createWebHashHistory } from "vue-router";

import Home from "./components/Home.vue";
import Checkout from "./components/Checkout.vue";
import Detail from "./components/Detail.vue";

//Mapping Routes to Components
const routes = [
    { path: "/", component: Home,  },
    { path: "/:id", component: Detail,},
    { path: "/checkout", component: Checkout,},  
];

const router = createRouter({

    history: createWebHashHistory(),
    routes,

});



const app = createApp({
    render: () => h(App),
});

app.use(router);
app.mount('#app');

//Bootstrap JS Helpers
import "bootstrap/dist/js/bootstrap.js"

import { createApp, h } from 'vue'
//Bootstrap CSS Framework
import "bootstrap/dist/css/bootstrap.min.css"

import App from './App.vue'
import { createRouter, createWebHashHistory } from "vue-router";
import store from './store';


import Home from "./components/Home.vue";
import Checkout from "./components/Checkout.vue";
import Detail from "./components/Detail.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Sale from "./components/Sale.vue";

//Mapping Routes to Components
const routes = [
    { path: "/", component: Home, meta: { requiresAuth: false }, },
    { path: "/:id", component: Detail, meta: { requiresAuth: true },},
    { path: "/checkout", component: Checkout, meta: { requiresAuth: true },},  
    { path: "/login", component: Login , meta: { requiresAuth: false },},  
    { path: "/register", component: Register,meta: { requiresAuth: false },},  
    { path: "/sale/:id", component: Sale,meta: { requiresAuth: true },},  
];

const router = createRouter({

    history: createWebHashHistory(),
    routes,

});

router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !store.getters.getAuth) {

        from
        return {
            path: '/login',
            // save the location we were at to come back later
            query: { redirect: to.fullPath },
        }
    }
})


const app = createApp({
    render: () => h(App),
});

app.use(router);
app.use(store);
app.mount('#app');

//Bootstrap JS Helpers
import "bootstrap/dist/js/bootstrap.js"
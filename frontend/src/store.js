import Vuex from 'vuex';


import axios from 'axios';
import createPersistedState from "vuex-persistedstate";

const dataStore = {
    state() {
        return {
            book: {},
            books: [],
            auth: null,
            sale: {}
        }
    },
    mutations: {
        selectBook(state, book) {
            state.book = book.data
        }, selectSale(state, sale) {
            state.sale = sale.sale;
            state.book = sale.book;

        },
        loadBooks(state, books) {
            state.books = books.data
        },
        loadAuth(state, auth) {
            state.auth = auth
        }
    },
    getters: {

        getBooks(state) {

            return state.books;
        },
        getBook(state) {
            return state.book;
        },
        getAuth(state) {
            return state.auth;
        }, getSale(state) {
            return state.sale;
        }

    },
    actions: {
        async signIn({ commit }, form) {

            const json = JSON.stringify(form);

            console.log(json);

            const { data } = await axios
                .post('http://localhost:1337/api/auth/local/', json, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

            await commit('loadAuth', { ...data.user, token: data.jwt });



        }, async signUp({ commit }, form) {

            const json = JSON.stringify(form);

            const { data } = await axios
                .post('http://localhost:1337/api/auth/local/register', json, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            await commit('loadAuth', { ...data.user, token: data.jwt });

        }, async makePurchase({ state }, form) {
            const json = JSON.stringify(form);

            const { data } = await axios
                .post('http://localhost:1337/api/sales', json, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.auth.token}`
                    }
                });

            return data;


        }, async myPurchase({ commit, state }, sale_id) {

            const { data } = await axios
                .get(`http://localhost:1337/api/sales/${sale_id}`, {

                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.auth.token}`
                    }
                });


            await commit('selectSale', data);


        }, async myPurchaseStatus({ state }, sale_id) {

            const { data } = await axios
                .get(`http://localhost:1337/api/sales/${sale_id}/status`, {

                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.auth.token}`
                    }
                });



            return data;

        },
        async listBooks({ commit }) {
            const { data } = await axios.get('http://localhost:1337/api/books?populate=image&&name', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            await commit('loadBooks', data);

        },
        async listBook({ commit }, book_id) {
            const { data } = await axios.get(`http://localhost:1337/api/books/${book_id}?populate=image&&name`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            await commit('selectBook', data);
        },
    }
}




export default new Vuex.Store({
    modules: {
        dataStore
    },
    plugins: [createPersistedState()]
})
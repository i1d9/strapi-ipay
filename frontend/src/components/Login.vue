<template>
    <div class="container my-5">
        <form autocomplete="off" @submit.prevent="submit" class="d-flex flex-column">
            <input autocomplete="false" name="hidden" type="text" style="display:none;">

            <div class="mb-3">
                <input type="email" class="form-control" placeholder="Email Address" name="email"
                    v-model="form.email" />
            </div>

            <div class="mb-3">
                <input class="form-control" type="password" name="password" v-model="form.password"
                    placeholder="Password" />
            </div>

            <button type="submit" class="btn btn-success m-1">
                Login
            </button>

            <router-link to="/register" class="btn btn-outline-primary m-1">
                Register
            </router-link>
        </form>
        <p v-if="showError" id="error">Invalid Email/Password</p>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    name: " LoginComponent",
    data() {
        return {
            form: {
                email: "",
                password: "",
            },
            showError: false
        }
    },
    methods: {
        ...mapActions(["signIn"]),
        async submit() {


            try {
                await this.signIn({
                    identifier: this.form.email,
                    password: this.form.password
                });

                this.$router.push(this.$route.query.redirect)


                this.showError = false
            } catch (error) {
                console.log(error)
                this.showError = true
            }
        }
    }
}
</script>
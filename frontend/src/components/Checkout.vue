<template>
    <div>
        <div>
            Book Details
            {{this.book}}
        </div>
        <div class="col-md-8 order-md-1">
            <form class="needs-validation" novalidate="">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="firstName">First name</label>
                        <input type="text" class="form-control" id="firstName" placeholder="" value="" required="">
                        <div class="invalid-feedback">
                            Valid first name is required.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="lastName">Last name</label>
                        <input type="text" class="form-control" id="lastName" placeholder="" value="" required="">
                        <div class="invalid-feedback">
                            Valid last name is required.
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="you@example.com">
                    <div class="invalid-feedback">
                        Please enter a valid email address for shipping updates.
                    </div>
                </div>

                <div class="mb-3">
                    <label for="address">Phone Number</label>
                    <input type="text" class="form-control" id="address" placeholder="2547XXXXXXXX" required="">
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
export default {
    name: "CheckoutComponent",
    props: ['book'],
    methods: {

    },
    created(){
        console.log(this.book);
    }


}

</script>
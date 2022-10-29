'use strict';

/**
 * sale controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::sale.sale', ({ strapi }) => ({

    async create(ctx) {
        


        let ref = (Math.random() + 1).toString(36).substring(2);


        console.log(ctx.request.body);
        let book = await strapi.entityService.findOne('api::book.book', ctx.request.body.book, {
            populate: ['file']
        });


        strapi.ipay.sendSTK(ref, ctx.request.body.phone, ctx.state.user.email, book.price);

        let sale = await strapi.entityService.create('api::sale.sale', {
            data: {
                ...ctx.request.body,
                buyer: ctx.state.user.id,
                ref,
                total: book.price
            }

        });
        ctx.body = sale;


        setTimeout(async () => {
            let transact_result = await strapi.ipay.checkTransactionStatus(ref);
            if (transact_result) {

                await strapi.entityService.update('api::sale.sale', sale.id, {
                    data: {
                        receipt: transact_result.data.transaction_code,
                        status: "confirmed"
                    },
                });
            }
        }, 420 * 1000);


    },
    async findOne(ctx) {


        const { id } = ctx.params;

        console.log(ctx.request);
        let sale = await strapi.entityService.findOne('api::sale.sale', id, {
            populate: {
                buyer: {
                    fields: ["username"],
                    filters: {
                        id: {
                            $eqi: ctx.state.user.id,
                        },
                    },
                },
                book: true
            },
        });




        if (sale.buyer) {
            let book = await strapi.entityService.findOne('api::book.book', sale.book.id, {
                populate: ['file', 'image'],

            });
            if (sale.status != "confirmed") delete book.file

            ctx.body = {
                book,
                sale
            }

        } else {
            ctx.status = 401;

            ctx.body = {
                message: "Invalid Request"
            };
        }
    },

    async checkStatus(ctx) {
        const { id } = ctx.params;

        let sale = await strapi.entityService.findOne('api::sale.sale', id, {
            populate: {
                buyer: {
                    fields: ["username"],
                    filters: {
                        id: {
                            $eqi: ctx.state.user.id,
                        },
                    },
                },
                book: true
            },
        });

        if (sale.buyer && sale.status == "pending") {
            let transact_result = await strapi.ipay.checkTransactionStatus(sale.ref);

            if (transact_result && transact_result.hasOwnProperty("data") && transact_result.data.hasOwnProperty("transaction_code")) {
                await strapi.entityService.update('api::sale.sale', sale.ref, {
                    data: {
                        receipt: transact_result.data.transaction_code,
                        status: "confirmed"
                    },
                });
                ctx.body = true;
            } else {
                ctx.body = false;
            }

        } else {
            ctx.status = 401;
            ctx.body = {
                message: "Invalid Request"
            };
        }


    }
}));

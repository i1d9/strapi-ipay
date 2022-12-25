'use strict';
var crypto = require('crypto');
const axios = require('axios').default;

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
    async bootstrap({ strapi }) {


    let iPayTransact = "https://apis.ipayafrica.com/payments/v2/transact";
    let iPayMpesa = "https://apis.ipayafrica.com/payments/v2/transact/push/mpesa";
    let iPayTransactMobile = "https://apis.ipayafrica.com/payments/v2/transact";
    let iPayQueryTransaction = "https://apis.ipayafrica.com/payments/v2/transaction/search";
    let iPayRefund = "https://apis.ipayafrica.com/payments/v2/transaction/refund";
    let iPaySecret = strapi.config.get('server.iPaySecret', 'demoCHANGED');
    let iPayVid = strapi.config.get('server.iPayVid', 'demo');
    let iPayAlgorithm = "sha256"

    function prepare_stk_data(order_id, amount, customer_phone, customer_email, customer_notifications = 0) {


      let iPayData = {
        "live": 0,
        "oid": order_id,
        "inv": order_id,
        "amount": amount,
        "tel": customer_phone,
        "eml": customer_email,
        "vid": iPayVid,
        "curr": "KES",
        "p1": "YOUR-CUSTOM-PARAMETER",
        "p2": "YOUR-CUSTOM-PARAMETER",
        "p3": "YOUR-CUSTOM-PARAMETER",
        "p4": "YOUR-CUSTOM-PARAMETER",
        "cbk": "https://enktpf6b4e4rm.x.pipedream.net",
        "cst": customer_notifications,
        "crl": 0,
        "autopay": 1
      }

      // The hash digital signature hash of the data for verification.
      let hashCode = `${iPayData['live']}${iPayData['oid']}${iPayData['inv']}${iPayData['amount']}${iPayData['tel']}${iPayData['eml']}${iPayData['vid']}${iPayData['curr']}${iPayData['p1']}${iPayData['p2']}${iPayData['p3']}${iPayData['p4']}${iPayData['cst']}${iPayData['cbk']}`


      //creating hmac object 
      let hash = crypto.createHmac(iPayAlgorithm, iPaySecret).update(hashCode).digest("hex");

      iPayData['hash'] = hash;
      return iPayData;

    }

    async function initateSTKTransaction(order_id, customer_tel, customer_email, amount, send_receipt = 0) {
      let data = prepare_stk_data(order_id, amount, customer_tel,
        customer_email, send_receipt);

      try {



        let response = await axios({
          method: 'post',
          url: iPayTransact,
          data: JSON.stringify(data),
          headers: {
            "Content-type": "application/json"
          }
        });

        response.data.tel = data.tel;
        response.data.vid = data.vid;
        console.log(response.data)
        return response.data;
      } catch (e) {

        return null;
      }
    }




    async function sendSTK(order_id, customer_telephone, customer_email, amount) {
      try {

        let init_response = await initateSTKTransaction(order_id, customer_telephone, customer_email, amount);


        if (init_response.status == 1) {
          console.log(init_response)

          let hashCode = `${customer_telephone}${init_response.vid}${init_response.data.sid}`;
          let hash = crypto.createHmac(iPayAlgorithm, iPaySecret).update(hashCode).digest("hex");

          let stkData = {
            phone: customer_telephone,
            sid: init_response.data.sid,
            vid: init_response.vid,
            hash: hash
          }


          let response = await axios({
            method: 'post',
            url: iPayMpesa,
            data: JSON.stringify(stkData),
            headers: {
              "Content-type": "application/json"
            }
          });

          return response.data;
        }

        return null;


      } catch (error) {
        console.log(error);
        return null;
      }
    }

    async function checkTransactionStatus(order_id) {

      let hashData = `${order_id}${iPayVid}`
      let hash = crypto.createHmac(iPayAlgorithm, iPaySecret).update(hashData).digest('hex');

      let data = {
        "oid": order_id,
        "vid": iPayVid,
        "hash": hash
      }

      try {
        let response = await axios({
          method: 'post',
          url: iPayQueryTransaction,
          data: JSON.stringify(data),
          headers: {
            "Content-type": "application/json"
          }
        });

        return response.data;

      } catch (error) {

        console.log("An error occurred while looking for the transaction.");
        console.log(error);
        return null
      }



    }
    
    



    strapi.ipay = {
      checkTransactionStatus,
      sendSTK, 
    }

  },
};

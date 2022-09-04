'use strict';
var crypto = require('crypto');
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
  bootstrap(/*{ strapi }*/) {


    let iPayTransact = "https://apis.ipayafrica.com/payments/v2/transact";
    let iPayMpesa = "https://apis.ipayafrica.com/payments/v2/transact/push/mpesa";
    let iPayTransactMobile = "https://apis.ipayafrica.com/payments/v2/transact";
    let iPayQueryTransaction = "https://apis.ipayafrica.com/payments/v2/transaction/search";
    let iPayRefund = "https://apis.ipayafrica.com/payments/v2/transaction/refund";

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
      hashCode = `${iPayData['live']}${iPayData['oid']}${iPayData['inv']}${iPayData['amount']}${iPayData['tel']}${iPayData['eml']}${iPayData['vid']}${iPayData['curr']}${iPayData['p1']}${iPayData['p2']}${iPayData['p3']}${iPayData['p4']}${iPayData['cst']}${iPayData['cbk']}`


      let iPaySecret = strapi.config.get('server.ipaysecret', 'demoCHANGED');
      //creating hmac object 
      let data = crypto.createHmac('sha256', iPaySecret).update(iPayData).digest('hex');
      iPayData['hash'] = data;
      return iPayData;

    }

    async function initateSTKTransaction(order_id, customer_tel, customer_email, amount, send_receipt = 0) {
      let data = prepare_stk_data(order_id, amount, customer_tel,
        customer_email, customer_notifications = send_receipt);

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
        console.log(response.data);
        return response.data
      } catch (e) {
        console.log(e);
        return null;
      }
    }


    async function sendSTK(params) {
      try {


        let hash, hmac;
        hmac = crypto.createHmac(iPayAlgorithm, iPaySecret);
        let hashCode = `${tel}${vid}${sid}`;
        hmac.write(hashCode); // write in to the stream
        hmac.end();       // can't read from the stream until you call end()
        hash = hmac.read().toString('hex');    // read out hmac digest

        let phone = tel;
        let stkData = {
          phone,
          sid,
          vid,
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

      } catch (error) {
        console.log(error);
        return null;
      }
    }
    async function checkTransactionStatus(order_id) {
      let iPayVid = strapi.config.get('server.ipayvid', 'demo');
      let hashData = `${order_id}${iPayVid}`
      let hash = crypto.createHmac('sha256', iPaySecret).update(hashData).digest('hex');

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
      }



    }


  },
};

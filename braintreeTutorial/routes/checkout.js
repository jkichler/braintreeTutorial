const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const { merchantId, publicKey, privateKey } = require('../../secrets');

router.post('/', function (req, res, next) {
  console.log('REQ BODY', req.body.paymentMethodNonce);
  const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId,
    publicKey,
    privateKey,
  });

  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale(
    {
      amount: '10.00',
      paymentMethodNonce: nonceFromTheClient,
      options: {
        // This option requests the funds from the transaction
        // once it has been authorized successfully
        submitForSettlement: true,
      },
    },
    function (error, result) {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
    }
  );
});

module.exports = router;
